import React, { useState, useEffect } from 'react'
import { KpiCards } from '../components/dashboard/KpiCards'
import { India3DMap } from '../components/three/India3DMap'
import { ActiveAlertsPanel } from '../components/dashboard/ActiveAlertsPanel'
import { AiInsightsPanel } from '../components/dashboard/AiInsightsPanel'
import { RecentCasesTable } from '../components/dashboard/RecentCasesTable'
import { CaseFlowStepper } from '../components/dashboard/CaseFlowStepper'
import { TopRiskLocationsPanel } from '../components/dashboard/TopRiskLocationsPanel'
import { LocationDetailModal } from '../components/dashboard/LocationDetailModal'
import { fetchDashboardSummary } from '../services/api'
import { DashboardSummaryResponse, CityNode3D, PageView, RecentCase, ActiveAlert } from '../types'
import { INDIA_TACTICAL_CITIES } from '../data/indiaGeoData'

interface DashboardPageProps {
  onNavigate: (view: PageView) => void
  onSelectCaseNumber?: (caseNumber: string) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectCaseNumber
}) => {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null)
  const [selectedCityName, setSelectedCityName] = useState<string>('Kolkata')
  const [modalCity, setModalCity] = useState<CityNode3D | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchDashboardSummary()
      .then((res) => {
        if (mounted) {
          setData(res)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.warn('Using local telemetry data fallback:', err)
        setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleCitySelect = (city: CityNode3D) => {
    setSelectedCityName(city.name)
    setModalCity(city)
  }

  const handleLocationNameSelect = (locName: string) => {
    const cityName = locName.split(',')[0].trim()
    const found = INDIA_TACTICAL_CITIES.find(
      (c) =>
        c.name.toLowerCase().includes(cityName.toLowerCase()) ||
        locName.toLowerCase().includes(c.name.toLowerCase())
    )
    if (found) {
      setSelectedCityName(found.name)
      setModalCity(found)
    }
  }

  const handleCaseSelect = (caseItem: RecentCase) => {
    if (onSelectCaseNumber) {
      onSelectCaseNumber(caseItem.case_id)
    }
    onNavigate('case_details')
  }

  const handleAlertSelect = (alert: ActiveAlert) => {
    const rawRef = alert.case_ref.replace('Case ', '').replace('#', '').trim()
    if (onSelectCaseNumber) {
      onSelectCaseNumber(rawRef)
    }
    // Also fly to location if mentioned
    if (alert.title) {
      const matchedCity = INDIA_TACTICAL_CITIES.find((c) =>
        alert.title.toLowerCase().includes(c.name.toLowerCase())
      )
      if (matchedCity) {
        setSelectedCityName(matchedCity.name)
      }
    }
    onNavigate('case_details')
  }

  return (
    <div className="space-y-3.5 pb-8 animate-in fade-in duration-300">
      {/* 1. Tactical KPI Metric Cards Row (Fed directly from Backend API) */}
      <KpiCards kpis={data?.kpis} />

      {/* 2. Main Tactical Operations Deck Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[500px]">
        {/* Centerpiece 3D Interactive Tactical India Map (8 Cols) */}
        <div className="lg:col-span-8 h-[500px] xl:h-[540px]">
          <India3DMap
            selectedLocation={selectedCityName}
            onSelectCity={handleCitySelect}
          />
        </div>

        {/* Right Intelligence Stack (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 h-[500px] xl:h-[540px]">
          <div className="flex-1 min-h-0">
            <ActiveAlertsPanel
              alerts={data?.active_alerts}
              onSelectAlert={handleAlertSelect}
              onNavigate={onNavigate}
            />
          </div>
          <div className="flex-1 min-h-0">
            <AiInsightsPanel insights={data?.ai_insights} />
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: 3 Investigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3.5">
        {/* Panel 1 (Left): Recent Cases Table (Spans 4 columns) */}
        <div className="xl:col-span-4 min-h-[280px]">
          <RecentCasesTable
            cases={data?.recent_cases}
            onSelectCase={handleCaseSelect}
            onNavigate={onNavigate}
          />
        </div>

        {/* Panel 2 (Center): Interactive Case Flow Stepper (Spans 5 columns) */}
        <div className="xl:col-span-5 min-h-[280px]">
          <CaseFlowStepper
            caseFlow={data?.case_flow}
            onExploreCase={(caseId) => {
              if (onSelectCaseNumber) onSelectCaseNumber(caseId)
              onNavigate('case_details')
            }}
          />
        </div>

        {/* Panel 3 (Right): Top Risk Locations Ranking (Spans 3 columns) */}
        <div className="xl:col-span-3 min-h-[280px]">
          <TopRiskLocationsPanel
            data={data?.top_risk_locations}
            onSelectLocation={handleLocationNameSelect}
            onNavigate={onNavigate}
          />
        </div>
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

export default DashboardPage
