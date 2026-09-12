import React, { useState, useEffect } from 'react'
import {
  Share2,
  Filter,
  User,
  ArrowRight,
  GitFork,
  Landmark,
  Shield,
  Layers,
  Search,
  Info
} from 'lucide-react'
import { fetchNetworkGraph } from '../services/api'
import { PageView } from '../types'

interface NetworkGraphPageProps {
  onNavigate: (view: PageView) => void
}

export const NetworkGraphPage: React.FC<NetworkGraphPageProps> = ({ onNavigate }) => {
  const [graphData, setGraphData] = useState<any | null>(null)
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    fetchNetworkGraph(1)
      .then((res) => {
        setGraphData(res)
        setSelectedNode(res.nodes[0])
      })
      .catch((err) => console.error(err))
  }, [])

  const defaultNodes = [
    { id: 'n1', label: 'Victim: ACC-9921402', type: 'victim', risk: 'LOW', x: 120, y: 180, amount: '₹2,00,000' },
    { id: 'n2', label: 'Mule Tier-1 (SBI)', type: 'mule', risk: 'HIGH', x: 280, y: 140, amount: '₹2,00,000' },
    { id: 'n3', label: 'Mule Tier-2 (HDFC)', type: 'mule', risk: 'HIGH', x: 440, y: 140, amount: '₹1,90,000' },
    { id: 'n4', label: 'Layered Mule #1', type: 'mule', risk: 'MEDIUM', x: 580, y: 80, amount: '₹40,000' },
    { id: 'n5', label: 'Layered Mule #2', type: 'mule', risk: 'MEDIUM', x: 580, y: 160, amount: '₹45,000' },
    { id: 'n6', label: 'Layered Mule #3', type: 'mule', risk: 'MEDIUM', x: 580, y: 240, amount: '₹50,000' },
    { id: 'n7', label: 'Park Street ATM Cluster', type: 'atm', risk: 'HIGH', x: 740, y: 160, amount: 'Predicted Cash-Out' },
    { id: 'n8', label: 'Linked: #CC2026-001238', type: 'case', risk: 'HIGH', x: 380, y: 280, amount: '87% Match' }
  ]

  const edges = [
    { from: 'n1', to: 'n2', label: 'UPI' },
    { from: 'n2', to: 'n3', label: 'IMPS' },
    { from: 'n3', to: 'n4', label: 'Split #1' },
    { from: 'n3', to: 'n5', label: 'Split #2' },
    { from: 'n3', to: 'n6', label: 'Split #3' },
    { from: 'n4', to: 'n7', label: 'ATM' },
    { from: 'n5', to: 'n7', label: 'ATM' },
    { from: 'n6', to: 'n7', label: 'ATM' },
    { from: 'n2', to: 'n8', label: 'Shared Ring' }
  ]

  return (
    <div className="space-y-4 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Mule Account & Financial Entity Link Graph
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Interactive node-link visualization of syndicate account hierarchies, mule rings, and liquidation points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40">
            SYNDICATE PATTERN FLAGGED
          </span>
        </div>
      </div>

      {/* Main Canvas & Node Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">
        {/* Interactive SVG Network Graph Canvas (Spans 8 columns) */}
        <div className="lg:col-span-8 glass-panel p-4 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center bg-[#070c18]">
          <svg className="w-full h-[460px] select-none">
            {/* Edges */}
            {edges.map((e, idx) => {
              const nFrom = defaultNodes.find(n => n.id === e.from)
              const nTo = defaultNodes.find(n => n.id === e.to)
              if (!nFrom || !nTo) return null

              return (
                <g key={idx}>
                  <line
                    x1={nFrom.x}
                    y1={nFrom.y}
                    x2={nTo.x}
                    y2={nTo.y}
                    stroke={e.label === 'ATM' || e.label === 'Shared Ring' ? '#ef4444' : '#00f0ff'}
                    strokeWidth="2"
                    strokeDasharray={e.label === 'Shared Ring' ? '4,4' : undefined}
                    opacity="0.6"
                  />
                  <text
                    x={(nFrom.x + nTo.x) / 2}
                    y={(nFrom.y + nTo.y) / 2 - 6}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {e.label}
                  </text>
                </g>
              )
            })}

            {/* Nodes */}
            {defaultNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id
              const isHigh = node.risk === 'HIGH'

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 22 : 18}
                    fill={node.type === 'victim' ? '#0d2847' : node.type === 'atm' ? '#450a0a' : '#1e1b4b'}
                    stroke={isSelected ? '#00f0ff' : isHigh ? '#ef4444' : '#0ea5e9'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                  <text
                    y="4"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.type === 'victim' ? 'V' : node.type === 'atm' ? 'ATM' : node.type === 'case' ? 'CC' : 'M'}
                  </text>
                  <text
                    y="32"
                    fill={isSelected ? '#00f0ff' : '#cbd5e1'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {node.label.length > 18 ? node.label.slice(0, 16) + '...' : node.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Canvas HUD Legend */}
          <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Victim
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Mule
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> ATM Liquidation
            </span>
          </div>
        </div>

        {/* Node Telemetry Inspector (Spans 4 columns) */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Entity Telemetry Inspector
            </h2>

            {selectedNode ? (
              <div className="space-y-3 pt-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Selected Entity</span>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Node Type:</span>
                    <span className="text-cyan-300 font-bold uppercase">{selectedNode.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Risk Tier:</span>
                    <span className={selectedNode.risk === 'HIGH' ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {selectedNode.risk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Flow Volume:</span>
                    <span className="text-amber-300 font-bold">{selectedNode.amount}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Entity is actively participating in a multi-hop fund dissipation sequence with high transaction velocity.
                </p>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500 py-12">
                Click any node on the canvas to inspect entity properties.
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('cases')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            Trace Linked Cases
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
