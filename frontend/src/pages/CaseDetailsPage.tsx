import React, { useState, useEffect } from 'react'
import {
  Briefcase,
  GitFork,
  Target,
  Share2,
  FileText,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  Shield,
  Printer,
  ChevronLeft,
  AlertTriangle,
  Landmark,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { fetchCaseDetail, updateCaseStatus } from '../services/api'
import { CaseDetailResponse, PageView } from '../types'

interface CaseDetailsPageProps {
  caseNumber: string
  onNavigate: (view: PageView) => void
  onSelectCaseNumber: (caseNum: string) => void
  onSelectLocationForMap?: (locName: string) => void
}

type TabType = 'overview' | 'flow' | 'prediction' | 'linked' | 'evidence' | 'timeline'

export const CaseDetailsPage: React.FC<CaseDetailsPageProps> = ({
  caseNumber = 'CC2026-001245',
  onNavigate,
  onSelectCaseNumber,
  onSelectLocationForMap
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [data, setData] = useState<CaseDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('Monitoring')

  // Extract clean ID from case string (e.g. CC2026-001245 -> 1 or direct ID)
  const cleanId = caseNumber.includes('-')
    ? parseInt(caseNumber.split('-')[1], 10) || 1
    : parseInt(caseNumber, 10) || 1

  useEffect(() => {
    setIsLoading(true)
    fetchCaseDetail(cleanId)
      .then((res) => {
        setData(res)
        setStatus(res.case.status)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load case detail:', err)
        setIsLoading(false)
      })
  }, [cleanId])

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    try {
      await updateCaseStatus(cleanId, newStatus)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center font-mono text-xs text-cyan-400 animate-pulse">
          LOADING TACTICAL CASE DOSSIER {caseNumber}...
        </div>
      </div>
    )
  }

  const { case: caseInfo, transactions, prediction, linked_cases, timeline, evidence } = data
  const isHigh = caseInfo.risk_score >= 80

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Top Dossier Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('cases')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Back to Cases list"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-mono font-extrabold text-white tracking-wider">
                CASE DOSSIER: <span className="text-cyan-400">{caseInfo.case_number}</span>
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isHigh
                    ? 'bg-red-950/80 text-red-400 border border-red-500/50 shadow-neon-red'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-500/50'
                }`}
              >
                {caseInfo.risk_score}% PROBABILITY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {caseInfo.title} • Ingested on {caseInfo.created_at}
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-8 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-semibold text-cyan-300 focus:outline-none"
          >
            <option value="Monitoring">Status: Monitoring</option>
            <option value="Alert Sent">Status: Alert Sent</option>
            <option value="Analysis">Status: Analysis</option>
            <option value="Intervened">Status: Intervened</option>
            <option value="Closed">Status: Closed</option>
          </select>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Export Dossier
          </button>
        </div>
      </div>

      {/* 6 Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'flow' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          Transaction Flow
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'prediction' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          AI Prediction & XAI
        </button>
        <button
          onClick={() => setActiveTab('linked')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'linked' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          Linked Cases ({linked_cases?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'evidence' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Evidence & Logs
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
            activeTab === 'timeline' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Timeline
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Incident Specification
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Fraud Category</span>
                <div className="text-white font-bold text-sm mt-0.5">{caseInfo.fraud_type}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Reported Amount</span>
                <div className="text-cyan-400 font-extrabold text-sm mt-0.5">{caseInfo.reported_amount_formatted}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Victim Location</span>
                <div className="text-slate-200 font-semibold mt-0.5">{caseInfo.victim_location}, {caseInfo.victim_city}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Source Account / VPA</span>
                <div className="text-slate-200 font-semibold mt-0.5">{caseInfo.victim_account}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-slate-400">Investigative Synopsis</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Multi-hop cascading fund dissipation initiated via instant UPI protocol. Intelligence engine flagged 2 intermediate layering hops through cooperative banking channels before targeting physical withdrawal in {prediction.location_name}.
              </p>
            </div>

            {/* Manual Case Rectification & Solving Controls */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-blue-950/40 border border-red-500/40 shadow-neon-red space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase text-white">Manual Case Interdiction & Rectification</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                  AUTHORIZATION: LEVEL 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400">Intervention Protocol:</span>
                  <select
                    id="rectify-action-select"
                    className="w-full h-8 mt-1 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-cyan-300 focus:outline-none"
                  >
                    <option value="Freeze Mule Accounts (Section 102 BNSS)">1. Freeze Mule Accounts (Section 102 BNSS)</option>
                    <option value="Dispatch Physical ATM Surveillance Unit">2. Dispatch Physical ATM Surveillance Unit</option>
                    <option value="Immediate Fund Lien & Recovery Notice">3. Immediate Fund Lien & Recovery Notice</option>
                    <option value="Rectify & Solve Case (Full Interdiction)">4. Rectify & Solve Case (Full Interdiction)</option>
                    <option value="Dismiss as False Positive">5. Dismiss as False Positive</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Investigator Operational Notes:</span>
                  <input
                    id="rectify-notes-input"
                    type="text"
                    defaultValue={`Verified target withdrawal corridor in ${prediction.location_name}. Interdiction executed.`}
                    className="w-full h-8 mt-1 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    const actionEl = document.getElementById('rectify-action-select') as HTMLSelectElement
                    const notesEl = document.getElementById('rectify-notes-input') as HTMLInputElement
                    const { rectifyCase } = await import('../services/api')
                    await rectifyCase(cleanId, {
                      action_type: actionEl?.value || 'Mule Account Frozen & ATM Surveillance Dispatched',
                      notes: notesEl?.value || 'Manually rectified & solved by Cybercrime Officer.'
                    })
                    const confetti = (await import('canvas-confetti')).default
                    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5, x: 0.5 } })
                    setStatus('Intervened')
                    alert(`[SUCCESS] Case ${caseInfo.case_number} has been manually rectified, accounts frozen, and marked as Intervened/Solved!`)
                  } catch (e) {
                    console.error(e)
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-neon-red flex items-center justify-center gap-2 active:scale-98"
              >
                ⚡ EXECUTE MANUAL RECTIFICATION & SOLVE CASE
              </button>
            </div>
          </div>

          {/* Quick Forecast Spotlight */}
          <div className="glass-panel p-5 rounded-xl border border-red-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">ML Forecast Summary</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <div className="text-lg font-bold text-white mb-1">{prediction.location_name}</div>
              <div className="text-xs font-mono text-cyan-300">Expected: {prediction.expected_time_window}</div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Risk Probability:</span>
                <span className="text-red-400 font-bold">{prediction.risk_score}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Estimated Amount:</span>
                <span className="text-amber-300 font-bold">{prediction.likely_amount_formatted}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onSelectLocationForMap) {
                    onSelectLocationForMap(prediction.city || prediction.location_name)
                  }
                  onNavigate('live_map')
                }}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono font-bold text-xs transition-all border border-cyan-500/40 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Track on GIS Map
              </button>
              <button
                onClick={() => setActiveTab('prediction')}
                className="py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs transition-all shadow-neon-cyan flex items-center justify-center gap-1"
              >
                Explainable AI
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Transaction Flow */}
      {activeTab === 'flow' && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              Multi-Hop Transaction Fund Dissipation Chain
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {transactions.length} Identified Hops
            </span>
          </div>

          <div className="space-y-3">
            {transactions.map((tx, idx) => {
              const isCashout = tx.hop_level === 4 || tx.channel.includes('ATM')

              return (
                <div
                  key={tx.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isCashout
                      ? 'bg-red-950/30 border-red-500/50 shadow-neon-red'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border ${
                        isCashout
                          ? 'bg-red-600 text-white border-red-400 animate-pulse'
                          : 'bg-blue-950 text-blue-300 border-blue-500/50'
                      }`}
                    >
                      H{tx.hop_level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{tx.sender_name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-300 font-mono">{tx.receiver_name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Ref: {tx.txn_ref} • Channel: {tx.channel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 font-mono text-xs">
                    <div>
                      <div className="text-slate-200 font-bold">{tx.amount_formatted}</div>
                      <div className="text-[9px] text-slate-400">{tx.timestamp}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCashout
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      Anomaly: {Math.round(tx.anomaly_score * 100)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 3: AI Prediction & Explainable AI (XAI) */}
      {activeTab === 'prediction' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 shadow-neon-cyan space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
              <h2 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Explainable AI (XAI) Feature Contribution Breakdown
              </h2>
              <span className="text-[10px] font-mono text-cyan-300">
                {prediction.explanation.methodology}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans italic">
              "{prediction.explanation.summary}"
            </p>

            {/* Feature attribution percentage bars */}
            <div className="space-y-2.5 pt-2">
              {prediction.explanation.breakdown.map((item, idx) => {
                return (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-semibold text-slate-200">{item.factor}</span>
                      <span className="text-cyan-400 font-bold">{item.percentage}% Contribution</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top 5 Alternative Locations */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
              Ranked Candidate Cash-Out Clusters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prediction.top_alternatives.map((alt) => {
                return (
                  <div key={alt.cluster_id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">#{alt.rank} {alt.name}</span>
                      <span className="text-red-400 font-bold">{alt.risk_score}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{alt.city}, {alt.state}</div>
                    <div className="text-[10px] text-cyan-300 font-mono">Window: {alt.expected_window}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Linked Cases */}
      {activeTab === 'linked' && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Cross-Case Correlation & Mule Ring Overlap
            </h2>
            <span className="text-[10px] font-mono text-amber-400">
              Requires Investigator Verification
            </span>
          </div>

          <div className="space-y-3">
            {linked_cases.map((lc) => {
              return (
                <div
                  key={lc.case_id}
                  onClick={() => onSelectCaseNumber(lc.case_number)}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400 group-hover:underline">{lc.case_number}</span>
                      <span className="text-slate-300 font-sans font-medium">{lc.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/40">
                      {lc.similarity_score}% Similarity
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400 font-sans pl-2 border-l-2 border-slate-700">
                    {lc.similarity_factors.map((f, i) => (
                      <div key={i}>• {f}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Evidence */}
      {activeTab === 'evidence' && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
            Chain of Custody & Telemetry Hashes
          </h2>
          <div className="space-y-2.5 font-mono text-xs">
            {evidence.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{ev.type}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">SHA256: {ev.hash}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Timeline */}
      {activeTab === 'timeline' && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
            Chronological Incident Trail
          </h2>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/30">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-neon-cyan"></span>
                <div className="text-xs font-mono text-cyan-300 font-semibold">{item.time} ({item.date})</div>
                <div className="text-xs font-bold text-white mt-0.5">{item.event}</div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
