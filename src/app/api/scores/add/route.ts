import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { score, date } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validation
    if (!score || score < 1 || score > 45) {
      return NextResponse.json({ error: 'Invalid score. Range: 1-45' }, { status: 400 })
    }

    // FIFO Logic: Get current scores count
    const { data: scores, error: countError } = await supabase
      .from('scores')
      .select('id, date')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (countError) throw countError

    if (scores && scores.length >= 5) {
      // Delete the oldest score
      const oldestScoreId = scores[0].id
      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .eq('id', oldestScoreId)
      
      if (deleteError) throw deleteError
    }

    // Add new score
    const { data: newScore, error: insertError } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score,
        date: date || new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ success: true, data: newScore })
  } catch (error: any) {
    console.error('Score add error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
