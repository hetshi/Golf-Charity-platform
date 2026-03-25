'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, Zap, Star, LayoutGrid, Calendar, HelpCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: '$12',
    interval: 'month',
    features: [
      'Automatic monthly draw entries',
      'Min 10% charity contribution',
      'Real-time score tracking',
      'Verified impact reports',
      'Exclusive community discord'
    ],
    highlight: false
  },
  {
    id: 'yearly',
    name: 'Yearly Legend',
    price: '$99',
    interval: 'year',
    features: [
      'All Monthly Pro features',
      '30% discount (save $45)',
      'Legacy member badge',
      'First access to charity events',
      'Enhanced prize pool weights'
    ],
    highlight: true,
    bonus: 'BEST VALUE'
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [currentSub, setCurrentSub] = useState<any>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setCurrentSub(sub)
      }
      setFetching(false)
    }
    fetchStatus()
  }, [])

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: planId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-24 px-6 relative overflow-hidden">
       {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-start mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group italic font-bold">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <header className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 italic">
              <Star className="w-3 h-3 fill-current" />
              Upgrade Membership
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-8">
              UNLEASH YOUR <span className="text-emerald-400">LEGACY.</span>
            </h1>
            <p className="text-zinc-500 max-w-xl mx-auto italic font-medium">
              Join the pro circle to automate your impact and qualify for global prize pools. 
              Secure billing powered by Stripe.
            </p>
          </motion.div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {PLANS.map((plan, i) => (
             <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] bg-zinc-900/40 border-2 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between ${
                plan.highlight ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'border-zinc-800'
              }`}
             >
                {plan.bonus && (
                  <div className="absolute -top-4 right-10 px-4 py-1.5 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-lg uppercase italic shadow-lg">
                    {plan.bonus}
                  </div>
                )}

                <div>
                   <div className="mb-8">
                      <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black italic">{plan.price}</span>
                        <span className="text-zinc-500 text-sm italic font-bold">/{plan.interval}</span>
                      </div>
                   </div>

                   <div className="space-y-4 mb-12">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                           <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                           </div>
                           <span className="text-sm font-medium text-zinc-300 italic">{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading !== null || (currentSub?.plan_type === plan.id && currentSub?.status === 'active')}
                  className={`w-full h-16 rounded-[1.5rem] font-black italic text-lg shadow-2xl ${
                    plan.highlight ? 'bg-emerald-500 text-zinc-950' : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  } ${
                    (currentSub?.plan_type === plan.id && currentSub?.status === 'active') ? 'opacity-50 cursor-default grayscale' : ''
                  }`}
                >
                  {loading === plan.id ? 'Connecting...' : (
                    (currentSub?.plan_type === plan.id && currentSub?.status === 'active') 
                    ? 'Current Plan' 
                    : `Activate ${plan.name}`
                  )}
                </Button>
             </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-12 max-w-3xl text-center">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 grayscale opacity-40">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8" />
                <span className="text-[8px] font-black uppercase tracking-widest italic">Secure Vault</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8" />
                <span className="text-[8px] font-black uppercase tracking-widest italic">Fast Payouts</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8" />
                <span className="text-[8px] font-black uppercase tracking-widest italic">Cancel Anytime</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HelpCircle className="w-8 h-8" />
                <span className="text-[8px] font-black uppercase tracking-widest italic">24/7 Support</span>
              </div>
           </div>

           <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed">
             Join 12,000+ golfers making a difference. <br />
             Payments handled securely via Stripe. No credit card stored on our servers.
           </p>
        </div>
      </div>
    </div>
  )
}
