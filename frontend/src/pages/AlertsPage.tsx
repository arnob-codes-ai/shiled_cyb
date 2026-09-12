import React, { useState, useEffect } from 'react'
import {
  Bell,
  AlertTriangle,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  Filter,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { fetchAlerts, updateAlertStatus } from '../services/api'
import { ActiveAlert, PageView } from '../types'

interface AlertsPageProps {
  onNavigate: (view: PageView) => void
  onSelectCaseNumber: (caseNum: string) => void
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  onNavigate,
  onSelectCaseNumber
}) => {
  const [alerts, setAlerts] = useState<ActiveAlert[]>([])
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const loadData = () => {
    setIsLoading(true)
    fetchAlerts({ severity: severityFilter, status: statusFilter })
      .then((res) => {
        setAlerts(res)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [severityFilter, statusFilter])

  const handleAcknowledge = async (id: number) => {
    try {
      await updateAlertStatus(id, 'ACKNOWLEDGED')
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleResolve = async (id: number) => {
    try {
      await updateAlertStatus(id, 'RESOLVED')
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400 animate-pulse" />
            Proactive Threat Alert Center
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Automated predictive warning engine dispatching real-time intervention notifications to regional cyber cells.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-8 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High Severity Only</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const isHigh = alert.severity === 'HIGH'
          const isMedium = alert.severity === 'MEDIUM'

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isHigh
                  ? 'bg-red-950/25 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : isMedium
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg border ${
                      isHigh
                        ? 'bg-red-900/80 border-red-500 text-red-200'
                        : 'bg-amber-900/80 border-amber-500 text-amber-200'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{alert.code}</span>
                      <h2 className="text-sm font-bold text-white">{alert.title}</h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isHigh ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {alert.severity} • {alert.probability}% PROBABILITY
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {alert.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Window: {alert.expected_window}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Case Ref Tag */}
                <div
                  onClick={() => {
                    const raw = alert.case_ref.replace('#', '').replace('Case ', '').trim()
                    onSelectCaseNumber(raw)
                    onNavigate('case_details')
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono font-bold text-cyan-400 hover:border-cyan-400 cursor-pointer transition-all shrink-0"
                >
                  {alert.case_ref} →
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-sans mb-3">
                <span className="font-mono text-slate-400 uppercase text-[10px] block mb-0.5">Recommended Action:</span>
                {alert.action || 'Prioritize authorized surveillance and ATM branch liaison.'}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-all border border-slate-700"
                >
                  Acknowledge Alert
                </button>
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-mono font-semibold transition-all border border-emerald-500/40 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Intervened / Resolved
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
