import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { TopRiskLocationsData, RiskLocationItem, PageView } from '../../types'

interface TopRiskLocationsPanelProps {
  data?: TopRiskLocationsData
  onSelectLocation?: (locationName: string) => void
  onNavigate?: (view: PageView) => void
}

export const TopRiskLocationsPanel: React.FC<TopRiskLocationsPanelProps> = ({
  data,
  onSelectLocation,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'atm_clusters' | 'cities' | 'districts'>('atm_clusters')

  const defaultData: TopRiskLocationsData = {
    atm_clusters: [
      { rank: 1, name: 'Park Street, Kolkata', risk: '92%', risk_score: 92, color: '#ef4444' },
      { rank: 2, name: 'Lajpat Nagar, Delhi', risk: '87%', risk_score: 87, color: '#ef4444' },
      { rank: 3, name: 'MG Road, Bengaluru', risk: '81%', risk_score: 81, color: '#f59e0b' },
      { rank: 4, name: 'Dadar, Mumbai', risk: '78%', risk_score: 78, color: '#f59e0b' },
      { rank: 5, name: 'Sector 17, Chandigarh', risk: '74%', risk_score: 74, color: '#f59e0b' }
    ],
    cities: [
      { rank: 1, name: 'Kolkata, West Bengal', risk: '89%', risk_score: 89, color: '#ef4444' },
      { rank: 2, name: 'New Delhi, NCR', risk: '86%', risk_score: 86, color: '#ef4444' },
      { rank: 3, name: 'Mumbai, Maharashtra', risk: '82%', risk_score: 82, color: '#f59e0b' },
      { rank: 4, name: 'Bengaluru, Karnataka', risk: '79%', risk_score: 79, color: '#f59e0b' },
      { rank: 5, name: 'Hyderabad, Telangana', risk: '71%', risk_score: 71, color: '#f59e0b' }
    ],
    districts: [
      { rank: 1, name: 'Kolkata Central, WB', risk: '91%', risk_score: 91, color: '#ef4444' },
      { rank: 2, name: 'South East Delhi, DL', risk: '88%', risk_score: 88, color: '#ef4444' },
      { rank: 3, name: 'Bengaluru Urban, KA', risk: '83%', risk_score: 83, color: '#f59e0b' },
      { rank: 4, name: 'Mumbai City, MH', risk: '80%', risk_score: 80, color: '#f59e0b' },
      { rank: 5, name: 'Chandigarh UT, CH', risk: '75%', risk_score: 75, color: '#f59e0b' }
    ]
  }

  const currentList: RiskLocationItem[] = (data && data[activeTab]) || defaultData[activeTab]

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-border hud-corner flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          Top Risk Locations
        </h2>
        {onNavigate && (
          <button
            onClick={() => onNavigate('live_map')}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3 Tabs: ATM Clusters | Cities | Districts matching reference */}
      <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800 mb-3 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab('atm_clusters')}
          className={`flex-1 py-1 rounded transition-all font-semibold ${
            activeTab === 'atm_clusters'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ATM Clusters
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`flex-1 py-1 rounded transition-all font-semibold ${
            activeTab === 'cities'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cities
        </button>
        <button
          onClick={() => setActiveTab('districts')}
          className={`flex-1 py-1 rounded transition-all font-semibold ${
            activeTab === 'districts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Districts
        </button>
      </div>

      {/* Ranked Progress Bar List matching reference image */}
      <div className="space-y-2.5">
        {currentList.map((item) => {
          const isHigh = item.risk_score >= 85

          return (
            <div
              key={item.rank}
              onClick={() => onSelectLocation && onSelectLocation(item.name)}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-[11px] font-mono text-slate-400 group-hover:text-cyan-400 font-bold">
                    {item.rank}
                  </span>
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs" style={{ color: item.color }}>
                  {item.risk}
                </span>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.risk_score}%`,
                    backgroundColor: item.color,
                    boxShadow: isHigh ? '0 0 8px rgba(239, 68, 68, 0.5)' : '0 0 8px rgba(245, 158, 11, 0.4)'
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
