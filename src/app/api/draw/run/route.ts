import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { mode } = await request.json() // 'random' or 'algorithm'

    // Admin check
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('users').select('role').eq('id', user?.id).single()
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin only.' }, { status: 403 })
    }

    // 1. Generate Numbers
    let drawNumbers: number[] = []
    if (mode === 'algorithm') {
      // Get all active scores to determine weights
      const { data: allScores } = await supabase.from('scores').select('score')
      if (allScores && allScores.length > 0) {
        // Simple weighted logic: calculate frequency of scores
        const freq: Record<number, number> = {}
        allScores.forEach(s => { freq[s.score] = (freq[s.score] || 0) + 1 })
        
        // Generate 5 numbers based on frequency
        const pool: number[] = []
        Object.entries(freq).forEach(([score, weight]) => {
          for (let i = 0; i < weight; i++) pool.push(parseInt(score))
        })
        
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * pool.length)
          drawNumbers.push(pool[randomIndex])
        }
      } else {
        // Fallback to random if no scores
        for (let i = 0; i < 5; i++) drawNumbers.push(Math.floor(Math.random() * 45) + 1)
      }
    } else {
      // Random mode
      for (let i = 0; i < 5; i++) drawNumbers.push(Math.floor(Math.random() * 45) + 1)
    }

    // 2. Calculate Prize Pool
    // Assuming a simplified model: total users * subscription fee (e.g. $10)
    const { count: subscriberCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    const totalRevenue = (subscriberCount || 0) * 10
    const totalPrizePool = totalRevenue * 0.9 // 90% goes back to prizes, 10% charity

    const distribution = {
      jackpot: totalPrizePool * 0.40, // 5 match
      tier2: totalPrizePool * 0.35,   // 4 match
      tier3: totalPrizePool * 0.25    // 3 match
    }

    // 3. Save Draw
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        mode,
        numbers: drawNumbers,
        total_pool: totalPrizePool
      })
      .select()
      .single()

    if (drawError) throw drawError

    // 4. Identify Winners (Simplified matching)
    // In a real app, this would be a complex query.
    // For each active user, check their last 5 scores against drawNumbers.
    const { data: activeUsers } = await supabase
      .from('users')
      .select('id')
      .eq('subscription_status', 'active')

    if (activeUsers) {
       for (const u of activeUsers) {
         const { data: userScores } = await supabase
           .from('scores')
           .select('score')
           .eq('user_id', u.id)
           .limit(5)
         
         if (userScores) {
            const matches = userScores.filter(s => drawNumbers.includes(s.score)).length
            if (matches >= 3) {
               // Record result
               let prize = 0
               if (matches === 5) prize = distribution.jackpot // Simplified: split later
               if (matches === 4) prize = distribution.tier2
               if (matches === 3) prize = distribution.tier3

               await supabase.from('draw_results').insert({
                 draw_id: draw.id,
                 user_id: u.id,
                 match_count: matches,
                 prize_amount: prize,
                 status: 'pending'
               })
            }
         }
       }
    }

    return NextResponse.json({ success: true, draw, distribution })
  } catch (error: any) {
    console.error('Draw run error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
