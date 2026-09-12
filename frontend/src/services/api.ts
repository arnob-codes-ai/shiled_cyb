import {
  DashboardSummaryResponse,
  CaseDetailResponse,
  AtmClusterLocation,
  ActiveAlert
} from '../types'

const API_BASE = '/api'

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const res = await fetch(`${API_BASE}/dashboard/summary`)
  if (!res.ok) throw new Error('Failed to fetch dashboard summary')
  return res.json()
}

export async function fetchCases(params?: {
  search?: string
  fraud_type?: string
  risk_level?: string
  status?: string
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.search) query.append('search', params.search)
  if (params?.fraud_type && params.fraud_type !== 'ALL') query.append('fraud_type', params.fraud_type)
  if (params?.risk_level && params.risk_level !== 'ALL') query.append('risk_level', params.risk_level)
  if (params?.status && params.status !== 'ALL') query.append('status', params.status)
  if (params?.limit) query.append('limit', String(params.limit))

  const res = await fetch(`${API_BASE}/cases?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch cases')
  return res.json()
}

export async function fetchCaseDetail(id: number | string): Promise<CaseDetailResponse> {
  const res = await fetch(`${API_BASE}/cases/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch case ${id}`)
  return res.json()
}

export async function createNewCase(data: {
  fraud_type: string
  reported_amount: number
  victim_name?: string
  victim_location: string
  victim_city: string
  victim_state: string
  victim_account?: string
  suspected_locations?: string
}) {
  const res = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create case')
  return res.json()
}

export async function updateCaseStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE}/cases/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH'
  })
  if (!res.ok) throw new Error('Failed to update case status')
  return res.json()
}

export async function rectifyCase(id: number | string, data?: { action_type?: string; notes?: string }) {
  const cleanId = String(id).includes('-') ? parseInt(String(id).split('-')[1], 10) || 1 : Number(id)
  const res = await fetch(`${API_BASE}/cases/${cleanId}/rectify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {
      action_type: 'Mule Account Frozen & ATM Surveillance Dispatched',
      notes: 'Investigator interdicted cash-out corridor and coordinated bank freeze.'
    })
  })
  if (!res.ok) throw new Error('Failed to rectify case')
  return res.json()
}

export async function batchRectifyCases() {
  const res = await fetch(`${API_BASE}/cases/batch-rectify-all`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error('Failed to batch rectify cases')
  return res.json()
}

export async function fetchRiskLocations(): Promise<AtmClusterLocation[]> {
  const res = await fetch(`${API_BASE}/locations/risk`)
  if (!res.ok) throw new Error('Failed to fetch risk locations')
  return res.json()
}

export async function fetchAlerts(params?: { severity?: string; status?: string }): Promise<ActiveAlert[]> {
  const query = new URLSearchParams()
  if (params?.severity && params.severity !== 'ALL') query.append('severity', params.severity)
  if (params?.status && params.status !== 'ALL') query.append('status', params.status)

  const res = await fetch(`${API_BASE}/alerts?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch alerts')
  return res.json()
}

export async function updateAlertStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update alert status')
  return res.json()
}

export async function fetchNetworkGraph(caseId: number | string = 1) {
  const res = await fetch(`${API_BASE}/network/${caseId}`)
  if (!res.ok) throw new Error('Failed to fetch network graph')
  return res.json()
}

export async function fetchTransactions(params?: { channel?: string; limit?: number }) {
  const query = new URLSearchParams()
  if (params?.channel && params.channel !== 'ALL') query.append('channel', params.channel)
  if (params?.limit) query.append('limit', String(params.limit))

  const res = await fetch(`${API_BASE}/transactions?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/overview`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export async function runSimulation(data: {
  fraud_type: string
  amount: number
  victim_state: string
  victim_city: string
  hop_count: number
  velocity_tx_per_hour: number
  hour_of_day: number
}) {
  const res = await fetch(`${API_BASE}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to run simulation')
  return res.json()
}

export async function triggerLiveEvent() {
  const res = await fetch(`${API_BASE}/simulation/trigger-live-event`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error('Failed to trigger live event')
  return res.json()
}

export async function fetchReport(caseId: number | string = 1) {
  const res = await fetch(`${API_BASE}/reports/${caseId}`)
  if (!res.ok) throw new Error('Failed to fetch intelligence report')
  return res.json()
}

export async function fetchModelPerformance() {
  const res = await fetch(`${API_BASE}/model/performance`)
  if (!res.ok) throw new Error('Failed to fetch model performance')
  return res.json()
}

export async function retrainModel() {
  const res = await fetch(`${API_BASE}/model/retrain`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error('Failed to retrain model')
  return res.json()
}
