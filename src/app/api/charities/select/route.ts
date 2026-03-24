import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { charityId, contributionPercent } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Upsert charity selection
    const { data, error } = await supabase
      .from('user_charity')
      .upsert({
        user_id: user.id,
        charity_id: charityId,
        contribution_percent: contributionPercent || 10,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Charity selection error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
