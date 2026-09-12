import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_info: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    badge_number: str

# Case Schemas
class CaseCreate(BaseModel):
    title: Optional[str] = None
    fraud_type: str = Field(..., example="Investment Scam")
    reported_amount: float = Field(..., example=200000.0)
    victim_name: Optional[str] = "Anonymous"
    victim_location: str = Field(..., example="Park Street, Kolkata")
    victim_city: str = Field(..., example="Kolkata")
    victim_state: str = Field(..., example="West Bengal")
    victim_account: Optional[str] = "ACC-9921402"
    transaction_date: Optional[str] = None
    transaction_time: Optional[str] = None
    suspected_locations: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    txn_ref: str
    sender_account: str
    sender_name: str
    receiver_account: str
    receiver_name: str
    amount: float
    channel: str
    hop_level: int
    is_mule: bool
    anomaly_score: float
    source_city: str
    target_city: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class CaseResponse(BaseModel):
    id: int
    case_number: str
    title: str
    fraud_type: str
    reported_amount: float
    victim_name: str
    victim_location: str
    victim_city: str
    victim_state: str
    victim_account: str
    status: str
    risk_level: str
    risk_score: float
    current_hop: int
    created_at: datetime.datetime
    predicted_location: Optional[str] = None
    expected_window: Optional[str] = None

    class Config:
        from_attributes = True

# Prediction Schemas
class ExplanationFactor(BaseModel):
    factor: str
    percentage: int
    description: str
    impact: str

class ExplanationData(BaseModel):
    risk_score: float
    summary: str
    breakdown: List[ExplanationFactor]
    methodology: str

class TopAlternative(BaseModel):
    rank: int
    cluster_id: str
    name: str
    city: str
    state: str
    latitude: float
    longitude: float
    risk_score: float
    confidence: float
    expected_window: str
    atm_count: int
    bank_branches: int
    similar_cases_count: int

class PredictionResponse(BaseModel):
    case_id: Optional[int] = None
    case_number: Optional[str] = None
    predicted_cluster_id: str
    location_name: str
    city: str
    state: str
    latitude: float
    longitude: float
    risk_score: float
    confidence_score: float
    expected_time_window: str
    likely_amount_min: float
    likely_amount_max: float
    likely_amount_formatted: str
    atm_count: int
    bank_branches: int
    similar_cases_count: int
    explanation: ExplanationData
    top_alternatives: List[TopAlternative]

# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    alert_code: str
    severity: str
    title: str
    description: str
    location_name: str
    expected_window: str
    probability: float
    status: str
    recommended_action: str
    case_number_ref: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str

# Location Schemas
class LocationClusterResponse(BaseModel):
    id: Optional[int] = 1
    cluster_id: str
    name: str
    city: str
    state: str
    latitude: float
    longitude: float
    risk_score: Optional[float] = 85.0
    risk_tier: Optional[str] = "HIGH"
    historical_withdrawals: Optional[int] = 150
    expected_time_window: Optional[str] = "6:00 PM - 9:00 PM (Today)"
    atm_count: Optional[int] = 30
    bank_branches: Optional[int] = 15
    active_threats: Optional[int] = 5

    class Config:
        from_attributes = True

# Network Graph Schemas
class NetworkNode(BaseModel):
    id: str
    label: str
    type: str  # victim, mule, atm, bank, case
    risk_level: str  # HIGH, MEDIUM, LOW
    details: Dict[str, Any]

class NetworkEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    amount: Optional[float] = None
    channel: Optional[str] = None
    is_threat: bool = False

class NetworkGraphResponse(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]

# Simulation Schemas
class SimulationRequest(BaseModel):
    fraud_type: str = "Investment Scam"
    amount: float = 250000.0
    victim_state: str = "West Bengal"
    victim_city: str = "Kolkata"
    hop_count: int = 4
    velocity_tx_per_hour: float = 5.0
    hour_of_day: int = 18

class SimulationResponse(BaseModel):
    simulated_risk_score: float
    predicted_location: str
    expected_time_window: str
    confidence: float
    breakdown: List[ExplanationFactor]
    top_alternatives: List[TopAlternative]

# Analytics Schemas
class AnalyticsSummary(BaseModel):
    total_cases: int
    predicted_withdrawals: int
    high_risk_alerts: int
    interventions: int
    linked_cases_count: int
    active_threat_nodes: int
    fraud_distribution: List[Dict[str, Any]]
    state_risk_distribution: List[Dict[str, Any]]
    hourly_cashout_patterns: List[Dict[str, Any]]
    model_metrics: Dict[str, Any]
