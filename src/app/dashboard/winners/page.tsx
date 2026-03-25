import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Upload, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowLeft, Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function WinnerVerificationPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWinnerResults() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('draw_results')
          .select('*, draws(*)')
          .eq('user_id', user.id)
          .eq('status', 'pending')
        
        if (data) setResults(data)
        if (error) setError(error.message)
      }
      setFetching(false)
    }
    fetchWinnerResults()
  }, [])

  const handleUpload = async (resultId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/winners/upload-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resultId, 
          imageUrl: 'https://placeholder.com/proof.jpg' // Simulated URL
        })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to submit proof')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
     return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 italic">VERIFYING YOUR WINS...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12 space-y-4">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8" />
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">Win Verification</h1>
           <p className="text-zinc-500 italic font-medium leading-relaxed">
             Congratulations on your match! To claim your prize, please upload a screenshot of your score from a verified golf tracking app (e.g., GolfingWorld, BlueGolf).
           </p>
        </header>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8">
           {results.length > 0 ? results.map((result) => (
             <div key={result.id} className="space-y-8 pb-12 border-b border-zinc-800 last:border-b-0 last:pb-0">
               <div className="flex items-center justify-between p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Prize Match</div>
                    <div className="text-2xl font-black italic">{result.match_count} NUMBER MATCH</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Est. Payout</div>
                    <div className="text-2xl font-black text-white italic">${result.prize_amount}</div>
                  </div>
               </div>

               {!success ? (
                 <div className="space-y-6">
                    <div className="aspect-video bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 group hover:border-emerald-500/50 transition-colors cursor-pointer">
                       <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Camera className="w-6 h-6 text-zinc-500" />
                       </div>
                       <h3 className="text-sm font-bold italic mb-2 uppercase">Drop screenshot here</h3>
                       <p className="text-xs text-zinc-600 italic">PNG, JPG or PDF. Max 5MB.</p>
                    </div>

                    <div className="flex gap-4">
                       <div className="flex-1 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-bold uppercase mb-1">Privacy Guarantee</div>
                            <p className="text-[9px] text-zinc-500 italic">Images are only used for winner auditing and then strictly encrypted.</p>
                          </div>
                       </div>
                       <div className="flex-1 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 flex items-start gap-3">
                          <Clock className="w-5 h-5 text-zinc-500 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-bold uppercase mb-1">Review Time</div>
                            <p className="text-[9px] text-zinc-500 italic">Admin review typically takes 24-48 hours for payouts.</p>
                          </div>
                       </div>
                    </div>

                    {error && <p className="text-red-400 text-xs italic text-center">{error}</p>}

                    <Button onClick={() => handleUpload(result.id)} disabled={loading} className="w-full h-16 text-lg font-black group">
                       {loading ? 'Securing Upload...' : 'Submit for Review'}
                       <Upload className="w-4 h-4 ml-2 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                 </div>
               ) : (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                 >
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                       <CheckCircle2 className="w-10 h-10 text-zinc-950" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase">Proof Submitted</h3>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto italic">
                       Your documentation is being reviewed. We'll notify you via email once the payout is initiated.
                    </p>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="h-14 px-10 italic">Return to Dashboard</Button>
                    </Link>
                 </motion.div>
               )}
             </div>
           )) : (
             <div className="text-center py-20">
               <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold italic uppercase text-zinc-700">No Pending Claims</h3>
               <p className="text-xs text-zinc-500 italic mt-2">Check back after the next monthly draw!</p>
             </div>
           )}
        </div>

        <p className="text-center mt-12 text-[10px] text-zinc-700 italic font-bold uppercase tracking-widest">
           Terms apply. Falsifying score data will result in immediate lifetime ban.
        </p>
      </div>
    </div>
  )
}
