import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import L from 'leaflet'
import {
  Shield,
  Layers,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  AlertTriangle,
  Landmark,
  Activity,
  Crosshair,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  TrendingUp,
  ArrowRight,
  Zap,
  RefreshCw,
  Eye,
  Radio
} from 'lucide-react'
import {
  INDIA_TACTICAL_CITIES,
  INDIA_TRANSACTION_FLOWS,
  CityNode3D,
  TransactionFlowArc
} from '../../data/indiaGeoData'
import { fetchRiskLocations } from '../../services/api'

interface RealIndiaMapProps {
  selectedLocation?: string
  onSelectCity?: (city: CityNode3D) => void
  highlightCluster?: string
  onInspectCase?: (caseNumber: string) => void
}

export const RealIndiaMap: React.FC<RealIndiaMapProps> = ({
  selectedLocation = 'Kolkata',
  onSelectCity,
  highlightCluster,
  onInspectCase
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const arcsLayerRef = useRef<L.LayerGroup | null>(null)
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null)

  // Map and Telemetry state
  const [citiesData, setCitiesData] = useState<CityNode3D[]>(INDIA_TACTICAL_CITIES)
  const [activeCity, setActiveCity] = useState<CityNode3D | null>(() => {
    return (
      INDIA_TACTICAL_CITIES.find(
        (c) => c.name.toLowerCase() === selectedLocation.toLowerCase()
      ) || INDIA_TACTICAL_CITIES[0]
    )
  })
  const [selectedFlow, setSelectedFlow] = useState<TransactionFlowArc | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CityNode3D[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(5)
  const [mapCenterCoords, setMapCenterCoords] = useState<[number, number]>([22.5937, 78.9629])
  const [tileLoadError, setTileLoadError] = useState(false)
  const [isLiveConnected, setIsLiveConnected] = useState(true)

  // Layer Visibility & Filtering Toggles
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showArcs, setShowArcs] = useState(true)
  const [showClusters, setShowClusters] = useState(true)
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')

  // India geographic bounds
  const indiaBounds = useMemo(() => L.latLngBounds([7.0, 68.0], [36.5, 97.5]), [])

  // Fetch dynamic risk data from backend
  useEffect(() => {
    let mounted = true
    fetchRiskLocations()
      .then((clusters) => {
        if (!mounted || !clusters || !Array.isArray(clusters) || clusters.length === 0) return

        // Merge backend data with local geo database
        setCitiesData((prevCities) => {
          const updated = [...prevCities]
          clusters.forEach((cluster) => {
            const index = updated.findIndex(
              (c) =>
                c.name.toLowerCase() === (cluster.city || cluster.name || '').toLowerCase() ||
                c.clusterId === cluster.cluster_id
            )
            const node: CityNode3D = {
              name: cluster.city || cluster.name,
              state: cluster.state || 'India',
              lat: cluster.latitude,
              lng: cluster.longitude,
              riskTier: (cluster.risk_tier as any) || (cluster.risk_score >= 80 ? 'HIGH' : cluster.risk_score >= 65 ? 'MEDIUM' : 'LOW'),
              riskScore: Math.round(cluster.risk_score <= 1.0 ? cluster.risk_score * 100 : cluster.risk_score),
              atmCount: cluster.atm_count || 35,
              bankCount: cluster.bank_branches || 15,
              activeThreats: cluster.active_threats || 5,
              clusterId: cluster.cluster_id || `CC-IND-${cluster.city || '01'}`,
              expectedWindow: cluster.expected_time_window || '6:00 PM – 9:00 PM'
            }
            if (index >= 0) {
              updated[index] = { ...updated[index], ...node }
            } else {
              updated.push(node)
            }
          })
          return updated
        })
      })
      .catch((err) => {
        console.warn('Real-time backend location feed unavailable, operating in standalone mode:', err)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Initialize Real Leaflet 2D Geographic Map (No Proprietary API Key Required)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const defaultCenter: L.LatLngExpression = [22.8, 79.6]

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
      maxBounds: indiaBounds.pad(0.35)
    })

    // Setup Custom Dark Leaflet Attribution
    map.attributionControl.setPrefix(false)
    map.attributionControl.addAttribution(
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" class="text-cyan-400 hover:underline">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer" class="text-cyan-400 hover:underline">CARTO</a>'
    )

    // Configurable Tile URL (Defaults to OpenStreetMap / CartoDB Dark Matter with zero API key requirement)
    const tileUrl =
      (import.meta as any).env?.VITE_MAP_TILE_URL ||
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    })

    tileLayer.on('tileerror', () => {
      setTileLoadError(true)
    })

    tileLayer.on('load', () => {
      setTileLoadError(false)
    })

    tileLayer.addTo(map)
    tileLayerRef.current = tileLayer

    // Setup Layer Groups
    const heatmapGroup = L.layerGroup().addTo(map)
    const arcsGroup = L.layerGroup().addTo(map)
    const markersGroup = L.layerGroup().addTo(map)

    heatmapLayerRef.current = heatmapGroup
    arcsLayerRef.current = arcsGroup
    markersLayerRef.current = markersGroup
    mapInstanceRef.current = map

    // Sync Viewport state
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom())
    })
    map.on('moveend', () => {
      const center = map.getCenter()
      setMapCenterCoords([Number(center.lat.toFixed(4)), Number(center.lng.toFixed(4))])
    })

    // Initial fit on desktop
    setTimeout(() => {
      if (mapContainerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
        mapInstanceRef.current.fitBounds(indiaBounds, {
          padding: [24, 24],
          maxZoom: 5.5
        })
      }
    }, 150)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [indiaBounds])

  // Sync prop changes (selectedLocation) to map flyTo
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return
    const target = citiesData.find(
      (c) =>
        c.name.toLowerCase() === selectedLocation.toLowerCase() ||
        selectedLocation.toLowerCase().includes(c.name.toLowerCase())
    )
    if (target) {
      setActiveCity(target)
      mapInstanceRef.current.flyTo([target.lat, target.lng], 10, {
        duration: 1.2,
        easeLinearity: 0.25
      })
    }
  }, [selectedLocation, citiesData])

  // Filtered Cities based on riskFilter
  const filteredCities = useMemo(() => {
    if (riskFilter === 'ALL') return citiesData
    return citiesData.filter((c) => c.riskTier === riskFilter)
  }, [riskFilter, citiesData])

  // Render Tactical 3D Risk Markers on the 2D Geographic Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return
    const layer = markersLayerRef.current
    layer.clearLayers()

    if (!showClusters) return

    filteredCities.forEach((city) => {
      const isSelected = activeCity?.name.toLowerCase() === city.name.toLowerCase()
      const isHigh = city.riskTier === 'HIGH'
      const isMed = city.riskTier === 'MEDIUM'

      const ringClass = isHigh
        ? 'marker-pulse-high bg-red-500/30 border-red-500 shadow-[0_0_15px_#ef4444]'
        : isMed
        ? 'marker-pulse-medium bg-amber-500/25 border-amber-500 shadow-[0_0_10px_#f59e0b]'
        : 'bg-emerald-500/20 border-emerald-500'

      const badgeColor = isHigh
        ? 'bg-red-950/90 text-red-300 border-red-500/70 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
        : isMed
        ? 'bg-amber-950/90 text-amber-300 border-amber-500/60'
        : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'

      // Tactical 3D marker HTML structure
      const customHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          <!-- 3D Risk Column Visual Rising from Geo Coordinates -->
          ${
            isHigh
              ? '<div class="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-12 bg-gradient-to-t from-red-600/80 via-red-500/40 to-transparent rounded-t shadow-[0_0_12px_#ef4444] pointer-events-none animate-pulse"></div>'
              : isMed
              ? '<div class="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-8 bg-gradient-to-t from-amber-500/70 via-amber-400/30 to-transparent rounded-t pointer-events-none"></div>'
              : ''
          }
          
          <!-- Concentric Shockwave Ring -->
          <div class="absolute -inset-3 rounded-full border border-dashed ${ringClass} pointer-events-none"></div>
          
          <!-- Central Risk Beacon Core -->
          <div class="relative w-5 h-5 rounded-full flex items-center justify-center ${
            isSelected
              ? 'bg-cyan-400 border-2 border-white shadow-[0_0_18px_#00f0ff] scale-125'
              : isHigh
              ? 'bg-red-600 border-2 border-red-200 shadow-[0_0_14px_#ef4444]'
              : isMed
              ? 'bg-amber-500 border border-amber-200 shadow-[0_0_8px_#f59e0b]'
              : 'bg-emerald-500 border border-emerald-200 shadow-[0_0_6px_#10b981]'
          } transition-all duration-200">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </div>

          <!-- Floating Tactical Name & Risk Label -->
          <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold tracking-tight ${badgeColor} backdrop-blur-md pointer-events-none">
            ${city.name} ${isHigh || isMed ? `(${city.riskScore}%)` : ''}
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-tactical-marker',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      })

      const marker = L.marker([city.lat, city.lng], { icon: customIcon })

      // Tactical Popup Dossier
      const popupContent = `
        <div class="p-3 text-slate-100 font-sans min-w-[240px]">
          <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-2">
            <div>
              <div class="font-bold text-sm text-white">${city.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">${city.state}, India</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isHigh
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-neon-red'
                : isMed
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }">
              ${city.riskScore}% ${city.riskTier}
            </span>
          </div>
          
          <div class="space-y-1.5 text-xs text-slate-300 font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">Cluster ID:</span>
              <span class="text-cyan-300 font-semibold">${city.clusterId}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Expected Window:</span>
              <span class="text-amber-300">${city.expectedWindow}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Predicted Cash-Out:</span>
              <span class="text-emerald-400 font-bold">₹1.5L – ₹2.0L</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">ATMs Monitored:</span>
              <span class="text-white">${city.atmCount} ATMs</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Active Threats:</span>
              <span class="text-red-400 font-bold">${city.activeThreats} Live Vectors</span>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5">
            <button id="popup-inspect-btn-${city.name.replace(/\s+/g, '-')}" class="py-1 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-[10px] font-bold text-center transition-colors">
              Inspect Cluster
            </button>
            <button id="popup-case-btn-${city.name.replace(/\s+/g, '-')}" class="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] font-semibold text-center border border-slate-700 transition-colors">
              View Case
            </button>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'tactical-leaflet-popup'
      })

      marker.on('click', () => {
        setActiveCity(city)
        if (onSelectCity) onSelectCity(city)
      })

      marker.on('popupopen', () => {
        const cleanName = city.name.replace(/\s+/g, '-')
        const inspectBtn = document.getElementById(`popup-inspect-btn-${cleanName}`)
        const caseBtn = document.getElementById(`popup-case-btn-${cleanName}`)

        if (inspectBtn) {
          inspectBtn.onclick = () => {
            setActiveCity(city)
            if (onSelectCity) onSelectCity(city)
          }
        }
        if (caseBtn && onInspectCase) {
          caseBtn.onclick = () => {
            onInspectCase('CC2026-001245')
          }
        }
      })

      layer.addLayer(marker)
    })
  }, [filteredCities, activeCity, showClusters, onSelectCity, onInspectCase])

  // Render Animated Transaction Flow Arcs on Real 2D Map
  useEffect(() => {
    if (!mapInstanceRef.current || !arcsLayerRef.current) return
    const layer = arcsLayerRef.current
    layer.clearLayers()

    if (!showArcs) return

    INDIA_TRANSACTION_FLOWS.forEach((flow) => {
      const fromCity = citiesData.find((c) => c.name.toLowerCase() === flow.from.toLowerCase())
      const toCity = citiesData.find((c) => c.name.toLowerCase() === flow.to.toLowerCase())

      if (!fromCity || !toCity) return

      // Create quadratic Bezier intermediate curve point for realistic curvature
      const latMid = (fromCity.lat + toCity.lat) / 2 + (fromCity.lng - toCity.lng) * 0.12
      const lngMid = (fromCity.lng + toCity.lng) / 2 - (fromCity.lat - toCity.lat) * 0.12

      const curvePoints: [number, number][] = []
      const steps = 20
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const lat =
          (1 - t) * (1 - t) * fromCity.lat +
          2 * (1 - t) * t * latMid +
          t * t * toCity.lat
        const lng =
          (1 - t) * (1 - t) * fromCity.lng +
          2 * (1 - t) * t * lngMid +
          t * t * toCity.lng
        curvePoints.push([lat, lng])
      }

      const polyline = L.polyline(curvePoints, {
        color: flow.isHighThreat ? '#ef4444' : '#00f0ff',
        weight: flow.isHighThreat ? 2.5 : 1.5,
        opacity: flow.isHighThreat ? 0.9 : 0.65,
        dashArray: flow.isHighThreat ? '6, 6' : '4, 8',
        className: 'animate-dash-flow'
      })

      polyline.on('click', () => {
        setSelectedFlow(flow)
      })

      polyline.bindTooltip(
        `<div class="text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/95 px-2 py-1 rounded border border-cyan-500/40 shadow-xl">
          <div class="text-white">${flow.from} ➔ ${flow.to}</div>
          <div class="text-amber-300 font-semibold">${flow.amount} • ${flow.channel}</div>
        </div>`,
        { sticky: true }
      )

      layer.addLayer(polyline)
    })
  }, [showArcs, citiesData])

  // Render Risk Heatmap Density Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !heatmapLayerRef.current) return
    const layer = heatmapLayerRef.current
    layer.clearLayers()

    if (!showHeatmap) return

    citiesData.forEach((city) => {
      const radius = city.riskScore * 1800 // meters
      const isHigh = city.riskTier === 'HIGH'
      const isMed = city.riskTier === 'MEDIUM'

      const circle = L.circle([city.lat, city.lng], {
        radius,
        color: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981',
        fillColor: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981',
        fillOpacity: isHigh ? 0.22 : 0.16,
        weight: 1.5,
        dashArray: '4, 6'
      })

      circle.bindTooltip(
        `<div class="text-[10px] font-mono font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-700">
          ${city.name} Heat Density: ${city.riskScore}%
        </div>`,
        { sticky: true }
      )

      layer.addLayer(circle)
    })
  }, [showHeatmap, citiesData])

  // Location Search Handler
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.trim().length > 0) {
      const filtered = citiesData.filter(
        (c) =>
          c.name.toLowerCase().includes(val.toLowerCase()) ||
          c.state.toLowerCase().includes(val.toLowerCase()) ||
          c.clusterId.toLowerCase().includes(val.toLowerCase())
      )
      setSearchResults(filtered)
      setIsSearchOpen(true)
    } else {
      setSearchResults([])
      setIsSearchOpen(false)
    }
  }

  const handleSelectSearchResult = (city: CityNode3D) => {
    setActiveCity(city)
    setSearchQuery(city.name)
    setIsSearchOpen(false)
    if (onSelectCity) onSelectCity(city)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], 11, {
        duration: 1.4,
        easeLinearity: 0.25
      })
    }
  }

  // Real Map Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  const handleFitIndia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyToBounds(indiaBounds, {
        padding: [24, 24],
        duration: 1.2
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }, 250)
  }

  const handleRetryTiles = () => {
    setTileLoadError(false)
    if (tileLayerRef.current) {
      tileLayerRef.current.redraw()
    }
  }

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-[#070b14] overflow-hidden rounded-xl border border-cyan-500/20 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
      }`}
    >
      {/* Real 2D Leaflet DOM Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Offline / Tile Unavailable Graceful Fallback Banner */}
      {tileLoadError && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 glass-panel px-4 py-2 rounded-xl border border-amber-500/60 text-amber-300 text-xs font-mono flex items-center gap-3 shadow-2xl backdrop-blur-md">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Map tiles unavailable (Offline Mode). Tactical vectors and GIS coordinates remain fully active.</span>
          <button
            onClick={handleRetryTiles}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Top-Left: Search & Tactical Filters */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 max-w-xs sm:max-w-sm w-full pointer-events-auto">
        <div className="relative">
          <div className="glass-panel p-1.5 rounded-lg border border-cyan-500/30 backdrop-blur-md flex items-center gap-2 shadow-hud">
            <Search className="w-4 h-4 text-cyan-400 shrink-0 ml-1.5" />
            <input
              type="text"
              placeholder="Search Indian city, state, district..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (searchResults.length > 0) setIsSearchOpen(true)
              }}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setIsSearchOpen(false)
                }}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-11 left-0 w-full glass-panel rounded-lg border border-cyan-400/40 shadow-2xl overflow-hidden max-h-56 overflow-y-auto z-20">
              {searchResults.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelectSearchResult(city)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-cyan-500/20 flex items-center justify-between border-b border-slate-800 last:border-b-0 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-white">{city.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({city.state})</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      city.riskTier === 'HIGH'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : city.riskTier === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {city.riskScore}% RISK
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Risk Filter & Layer Toggles Bar */}
        <div className="glass-panel px-2.5 py-1.5 rounded-lg border border-cyan-500/20 flex items-center justify-between gap-2 text-xs backdrop-blur-md shadow-hud">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={riskFilter}
              onChange={(e: any) => setRiskFilter(e.target.value)}
              className="bg-slate-950/90 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 focus:outline-none"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH">High (≥80%)</option>
              <option value="MEDIUM">Medium (65-79%)</option>
              <option value="LOW">Low (&lt;65%)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowArcs(!showArcs)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                showArcs
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Transaction Flow Arcs"
            >
              FLOW
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                showHeatmap
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Risk Concentration Heatmap"
            >
              HEATMAP
            </button>
          </div>
        </div>
      </div>

      {/* Top-Right: Map Viewport Action Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="glass-panel p-1 rounded-lg border border-cyan-500/20 flex flex-col gap-1 backdrop-blur-md shadow-hud">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Zoom In (+)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Zoom Out (-)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitIndia}
            className="p-1.5 rounded hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors border-t border-slate-700/60"
            title="Fit India Bounds / Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors border-t border-slate-700/60"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Tactical Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Coordinates HUD */}
        <div className="glass-panel px-2.5 py-1.5 rounded-lg border border-cyan-500/20 text-[9px] font-mono text-cyan-300/90 backdrop-blur-md shadow-hud text-center">
          <div>LAT: {mapCenterCoords[0]}°N</div>
          <div>LNG: {mapCenterCoords[1]}°E</div>
          <div className="text-[8px] text-slate-400 mt-0.5">ZOOM: {currentZoom}</div>
        </div>
      </div>

      {/* Bottom-Left: Live Monitored GIS Stats Strip */}
      <div className="absolute bottom-3 left-3 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-cyan-500/20 backdrop-blur-md hud-corner shadow-hud pointer-events-auto hidden sm:block">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          Real-Time Geospatial Intelligence
        </div>
        <div className="flex items-center gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-300 mb-0.5">
              <Landmark className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs font-mono font-bold text-white">1,284</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-tight">ATMs Monitored</div>
          </div>
          <div className="h-6 w-px bg-slate-700/80"></div>
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-300 mb-0.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xs font-mono font-bold text-white">532</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-tight">Bank Hubs</div>
          </div>
          <div className="h-6 w-px bg-slate-700/80"></div>
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-300 mb-0.5">
              <Crosshair className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xs font-mono font-bold text-red-400">28</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-tight">High Risk Hubs</div>
          </div>
        </div>
      </div>

      {/* Bottom-Right: Active Node Quick Telemetry Card */}
      {activeCity && (
        <div className="absolute bottom-3 right-3 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-cyan-400/40 backdrop-blur-md shadow-neon-cyan max-w-[240px] hud-corner pointer-events-auto">
          <div className="flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-1 mb-1.5">
            <span className="font-semibold text-xs text-white truncate">
              {activeCity.name}, {activeCity.state}
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                activeCity.riskTier === 'HIGH'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {activeCity.riskScore}% RISK
            </span>
          </div>
          <div className="text-[10px] space-y-0.5 text-slate-300 font-mono">
            <div>
              Window: <span className="text-cyan-300">{activeCity.expectedWindow}</span>
            </div>
            <div>
              Cluster: <span className="text-slate-400">{activeCity.clusterId}</span>
            </div>
            <div>
              Threat Level:{' '}
              <span className="text-red-400 font-bold">{activeCity.activeThreats} Live Vectors</span>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Flow Details Modal Overlay (When user clicks an arc) */}
      {selectedFlow && (
        <div className="absolute top-16 right-3 z-20 glass-panel p-3.5 rounded-xl border border-cyan-400/50 shadow-2xl max-w-xs backdrop-blur-lg hud-corner pointer-events-auto animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              TRANSACTION FLOW VECTOR
            </div>
            <button
              onClick={() => setSelectedFlow(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Origin City:</span>
              <span className="text-white font-semibold">{selectedFlow.from}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Cash-Out:</span>
              <span className="text-cyan-300 font-semibold">{selectedFlow.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transfer Channel:</span>
              <span className="text-slate-200">{selectedFlow.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dissipated Amount:</span>
              <span className="text-emerald-400 font-bold">{selectedFlow.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Case ID:</span>
              <span className="text-cyan-300 font-semibold">CC2026-001245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Threat Status:</span>
              <span
                className={`font-bold ${
                  selectedFlow.isHighThreat ? 'text-red-400' : 'text-cyan-300'
                }`}
              >
                {selectedFlow.isHighThreat ? 'CRITICAL DISPERSION' : 'NORMAL TRANSLAYER'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealIndiaMap
