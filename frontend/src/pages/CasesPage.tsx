import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react'
import { fetchCases } from '../services/api'
import { PageView } from '../types'

interface CasesPageProps {
  onNavigate: (view: PageView) => void
  onSelectCaseNumber: (caseNumber: string) => void
}

export const CasesPage: React.FC<CasesPageProps> = ({
  onNavigate,
  onSelectCaseNumber
}) => {
  const [casesList, setCasesList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [fraudTypeFilter, setFraudTypeFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const loadData = () => {
    setIsLoading(true)
    fetchCases({
      search,
      fraud_type: fraudTypeFilter,
      risk_level: riskFilter,
      status: statusFilter,
      limit: 50
    })
      .then((res) => {
        setCasesList(res)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load cases:', err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [search, fraudTypeFilter, riskFilter, statusFilter])

  return (
    <div className="space-y-4 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-cyber-border hud-corner">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            Cybercrime Case Management
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time complaint tracking, multi-hop financial velocity analysis, and predictive cash-out triage.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={async () => {
              try {
                const { batchRectifyCases } = await import('../services/api')
                const res = await batchRectifyCases()
                const confetti = (await import('canvas-confetti')).default
                confetti({ particleCount: 60, spread: 80, origin: { y: 0.3, x: 0.5 } })
                alert(`[SUCCESS] ${res.message || 'All high-risk cases and alerts manually rectified and solved!'}`)
                loadData()
              } catch (e) {
                console.error(e)
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-600/40 via-amber-600/30 to-emerald-600/40 hover:from-red-600/60 hover:to-emerald-600/60 border border-red-500/50 text-white font-mono font-bold text-xs transition-all shadow-neon-red flex items-center gap-1.5 active:scale-95"
            title="Batch solve and freeze all high-risk accounts in 1 click"
          >
            ⚡ BATCH RECTIFY ALL
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Refresh case data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('new_case')}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-semibold text-xs font-mono transition-all shadow-neon-cyan flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            NEW CASE INTAKE
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by case #, victim, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Fraud Type Filter */}
        <select
          value={fraudTypeFilter}
          onChange={(e) => setFraudTypeFilter(e.target.value)}
          className="h-9 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-cyan-400 focus:outline-none font-mono"
        >
          <option value="ALL">All Fraud Modus Operandi</option>
          <option value="Investment Scam">Investment Scam</option>
          <option value="UPI Fraud">UPI Fraud</option>
          <option value="Trading Fraud">Trading Fraud</option>
          <option value="Job Fraud">Job Fraud</option>
          <option value="Sextortion">Sextortion</option>
          <option value="Loan App Scam">Loan App Scam</option>
        </select>

        {/* Risk Level Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="h-9 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-cyan-400 focus:outline-none font-mono"
        >
          <option value="ALL">All Risk Tiers</option>
          <option value="HIGH">High Risk (≥ 80%)</option>
          <option value="MEDIUM">Medium Risk (65-79%)</option>
          <option value="LOW">Low Risk (&lt; 65%)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-cyan-400 focus:outline-none font-mono"
        >
          <option value="ALL">All Statuses</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Alert Sent">Alert Sent</option>
          <option value="Analysis">Analysis</option>
          <option value="Intervened">Intervened</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Cases Table View */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <th className="pb-3 font-semibold">Case ID</th>
              <th className="pb-3 font-semibold">Fraud Modus</th>
              <th className="pb-3 font-semibold">Reported Amount</th>
              <th className="pb-3 font-semibold">Victim Location</th>
              <th className="pb-3 font-semibold">Predicted Cash-Out</th>
              <th className="pb-3 font-semibold">Risk Score</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {casesList.map((c) => {
              const isHigh = c.risk_level === 'HIGH'

              return (
                <tr
                  key={c.id}
                  onClick={() => {
                    onSelectCaseNumber(c.case_number)
                    onNavigate('case_details')
                  }}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 font-mono font-bold text-cyan-400 group-hover:underline">
                    {c.case_number}
                  </td>
                  <td className="py-3 text-slate-200 font-medium">
                    {c.fraud_type}
                  </td>
                  <td className="py-3 font-mono text-slate-100 font-bold">
                    ₹{c.reported_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{c.victim_city}, {c.victim_state}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 font-mono text-[11px]">
                    {c.predicted_location ? (
                      <span className="text-cyan-300 font-semibold">{c.predicted_location}</span>
                    ) : (
                      <span className="text-slate-500 italic">Computing...</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        isHigh
                          ? 'bg-red-950/70 text-red-400 border border-red-500/40'
                          : 'bg-amber-950/70 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {c.risk_score ? `${c.risk_score.toFixed(0)}%` : '92%'}
                    </span>
                  </td>
                  <td className="py-3 font-mono">
                    <span
                      className={`text-[11px] font-semibold ${
                        c.status === 'Alert Sent'
                          ? 'text-red-400'
                          : c.status === 'Monitoring'
                          ? 'text-blue-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const { rectifyCase } = await import('../services/api')
                            await rectifyCase(c.id, {
                              action_type: 'Direct Interdiction & Mule Account Freeze',
                              notes: `Case ${c.case_number} manually rectified from Cases list.`
                            })
                            const confetti = (await import('canvas-confetti')).default
                            confetti({ particleCount: 35, spread: 50, origin: { y: 0.7, x: 0.8 } })
                            loadData()
                          } catch (err) {
                            console.error(err)
                          }
                        }}
                        className="px-2 py-1 rounded bg-red-950/60 hover:bg-emerald-600 hover:text-black text-red-300 font-mono text-[9px] font-bold transition-all border border-red-500/40"
                        title="1-click manual solve & account freeze"
                      >
                        ⚡ Solve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectCaseNumber(c.case_number)
                          onNavigate('case_details')
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-black text-cyan-400 font-mono text-[10px] font-semibold transition-all border border-slate-700 inline-flex items-center gap-1"
                      >
                        Analyze
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
