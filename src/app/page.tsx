'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { 
  Trophy, 
  Heart, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-200 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <span className="text-zinc-950 font-black text-xl">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight italic">GOLF CHARITY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link>
            <Link href="#charities" className="hover:text-emerald-400 transition-colors">Charities</Link>
            <Link href="#prizes" className="hover:text-emerald-400 transition-colors">Prizes</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                <Zap className="w-3 h-3" />
                Next Draw in 12 Days
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                DRIVE CHANGE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 animate-gradient-x">WIN BIG.</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed italic">
                The world's first premium golf subscription platform where your scores contribute to global charities. Compete in monthly draws, support causes you love, and win luxury prizes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-16 px-10 group">
                    Join the Mission
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-xs italic">
                    +2k
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 border-y border-zinc-900 bg-zinc-900/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-4xl font-black text-emerald-400 mb-2">$1.2M+</div>
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest italic">Donated to Charity</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">50k+</div>
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest italic">Scores Submitted</div>
              </div>
              <div>
                <div className="text-4xl font-black text-emerald-400 mb-2">$450k+</div>
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest italic">Prize Pool Paid</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">124</div>
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest italic">Active Charities</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">EASY AS A <span className="text-emerald-400 italic">3-FOOT PUTT.</span></h2>
              <p className="text-zinc-500 max-w-xl mx-auto">Three simple steps to start making an impact while playing the game you love.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Enter Your Scores",
                  desc: "Submit your last 5 Stableford scores. We use these for our weighted draw algorithm."
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Choose Your Cause",
                  desc: "Select a charity to support. 10% of every subscription goes directly to your choice."
                },
                {
                  icon: <Trophy className="w-8 h-8" />,
                  title: "Win Monthly Prizes",
                  desc: "Automatically enter our monthly prize draws. Matching numbers wins you a share of the pool."
                }
              ].map((step, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/20">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 italic">{step.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-tr from-emerald-600 to-emerald-400 p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
            
            <h2 className="text-4xl md:text-6xl font-black text-zinc-950 mb-8 leading-tight">
              JOIN THE ELITE CIRCLE <br /> OF GIVING.
            </h2>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="h-16 px-12 bg-zinc-950 text-white hover:bg-zinc-900 shadow-2xl border-none">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        <p>© 2026 Golf Charity Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
