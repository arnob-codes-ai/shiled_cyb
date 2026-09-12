import React, { useState, useEffect } from 'react'
import {
  Globe,
  Layers,
  MapPin,
  Shield,
  Activity,
  Maximize2,
  Crosshair,
  Filter,
  Landmark,
  Compass,
  Zap,
  TrendingUp
} from 'lucide-react'
import { RealIndiaMap } from '../components/map/RealIndiaMap'
import { LocationDetailModal } from '../components/dashboard/LocationDetailModal'
import { CityNode3D, PageView } from '../types'
import { INDIA_TACTICAL_CITIES } from '../data/indiaGeoData'

interface LiveMapPageProps {
  onNavigate: (view: PageView) => void
  initialLocation?: string
  onSelectCaseNumber?: (caseNum: string) => void
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ onNavigate, initialLocation, onSelectCaseNumber }) => {
  const [selectedCity, setSelectedCity] = useState<CityNode3D | null>(null)
  const [modalCity, setModalCity] = useState<CityNode3D | null>(null)
  const [quickCity, setQuickCity] = useState(initialLocation || 'Kolkata')

  useEffect(() => {
    if (initialLocation) {
      setQuickCity(initialLocation)
      const found = INDIA_TACTICAL_CITIES.find(
        (c) =>
          c.name.toLowerCase() === initialLocation.toLowerCase() ||
          initialLocation.toLowerCase().includes(c.name.toLowerCase())
      )
      if (found) setSelectedCity(found)
    }
  }, [initialLocation])

  const handleCitySelect = (city: CityNode3D) => {
    setSelectedCity(city)
    setModalCity(city)
    setQuickCity(city.name)
  }

  const hotspotCities = [
    'Kolkata',
    'Delhi',
    'Bengaluru',
    'Mumbai',
    'Lucknow',
    'Patna',
    'Jaipur',
    'Hyderabad',
    'Ahmedabad',
    'Chandigarh',
    'Ranchi',
    'Bhopal',
    'Guwahati',
    'Srinagar',
    'Pune',
    'Chennai'
  ]

  return (
    <div className="space-y-3.5 pb-8 animate-in fade-in duration-300">
      {/* Top Map Control Bar */}
      <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 hud-corner flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-neon-cyan shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                Real 2D Geographic Cash-Out Intelligence Map
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                LIVE OPEN-GIS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Real geographic coordinates, OpenStreetMap / Leaflet tiles, 3D tactical beacons, and dynamic fund dissipation arcs.
            </p>
          </div>
        </div>

        {/* Quick Fly-To Hotspot Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1 hidden sm:inline whitespace-nowrap">
            Priority Sectors:
          </span>
          {hotspotCities.map((cityName) => (
            <button
              key={cityName}
              onClick={() => {
                setQuickCity(cityName)
                const found = INDIA_TACTICAL_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase())
                if (found) setSelectedCity(found)
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold whitespace-nowrap transition-all ${
                quickCity.toLowerCase() === cityName.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Real 2D Interactive Map Viewport */}
      <div className="w-full h-[calc(100vh-13.5rem)] min-h-[560px] rounded-2xl overflow-hidden border border-cyan-500/25 shadow-2xl relative">
        <RealIndiaMap
          selectedLocation={quickCity}
          onSelectCity={handleCitySelect}
          onInspectCase={(caseId) => {
            onNavigate('cases')
          }}
        />
      </div>

      {/* Interactive Location Inspection Modal */}
      {modalCity && (
        <LocationDetailModal
          city={modalCity}
          onClose={() => setModalCity(null)}
          onNavigate={onNavigate}
          onRunPredictor={() => {
            onNavigate('simulator')
          }}
        />
      )}
    </div>
  )
}

export default LiveMapPage
