import React from 'react'
import { MapPin, ArrowRight } from 'lucide-react'
import { ActiveAlert, PageView } from '../../types'

interface ActiveAlertsPanelProps {
  alerts?: ActiveAlert[]
  onSelectAlert?: (alert: ActiveAlert) => void
  onNavigate?: (view: PageView) => void
}

export const ActiveAlertsPanel: React.FC<ActiveAlertsPanelProps> = ({
  alerts,
  onSelectAlert,
  onNavigate
}) => {
  // Default alerts matching the reference image
  const defaultAlerts: ActiveAlert[] = [
    {
      id: 1,
      code: "ALT-2026-001",
      location: "Park Street, Kolkata",
      time: "10:22 AM",
      severity: "HIGH",
      title: "High cash withdrawal predicted",
      description: "High cash withdrawal predicted",
      case_ref: "Case #CC2026-001245",
      probability: 92.0
    },
    {
      id: 2,
      code: "ALT-2026-002",
      location: "Lajpat Nagar, Delhi",
      time: "09:48 AM",
      severity: "HIGH",
      title: "Multiple linked accounts detected",
      description: "Multiple linked accounts detected",
      case_ref: "Case #CC2026-001238",
      probability: 87.0
    },
    {
      id: 3,
      code: "ALT-2026-003",
      location: "MG Road, Bengaluru",
      time: "08:15 AM",
      severity: "MEDIUM",
      title: "Unusual transaction pattern",
      description: "Unusual transaction pattern",
      case_ref: "Case #CC2026-001201",
      probability: 81.0
    },
    {
      id: 4,
      code: "ALT-2026-004",
      location: "Dadar, Mumbai",
      time: "07:32 AM",
      severity: "MEDIUM",
      title: "New cluster match found",
      description: "New cluster match found",
      case_ref: "Case #CC2026-001189",
      probability: 78.0
    },
    {
      id: 5,
      code: "ALT-2026-005",
      location: "Sector 17, Chandigarh",
      time: "06:11 AM",
      severity: "LOW",
      title: "Possible cash-out activity",
      description: "Possible cash-out activity",
      case_ref: "Case #CC2026-001176",
      probability: 74.0
    }
  ]

  const displayAlerts = alerts && alerts.length > 0 ? alerts.slice(0, 5) : defaultAlerts

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span>
          Active Alerts
        </h2>
        {onNavigate && (
          <button
            onClick={() => onNavigate('alerts')}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Alert Cards List */}
      <div className="space-y-2">
        {displayAlerts.map((alert) => {
          const isHigh = alert.severity === 'HIGH'
          const isMedium = alert.severity === 'MEDIUM'

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer group ${
                isHigh
                  ? 'bg-red-950/25 border-red-500/30 hover:border-red-500/60 hover:bg-red-950/40'
                  : isMedium
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-950/35'
                  : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/35'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                {/* Location with Pin Icon */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isHigh ? 'text-red-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  />
                  <span className="font-semibold text-xs text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                    {alert.location}
                  </span>
                </div>

                {/* Time & Severity Badge */}
                <div className="flex items-center gap-1.5 shrink-0 font-mono">
                  <span className="text-[10px] text-slate-400">{alert.time}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isHigh
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_6px_rgba(239,68,68,0.3)]'
                        : isMedium
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>

              {/* Alert Title / Reason */}
              <div className="text-[11px] text-slate-300 truncate pl-5">
                {alert.title}
              </div>

              {/* Case Reference */}
              <div className="text-[10px] font-mono text-slate-400 pl-5 mt-0.5">
                {alert.case_ref.startsWith('Case') ? alert.case_ref : `Case ${alert.case_ref}`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
