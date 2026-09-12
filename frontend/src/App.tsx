import React, { useState, useEffect } from 'react'
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardPage } from './pages/DashboardPage'
import { CasesPage } from './pages/CasesPage'
import { NewCasePage } from './pages/NewCasePage'
import { CaseDetailsPage } from './pages/CaseDetailsPage'
import { PredictionPage } from './pages/PredictionPage'
import { LiveMapPage } from './pages/LiveMapPage'
import { NetworkGraphPage } from './pages/NetworkGraphPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AlertsPage } from './pages/AlertsPage'
import { ReportsPage } from './pages/ReportsPage'
import { DataHubPage } from './pages/DataHubPage'
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage'
import { SettingsPage } from './pages/SettingsPage'
import { PageView } from './types'
import { AlertTriangle, X, ArrowRight } from 'lucide-react'

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('dashboard')
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string>('CC2026-001245')
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<string>('Kolkata')
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(3)
  const [liveToast, setLiveToast] = useState<any | null>(null)

  // Real-time WebSocket connection to backend
  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimeout: any = null

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host || '127.0.0.1:8000'
        const wsUrl = `${protocol}//${host.includes(':5173') ? '127.0.0.1:8000' : host}/ws/live`

        ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log('[*] Real-time WebSocket telemetry connected.')
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'LIVE_THREAT_DETECTED') {
              setUnreadAlertsCount((prev) => prev + 1)
              setLiveToast(data)
            }
          } catch (e) {
            console.error('WebSocket parse error:', e)
          }
        }

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWebSocket, 4000)
        }
      } catch (e) {
        console.warn('WebSocket connection not available in offline preview')
      }
    }

    connectWebSocket()

    return () => {
      if (ws) ws.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [])

  const handleLiveEventTriggered = (event: any) => {
    setUnreadAlertsCount((prev) => prev + 1)
    setLiveToast(event)
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
      case 'cases':
        return (
          <CasesPage
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
      case 'new_case':
        return (
          <NewCasePage
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
      case 'case_details':
        return (
          <CaseDetailsPage
            caseNumber={selectedCaseNumber}
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
            onSelectLocationForMap={(loc) => {
              setSelectedLocationForMap(loc)
              setCurrentView('live_map')
            }}
          />
        )
      case 'prediction':
        return (
          <PredictionPage
            onNavigate={setCurrentView}
            onSelectLocationForMap={(loc) => {
              setSelectedLocationForMap(loc)
              setCurrentView('live_map')
            }}
          />
        )
      case 'live_map':
        return (
          <LiveMapPage
            onNavigate={setCurrentView}
            initialLocation={selectedLocationForMap}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
      case 'network_graph':
        return <NetworkGraphPage onNavigate={setCurrentView} />
      case 'transactions':
        return <TransactionsPage onNavigate={setCurrentView} />
      case 'analytics':
        return <AnalyticsPage onNavigate={setCurrentView} />
      case 'alerts':
        return (
          <AlertsPage
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
      case 'reports':
        return <ReportsPage onNavigate={setCurrentView} />
      case 'data_hub':
        return <DataHubPage onNavigate={setCurrentView} />
      case 'simulator':
        return <ScenarioSimulatorPage onNavigate={setCurrentView} />
      case 'settings':
        return <SettingsPage onNavigate={setCurrentView} />
      default:
        return (
          <DashboardPage
            onNavigate={setCurrentView}
            onSelectCaseNumber={setSelectedCaseNumber}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased">
      {/* Top Bar Header */}
      <TopBar
        unreadAlertsCount={unreadAlertsCount}
        onLiveEventTriggered={handleLiveEventTriggered}
        onSearch={(query) => {
          if (query.trim().length > 2 && currentView !== 'cases') {
            setCurrentView('cases')
          }
        }}
      />

      {/* Main Layout Body: Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          unreadAlertsCount={unreadAlertsCount}
        />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 p-3 md:p-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Live Threat Real-Time Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full glass-panel p-4 rounded-2xl border border-red-500 shadow-2xl shadow-red-900/50 hud-corner animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <AlertTriangle className="w-4 h-4" />
              LIVE PROACTIVE THREAT ALERT
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-xs font-bold text-white">
            {liveToast.alert?.title || 'Immediate Cash-Out Surge Detected'}
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-0.5">
            Target: <strong className="text-cyan-300">{liveToast.location}</strong> • Loss: <strong>{liveToast.amount}</strong>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono text-red-400 font-bold">
              Probability: {liveToast.risk_probability || '94%'}
            </span>
            <button
              onClick={() => {
                setSelectedCaseNumber(liveToast.case_number)
                setCurrentView('case_details')
                setLiveToast(null)
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold transition-all shadow-neon-red flex items-center gap-1"
            >
              Inspect Case
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
