import React, { useState, useEffect, useRef, useMemo } from 'react'
import * as d3Geo from 'd3-geo'
import {
  Shield,
  Layers,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  Landmark,
  Crosshair,
  Maximize2,
  Minimize2,
  Activity,
  Zap,
  Radio,
  Search
} from 'lucide-react'
import {
  INDIA_TACTICAL_CITIES,
  INDIA_TRANSACTION_FLOWS,
  CityNode3D,
  TransactionFlowArc
} from '../../data/indiaGeoData'
import indiaGeoJson from '../../data/india-states-simplified.json'

export const STATE_COLORS: Record<string, string> = {
  'Ladakh': '#653b8e',
  'Jammu and Kashmir': '#d2872c',
  'Himachal Pradesh': '#389e82',
  'Punjab': '#e8b871',
  'Uttaranchal': '#234975',
  'Uttarakhand': '#234975',
  'Haryana': '#317ab3',
  'Delhi': '#2b9348',
  'Rajasthan': '#e09191',
  'Uttar Pradesh': '#f0b5ab',
  'Bihar': '#4286c4',
  'Sikkim': '#9ec5fe',
  'West Bengal': '#2e8250',
  'Jharkhand': '#e6993a',
  'Orissa': '#72aee6',
  'Odisha': '#72aee6',
  'Chhattisgarh': '#c9a032',
  'Madhya Pradesh': '#de7a38',
  'Gujarat': '#6a3c82',
  'Maharashtra': '#d14f43',
  'Telangana': '#ca9e2e',
  'Andhra Pradesh': '#2b7a4b',
  'Karnataka': '#b83a3a',
  'Goa': '#f59e0b',
  'Kerala': '#49a6d4',
  'Tamil Nadu': '#92cbb8',
  'Assam': '#2f7e4f',
  'Arunachal Pradesh': '#c27a2b',
  'Nagaland': '#9b4d80',
  'Manipur': '#d86a60',
  'Mizoram': '#5494c2',
  'Tripura': '#e6c86e',
  'Meghalaya': '#b8487b',
  'Lakshadweep': '#38bdf8',
  'Andaman and Nicobar': '#38bdf8',
  'Puducherry': '#20e39a',
  'Chandigarh': '#e8b871',
  'Dadra and Nagar Haveli': '#6a3c82',
  'Daman and Diu': '#6a3c82'
}

interface India3DMapProps {
  selectedLocation?: string
  onSelectCity?: (city: CityNode3D) => void
  highlightCluster?: string
}

export const India3DMap: React.FC<India3DMapProps> = ({
  selectedLocation = 'Kolkata',
  onSelectCity,
  highlightCluster
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [activeCity, setActiveCity] = useState<CityNode3D | null>(() => {
    return (
      INDIA_TACTICAL_CITIES.find(
        (c) => c.name.toLowerCase() === selectedLocation.toLowerCase()
      ) || INDIA_TACTICAL_CITIES[0]
    )
  })
  const [hoveredState, setHoveredState] = useState<{ name: string; x: number; y: number } | null>(null)
  const [hoveredCity, setHoveredCity] = useState<CityNode3D | null>(null)
  const [selectedFlow, setSelectedFlow] = useState<TransactionFlowArc | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Sync selected location prop
  useEffect(() => {
    if (!selectedLocation) return
    const matched = INDIA_TACTICAL_CITIES.find(
      (c) =>
        c.name.toLowerCase() === selectedLocation.toLowerCase() ||
        selectedLocation.toLowerCase().includes(c.name.toLowerCase())
    )
    if (matched) {
      setActiveCity(matched)
    }
  }, [selectedLocation])

  // Setup D3 Mercator Projection fitted to 820 x 580 viewBox
  const { projection, pathGenerator, features } = useMemo(() => {
    const width = 820
    const height = 580
    const proj = d3Geo.geoMercator().fitSize([width, height], indiaGeoJson as any)
    const generator = d3Geo.geoPath().projection(proj)
    return {
      projection: proj,
      pathGenerator: generator,
      features: (indiaGeoJson as any).features || []
    }
  }, [])

  // Project Cities Coordinates
  const projectedCities = useMemo(() => {
    return INDIA_TACTICAL_CITIES.map((city) => {
      const coords = projection([city.lng, city.lat])
      return {
        ...city,
        x: coords ? coords[0] : 0,
        y: coords ? coords[1] : 0
      }
    })
  }, [projection])

  // Project Transaction Flows into Curved Paths
  const projectedFlows = useMemo(() => {
    return INDIA_TRANSACTION_FLOWS.map((flow, idx) => {
      const fromCity = projectedCities.find(
        (c) => c.name.toLowerCase() === flow.from.toLowerCase()
      )
      const toCity = projectedCities.find(
        (c) => c.name.toLowerCase() === flow.to.toLowerCase()
      )

      if (!fromCity || !toCity) return null

      const x1 = fromCity.x
      const y1 = fromCity.y
      const x2 = toCity.x
      const y2 = toCity.y

      const dx = x2 - x1
      const dy = y2 - y1
      const dist = Math.hypot(dx, dy)
      const curvature = 0.22
      const cx = (x1 + x2) / 2 - dy * curvature
      const cy = (y1 + y2) / 2 + dx * curvature

      const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`

      return {
        ...flow,
        pathData,
        midX: cx,
        midY: cy,
        id: `flow-${idx}`
      }
    }).filter(Boolean)
  }, [projectedCities])

  // Zoom and Pan Handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 3.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.75))
  }

  const handleResetCamera = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88
    setZoomLevel((prev) => Math.min(Math.max(prev * zoomFactor, 0.75), 3.5))
  }

  const handleCityClick = (city: CityNode3D, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveCity(city)
    if (onSelectCity) onSelectCity(city)
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full min-h-[460px] bg-[#020b14] overflow-hidden rounded-xl border border-[#16415d] shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
      }`}
      style={{
        background: `
          radial-gradient(ellipse at 48% 48%, rgba(7, 76, 108, 0.45), transparent 45%),
          radial-gradient(ellipse at 50% 65%, rgba(0, 181, 255, 0.12), transparent 55%),
          #020b14
        `,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* 3D Map Header Overlay */}
      <div className="absolute top-3 left-4 z-10 font-bold text-sm tracking-wider text-white flex items-center gap-2 pointer-events-none">
        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>India Cash-Out Risk Map</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
          OFFICIAL BOUNDARIES
        </span>
      </div>

      {/* SVG Vector Map Viewport */}
      <svg
        ref={svgRef}
        viewBox="0 0 820 580"
        className="w-full h-full absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '50% 50%'
        }}
      >
        <defs>
          {/* Luminous Outer Boundary Glow Filter */}
          <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                0 0 0 0 0.14
                0 0 0 0 0.89
                0 0 0 0 1.0
                0 0 0 1 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Marker Glow Filters */}
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="yellowGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Beacon Gradient */}
          <radialGradient id="highRiskBeam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4058" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ff4058" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff4058" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Base Subtle Oceanic Tactical Grid */}
        <g opacity="0.18">
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 40}
              x2="820"
              y2={i * 40}
              stroke="#0c7898"
              strokeWidth="0.6"
              strokeDasharray="4 8"
            />
          ))}
          {Array.from({ length: 21 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 40}
              y1="0"
              x2={i * 40}
              y2="580"
              stroke="#0c7898"
              strokeWidth="0.6"
              strokeDasharray="4 8"
            />
          ))}
        </g>

        {/* 2. Official Indian States Geographies with Authentic Color fills */}
        <g className="india-states-layer">
          {features.map((feature: any, idx: number) => {
            const stateName = feature.properties?.NAME_1 || 'India'
            const fillColor = STATE_COLORS[stateName] || '#1f538d'
            const isHovered = hoveredState?.name === stateName

            return (
              <path
                key={`state-${stateName}-${idx}`}
                d={pathGenerator(feature) || ''}
                fill={fillColor}
                stroke="#12354e"
                strokeWidth="0.75"
                opacity={isHovered ? 0.95 : 0.85}
                className="transition-colors duration-150 cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect()
                  if (rect) {
                    setHoveredState({
                      name: stateName,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    })
                  }
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect()
                  if (rect) {
                    setHoveredState({
                      name: stateName,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    })
                  }
                }}
                onMouseLeave={() => {
                  setHoveredState(null)
                }}
              />
            )
          })}
        </g>

        {/* 3. Luminous Outer Sovereign Border Glow Pass */}
        <g className="india-outer-glow-layer" pointerEvents="none">
          {features.map((feature: any, idx: number) => {
            return (
              <path
                key={`outer-${idx}`}
                d={pathGenerator(feature) || ''}
                fill="none"
                stroke="#25e4ff"
                strokeWidth="1.6"
                filter="url(#countryGlow)"
                opacity="0.75"
              />
            )
          })}
        </g>

        {/* 4. Animated Curved Transaction Flow Arcs */}
        <g className="transaction-flows-layer" pointerEvents="none">
          {projectedFlows.map((flow: any) => {
            if (!flow) return null
            const isHigh = flow.isHighThreat

            return (
              <g key={flow.id}>
                {/* Background Shadow Stroke */}
                <path
                  d={flow.pathData}
                  fill="none"
                  stroke={isHigh ? '#ff4058' : '#21dfff'}
                  strokeWidth={isHigh ? '2.4' : '1.5'}
                  opacity="0.85"
                  className="animate-dash-flow"
                />

                {/* Traveling Glowing Light Photon Particle */}
                <circle r={isHigh ? '3.2' : '2.2'} fill={isHigh ? '#ff8747' : '#ffffff'}>
                  <animateMotion
                    path={flow.pathData}
                    dur={isHigh ? '2.2s' : '3.2s'}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )
          })}
        </g>

        {/* 5. 3D Tactical City Threat Nodes & Risk Beacons */}
        <g className="city-threat-nodes-layer">
          {projectedCities.map((city) => {
            const isSelected = activeCity?.name.toLowerCase() === city.name.toLowerCase()
            const isHigh = city.riskTier === 'HIGH'
            const isMed = city.riskTier === 'MEDIUM'

            const nodeColor = isHigh ? '#ff4058' : isMed ? '#ffc53d' : '#20e39a'
            const glowFilter = isHigh ? 'url(#redGlow)' : isMed ? 'url(#yellowGlow)' : 'url(#greenGlow)'

            return (
              <g
                key={city.name}
                transform={`translate(${city.x}, ${city.y})`}
                className="cursor-pointer group"
                onClick={(e) => handleCityClick(city, e)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* High Risk Vertical 3D Light Column */}
                {isHigh && (
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-26"
                    stroke="#ff4058"
                    strokeWidth="2"
                    opacity="0.8"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                )}

                {/* Concentric Pulsing Shockwave Ring */}
                <circle
                  r={isSelected ? '14' : isHigh ? '11' : isMed ? '8' : '6'}
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="1.2"
                  opacity="0.65"
                  strokeDasharray="3 3"
                  className={isHigh ? 'marker-pulse-high' : isMed ? 'marker-pulse-medium' : ''}
                />

                {/* Secondary Ripple for High Risk */}
                {isHigh && (
                  <circle
                    r="18"
                    fill="none"
                    stroke="#ff4058"
                    strokeWidth="0.8"
                    opacity="0.35"
                    className="animate-ping"
                  />
                )}

                {/* Central Beacon Core */}
                <circle
                  r={isSelected ? '5.5' : isHigh ? '4.5' : '3.5'}
                  fill={nodeColor}
                  filter={glowFilter}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '1.5' : '0.8'}
                />

                {/* City Name & Risk Percentage Label */}
                <text
                  x="0"
                  y={isHigh ? '-30' : '-10'}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="'Inter', system-ui, sans-serif"
                  style={{
                    paintOrder: 'stroke fill',
                    stroke: '#03101b',
                    strokeWidth: '3.5px',
                    strokeLinejoin: 'round'
                  }}
                  className="pointer-events-none select-none tracking-tight"
                >
                  {city.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Floating Tactical Tooltip on State Hover */}
      {hoveredState && (
        <div
          className="absolute z-40 pointer-events-none glass-panel px-3 py-1.5 rounded-lg border border-cyan-400/50 shadow-2xl text-xs font-mono font-bold text-white backdrop-blur-md -translate-x-1/2 -translate-y-full mb-2 animate-in fade-in"
          style={{
            left: `${hoveredState.x}px`,
            top: `${hoveredState.y}px`
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: STATE_COLORS[hoveredState.name] || '#38bdf8' }}
            ></span>
            <span>{hoveredState.name}</span>
          </div>
        </div>
      )}

      {/* Floating Tactical Tooltip on City Hover */}
      {hoveredCity && !hoveredState && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 glass-panel px-3.5 py-2 rounded-xl border border-cyan-400/50 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hoveredCity.riskTier === 'HIGH'
                  ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  : hoveredCity.riskTier === 'MEDIUM'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
            <span className="font-bold text-white">{hoveredCity.name}, {hoveredCity.state}</span>
          </div>
          <span className="text-cyan-300">Cluster: {hoveredCity.clusterId}</span>
          <span className="text-amber-300 font-bold">{hoveredCity.riskScore}% RISK</span>
        </div>
      )}

      {/* Floating HUD: Top-Left Risk Legend */}
      <div className="absolute top-12 left-4 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-[#24526c] text-xs backdrop-blur-md shadow-hud pointer-events-auto">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Risk Legend
        </div>
        <div className="space-y-1.5 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4058] shadow-[0_0_8px_#ff4058]"></span>
            <span className="text-slate-200">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffc53d] shadow-[0_0_8px_#ffc53d]"></span>
            <span className="text-slate-200">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20e39a] shadow-[0_0_8px_#20e39a]"></span>
            <span className="text-slate-200">Low Risk</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
            <span className="w-4 h-0.5 bg-[#25e4ff] rounded shadow-[0_0_6px_#25e4ff]"></span>
            <span className="text-cyan-300 font-mono text-[10px]">━━ Transaction Flow</span>
          </div>
        </div>
      </div>

      {/* Floating HUD: Top-Right Controls */}
      <div className="absolute top-12 right-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="glass-panel w-9 rounded-lg border border-[#28536c] flex flex-col items-center backdrop-blur-md shadow-hud overflow-hidden text-center text-xs font-mono font-bold text-slate-300">
          <div className="p-1.5 text-cyan-400 border-b border-[#23485f] w-full flex justify-center">
            <Compass className="w-4 h-4 animate-pulse" />
          </div>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors border-b border-[#23485f] w-full"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors border-b border-[#23485f] w-full"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors w-full border-b border-[#23485f]"
            title="Reset Map Bounds"
          >
            <RotateCcw className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors w-full"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 mx-auto" /> : <Maximize2 className="w-3.5 h-3.5 mx-auto" />}
          </button>
        </div>
      </div>

      {/* Oceanic Watermark Labels Matching Reference Source of Truth */}
      <div className="absolute bottom-[24%] left-[15%] text-[10px] font-mono tracking-widest text-[#35627a] uppercase italic pointer-events-none select-none">
        ARABIAN SEA
      </div>
      <div className="absolute bottom-[28%] right-[14%] text-[10px] font-mono tracking-widest text-[#35627a] uppercase italic pointer-events-none select-none">
        BAY OF BENGAL
      </div>
      <div className="absolute bottom-[4%] left-[53%] text-[10px] font-mono tracking-widest text-[#35627a] uppercase italic pointer-events-none select-none">
        INDIAN OCEAN
      </div>

      {/* Floating HUD: Bottom-Left Live Stats */}
      <div className="absolute bottom-3 left-3 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-cyan-500/20 backdrop-blur-md hud-corner shadow-hud pointer-events-auto hidden sm:block">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          Live Geospatial Telemetry
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

      {/* Floating Selected Node Quick Card (When a city is active) */}
      {activeCity && (
        <div className="absolute bottom-3 right-3 z-10 glass-panel px-3.5 py-2 rounded-lg border border-cyan-400/40 backdrop-blur-md shadow-neon-cyan max-w-[220px] hud-corner pointer-events-auto">
          <div className="flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-1 mb-1.5">
            <span className="font-semibold text-xs text-white truncate">{activeCity.name}</span>
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
            <div>Window: <span className="text-cyan-300">{activeCity.expectedWindow}</span></div>
            <div>Cluster: <span className="text-slate-400">{activeCity.clusterId}</span></div>
            <div>Active Threats: <span className="text-red-400 font-bold">{activeCity.activeThreats} Live Vectors</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default India3DMap
