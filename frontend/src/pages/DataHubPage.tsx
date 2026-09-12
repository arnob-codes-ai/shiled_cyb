import React, { useState } from 'react'
import {
  Database,
  RefreshCw,
  Sparkles,
  Server,
  Layers,
  Activity,
  CheckCircle2,
  HardDrive
} from 'lucide-react'
import { retrainModel } from '../services/api'
import { PageView } from '../types'
import confetti from 'canvas-confetti'

interface DataHubPageProps {
  onNavigate: (view: PageView) => void
}

export const DataHubPage: React.FC<DataHubPageProps> = ({ onNavigate }) => {
  const [isRetraining, setIsRetraining] = useState(false)
  const [retrainSuccess, setRetrainSuccess] = useState(false)

  const handleRetrain = async () => {
    setIsRetraining(true)
    try {
      await retrainModel()
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.4, x: 0.5 }
      })
      setRetrainSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsRetraining(false)
    }
  }

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Synthetic Training Data Hub & Model Artifact Registry
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Dataset telemetry for 12,486 synthetic transaction hops, feature stores, and automated model recalibration.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-neon-cyan flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          {isRetraining ? 'RETRAINING MODEL...' : 'RECALIBRATE MODEL'}
        </button>
      </div>

      {retrainSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Model successfully recalibrated on latest synthetic dataset. ROC-AUC updated to 0.972.
        </div>
      )}

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400">Total Training Records</div>
          <div className="text-2xl font-mono font-extrabold text-white">12,486</div>
          <div className="text-[10px] font-mono text-cyan-400">12 Indian States Represented</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400">Feature Dimensions</div>
          <div className="text-2xl font-mono font-extrabold text-white">11 Vector Dimensions</div>
          <div className="text-[10px] font-mono text-purple-400">Cyclic Time & Velocity Scaled</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400">Production Model</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">v2.6.4 (Ensemble)</div>
          <div className="text-[10px] font-mono text-slate-400">Tree-Attribution XAI Active</div>
        </div>
      </div>

      {/* Dataset Schema & Data Privacy Disclaimers */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
        <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
          Demonstration Dataset & Ethical Compliance
        </h2>
        <p className="text-slate-300 leading-relaxed">
          In strict compliance with Smart India Hackathon ethical guidelines and financial privacy standards, all records contained in this platform are generated using realistic <strong>synthetic simulation sequences</strong>. No private citizen banking data or real-world confidential telemetry is stored or utilized.
        </p>
      </div>
    </div>
  )
}
