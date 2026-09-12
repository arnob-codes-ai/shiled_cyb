import React, { useState, useEffect } from 'react'
import {
  FileText,
  Printer,
  Download,
  Shield,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { fetchReport } from '../services/api'
import { PageView } from '../types'

interface ReportsPageProps {
  onNavigate: (view: PageView) => void
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [reportData, setReportData] = useState<any | null>(null)
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1)

  useEffect(() => {
    fetchReport(selectedCaseId)
      .then((res) => setReportData(res))
      .catch((err) => console.error(err))
  }, [selectedCaseId])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Top Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Investigative Intelligence Dossier Generator
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Formal analytical dossier with decision-support intelligence, XAI reasoning, and legal verification notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(Number(e.target.value))}
            className="h-8 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
          >
            <option value={1}>Case #CC2026-001245 (Investment Scam)</option>
            <option value={2}>Case #CC2026-001238 (UPI Fraud)</option>
            <option value={3}>Case #CC2026-001201 (Trading Fraud)</option>
            <option value={4}>Case #CC2026-001189 (Job Fraud)</option>
            <option value={5}>Case #CC2026-001176 (Sextortion)</option>
          </select>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-neon-cyan flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            PRINT / SAVE PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      {reportData ? (
        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 space-y-6 text-slate-100 shadow-2xl print:border-none print:p-0 print:bg-white print:text-black">
          {/* Header Banner */}
          <div className="border-b-2 border-cyan-500 pb-4 flex items-start justify-between">
            <div>
              <div className="text-xl font-extrabold font-mono tracking-wider text-cyan-400 print:text-black">
                CYBER SHIELD ANALYTICAL ASSESSMENT
              </div>
              <div className="text-xs font-mono text-slate-400 print:text-gray-600 mt-1">
                Document ID: {reportData.report_id} • Generated: {reportData.generated_at}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 print:border-black print:text-black">
              {reportData.classification}
            </span>
          </div>

          {/* Case Overview */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              1. Incident Identification
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>Case Number: <strong>{reportData.case_overview.case_number}</strong></div>
              <div>Reported Loss: <strong className="text-cyan-300 print:text-black">{reportData.case_overview.reported_amount}</strong></div>
              <div>Modus Operandi: <strong>{reportData.case_overview.fraud_type}</strong></div>
              <div>Victim Location: <strong>{reportData.case_overview.victim_location}</strong></div>
            </div>
          </div>

          {/* Predictive Assessment */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              2. ML Spatio-Temporal Forecast
            </h2>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs print:bg-gray-100 print:border-gray-300">
              <div className="flex justify-between">
                <span>Predicted Cash-Out Location:</span>
                <strong className="text-cyan-300 print:text-black">{reportData.ml_predictive_assessment.primary_predicted_cluster}</strong>
              </div>
              <div className="flex justify-between">
                <span>Risk Probability:</span>
                <strong className="text-red-400 print:text-black">{reportData.ml_predictive_assessment.risk_probability}</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Operational Window:</span>
                <strong>{reportData.ml_predictive_assessment.forecasted_time_window}</strong>
              </div>
              <div className="flex justify-between">
                <span>Forecasted Liquidation Amount:</span>
                <strong>{reportData.ml_predictive_assessment.estimated_liquidation_range}</strong>
              </div>
            </div>
          </div>

          {/* Explainable AI Reasoning */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              3. Explainable AI (XAI) Attribution Breakdown
            </h2>
            <div className="space-y-2 text-xs font-sans">
              {reportData.explainable_ai_reasoning.map((item: any, i: number) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 print:bg-white print:border-gray-200">
                  <div className="flex justify-between font-mono font-semibold text-slate-200 print:text-black text-[11px] mb-0.5">
                    <span>{item.factor}</span>
                    <span className="text-cyan-400 print:text-black">{item.percentage}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              4. Recommended Decision-Support Protocols
            </h2>
            <ul className="space-y-1.5 text-xs font-sans text-slate-300 print:text-black list-disc pl-5">
              {reportData.recommended_investigative_actions.map((act: string, i: number) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-[10px] text-amber-300 print:text-gray-800 print:border-gray-400 font-sans leading-relaxed">
            {reportData.disclaimer}
          </div>
        </div>
      ) : (
        <div className="text-center font-mono text-xs text-slate-500 py-12">
          Loading report dossier...
        </div>
      )}
    </div>
  )
}
