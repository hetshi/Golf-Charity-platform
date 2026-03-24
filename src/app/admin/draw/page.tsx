'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Play, BarChart, Settings, ShieldCheck, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AdminDrawPage() {
  const [mode, setMode] = useState<'random' | 'algorithm'>('random')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleRunDraw = async (isSimulation: boolean) => {
    setLoading(true)
    try {
      const res = await fetch('/api/draw/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, simulate: isSimulation })
      })
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic mb-2 tracking-tighter uppercase">Draw Engine Control</h1>
          <p className="text-zinc-500 font-medium">Monthly prize distribution and winner generation system.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between">
                <Settings className="w-6 h-6 text-emerald-400" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Configuration</span>
              </div>
              <div className="space-y-4">
                 <button 
                  onClick={() => setMode('random')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${mode === 'random' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-black border-zinc-800 text-zinc-500'}`}
                 >
                    <div className="font-bold text-sm">RANDOM MODE</div>
                    <div className="text-[10px]">Pure lottery-style generation</div>
                 </button>
                 <button 
                  onClick={() => setMode('algorithm')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${mode === 'algorithm' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-black border-zinc-800 text-zinc-500'}`}
                 >
                    <div className="font-bold text-sm">ALGORITHM MODE</div>
                    <div className="text-[10px]">Weighted by score frequency</div>
                 </button>
              </div>
           </div>

           <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold italic mb-4">Run Monthly Draw</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Initiating a draw will freeze all score entries for the current period, calculate the prize pool based on current subscriptions, and identify winners across all tiers.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => handleRunDraw(true)} 
                  variant="outline" 
                  className="flex-1 h-14 italic"
                  disabled={loading}
                >
                  Simulate Draw
                </Button>
                <Button 
                  onClick={() => handleRunDraw(false)} 
                  className="flex-1 h-14 font-black italic"
                  disabled={loading}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Live Draw
                </Button>
              </div>
           </div>
        </div>

        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem]"
          >
             <h3 className="text-lg font-black italic mb-6 uppercase text-emerald-400">Draw Results Summary</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">Numbers</div>
                   <div className="flex gap-1">
                      {results.draw.numbers.map((n: number, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-xs">{n}</div>
                      ))}
                   </div>
                </div>
                <div>
                   <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">Total Pool</div>
                   <div className="text-xl font-black">${results.draw.total_pool.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">Winners</div>
                   <div className="text-xl font-black italic">TBD</div>
                </div>
                <div>
                   <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">Status</div>
                   <div className="text-emerald-400 text-xl font-black italic">PUBLISHED</div>
                </div>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
