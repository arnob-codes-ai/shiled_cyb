import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Activity,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { fetchTransactions } from '../services/api'
import { PageView } from '../types'

interface TransactionsPageProps {
  onNavigate: (view: PageView) => void
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [channelFilter, setChannelFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadData = () => {
    setIsLoading(true)
    fetchTransactions({ channel: channelFilter, limit: 50 })
      .then((res) => {
        setTransactions(res)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [channelFilter])

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Financial Transaction Ledger & Anomaly Stream
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Ingested transaction hops, banking channel telemetry, velocity anomaly scoring, and flagged mule hops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-8 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Payment Channels</option>
            <option value="UPI">UPI Transfer</option>
            <option value="IMPS">IMPS Immediate</option>
            <option value="ATM">ATM Withdrawal</option>
            <option value="NEFT">NEFT / RTGS</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <th className="pb-3 font-semibold">Txn Reference</th>
              <th className="pb-3 font-semibold">Sender Account</th>
              <th className="pb-3 font-semibold">Receiver Account</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Channel</th>
              <th className="pb-3 font-semibold">Hop Level</th>
              <th className="pb-3 font-semibold">Anomaly Score</th>
              <th className="pb-3 font-semibold">Mule Tag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {transactions.map((tx) => {
              const isHighAnomaly = tx.anomaly_score >= 0.85

              return (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-cyan-400">{tx.txn_ref}</td>
                  <td className="py-3 font-mono text-slate-300">{tx.sender_account}</td>
                  <td className="py-3 font-mono text-slate-300">{tx.receiver_account}</td>
                  <td className="py-3 font-mono font-bold text-white">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-slate-300">{tx.channel}</td>
                  <td className="py-3 font-mono">Hop #{tx.hop_level}</td>
                  <td className="py-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighAnomaly
                          ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {Math.round(tx.anomaly_score * 100)}%
                    </span>
                  </td>
                  <td className="py-3">
                    {tx.is_mule && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                        FLAGGED MULE
                      </span>
                    )}
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
