import React, { useState } from 'react'
import {
  Sliders,
  Sparkles,
  Play,
  MapPin,
  Clock,
  Coins,
  Activity,
  Shield,
  RotateCcw
} from 'lucide-react'
import { runSimulation } from '../services/api'
import { PageView } from '../types'

interface ScenarioSimulatorPageProps {
  onNavigate: (view: PageView) => void
}

export const ScenarioSimulatorPage: React.FC<ScenarioSimulatorPageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState(250000)
  const [fraudType, setFraudType] = useState('Investment Scam')
  const [hopCount, setHopCount] = useState(4)
  const [velocity, setVelocity] = useState(5.5)
  const [hourOfDay, setHourOfDay] = useState(19) // 7 PM
  const [victimCity, setVictimCity] = useState('Kolkata')
  const [victimState, setVictimState] = useState('West Bengal')

  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<any | null>(null)

  const handleRunSimulation = async () => {
    setIsSimulating(true)
    try {
      const res = await runSimulation({
        amount: Number(amount),
        fraud_type: fraudType,
        victim_city: victimCity,
        victim_state: victimState,
        hop_count: Number(hopCount),
        velocity_tx_per_hour: Number(velocity),
        hour_of_day: Number(hourOfDay)
      })
      setSimulationResult(res)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            What-If Scenario Simulation Sandbox
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Test arbitrary transaction magnitudes, layering velocity, and temporal factors to observe real-time predictive risk shifts.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 hover:from-cyan-400 text-black font-mono font-extrabold text-xs transition-all shadow-neon-cyan flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isSimulating ? 'SIMULATING...' : 'RUN WHAT-IF SIMULATION'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sliders Control Panel (Spans 6 columns) */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <h2 className="text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
            Simulation Variable Inputs
          </h2>

          {/* Amount Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Loss Amount:</span>
              <strong className="text-cyan-300 font-bold">₹{amount.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min={25000}
              max={1000000}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Hour of Day Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Time of Day:</span>
              <strong className="text-amber-300 font-bold">{hourOfDay}:00 hrs</strong>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={hourOfDay}
              onChange={(e) => setHourOfDay(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Velocity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Velocity:</span>
              <strong className="text-red-400 font-bold">{velocity} tx / hour</strong>
            </div>
            <input
              type="range"
              min={1.0}
              max={10.0}
              step={0.5}
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* Hop Count Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Mule Account Hop Depth:</span>
              <strong className="text-purple-300 font-bold">{hopCount} Layers</strong>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={hopCount}
              onChange={(e) => setHopCount(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Fraud Type Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400">Fraud Modus:</span>
            <select
              value={fraudType}
              onChange={(e) => setFraudType(e.target.value)}
              className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="Investment Scam">Investment Scam</option>
              <option value="UPI Fraud">UPI Fraud</option>
              <option value="Trading Fraud">Trading Fraud</option>
              <option value="Job Fraud">Job Fraud</option>
              <option value="Sextortion">Sextortion</option>
            </select>
          </div>
        </div>

        {/* Simulation Output Card (Spans 6 columns) */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-cyan-400/40 shadow-neon-cyan flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
              <h2 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Simulated Predictive Intelligence
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                DYNAMIC ML RECALCULATION
              </span>
            </div>

            {simulationResult ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Forecasted Location:</span>
                    <strong className="text-cyan-300 text-sm">{simulationResult.predicted_location}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Simulated Risk Score:</span>
                    <strong className="text-red-400 text-base">{simulationResult.simulated_risk_score}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Expected Time Window:</span>
                    <strong className="text-white">{simulationResult.expected_time_window}</strong>
                  </div>
                </div>

                {/* Top 3 Alternative Candidates */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase">Candidate Cluster Probabilities</span>
                  <div className="space-y-1">
                    {simulationResult.top_alternatives.slice(0, 3).map((alt: any) => (
                      <div key={alt.cluster_id} className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 text-[11px]">
                        <span className="text-slate-300">#{alt.rank} {alt.name}</span>
                        <span className="text-red-400 font-bold">{alt.risk_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center font-mono text-xs text-slate-400 py-12 space-y-2">
                <div>Adjust simulation sliders and click <strong>RUN WHAT-IF SIMULATION</strong> to recalculate ML cash-out predictions.</div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('live_map')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-all border border-slate-700"
          >
            Inspect Geospatial Risk on 3D Map
          </button>
        </div>
      </div>
    </div>
  )
}
