import React, { useState } from 'react'
import {
  Target,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  Shield,
  ArrowRight,
  TrendingUp,
  Activity,
  Sliders
} from 'lucide-react'
import { PageView } from '../types'

interface PredictionPageProps {
  onNavigate: (view: PageView) => void
  onSelectLocationForMap?: (locationName: string) => void
}

export const PredictionPage: React.FC<PredictionPageProps> = ({ onNavigate, onSelectLocationForMap }) => {
  const [selectedCluster, setSelectedCluster] = useState('Park Street ATM Cluster, Kolkata')

  const topAlternatives = [
    { rank: 1, name: 'Park Street ATM Cluster', city: 'Kolkata', state: 'West Bengal', risk: 92, window: '6:00 PM – 9:00 PM (Today)', atms: 42, similar: 24 },
    { rank: 2, name: 'Lajpat Nagar ATM Cluster', city: 'Delhi', state: 'Delhi', risk: 87, window: '5:00 PM – 8:00 PM (Today)', atms: 56, similar: 19 },
    { rank: 3, name: 'MG Road ATM Cluster', city: 'Bengaluru', state: 'Karnataka', risk: 81, window: '7:00 PM – 10:00 PM (Today)', atms: 48, similar: 15 },
    { rank: 4, name: 'Dadar ATM Cluster', city: 'Mumbai', state: 'Maharashtra', risk: 78, window: '6:30 PM – 9:30 PM (Today)', atms: 64, similar: 14 },
    { rank: 5, name: 'Sector 17 ATM Cluster', city: 'Chandigarh', state: 'Chandigarh', risk: 74, window: '4:00 PM – 7:00 PM (Today)', atms: 35, similar: 9 }
  ]

  const featureBreakdown = [
    { factor: 'Transaction Pattern Similarity', percentage: 32, note: 'Rapid multi-hop cascading sequence matches Investment Scam syndicate patterns.' },
    { factor: 'Historical Location Pattern', percentage: 27, note: 'Target cluster exhibits recurrent end-of-chain cash disbursements for similar amounts.' },
    { factor: 'Time Pattern', percentage: 21, note: 'High probability withdrawal activity concentrated in late evening ATM operational peak.' },
    { factor: 'Amount + Fraud Category', percentage: 15, note: '₹2,00,000 falls within the typical ATM cardless/micro-batch liquidation threshold.' },
    { factor: 'Linked-Case Behavior', percentage: 5, note: 'Overlap detected with previously documented cross-state mule banking networks.' }
  ]

  const handleTrackOnMap = (cityName: string) => {
    if (onSelectLocationForMap) {
      onSelectLocationForMap(cityName)
    }
    onNavigate('live_map')
  }

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Spatio-Temporal Cash-Out Predictive Intelligence
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Probabilistic forecasting of physical cash-liquidation corridors based on machine learning ensemble weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTrackOnMap('Kolkata')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono font-semibold text-xs transition-all border border-cyan-500/40 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            TRACK ON GIS MAP
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-black font-mono font-semibold text-xs transition-all shadow-neon-cyan flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            WHAT-IF SIMULATOR
          </button>
        </div>
      </div>

      {/* Main Focus: Top Forecast Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/40 shadow-neon-red hud-corner grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              Primary Threat Target Forecast
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Park Street ATM Cluster, Kolkata
          </h2>
          <p className="text-xs text-slate-300 font-sans">
            Ensemble predictive model estimates an immediate 92% liquidation risk probability for ongoing Investment Scam cases.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Window: <strong className="text-cyan-300">6:00 PM – 9:00 PM (Today)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Likely: <strong className="text-amber-300">₹1.5L – ₹2.0L</strong></span>
            </div>
          </div>
        </div>

        {/* Probability Metric Card */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-red-500/50 text-center space-y-2 shadow-lg">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Model Probability</div>
          <div className="text-4xl font-mono font-extrabold text-red-400 text-glow-red">92%</div>
          <div className="text-[10px] font-mono text-emerald-400 font-semibold">Confidence: 94.2%</div>
          <button
            onClick={() => handleTrackOnMap('Kolkata')}
            className="w-full mt-1 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs border border-red-500/40 flex items-center justify-center gap-1 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            Track Kolkata Vector
          </button>
        </div>
      </div>

      {/* Grid: Top 5 Alternatives + Explainable AI Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Alternative Locations */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Top Ranked Alternative Locations
          </h3>

          <div className="space-y-2.5">
            {topAlternatives.map((alt) => {
              return (
                <div
                  key={alt.rank}
                  onClick={() => handleTrackOnMap(alt.city)}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 group-hover:bg-cyan-500/20">
                      #{alt.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{alt.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{alt.city}, {alt.state} • {alt.window}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-red-400">{alt.risk}%</div>
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 justify-end group-hover:text-cyan-400">
                      <span>Track</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Explainable AI Radar / Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Transparent Explainable AI (XAI) Attribution
          </h3>

          <div className="space-y-2.5">
            {featureBreakdown.map((item, idx) => {
              return (
                <div key={idx} className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-semibold text-slate-200">{item.factor}</span>
                    <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${item.percentage * 2}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{item.note}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
