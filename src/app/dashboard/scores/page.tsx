'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddScorePage() {
  const [score, setScore] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/scores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: parseInt(score), date })
      })

      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Score added successfully! Redirecting...' })
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add score' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold italic">ADD NEW SCORE</h1>
              <p className="text-sm text-zinc-500 font-medium">Stableford Scoring System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <Input
                  label="Stableford Score"
                  type="number"
                  placeholder="e.g. 36"
                  min="1"
                  max="45"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  className="text-2xl font-black h-16 pl-4 pr-12 italic"
                />
                <div className="absolute top-11 right-4 text-zinc-600 font-bold italic text-xs">PTS</div>
              </div>

              <Input
                label="Date of Play"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-14 italic"
              />
            </div>

            <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 text-xs text-zinc-500 italic leading-relaxed">
              <span className="text-emerald-400 font-bold uppercase mr-2">Note:</span>
              We only store your latest 5 scores. Adding this will automatically remove your oldest entry from the system.
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 text-lg font-bold group"
            >
              {loading ? 'Processing...' : 'Confirm Entry'}
              {!loading && <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />}
            </Button>
          </form>
        </motion.div>
        
        <p className="text-center mt-10 text-zinc-700 text-[10px] font-bold uppercase tracking-widest italic">
          Verification might be required for prize payouts
        </p>
      </div>
    </div>
  )
}
