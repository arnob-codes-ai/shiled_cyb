import React from 'react'
import {
  Briefcase,
  Target,
  AlertTriangle,
  ShieldCheck,
  Share2,
  Activity,
  ArrowUpRight
} from 'lucide-react'
import { DashboardKpis } from '../../types'

interface KpiCardsProps {
  kpis?: DashboardKpis
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  // Fallback defaults matching reference image if API is loading
  const totalCases = kpis?.total_cases?.formatted || '12,486'
  const predictedWithdrawals = kpis?.predicted_withdrawals?.formatted || '248'
  const highRiskAlerts = kpis?.high_risk_alerts?.formatted || '132'
  const interventions = kpis?.interventions?.formatted || '87'
  const linkedCases = kpis?.linked_cases?.formatted || '312'
  const isOnline = kpis?.live_monitoring?.status || 'System Online'

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Total Cases Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 hud-corner transition-all hover:border-cyan-400/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Briefcase className="w-4 h-4" />
          </div>
          {/* Mini Bar Chart Indicator */}
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-cyan-400 h-2 rounded-t"></span>
            <span className="w-1 bg-cyan-400 h-3 rounded-t"></span>
            <span className="w-1 bg-cyan-400 h-4 rounded-t"></span>
            <span className="w-1 bg-cyan-400 h-3.5 rounded-t"></span>
          </div>
        </div>
        <div className="text-xl font-mono font-extrabold text-white tracking-tight">{totalCases}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-sans">Total Cases</span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
            ↑ 18%
          </span>
        </div>
      </div>

      {/* 2. Predicted Withdrawals Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-purple-500/20 hud-corner transition-all hover:border-purple-400/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AI FORECAST
          </span>
        </div>
        <div className="text-xl font-mono font-extrabold text-white tracking-tight">{predictedWithdrawals}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-sans">Predicted Withdrawals</span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
            ↑ 28%
          </span>
        </div>
      </div>

      {/* 3. High Risk Alerts Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-red-500/30 hud-corner transition-all hover:border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-2 rounded-lg bg-red-950/70 border border-red-500/40 text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        </div>
        <div className="text-xl font-mono font-extrabold text-red-400 tracking-tight text-glow-red">{highRiskAlerts}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-sans">High Risk Alerts</span>
          <span className="text-[10px] font-mono text-red-400 font-semibold flex items-center">
            ↑ 42%
          </span>
        </div>
      </div>

      {/* 4. Interventions Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 hud-corner transition-all hover:border-emerald-400/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">PREVENTED</span>
        </div>
        <div className="text-xl font-mono font-extrabold text-white tracking-tight">{interventions}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-sans">Interventions</span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
            ↑ 36%
          </span>
        </div>
      </div>

      {/* 5. Linked Cases Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 hud-corner transition-all hover:border-cyan-400/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold">SYNDICATES</span>
        </div>
        <div className="text-xl font-mono font-extrabold text-white tracking-tight">{linkedCases}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-sans">Linked Cases</span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
            ↑ 25%
          </span>
        </div>
      </div>

      {/* 6. Live Monitoring Card with Real-time Sine/ECG Waveform */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/30 hud-corner transition-all hover:border-emerald-400/50">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">Live Monitoring</span>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-400 mb-2">{isOnline}</div>

        {/* Live Audio / ECG Pulse Wave Visualization */}
        <div className="flex items-center justify-between gap-1 h-5 px-1 py-0.5 rounded bg-slate-950/60 border border-slate-800">
          <span className="w-1 bg-emerald-500 h-1.5 rounded-full animate-pulse"></span>
          <span className="w-1 bg-emerald-500 h-3 rounded-full animate-ecg"></span>
          <span className="w-1 bg-emerald-500 h-4 rounded-full animate-pulse"></span>
          <span className="w-1 bg-emerald-500 h-2 rounded-full animate-ecg"></span>
          <span className="w-1 bg-emerald-500 h-4.5 rounded-full animate-pulse"></span>
          <span className="w-1 bg-emerald-500 h-2.5 rounded-full animate-ecg"></span>
          <span className="w-1 bg-emerald-500 h-1 rounded-full animate-pulse"></span>
          <span className="w-1 bg-emerald-500 h-3.5 rounded-full animate-ecg"></span>
          <span className="w-1 bg-emerald-500 h-2 rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>
  )
}
