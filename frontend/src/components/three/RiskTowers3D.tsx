import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { INDIA_TACTICAL_CITIES, CityNode3D } from '../../data/indiaGeoData'
import { Activity, RotateCcw, Plus, Minus, Info } from 'lucide-react'

function RiskTower({
  city,
  position,
  isSelected,
  onSelect
}: {
  city: CityNode3D
  position: [number, number, number]
  isSelected: boolean
  onSelect: (city: CityNode3D) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const height = (city.riskScore / 100) * 4.5 + 0.5

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
    }
  })

  const color =
    city.riskTier === 'HIGH'
      ? '#ef4444'
      : city.riskTier === 'MEDIUM'
      ? '#f59e0b'
      : '#10b981'

  return (
    <group position={position}>
      {/* 3D Vertical Extruded Risk Column */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(city)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe Border Overlay */}
      <lineSegments position={[0, height / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.7, height, 0.7)]} />
        <lineBasicMaterial color={isSelected ? '#ffffff' : color} linewidth={1.5} />
      </lineSegments>

      {/* Pulsing Beacon Orb on Top */}
      <mesh position={[0, height + 0.15, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : color} />
      </mesh>

      {/* Floating 3D HTML Metric Tag */}
      <Html position={[0, height + 0.6, 0]} center distanceFactor={14}>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap border backdrop-blur-md transition-transform pointer-events-none select-none ${
            isSelected
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 scale-110 shadow-neon-cyan'
              : city.riskTier === 'HIGH'
              ? 'bg-red-950/80 text-red-300 border-red-500/70'
              : city.riskTier === 'MEDIUM'
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
          }`}
        >
          {city.name} {city.riskScore}%
        </div>
      </Html>
    </group>
  )
}

export const RiskTowers3D: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityNode3D | null>(INDIA_TACTICAL_CITIES[0])
  const controlsRef = useRef<any>(null)

  // Layout top 10 cities in a structured spatial 3D tactical grid
  const topCities = INDIA_TACTICAL_CITIES.slice(0, 10)
  const gridPositions: [number, number, number][] = [
    [-4, 0, -2],
    [-2, 0, -2],
    [0, 0, -2],
    [2, 0, -2],
    [4, 0, -2],
    [-4, 0, 2],
    [-2, 0, 2],
    [0, 0, 2],
    [2, 0, 2],
    [4, 0, 2]
  ]

  return (
    <div className="relative w-full h-[360px] bg-[#070c18] rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 8, 11], fov: 42 }}>
        <color attach="background" args={['#070c18']} />
        <ambientLight intensity={0.8} color="#9ec5fe" />
        <directionalLight position={[10, 15, 10]} intensity={1.5} color="#00f0ff" />
        <directionalLight position={[-10, 10, -10]} intensity={0.8} color="#3b82f6" />

        {/* Tactical Base Grid Floor */}
        <gridHelper args={[24, 24, '#00f0ff', '#0d224d']} position={[0, 0, 0]} />

        {/* 3D Regional Risk Towers */}
        {topCities.map((city, idx) => (
          <RiskTower
            key={city.name}
            city={city}
            position={gridPositions[idx] || [0, 0, 0]}
            isSelected={selectedCity?.name === city.name}
            onSelect={setSelectedCity}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enableZoom={true}
          enablePan={false}
          minDistance={6}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0.3}
        />
      </Canvas>

      {/* Floating HUD Header */}
      <div className="absolute top-3 left-3 z-10 glass-panel px-3 py-1.5 rounded-lg border border-cyan-500/20 text-xs backdrop-blur-md flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-mono font-bold text-white text-[11px] uppercase">
          3D Spatio-Temporal Risk Intensity Tower Mesh
        </span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 glass-panel p-1 rounded-lg border border-cyan-500/20 flex flex-col gap-1 backdrop-blur-md">
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.dollyIn(1.2)
              controlsRef.current.update()
            }
          }}
          className="p-1 text-slate-300 hover:text-cyan-300 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.dollyOut(1.2)
              controlsRef.current.update()
            }
          }}
          className="p-1 text-slate-300 hover:text-cyan-300 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            if (controlsRef.current) controlsRef.current.reset()
          }}
          className="p-1 text-slate-300 hover:text-cyan-300 transition-colors border-t border-slate-700"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Tower Quick Info Footer */}
      {selectedCity && (
        <div className="absolute bottom-3 left-3 right-3 z-10 glass-panel px-3 py-2 rounded-lg border border-cyan-500/30 flex items-center justify-between backdrop-blur-md text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{selectedCity.name}, {selectedCity.state}</span>
            <span className="text-slate-400">• Cluster: {selectedCity.clusterId}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-300">Monitored ATMs: <strong className="text-white">{selectedCity.atmCount}</strong></span>
            <span className="text-red-400 font-bold">Risk: {selectedCity.riskScore}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default RiskTowers3D
