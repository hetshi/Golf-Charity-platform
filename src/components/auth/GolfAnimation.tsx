'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface GolfAnimationProps {
  onComplete: () => void
}

export const GolfAnimation: React.FC<GolfAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'hitting' | 'rolling' | 'holed' | 'logo' | 'form'>('hitting')

  useEffect(() => {
    // Phase transitions
    if (phase === 'hitting') {
      const timer = setTimeout(() => setPhase('rolling'), 800)
      return () => clearTimeout(timer)
    }
    if (phase === 'rolling') {
      const timer = setTimeout(() => {
        setPhase('holed')
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DAA520', '#ffffff', '#228B22'] // Gold, White, Forest Green
        })
      }, 1200)
      return () => clearTimeout(timer)
    }
    if (phase === 'holed') {
      const timer = setTimeout(() => setPhase('logo'), 1000)
      return () => clearTimeout(timer)
    }
    if (phase === 'logo') {
      const timer = setTimeout(() => onComplete(), 2000)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase !== 'logo' && phase !== 'form' && (
          <motion.div 
            key="animation-scene"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative w-full h-[400px] flex items-center justify-center"
          >
            {/* Golf Hole/Pit */}
            <div className="absolute bottom-20 right-1/4 w-32 h-8 bg-black/40 rounded-[50%] blur-sm" />
            <div className="absolute bottom-[84px] right-1/4 w-28 h-4 bg-zinc-900 rounded-[50%] border-t-2 border-zinc-800" />
            
            {/* Golf Ball */}
            <motion.div
              initial={{ x: -300, y: 100 }}
              animate={
                phase === 'hitting' ? { x: -300, y: 100 } :
                phase === 'rolling' ? { x: [ -300, 100, 250], y: [100, 100, 100], rotate: 720 } :
                phase === 'holed' ? { x: 250, y: 120, scale: 0, opacity: 0 } : {}
              }
              transition={{ 
                duration: phase === 'rolling' ? 1.2 : 0.5,
                ease: phase === 'rolling' ? "easeOut" : "easeInOut"
              }}
              className="absolute w-8 h-8 bg-white rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)] z-10"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e5e5e5 100%)'
              }}
            >
              {/* Dimples texture */}
              <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                backgroundSize: '4px 4px' 
              }} />
            </motion.div>

            {/* Golf Club (Bat) */}
            <motion.div
              initial={{ rotate: -45, x: -380, y: 0 }}
              animate={
                phase === 'hitting' ? { rotate: [ -45, 15, -45], x: -380, y: 0 } :
                { opacity: 0 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-4 h-64 bg-zinc-800 origin-bottom rounded-full"
            >
              {/* Club Head */}
              <div className="absolute top-0 -left-6 w-12 h-6 bg-zinc-700 rounded-l-lg border-b-2 border-zinc-600" />
            </motion.div>

            {/* Grass/Floor */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-emerald-950/20 to-transparent" />
          </motion.div>
        )}

        {phase === 'logo' && (
          <motion.div
            key="logo-reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-200 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <span className="text-zinc-950 font-black text-4xl">G</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              GOLF <span className="text-emerald-400">CHARITY</span>
            </h1>
            <p className="text-zinc-400 text-lg">Drive change with every score.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
