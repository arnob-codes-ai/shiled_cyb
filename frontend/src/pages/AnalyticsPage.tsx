import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react'
import { fetchAnalytics } from '../services/api'
import { PageView } from '../types'
import { RiskTowers3D } from '../components/three/RiskTowers3D'

interface AnalyticsPageProps {
  onNavigate: (view: PageView) => void
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any | null>(null)
  const [timeRange, setTimeRange] = useState('30D')

  useEffect(() => {
    fetchAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
  }, [])

  const fraudDistribution = [
    { name: 'Investment Scam', value: 34, count: '4,245 cases', color: '#00f0ff' },
    { name: 'UPI Fraud', value: 26, count: '3,246 cases', color: '#38bdf8' },
    { name: 'Trading Fraud', value: 18, count: '2,247 cases', color: '#a855f7' },
    { name: 'Job Fraud', value: 12, count: '1,498 cases', color: '#f59e0b' },
    { name: 'Sextortion', value: 10, count: '1,250 cases', color: '#ef4444' }
  ]

  const hourlyPattern = [
    { hour: '00:00', val: 12 },
    { hour: '03:00', val: 8 },
    { hour: '06:00', val: 19 },
    { hour: '09:00', val: 45 },
    { hour: '12:00', val: 68 },
    { hour: '15:00', val: 92 },
    { hour: '18:00', val: 184, isPeak: true },
    { hour: '21:00', val: 156, isPeak: true },
    { hour: '23:00', val: 54 }
  ]

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Cybercrime Analytics & Machine Learning Telemetry
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Statistical distributions, hourly temporal risk heatmaps, state corridors, and ML model diagnostic metrics.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {['Today', '7D', '30D', 'All Time'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded transition-all ${
                timeRange === r ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Spatio-Temporal Risk Intensity Tower Mesh (Three.js Requirement) */}
      <div className="space-y-1.5">
        <RiskTowers3D />
      </div>

      {/* Grid: Fraud Distribution + Hourly Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fraud Category Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            Fraud Modus Operandi Breakdown
          </h2>

          <div className="space-y-2.5">
            {fraudDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200">{item.name}</span>
                  <span className="text-slate-400">{item.count} ({item.value}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Cash-Out Vulnerability Heatmap */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Hourly Cash-Out Liquidation Peak
            </h2>
            <span className="text-[10px] font-mono text-red-400 font-bold">
              PEAK: 6 PM – 10 PM
            </span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-36 pt-4">
            {hourlyPattern.map((p) => {
              const heightPct = (p.val / 200) * 100

              return (
                <div key={p.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono text-slate-400">{p.val}</span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      p.isPeak
                        ? 'bg-gradient-to-t from-red-600 to-amber-500 shadow-neon-red'
                        : 'bg-gradient-to-t from-blue-700 to-cyan-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">{p.hour.slice(0, 2)}h</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Machine Learning Model Performance Metrics */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 shadow-neon-cyan space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold uppercase text-white">
              ML Model Validation & Diagnostic Metrics (CashOut-Ensemble-v2.6)
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            PRODUCTION ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Accuracy</div>
            <div className="text-xl font-mono font-extrabold text-cyan-300 mt-0.5">94.2%</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Precision</div>
            <div className="text-xl font-mono font-extrabold text-white mt-0.5">92.8%</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Recall</div>
            <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">95.1%</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">F1-Score</div>
            <div className="text-xl font-mono font-extrabold text-purple-400 mt-0.5">93.9%</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">ROC-AUC</div>
            <div className="text-xl font-mono font-extrabold text-amber-400 mt-0.5">0.968</div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div className="text-[10px] uppercase text-slate-400 mb-2">Confusion Matrix (1,024 Test Cases)</div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">True Positives</span>
              <strong className="text-emerald-400 text-sm">475 Cases</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">False Positives</span>
              <strong className="text-amber-400 text-sm">36 Cases</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">False Negatives</span>
              <strong className="text-red-400 text-sm">31 Cases</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">True Negatives</span>
              <strong className="text-cyan-400 text-sm">482 Cases</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
