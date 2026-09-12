import React, { useState, useEffect } from 'react'
import {
  Shield,
  Search,
  Bell,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Command
} from 'lucide-react'
import { triggerLiveEvent } from '../../services/api'
import confetti from 'canvas-confetti'

interface TopBarProps {
  onSearch?: (query: string) => void
  onLiveEventTriggered?: (event: any) => void
  unreadAlertsCount?: number
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearch,
  onLiveEventTriggered,
  unreadAlertsCount = 3
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState('12 Sep 2026  10:24 AM')
  const [isSimulating, setIsSimulating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Real-time clock formatted to reference image timestamp style
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Display current time or reference default
      const timeStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + '  ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      setCurrentTime(timeStr)
    }
    updateTime()
    const interval = setInterval(updateTime, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSimulateLiveThreat = async () => {
    try {
      setIsSimulating(true)
      const res = await triggerLiveEvent()
      
      // Visual celebration / tactical cue
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.1, x: 0.8 },
        colors: ['#ef4444', '#00f0ff', '#f59e0b']
      })

      if (onLiveEventTriggered && res?.event) {
        onLiveEventTriggered(res.event)
      }
    } catch (err) {
      console.error('Simulation trigger failed:', err)
    } finally {
      setTimeout(() => setIsSimulating(false), 800)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-cyber-border px-4 lg:px-6 flex items-center justify-between shadow-lg">
      {/* Brand Logo & Product Name */}
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 shadow-neon-cyan">
          <Shield className="w-6 h-6 text-cyan-400" />
          <div className="absolute inset-0 rounded-lg bg-cyan-400/10 animate-pulse"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-wider text-white font-mono uppercase text-glow-cyan">
              CYBER SHIELD
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              v2.6
            </span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-tight font-sans hidden sm:block">
            Cash-Out Intelligence Platform
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search case, account, location, keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-9 pl-10 pr-16 bg-[#0b1326]/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] text-slate-400 font-mono">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      {/* Right Action Tools & User Profile */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Live Threat Simulator Action Button (SIH Demo Spotlight) */}
        <button
          onClick={handleSimulateLiveThreat}
          disabled={isSimulating}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/30 to-amber-600/20 hover:from-red-600/50 hover:to-amber-600/40 border border-red-500/50 text-red-300 hover:text-white text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:shadow-neon-red active:scale-95"
          title="Trigger a real-time live fraudulent cash-out simulation event"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? 'animate-bounce' : 'group-hover:scale-110'}`} />
          <span className="hidden sm:inline">
            {isSimulating ? 'TRANSMITTING...' : 'SIMULATE LIVE THREAT'}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        {/* Date & Time Clock Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          title={soundEnabled ? 'Audio alerts enabled' : 'Audio alerts muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button className="relative p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors">
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold shadow-neon-red">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Avatar & Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 border border-cyan-300 flex items-center justify-center text-white text-xs font-mono font-bold shadow-neon-cyan">
            AO
          </div>
          <div className="hidden lg:block text-left select-none">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Cybercrime Officer</div>
            <div className="text-[10px] text-cyan-400 font-mono">AO-4492 • Active</div>
          </div>
        </div>
      </div>
    </header>
  )
}
