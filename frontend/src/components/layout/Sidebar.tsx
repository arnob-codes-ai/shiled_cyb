import React, { useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Target,
  Globe,
  Share2,
  CreditCard,
  BarChart3,
  Bell,
  FileText,
  Sliders,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react'
import { PageView } from '../../types'

interface SidebarProps {
  currentView: PageView
  onNavigate: (view: PageView) => void
  unreadAlertsCount?: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavItem {
  id: PageView
  label: string
  icon: React.ElementType
  badge?: string | number
  badgeColor?: string
  shortcut?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  unreadAlertsCount = 3,
  isCollapsed: externalCollapsed,
  onToggleCollapse
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalCollapsed(!internalCollapsed)
    }
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
    { id: 'cases', label: 'Cases', icon: Briefcase, shortcut: '2' },
    { id: 'new_case', label: 'New Case', icon: PlusCircle, shortcut: '3' },
    { id: 'prediction', label: 'Prediction', icon: Target, shortcut: '4' },
    { id: 'live_map', label: 'Live Map', icon: Globe, shortcut: '5' },
    { id: 'network_graph', label: 'Network Graph', icon: Share2, shortcut: '6' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, shortcut: '7' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, shortcut: '8' },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeColor: 'bg-red-600 text-white shadow-neon-red',
      shortcut: '9'
    },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'data_hub', label: 'Data Hub', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <aside
      className={`shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-[#070c18]/95 backdrop-blur-md border-r border-cyan-500/20 py-3 flex flex-col justify-between select-none z-20 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-56'
      }`}
      role="navigation"
      aria-label="Tactical Command Navigation Rail"
    >
      {/* Top Header Rail Brand (Compact / Expanded) */}
      <div className="px-3 mb-2 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">COMMAND RAIL</div>
              <div className="text-[9px] text-slate-400 font-mono">SIH26184 DECK</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-7 h-7 rounded bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
        )}

        {/* Sidebar Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={handleToggle}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Collapse Sidebar Rail"
            aria-label="Collapse Navigation Rail"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Links List */}
      <nav className="space-y-1 px-2 flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onNavigate(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/25 via-cyan-500/10 to-transparent text-cyan-300 border-y border-r border-cyan-400/40 font-semibold shadow-[inset_0_0_12px_rgba(0,240,255,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
                title={isCollapsed ? `${item.label} (${item.shortcut || ''})` : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Distinct Illuminated Left Active Indicator Edge */}
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></div>
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_#00f0ff]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate text-left flex-1 font-sans">{item.label}</span>
                )}

                {/* Badge for Alerts / Notifications */}
                {item.badge && (
                  <span
                    className={`ml-auto inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    } ${isCollapsed ? 'absolute -top-1 -right-1 w-4 h-4 p-0' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Collapsed Tooltip on Hover */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-slate-900/95 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-semibold whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                  {item.shortcut && <span className="text-slate-400 text-[10px] ml-1.5 font-sans">[{item.shortcut}]</span>}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Expand Button When Collapsed */}
      {isCollapsed && (
        <div className="px-2 py-1 flex justify-center border-t border-slate-800/80 mt-1">
          <button
            onClick={handleToggle}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Expand Sidebar Rail"
            aria-label="Expand Navigation Rail"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* System Status Mini Widget at Bottom */}
      {!isCollapsed ? (
        <div className="px-3 py-2 mx-2 rounded-lg bg-slate-900/90 border border-cyan-500/20 text-[11px] hud-corner">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              AI PREDICTOR ACTIVE
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
          </div>
          <div className="text-slate-200 font-medium text-[11px]">Ensemble ML v2.6.4</div>
          <div className="text-[10px] text-cyan-300 font-mono flex items-center justify-between">
            <span>ROC-AUC: 0.968</span>
            <span className="text-emerald-400">94.2% Acc</span>
          </div>
        </div>
      ) : (
        <div className="py-2 flex justify-center border-t border-slate-800">
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"
            title="ML Inference Engine Online • ROC-AUC 0.968"
          ></span>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
