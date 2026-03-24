'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, CheckCircle2, XCircle, ExternalLink, ShieldAlert, DollarSign, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AdminWinnersPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setLoading(id)
    setTimeout(() => setLoading(null), 1500)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Winner Verification</h1>
            <p className="text-zinc-500 font-medium">Review proof of scores and authorize prize payouts.</p>
          </div>
          <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3">
             <ShieldAlert className="w-5 h-5 text-amber-500" />
             <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">4 Pending Reviews</div>
          </div>
        </header>

        <div className="space-y-4">
          {[
            { id: '1', name: 'John Doe', score: 41, prize: '$450.00', date: '2 days ago' },
            { id: '2', name: 'Sarah Smith', score: 38, prize: '$240.50', date: '5 hours ago' }
          ].map((winner) => (
            <motion.div 
              key={winner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between group hover:border-zinc-700 transition-colors"
            >
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                     <ImageIcon className="w-6 h-6 text-zinc-600" />
                     <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <ExternalLink className="w-5 h-5 text-emerald-400" />
                     </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{winner.name}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
                       <span>Score: {winner.score}</span>
                       <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                       <span>{winner.date}</span>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-12">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 italic">Prize Amount</div>
                    <div className="text-xl font-black text-white italic">{winner.prize}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/20 text-red-500 hover:bg-red-500/10 h-12 px-6"
                      onClick={() => handleAction(winner.id, 'reject')}
                      disabled={loading === winner.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 text-zinc-950 h-12 px-6"
                      onClick={() => handleAction(winner.id, 'approve')}
                      disabled={loading === winner.id}
                    >
                      {loading === winner.id ? 'Processing...' : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve Payout
                        </>
                      )}
                    </Button>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-zinc-900/20 border border-zinc-900 rounded-[3rem] text-center max-w-2xl mx-auto">
           <DollarSign className="w-10 h-10 text-emerald-500 mx-auto mb-6" />
           <h3 className="text-xl font-bold mb-4 italic uppercase tracking-tighter italic">Total Pending Payouts</h3>
           <div className="text-5xl font-black text-white italic mb-4">$1,390.50</div>
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] italic">Authorized via Stripe Connect</p>
        </div>
      </div>
    </div>
  )
}
