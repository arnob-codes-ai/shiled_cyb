import React from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { RecentCase, PageView } from '../../types'

interface RecentCasesTableProps {
  cases?: RecentCase[]
  onSelectCase?: (caseItem: RecentCase) => void
  onNavigate?: (view: PageView) => void
}

export const RecentCasesTable: React.FC<RecentCasesTableProps> = ({
  cases,
  onSelectCase,
  onNavigate
}) => {
  // Default benchmark cases matching reference visual
  const defaultCases: RecentCase[] = [
    {
      id: 1,
      case_id: 'CC2026-001245',
      type: 'Investment Scam',
      amount: '₹2,00,000',
      amount_raw: 200000,
      location: 'Park Street, Kolkata',
      city: 'Kolkata',
      risk: '92%',
      risk_score: 92,
      status: 'Monitoring',
      status_color: 'text-blue-400'
    },
    {
      id: 2,
      case_id: 'CC2026-001238',
      type: 'UPI Fraud',
      amount: '₹85,000',
      amount_raw: 85000,
      location: 'Lajpat Nagar, Delhi',
      city: 'Delhi',
      risk: '87%',
      risk_score: 87,
      status: 'Alert Sent',
      status_color: 'text-red-400'
    },
    {
      id: 3,
      case_id: 'CC2026-001201',
      type: 'Trading Fraud',
      amount: '₹1,50,000',
      amount_raw: 150000,
      location: 'MG Road, Bengaluru',
      city: 'Bengaluru',
      risk: '81%',
      risk_score: 81,
      status: 'Analysis',
      status_color: 'text-amber-400'
    },
    {
      id: 4,
      case_id: 'CC2026-001189',
      type: 'Job Fraud',
      amount: '₹75,000',
      amount_raw: 75000,
      location: 'Dadar, Mumbai',
      city: 'Mumbai',
      risk: '78%',
      risk_score: 78,
      status: 'Monitoring',
      status_color: 'text-blue-400'
    },
    {
      id: 5,
      case_id: 'CC2026-001176',
      type: 'Sextortion',
      amount: '₹1,20,000',
      amount_raw: 120000,
      location: 'Sector 17, Chandigarh',
      city: 'Chandigarh',
      risk: '74%',
      risk_score: 74,
      status: 'Analysis',
      status_color: 'text-amber-400'
    }
  ]

  const displayCases = cases && cases.length > 0 ? cases.slice(0, 5) : defaultCases

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          Recent Cases
        </h2>
        {onNavigate && (
          <button
            onClick={() => onNavigate('cases')}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <th className="pb-2 font-semibold">Case ID</th>
              <th className="pb-2 font-semibold">Type</th>
              <th className="pb-2 font-semibold">Amount</th>
              <th className="pb-2 font-semibold">Location</th>
              <th className="pb-2 font-semibold">Risk</th>
              <th className="pb-2 font-semibold">Status</th>
              <th className="pb-2 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {displayCases.map((c) => {
              const isHigh = c.risk_score >= 80

              return (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase && onSelectCase(c)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 font-mono text-slate-300 font-medium group-hover:text-cyan-400 transition-colors">
                    {c.case_id}
                  </td>
                  <td className="py-2.5 text-slate-300">{c.type}</td>
                  <td className="py-2.5 font-mono text-slate-200 font-semibold">{c.amount}</td>
                  <td className="py-2.5 text-slate-300">{c.location}</td>
                  <td className="py-2.5 font-mono font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isHigh ? 'text-red-400 bg-red-950/60' : 'text-amber-400 bg-amber-950/60'
                      }`}
                    >
                      {c.risk}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] font-medium ${
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
                  <td className="py-2.5 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 inline transition-colors" />
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
