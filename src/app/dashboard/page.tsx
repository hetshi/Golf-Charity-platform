'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Target, 
  Heart, 
  History, 
  ArrowUpRight, 
  Plus,
  ShieldCheck,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [charity, setCharity] = useState<any>(null)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

        // Fetch subscription
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setSubscription(sub)

        // Fetch scores
        const { data: scs } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5)
        setScores(scs || [])

        // Fetch charity impact
        const { data: uc } = await supabase
          .from('user_charity')
          .select('*, charities(*)')
          .eq('user_id', user.id)
          .single()
        setCharity(uc)

        // Fetch total winnings
        const { data: wr } = await supabase
          .from('draw_results')
          .select('prize_amount')
          .eq('user_id', user.id)
        const total = wr?.reduce((sum, r) => sum + (Number(r.prize_amount) || 0), 0) || 0
        setTotalWinnings(total)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 italic">SYNCING PLAYER DATA...</div>
  }

  const avgScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1) : '0.0'
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 pb-24">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-200 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <span className="text-zinc-950 font-black text-xl">G</span>
          </div>
          <div>
            <h1 className="text-lg font-bold italic">GOLF CHARITY</h1>
            <p className="text-xs text-zinc-500 font-medium">PLAYER DASHBOARD</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user?.email?.split('@')[0] || 'Player'}</p>
            <p className="text-xs text-emerald-400">{subscription?.status === 'active' ? 'Pro Subscriber' : 'Visitor'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Subscription & Quick Actions */}
        <div className="md:col-span-4 space-y-6">
          {/* Subscription Status Card */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-emerald-500" />
            </div>
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 italic">Membership</h2>
            <div className="flex items-end gap-2 mb-6">
              <div className="text-4xl font-black text-white italic">{subscription?.status?.toUpperCase() || 'INACTIVE'}</div>
              {subscription?.plan_type && <div className="text-emerald-400 pb-1 font-bold">{subscription.plan_type.toUpperCase()}</div>}
            </div>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              {charity ? (
                <>Your monthly contribution of {charity.contribution_percent}% is supporting <span className="text-white italic">{charity.charities?.name}.</span></>
              ) : (
                'Pick a charity to start making an impact with your monthly entries.'
              )}
            </p>
            <Link href="/dashboard/subscription" className="block">
              <Button variant="secondary" className="w-full bg-zinc-800 border-none hover:bg-zinc-700">
                Manage Billing
              </Button>
            </Link>
          </div>

            <Link href="/dashboard/scores">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] shadow-2xl shadow-emerald-500/10 group cursor-pointer h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black italic mb-2">ADD NEW SCORE</h3>
                <p className="text-white/70 text-sm">Keep your last 5 scores updated to qualify for the next draw.</p>
              </div>
            </Link>
        </div>

        {/* Middle/Main Column - Stats & History */}
        <div className="md:col-span-8 space-y-6">
          {/* Top Row - Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl">
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 italic">Avg Score</div>
              <div className="text-3xl font-black">{avgScore}</div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold mt-1 uppercase italic">
                From last {scores.length} games
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl">
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 italic">Total Winnings</div>
              <div className="text-3xl font-black">${totalWinnings.toFixed(2)}</div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold mt-1 uppercase italic">
                All time earnings
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl">
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 italic">Charity Rank</div>
              <div className="text-3xl font-black italic">{charity ? 'TOP 5%' : 'N/A'}</div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold mt-1 uppercase italic">
                {charity ? 'Elite Contributor' : 'No Impact Yet'}
              </div>
            </div>
          </div>

          {/* Draw Participation & Latest Scores */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2rem] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold italic">LATEST SCORES</h3>
                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded">LAST 5 ONLY</span>
              </div>
              <div className="space-y-4 flex-1">
                {scores.length > 0 ? scores.map((score, i) => (
                  <div key={score.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        #{scores.length-i}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{score.score} Stableford</div>
                        <div className="text-[10px] text-zinc-500 font-medium italic">
                          {new Date(score.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-zinc-600 text-sm italic">No scores yet. Add your first score to start!</div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold italic">NEXT DRAW</h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 text-[10px] font-black italic animate-pulse">
                  <Zap className="w-3 h-3fill-current" />
                  LIVE ENTRY
                </div>
              </div>
              
              <div className="p-6 bg-zinc-950 rounded-3xl border border-dashed border-zinc-800 text-center space-y-4">
                <div className="text-zinc-500 text-xs italic font-medium uppercase tracking-widest">Jackpot Pool</div>
                <div className="text-5xl font-black text-white leading-none">$24,500.00</div>
                <div className="pt-4 grid grid-cols-5 gap-2 px-4">
                   {[14, 23, 5, 41, 32].map((n, i) => (
                     <div key={i} className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-black italic text-zinc-400">
                        {n}
                     </div>
                   ))}
                </div>
                <p className="text-[10px] text-zinc-600 italic pt-2">Your numbers are generated based on your score frequency. <br /> Draw on 5th April, 2026.</p>
              </div>

              <div className="mt-8 p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold italic mb-1">Impact Bonus</h4>
                  <p className="text-xs text-zinc-500 italic">Boost prize share by +5%</p>
                </div>
                <Button variant="outline" size="sm" className="h-10 text-xs border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                  Select Charity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation - Bottom bar for mobile focus */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-around px-6 sm:hidden">
        <Link href="/dashboard" className="text-emerald-400 flex flex-col items-center">
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">DASHBOARD</span>
        </Link>
        <div className="p-3 bg-emerald-500 rounded-full -translate-y-8 shadow-2xl shadow-emerald-500/50">
          <Plus className="w-8 h-8 text-zinc-950" />
        </div>
        <Link href="/charities" className="text-zinc-600 flex flex-col items-center">
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">CHARITIES</span>
        </Link>
      </nav>
    </div>
  )
}
