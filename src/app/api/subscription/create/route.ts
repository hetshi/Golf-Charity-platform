import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-acacia' as any,
  })
  
  try {
    const supabase = await createClient()
    const { planType } = await request.json() // 'monthly' or 'yearly'

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const priceId = planType === 'yearly' 
      ? process.env.STRIPE_YEARLY_PRICE_ID 
      : process.env.STRIPE_MONTHLY_PRICE_ID

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
