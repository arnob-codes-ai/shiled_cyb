import React, { useState } from 'react'
import {
  BrainCircuit,
  Clock,
  Shield,
  AlertCircle,
  Network,
  ChevronDown
} from 'lucide-react'
import { AiInsight } from '../../types'

interface AiInsightsPanelProps {
  insights?: AiInsight[]
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ insights }) => {
  const [selectedRange, setSelectedRange] = useState('This Week')

  // Default insights matching reference visual
  const defaultInsights: AiInsight[] = [
    {
      id: 1,
      icon: 'clock',
      text: '78% of predicted withdrawals occur within 6 hours of the final transaction.',
      type: 'info'
    },
    {
      id: 2,
      icon: 'shield',
      text: 'Most cash-out activities are clustered within 5 km of metro areas.',
      type: 'success'
    },
    {
      id: 3,
      icon: 'alert',
      text: 'Investment fraud cases show 3x higher ATM usage during 6 PM – 10 PM.',
      type: 'warning'
    },
    {
      id: 4,
      icon: 'network',
      text: 'Link analysis identified 24 new cross-state networks.',
      type: 'highlight'
    }
  ]

  const displayInsights = insights || defaultInsights

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            AI Insights
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800 cursor-pointer hover:border-slate-700">
          <span>{selectedRange}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Insights Bullet Points List */}
      <div className="space-y-2.5">
        {displayInsights.map((item) => {
          return (
            <div key={item.id} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans leading-relaxed">
              {item.icon === 'clock' ? (
                <div className="p-1 rounded bg-purple-500/20 text-purple-300 shrink-0 mt-0.5 border border-purple-500/30">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              ) : item.icon === 'shield' ? (
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5 border border-emerald-500/30">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              ) : item.icon === 'alert' ? (
                <div className="p-1 rounded bg-red-500/20 text-red-300 shrink-0 mt-0.5 border border-red-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="p-1 rounded bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5 border border-cyan-500/30">
                  <Network className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-[11px] text-slate-200">{item.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
