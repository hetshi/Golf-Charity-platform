import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-acacia' as any,
  })

  // Use service role key since webhooks are server-to-server and need to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.text()
  const sig = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      
      if (userId) {
        // Update user status and record subscription
        await supabaseAdmin
          .from('users')
          .update({ subscription_status: 'active' })
          .eq('id', userId)

        await supabaseAdmin
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            plan_type: session.amount_total === 9900 ? 'yearly' : 'monthly' // Example pricing logic
          })
      }
      break

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      // Update status to inactive
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', subscription.id)
      
      // Get userId from subscription if needed or via query
      const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()
      
      if (subData) {
        await supabaseAdmin
          .from('users')
          .update({ subscription_status: 'inactive' })
          .eq('id', subData.user_id)
      }
      break
  }

  return NextResponse.json({ received: true })
}
