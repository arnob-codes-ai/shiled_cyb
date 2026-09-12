import React, { useState } from 'react'
import {
  PlusCircle,
  Sparkles,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  Landmark,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  FileCheck
} from 'lucide-react'
import { createNewCase } from '../services/api'
import { PageView } from '../types'
import confetti from 'canvas-confetti'

interface NewCasePageProps {
  onNavigate: (view: PageView) => void
  onSelectCaseNumber: (caseNumber: string) => void
}

export const NewCasePage: React.FC<NewCasePageProps> = ({
  onNavigate,
  onSelectCaseNumber
}) => {
  const [fraudType, setFraudType] = useState('Investment Scam')
  const [reportedAmount, setReportedAmount] = useState<number>(200000)
  const [victimName, setVictimName] = useState('Rohan Sen')
  const [victimLocation, setVictimLocation] = useState('Park Street Area, Central Kolkata')
  const [victimCity, setVictimCity] = useState('Kolkata')
  const [victimState, setVictimState] = useState('West Bengal')
  const [victimAccount, setVictimAccount] = useState('ACC-4921094')
  const [suspectedCluster, setSuspectedCluster] = useState('CC-WB-KOL-01')

  const [isProcessing, setIsProcessing] = useState(false)
  const [predictionResult, setPredictionResult] = useState<any | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const res = await createNewCase({
        fraud_type: fraudType,
        reported_amount: Number(reportedAmount),
        victim_name: victimName,
        victim_location: victimLocation,
        victim_city: victimCity,
        victim_state: victimState,
        victim_account: victimAccount,
        suspected_locations: suspectedCluster
      })

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.3, x: 0.5 },
        colors: ['#00f0ff', '#ef4444', '#10b981']
      })

      setPredictionResult(res)
    } catch (err) {
      console.error('Failed to create case:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4 pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex items-center justify-between">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            New Cybercrime Complaint Intake & Forecast
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Ingest first-information report, extract multi-hop transaction features, and generate immediate predictive cash-out intelligence.
          </p>
        </div>
        <span className="hidden sm:inline-block px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
          AI PIPELINE AUTO-TRIGGER
        </span>
      </div>

      {!predictionResult ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Complaint Details */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3.5">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              1. Incident & Complainant Details
            </h2>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Fraud Modus Operandi
              </label>
              <select
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
              >
                <option value="Investment Scam">Investment Scam (High-Yield Crypto / Trading)</option>
                <option value="UPI Fraud">UPI Compromise & Remote Access</option>
                <option value="Trading Fraud">Trading Platform / Arbitrage Scheme</option>
                <option value="Job Fraud">Work-From-Home Task Commission</option>
                <option value="Sextortion">Video Call Extortion / Digital Arrest</option>
                <option value="Loan App Scam">Illegal Instant Loan Harassment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Reported Loss Amount (₹)
              </label>
              <input
                type="number"
                value={reportedAmount}
                onChange={(e) => setReportedAmount(Number(e.target.value))}
                className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                placeholder="200000"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Complainant / Account Holder
              </label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                placeholder="Victim Name"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Source Account / UPI VPA
              </label>
              <input
                type="text"
                value={victimAccount}
                onChange={(e) => setVictimAccount(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                placeholder="ACC-4921094 or rohan@upi"
              />
            </div>
          </div>

          {/* Right Column: Geographic Corridor & Routing */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3.5">
            <div className="space-y-3.5">
              <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                2. Geographic Origin & Suspected Hotspot
              </h2>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Victim City & State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={victimCity}
                    onChange={(e) => setVictimCity(e.target.value)}
                    className="h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                    placeholder="City (e.g. Kolkata)"
                    required
                  />
                  <input
                    type="text"
                    value={victimState}
                    onChange={(e) => setVictimState(e.target.value)}
                    className="h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                    placeholder="State (e.g. West Bengal)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Incident Street / Area Location
                </label>
                <input
                  type="text"
                  value={victimLocation}
                  onChange={(e) => setVictimLocation(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  placeholder="Park Street Area, Central Kolkata"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Primary Surveillance Corridor
                </label>
                <select
                  value={suspectedCluster}
                  onChange={(e) => setSuspectedCluster(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="CC-WB-KOL-01">Park Street ATM Cluster (Kolkata, WB)</option>
                  <option value="CC-DL-DEL-01">Lajpat Nagar ATM Cluster (Delhi NCR)</option>
                  <option value="CC-KA-BLR-01">MG Road ATM Cluster (Bengaluru, KA)</option>
                  <option value="CC-MH-MUM-01">Dadar ATM Cluster (Mumbai, MH)</option>
                  <option value="CC-CH-CHD-01">Sector 17 Cluster (Chandigarh, CH)</option>
                </select>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold font-mono text-sm tracking-wider uppercase transition-all shadow-neon-cyan flex items-center justify-center gap-2 active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    RUNNING ML PREDICTIVE ENGINE...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    SUBMIT & GENERATE CASH-OUT FORECAST
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Instant Prediction Generated Result Dossier */
        <div className="glass-panel p-6 rounded-2xl border border-cyan-400/60 shadow-neon-cyan space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold font-mono text-white">
                  Case <span className="text-cyan-400">{predictionResult.case_number}</span> Ingested & Forecasted
                </h2>
                <p className="text-xs text-slate-300 font-sans">
                  Spatio-temporal machine learning model generated probabilistic cash-out intelligence.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-red-950/80 text-red-400 border border-red-500/50 shadow-neon-red">
              {predictionResult.risk_score}% PROBABILITY
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Forecasted Location</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{predictionResult.predicted_location}</div>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Operational Time Window</div>
              <div className="text-sm font-bold text-white mt-0.5">{predictionResult.expected_window}</div>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Initial Status</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{predictionResult.status}</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                onSelectCaseNumber(predictionResult.case_number)
                onNavigate('case_details')
              }}
              className="flex-1 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-xs uppercase transition-all shadow-neon-cyan flex items-center justify-center gap-2"
            >
              OPEN FULL CASE DOSSIER & TRANSACTIONS
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-all border border-slate-700"
            >
              Back to Command Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
