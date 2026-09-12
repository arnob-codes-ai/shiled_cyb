export interface CityNode3D {
  name: string
  state: string
  lat: number
  lng: number
  riskTier: 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number
  atmCount: number
  bankCount: number
  activeThreats: number
  clusterId: string
  expectedWindow: string
}

export interface KpiCardData {
  value: number
  formatted: string
  change: string
  trend: 'up' | 'down'
  severity?: 'critical' | 'success' | 'warning'
}

export interface DashboardKpis {
  total_cases: KpiCardData
  predicted_withdrawals: KpiCardData
  high_risk_alerts: KpiCardData
  interventions: KpiCardData
  linked_cases: KpiCardData
  live_monitoring: {
    status: string
    heartbeat: boolean
    latency_ms: number
  }
}

export interface ActiveAlert {
  id: number
  code: string
  location: string
  time: string
  expected_window?: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  case_ref: string
  probability: number
  action?: string
}

export interface AiInsight {
  id: number
  icon: 'clock' | 'shield' | 'alert' | 'network'
  text: string
  type: 'info' | 'success' | 'warning' | 'highlight'
}

export interface RecentCase {
  id: number
  case_id: string
  type: string
  amount: string
  amount_raw: number
  location: string
  city: string
  risk: string
  risk_score: number
  status: string
  status_color: string
}

export interface FlowStep {
  step: number
  title: string
  subtitle: string
  type: 'victim' | 'mule' | 'multi' | 'cashout'
  icon: string
}

export interface CaseFlowData {
  case_id: string
  case_number: string
  fraud_type: string
  steps: FlowStep[]
  prediction: {
    predicted_location: string
    risk_probability: string
    risk_score: number
    expected_time_window: string
    likely_amount: string
  }
}

export interface RiskLocationItem {
  rank: number
  name: string
  risk: string
  risk_score: number
  color: string
}

export interface TopRiskLocationsData {
  atm_clusters: RiskLocationItem[]
  cities: RiskLocationItem[]
  districts: RiskLocationItem[]
}

export interface LiveStatsData {
  atms_monitored: number
  bank_branches: number
  active_clusters: number
}

export interface DashboardSummaryResponse {
  kpis: DashboardKpis
  active_alerts: ActiveAlert[]
  ai_insights: AiInsight[]
  recent_cases: RecentCase[]
  case_flow: CaseFlowData
  top_risk_locations: TopRiskLocationsData
  live_stats: LiveStatsData
  system_time: string
}

export interface AtmClusterLocation {
  id: number
  cluster_id: string
  name: string
  city: string
  state: string
  latitude: number
  longitude: number
  risk_score: number
  risk_tier: 'HIGH' | 'MEDIUM' | 'LOW'
  historical_withdrawals: number
  expected_time_window: string
  atm_count: number
  bank_branches: number
  active_threats: number
}

export interface ExplanationFactor {
  factor: string
  percentage: number
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface TopAlternativeLocation {
  rank: number
  cluster_id: string
  name: string
  city: string
  state: string
  latitude: number
  longitude: number
  risk_score: number
  confidence: number
  expected_window: string
  atm_count: number
  bank_branches: number
  similar_cases_count: number
}

export interface CaseDetail {
  id: number
  case_number: string
  title: string
  fraud_type: string
  reported_amount: number
  reported_amount_formatted: string
  victim_name: string
  victim_location: string
  victim_city: string
  victim_state: string
  victim_account: string
  status: string
  risk_level: string
  risk_score: number
  current_hop: number
  created_at: string
}

export interface TransactionItem {
  id: number
  txn_ref: string
  sender_account: string
  sender_name: string
  receiver_account: string
  receiver_name: string
  amount: number
  amount_formatted: string
  channel: string
  hop_level: number
  is_mule: boolean
  anomaly_score: number
  source_city: string
  target_city: string
  timestamp: string
}

export interface LinkedCaseItem {
  case_id: number
  case_number: string
  title: string
  fraud_type: string
  amount: number
  similarity_score: number
  similarity_factors: string[]
  status: string
  shared_mules_count: number
}

export interface CaseDetailResponse {
  case: CaseDetail
  transactions: TransactionItem[]
  prediction: {
    predicted_cluster_id: string
    location_name: string
    city: string
    state: string
    latitude: number
    longitude: number
    risk_score: number
    confidence_score: number
    expected_time_window: string
    likely_amount_min: number
    likely_amount_max: number
    likely_amount_formatted: string
    atm_count: number
    bank_branches: number
    similar_cases_count: number
    explanation: {
      risk_score: number
      summary: string
      breakdown: ExplanationFactor[]
      methodology: string
    }
    top_alternatives: TopAlternativeLocation[]
  }
  linked_cases: LinkedCaseItem[]
  timeline: Array<{
    time: string
    date: string
    event: string
    description: string
    badge: string
  }>
  evidence: Array<{
    type: string
    status: string
    hash: string
  }>
}

export type PageView =
  | 'dashboard'
  | 'cases'
  | 'new_case'
  | 'case_details'
  | 'prediction'
  | 'live_map'
  | 'network_graph'
  | 'transactions'
  | 'analytics'
  | 'alerts'
  | 'reports'
  | 'data_hub'
  | 'simulator'
  | 'settings'
