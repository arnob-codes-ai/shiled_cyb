import math
import datetime
from typing import Dict, Any, List

FRAUD_CATEGORIES = [
    "Investment Scam",
    "UPI Fraud",
    "Trading Fraud",
    "Job Fraud",
    "Sextortion",
    "Loan App Scam",
    "Identity Theft",
    "SIM Swap Fraud"
]

FRAUD_TYPE_WEIGHTS = {
    "Investment Scam": 0.94,
    "Trading Fraud": 0.89,
    "UPI Fraud": 0.85,
    "Job Fraud": 0.78,
    "Sextortion": 0.74,
    "Loan App Scam": 0.72,
    "Identity Theft": 0.68,
    "SIM Swap Fraud": 0.82
}

def extract_features(
    amount: float,
    fraud_type: str,
    victim_state: str,
    target_state: str,
    timestamp: datetime.datetime,
    hop_count: int = 3,
    recent_tx_count: int = 4,
    historical_cluster_freq: float = 0.85
) -> Dict[str, float]:
    """
    Extracts numerical feature vector for predictive cash-out modeling.
    """
    hour = timestamp.hour + timestamp.minute / 60.0
    day_of_week = timestamp.weekday()

    # Cyclic time encoding
    hour_sin = math.sin(2 * math.pi * hour / 24.0)
    hour_cos = math.cos(2 * math.pi * hour / 24.0)
    
    amount_log = math.log1p(max(100.0, amount))
    is_cross_state = 1.0 if victim_state.strip().lower() != target_state.strip().lower() else 0.0
    fraud_weight = FRAUD_TYPE_WEIGHTS.get(fraud_type, 0.75)
    
    # Velocity index: fast cascading transactions have higher urgency
    velocity = min(1.0, (recent_tx_count / 5.0) * (1.0 + 0.1 * hop_count))
    
    return {
        "amount_log": amount_log,
        "amount_raw": amount,
        "hour_sin": hour_sin,
        "hour_cos": hour_cos,
        "hour_raw": hour,
        "day_of_week": float(day_of_week),
        "fraud_weight": fraud_weight,
        "is_cross_state": is_cross_state,
        "hop_count": float(hop_count),
        "velocity": velocity,
        "historical_cluster_freq": historical_cluster_freq
    }
