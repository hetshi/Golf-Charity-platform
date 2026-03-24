import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { resultId, imageUrl } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Verify this result belongs to the user
    const { data: result } = await supabase
      .from('draw_results')
      .select('id, user_id')
      .eq('id', resultId)
      .eq('user_id', user.id)
      .single()

    if (!result) {
      return NextResponse.json({ error: 'Result not found or unauthorized' }, { status: 404 })
    }

    // 2. Insert proof
    const { data, error } = await supabase
      .from('winner_proof')
      .insert({
        result_id: resultId,
        image_url: imageUrl,
        verification_status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // 3. Update result status
    await supabase
      .from('draw_results')
      .update({ status: 'proof_uploaded' })
      .eq('id', resultId)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Proof upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
