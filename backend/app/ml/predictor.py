import math
import datetime
from typing import Dict, Any, List, Optional
from backend.app.ml.feature_engine import extract_features
from backend.app.ml.explainability import compute_explanations

# Master Database of Indian ATM / Financial Cash-Out Clusters
ATM_CLUSTERS = [
    {
        "cluster_id": "CC-WB-KOL-01",
        "name": "Park Street ATM Cluster",
        "city": "Kolkata",
        "state": "West Bengal",
        "latitude": 22.5512,
        "longitude": 88.3524,
        "base_risk": 92.0,
        "atm_count": 42,
        "bank_branches": 18,
        "active_threats": 14,
        "expected_window": "6:00 PM - 9:00 PM (Today)"
    },
    {
        "cluster_id": "CC-DL-DEL-01",
        "name": "Lajpat Nagar ATM Cluster",
        "city": "Delhi",
        "state": "Delhi",
        "latitude": 28.5677,
        "longitude": 77.2433,
        "base_risk": 87.0,
        "atm_count": 56,
        "bank_branches": 24,
        "active_threats": 18,
        "expected_window": "5:00 PM - 8:00 PM (Today)"
    },
    {
        "cluster_id": "CC-KA-BLR-01",
        "name": "MG Road ATM Cluster",
        "city": "Bengaluru",
        "state": "Karnataka",
        "latitude": 12.9756,
        "longitude": 77.6066,
        "base_risk": 81.0,
        "atm_count": 48,
        "bank_branches": 22,
        "active_threats": 11,
        "expected_window": "7:00 PM - 10:00 PM (Today)"
    },
    {
        "cluster_id": "CC-MH-MUM-01",
        "name": "Dadar ATM Cluster",
        "city": "Mumbai",
        "state": "Maharashtra",
        "latitude": 19.0178,
        "longitude": 72.8478,
        "base_risk": 78.0,
        "atm_count": 64,
        "bank_branches": 30,
        "active_threats": 16,
        "expected_window": "6:30 PM - 9:30 PM (Today)"
    },
    {
        "cluster_id": "CC-CH-CHD-01",
        "name": "Sector 17 ATM Cluster",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "latitude": 30.7415,
        "longitude": 76.7681,
        "base_risk": 74.0,
        "atm_count": 35,
        "bank_branches": 15,
        "active_threats": 8,
        "expected_window": "4:00 PM - 7:00 PM (Today)"
    },
    {
        "cluster_id": "CC-WB-KOL-02",
        "name": "Salt Lake Sector V Cluster",
        "city": "Kolkata",
        "state": "West Bengal",
        "latitude": 22.5804,
        "longitude": 88.4378,
        "base_risk": 76.0,
        "atm_count": 38,
        "bank_branches": 16,
        "active_threats": 9,
        "expected_window": "8:00 PM - 11:00 PM (Today)"
    },
    {
        "cluster_id": "CC-DL-DEL-02",
        "name": "Connaught Place Financial Hub",
        "city": "Delhi",
        "state": "Delhi",
        "latitude": 28.6304,
        "longitude": 77.2177,
        "base_risk": 79.0,
        "atm_count": 62,
        "bank_branches": 35,
        "active_threats": 12,
        "expected_window": "5:30 PM - 8:30 PM (Today)"
    },
    {
        "cluster_id": "CC-MH-MUM-02",
        "name": "Bandra Kurla Complex",
        "city": "Mumbai",
        "state": "Maharashtra",
        "latitude": 19.0657,
        "longitude": 72.8687,
        "base_risk": 72.0,
        "atm_count": 51,
        "bank_branches": 28,
        "active_threats": 7,
        "expected_window": "6:00 PM - 9:00 PM (Today)"
    },
    {
        "cluster_id": "CC-TS-HYD-01",
        "name": "Banjara Hills Financial Hub",
        "city": "Hyderabad",
        "state": "Telangana",
        "latitude": 17.4156,
        "longitude": 78.4350,
        "base_risk": 68.0,
        "atm_count": 44,
        "bank_branches": 20,
        "active_threats": 6,
        "expected_window": "7:00 PM - 10:00 PM (Today)"
    },
    {
        "cluster_id": "CC-TN-CHE-01",
        "name": "T Nagar Commercial Zone",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "latitude": 13.0418,
        "longitude": 80.2341,
        "base_risk": 65.0,
        "atm_count": 46,
        "bank_branches": 19,
        "active_threats": 5,
        "expected_window": "5:00 PM - 8:00 PM (Today)"
    },
    {
        "cluster_id": "CC-UP-LKO-01",
        "name": "Hazratganj Financial Area",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "base_risk": 63.0,
        "atm_count": 39,
        "bank_branches": 17,
        "active_threats": 5,
        "expected_window": "4:30 PM - 7:30 PM (Today)"
    },
    {
        "cluster_id": "CC-RJ-JAI-01",
        "name": "MI Road Business Center",
        "city": "Jaipur",
        "state": "Rajasthan",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "base_risk": 61.0,
        "atm_count": 34,
        "bank_branches": 14,
        "active_threats": 4,
        "expected_window": "5:00 PM - 8:00 PM (Today)"
    }
]

class CashOutPredictor:
    """
    Spatio-Temporal Cash-Out Predictive Model.
    Forecasts likely ATM clusters, risk probabilities, and time windows.
    """
    def __init__(self):
        self.clusters = ATM_CLUSTERS

    def predict(
        self,
        amount: float,
        fraud_type: str,
        victim_city: str,
        victim_state: str,
        timestamp: Optional[datetime.datetime] = None,
        suspected_cluster_id: Optional[str] = None,
        hop_count: int = 3
    ) -> Dict[str, Any]:
        if timestamp is None:
            timestamp = datetime.datetime.utcnow()

        # Score all clusters based on spatio-temporal velocity, state cross-routing, and fraud affinity
        scored_clusters = []
        for c in self.clusters:
            features = extract_features(
                amount=amount,
                fraud_type=fraud_type,
                victim_state=victim_state,
                target_state=c["state"],
                timestamp=timestamp,
                hop_count=hop_count,
                recent_tx_count=4,
                historical_cluster_freq=c["base_risk"] / 100.0
            )

            # Spatial affinity boost
            spatial_match = 1.15 if c["city"].lower() == victim_city.lower() else (1.05 if c["state"].lower() == victim_state.lower() else 0.95)
            
            # Amount tier affinity
            amount_factor = 1.08 if (amount >= 100000 and "Park Street" in c["name"]) else 1.0
            
            # Calculate dynamic risk score (clamped between 35% and 98%)
            raw_score = (c["base_risk"] * 0.65) + (features["velocity"] * 15.0) + (features["fraud_weight"] * 18.0) * spatial_match * amount_factor
            risk_score = round(min(98.0, max(35.0, raw_score)), 1)
            confidence = round(min(0.96, 0.75 + (risk_score / 400.0)), 2)

            scored_clusters.append({
                "cluster": c,
                "risk_score": risk_score,
                "confidence": confidence,
                "features": features
            })

        # Sort by risk score descending
        scored_clusters.sort(key=lambda x: x["risk_score"], reverse=True)

        primary = scored_clusters[0]
        if suspected_cluster_id:
            for sc in scored_clusters:
                if sc["cluster"]["cluster_id"] == suspected_cluster_id:
                    primary = sc
                    break

        primary_cluster = primary["cluster"]
        primary_risk = primary["risk_score"]
        primary_confidence = primary["confidence"]
        primary_features = primary["features"]

        # Calculate likely withdrawal amount band
        likely_min = round(amount * 0.75, -3)
        likely_max = round(amount * 1.0, -3)

        # Compute Explainable AI feature breakdown
        xai_data = compute_explanations(
            features=primary_features,
            risk_score=primary_risk,
            location_name=primary_cluster["name"],
            fraud_type=fraud_type,
            amount=amount
        )

        # Top 5 alternative locations
        top_alternatives = []
        for idx, item in enumerate(scored_clusters[:5]):
            top_alternatives.append({
                "rank": idx + 1,
                "cluster_id": item["cluster"]["cluster_id"],
                "name": item["cluster"]["name"],
                "city": item["cluster"]["city"],
                "state": item["cluster"]["state"],
                "latitude": item["cluster"]["latitude"],
                "longitude": item["cluster"]["longitude"],
                "risk_score": item["risk_score"],
                "confidence": item["confidence"],
                "expected_window": item["cluster"]["expected_window"],
                "atm_count": item["cluster"]["atm_count"],
                "bank_branches": item["cluster"]["bank_branches"],
                "similar_cases_count": 18 + int(item["risk_score"] * 0.15)
            })

        return {
            "predicted_cluster_id": primary_cluster["cluster_id"],
            "location_name": primary_cluster["name"],
            "city": primary_cluster["city"],
            "state": primary_cluster["state"],
            "latitude": primary_cluster["latitude"],
            "longitude": primary_cluster["longitude"],
            "risk_score": primary_risk,
            "confidence_score": primary_confidence,
            "expected_time_window": primary_cluster["expected_window"],
            "likely_amount_min": likely_min,
            "likely_amount_max": likely_max,
            "likely_amount_formatted": f"₹{likely_min/100000:.1f}L - ₹{likely_max/100000:.1f}L" if likely_max >= 100000 else f"₹{likely_min:,.0f} - ₹{likely_max:,.0f}",
            "atm_count": primary_cluster["atm_count"],
            "bank_branches": primary_cluster["bank_branches"],
            "similar_cases_count": 24,
            "explanation": xai_data,
            "top_alternatives": top_alternatives
        }

predictor_instance = CashOutPredictor()
