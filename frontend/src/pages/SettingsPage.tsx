import React, { useState } from 'react'
import {
  Settings,
  Shield,
  Bell,
  Volume2,
  Database,
  Lock,
  Cpu,
  CheckCircle2
} from 'lucide-react'
import { PageView } from '../types'

interface SettingsPageProps {
  onNavigate: (view: PageView) => void
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [riskThreshold, setRiskThreshold] = useState(80)
  const [audioAlerts, setAudioAlerts] = useState(true)
  const [wsStream, setWsStream] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex items-center justify-between">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Platform & Operational Configuration
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Manage predictive risk thresholds, telemetry feeds, and command center environment preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-neon-cyan"
        >
          SAVE CONFIGURATION
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Configuration preferences updated successfully across active session.
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Thresholds */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
          <h2 className="text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Predictive Risk Calibration
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">High Risk Alert Trigger Threshold:</span>
              <strong className="text-red-400 font-bold">{riskThreshold}%</strong>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              step={5}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <div className="text-white font-semibold">Real-Time Audio Alerts</div>
              <div className="text-[10px] text-slate-400 font-sans">Play tactical chime on live high-risk alert</div>
            </div>
            <input
              type="checkbox"
              checked={audioAlerts}
              onChange={(e) => setAudioAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <div className="text-white font-semibold">Live WebSocket Telemetry</div>
              <div className="text-[10px] text-slate-400 font-sans">Continuous background incident synchronization</div>
            </div>
            <input
              type="checkbox"
              checked={wsStream}
              onChange={(e) => setWsStream(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Security & Access Information */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
          <h2 className="text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Officer Credential & Clearance
          </h2>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Investigator Profile</span>
              <div className="text-white font-bold text-sm mt-0.5">Cybercrime Officer (AO-4492)</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Clearance Level</span>
              <div className="text-cyan-400 font-bold mt-0.5">Operational Intelligence Level 3</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Backend API Gateway</span>
              <div className="text-slate-300 font-mono text-[11px] mt-0.5">http://127.0.0.1:8000/api/v1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
