import React from 'react'
import {
  User,
  ArrowRight,
  GitFork,
  Landmark,
  MapPin,
  Clock,
  Coins,
  Lock
} from 'lucide-react'
import { CaseFlowData } from '../../types'

interface CaseFlowStepperProps {
  caseFlow?: CaseFlowData
  onExploreCase?: (caseNumber: string) => void
}

export const CaseFlowStepper: React.FC<CaseFlowStepperProps> = ({
  caseFlow,
  onExploreCase
}) => {
  const defaultFlow: CaseFlowData = {
    case_id: 'CC2026-001245',
    case_number: '#CC2026-001245',
    fraud_type: 'Investment Scam',
    steps: [
      {
        step: 1,
        title: 'Victim Account',
        subtitle: 'Kolkata, 10 Sep, 11:24 AM',
        type: 'victim',
        icon: 'user'
      },
      {
        step: 2,
        title: 'Mule Account',
        subtitle: 'UPI Transfer',
        type: 'mule',
        icon: 'arrow-right'
      },
      {
        step: 3,
        title: 'Multiple Transfers',
        subtitle: '(5 Accounts)',
        type: 'multi',
        icon: 'git-fork'
      },
      {
        step: 4,
        title: 'Predicted Cash-Out',
        subtitle: 'Park Street ATM',
        type: 'cashout',
        icon: 'landmark'
      }
    ],
    prediction: {
      predicted_location: 'Park Street ATM Cluster, Kolkata',
      risk_probability: '92%',
      risk_score: 92.0,
      expected_time_window: '6:00 PM – 9:00 PM (Today)',
      likely_amount: '₹1.5L – ₹2L'
    }
  }

  const flow = caseFlow || defaultFlow

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            Case Flow: <span className="text-cyan-400">{flow.case_number}</span>
          </h2>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {flow.fraud_type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onExploreCase && (
            <button
              onClick={() => onExploreCase(flow.case_id)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Deep Analysis →
            </button>
          )}
        </div>
      </div>

      {/* 4-Step Stepper Chain matching reference visual */}
      <div className="grid grid-cols-4 gap-2 mb-3 items-center relative">
        {flow.steps.map((step, idx) => {
          return (
            <div key={step.step} className="flex flex-col items-center text-center relative group">
              {/* Connector line between steps */}
              {idx < flow.steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-red-500/40 -z-0"></div>
              )}

              {/* Icon Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  step.type === 'victim'
                    ? 'bg-blue-950/80 border-blue-400 text-blue-300'
                    : step.type === 'mule'
                    ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                    : step.type === 'multi'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                    : 'bg-red-950/90 border-red-500 text-red-300 shadow-neon-red scale-110'
                }`}
              >
                {step.type === 'victim' ? (
                  <User className="w-4 h-4" />
                ) : step.type === 'mule' ? (
                  <ArrowRight className="w-4 h-4" />
                ) : step.type === 'multi' ? (
                  <GitFork className="w-4 h-4" />
                ) : (
                  <Landmark className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-1.5 font-semibold text-[11px] text-slate-100 leading-tight">
                {step.title}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                {step.subtitle}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Highlight Cards at Bottom matching reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Left Sub-card: Predicted Location & Expected Time Window */}
        <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-start gap-2 mb-1.5">
            <div className="p-1.5 rounded-md bg-red-950/60 border border-red-500/40 text-red-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-mono text-slate-400">Predicted Location</div>
              <div className="text-xs font-semibold text-white truncate">
                {flow.prediction.predicted_location}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono pl-1 pt-1 border-t border-slate-800/60">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Expected Time Window: <strong className="text-cyan-300">{flow.prediction.expected_time_window}</strong></span>
          </div>
        </div>

        {/* Right Sub-card: Risk Probability & Likely Amount */}
        <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Risk Probability</div>
              <div className="text-lg font-mono font-extrabold text-red-400 text-glow-red">
                {flow.prediction.risk_probability}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono pl-1 pt-1 border-t border-slate-800/60">
            <Coins className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Likely Amount: <strong className="text-amber-300">{flow.prediction.likely_amount}</strong></span>
          </div>
        </div>
      </div>

      {/* Manual Case Rectification Action Bar */}
      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Predictive Triage Active
        </div>
        <button
          onClick={async () => {
            try {
              const { rectifyCase } = await import('../../services/api')
              await rectifyCase(flow.case_id, {
                action_type: 'Immediate ATM Surveillance & Mule Freeze',
                notes: `Manually rectified threat at ${flow.prediction.predicted_location}`
              })
              const confetti = (await import('canvas-confetti')).default
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.8, x: 0.5 } })
              alert(`[SUCCESS] Case ${flow.case_number} manually rectified & interdicted!`)
            } catch (e) {
              console.error(e)
            }
          }}
          className="px-3 py-1 rounded bg-gradient-to-r from-red-600/40 to-amber-600/30 hover:from-red-600/60 hover:to-amber-600/50 border border-red-500/50 text-red-200 hover:text-white font-mono text-[10px] font-bold transition-all shadow-[0_0_8px_rgba(239,68,68,0.2)] flex items-center gap-1 active:scale-95"
          title="Manually freeze mule accounts and solve this case"
        >
          ⚡ MANUALLY RECTIFY & SOLVE CASE
        </button>
      </div>
    </div>
  )
}
