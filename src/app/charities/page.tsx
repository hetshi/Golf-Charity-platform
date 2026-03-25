import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Heart, ArrowRight, ShieldCheck, Star, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CharityDirectoryPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCharities() {
      const { data, error } = await supabase
        .from('charities')
        .select('*')
        .order('featured', { ascending: false })
      
      if (data) setCharities(data)
      
      // Fetch user's current choice
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: uc } = await supabase
          .from('user_charity')
          .select('charity_id')
          .eq('user_id', user.id)
          .single()
        if (uc) setSelectedCharityId(uc.charity_id)
      }
      
      setLoading(false)
    }
    fetchCharities()
  }, [])

  const categories = ['All', 'Environment', 'Health', 'Education', 'Animal Welfare']

  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || charity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelect = async (charityId: string) => {
    setProcessing(charityId)
    try {
      const res = await fetch('/api/charities/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId })
      })
      const data = await res.json()
      if (data.success) {
        setSelectedCharityId(charityId)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
     return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 italic">LOADING CHARITIES...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      {/* Header Section */}
      <header className="pt-24 pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 italic">
              <Heart className="w-3 h-3" />
              Charity Directory
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic mb-6">
              CHOOSE YOUR <span className="text-emerald-400">IMPACT.</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto italic font-medium">
              Every score you submit contributes directly to the cause you choose. 
              Browse our vetted partners and join the mission that matters to you.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-y border-zinc-900 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input 
              placeholder="Search charities..." 
              className="pl-12 h-14 italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-emerald-500 text-zinc-950' 
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCharities.map((charity, i) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={charity.image_url || 'https://images.unsplash.com/photo-1469571483398-84358bb003bd?q=80&w=800&auto=format&fit=crop'} 
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                
                {selectedCharityId === charity.id && (
                  <div className="absolute top-6 left-6 px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-zinc-950 text-[10px] font-black rounded-lg shadow-xl uppercase italic flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Currently Supporting
                  </div>
                )}

                {charity.featured && (
                  <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black rounded-lg shadow-xl uppercase italic flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                )}
                <div className="absolute bottom-6 left-6">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic mb-1">
                    {charity.category || 'Humanitarian'}
                  </div>
                  <h3 className="text-2xl font-black italic text-white leading-tight">
                    {charity.name}
                  </h3>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">
                    {charity.description}
                  </p>
                  
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Est. Impact</div>
                    </div>
                    <div className="text-xs font-black text-white italic">{charity.impact}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSelect(charity.id)}
                  disabled={processing !== null || selectedCharityId === charity.id}
                  className={`w-full h-14 rounded-2xl group/btn overflow-hidden ${
                    selectedCharityId === charity.id 
                    ? 'bg-zinc-800 text-zinc-500 cursor-default hover:bg-zinc-800 shadow-none border border-zinc-700' 
                    : 'bg-emerald-500 text-zinc-950'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {processing === charity.id ? 'Connecting...' : (selectedCharityId === charity.id ? 'Active Selection' : 'Select for Support')}
                    {selectedCharityId !== charity.id && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                  </span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCharities.length === 0 && (
          <div className="text-center py-40">
            <h3 className="text-2xl font-bold text-zinc-700 italic">NO CHARITIES MATCHED YOUR SEARCH</h3>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <div className="p-12 bg-zinc-900/20 border border-zinc-900 rounded-[3rem] backdrop-blur-sm">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 italic uppercase tracking-tighter">Vetted & Transparent</h2>
          <p className="text-zinc-500 text-sm italic font-medium leading-relaxed">
            All charities on our platform go through a rigorous 12-point authentication process. 
            We ensure that 100% of your contribution reaches the designated projects, 
            with monthly reports delivered straight to your dashboard.
          </p>
        </div>
      </section>
    </div>
  )
}
