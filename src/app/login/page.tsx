'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GolfAnimation } from '@/components/auth/GolfAnimation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, ArrowRight, Github } from 'lucide-react'

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <GolfAnimation onComplete={() => setShowForm(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md"
          >
            {/* Logo area */}
            <div className="flex flex-col items-center mb-10 translate-y-[-20px]">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-emerald-200 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-4 transform rotate-3">
                <span className="text-zinc-950 font-black text-2xl font-serif">G</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2 italic">GOLF CHARITY</h2>
              <p className="text-zinc-500 text-sm">Welcome back to the green</p>
            </div>

            {/* Auth Card */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-50" />
              
              <div className="space-y-6">
                <div className="text-center space-y-1 mb-2">
                  <h3 className="text-2xl font-semibold">{isLogin ? 'Sign In' : 'Create Account'}</h3>
                  <p className="text-zinc-500 text-sm italic">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>
                </div>

                <div className="space-y-4">
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    label="Email Address"
                    required
                  />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    label="Password"
                    required
                  />
                </div>

                <Button className="w-full group/btn relative overflow-hidden h-14">
                  <span className="relative z-10 flex items-center gap-2 text-lg">
                    {isLogin ? 'Continue to Platform' : 'Start Subscribing'}
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500 italic">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12">
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Mail className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center mt-8 text-zinc-600 text-xs italic px-8">
              By continuing, you agree to our Terms of Service and Privacy Policy. 
              10% of your subscription goes directly to your selected charity.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
