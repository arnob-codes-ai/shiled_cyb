import React from 'react'
import {
  X,
  MapPin,
  Clock,
  Coins,
  Shield,
  Landmark,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { CityNode3D, PageView } from '../../types'

interface LocationDetailModalProps {
  city: CityNode3D | null
  onClose: () => void
  onNavigate?: (view: PageView) => void
  onRunPredictor?: (city: string) => void
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  city,
  onClose,
  onNavigate,
  onRunPredictor
}) => {
  if (!city) return null

  const isHigh = city.riskTier === 'HIGH'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel p-5 rounded-2xl border border-cyan-400/50 shadow-2xl hud-corner">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`p-2.5 rounded-xl border ${
              isHigh
                ? 'bg-red-950/80 border-red-500/50 text-red-400 shadow-neon-red'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-400'
            }`}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">{city.name} ATM Cluster</h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isHigh
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                }`}
              >
                {city.riskScore}% RISK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {city.state}, India • Cluster ID: {city.clusterId}
            </p>
          </div>
        </div>

        {/* 3 Key Metric Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center text-cyan-400 mb-1">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="text-base font-mono font-bold text-white">{city.atmCount}</div>
            <div className="text-[10px] text-slate-400">ATMs in Zone</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center text-blue-400 mb-1">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-base font-mono font-bold text-white">{city.bankCount}</div>
            <div className="text-[10px] text-slate-400">Bank Branches</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-center text-red-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-base font-mono font-bold text-red-400">{city.activeThreats}</div>
            <div className="text-[10px] text-slate-400">Active Threats</div>
          </div>
        </div>

        {/* Tactical Intel Details */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono mb-4">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Expected Cash-Out Window:</span>
            <span className="text-cyan-300 font-semibold">{city.expectedWindow}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Surveillance Priority:</span>
            <span className={isHigh ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
              {isHigh ? 'LEVEL 1 (IMMEDIATE SURVEILLANCE)' : 'LEVEL 2 (MONITORING)'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Correlated Syndicate Links:</span>
            <span className="text-slate-200">24 Identified Cases</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={async () => {
              try {
                const { batchRectifyCases } = await import('../../services/api')
                await batchRectifyCases()
                const confetti = (await import('canvas-confetti')).default
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.5, x: 0.5 } })
                alert(`[SUCCESS] Tactical intervention dispatched! Threat at ${city.name} successfully interdicted and accounts frozen.`)
                onClose()
              } catch (e) {
                console.error(e)
              }
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-neon-red flex items-center justify-center gap-2 active:scale-98"
          >
            ⚡ MANUALLY RECTIFY & FREEZE ACCOUNTS IN ZONE
          </button>

          <div className="flex items-center gap-2">
            {onRunPredictor && (
              <button
                onClick={() => {
                  onRunPredictor(city.name)
                  onClose()
                }}
                className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs transition-all shadow-neon-cyan flex items-center justify-center gap-1.5 font-mono"
              >
                Run What-If Prediction
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => {
                  onNavigate('cases')
                  onClose()
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 font-mono"
              >
                View Cases
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
