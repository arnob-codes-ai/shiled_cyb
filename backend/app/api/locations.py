from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.db import get_db
from backend.app.models.models import LocationCluster
from backend.app.schemas.schemas import LocationClusterResponse
from backend.app.ml.predictor import ATM_CLUSTERS

router = APIRouter(prefix="/api/locations", tags=["Locations"])

@router.get("/risk", response_model=List[LocationClusterResponse])
def get_all_risk_locations(db: Session = Depends(get_db)):
    clusters = db.query(LocationCluster).all()
    if not clusters:
        # Fallback to in-memory catalogue if db not yet queried
        return [
            {
                "id": idx + 1,
                "cluster_id": c.get("cluster_id", f"CC-{idx+1}"),
                "name": c.get("name", "ATM Cluster"),
                "city": c.get("city", "India"),
                "state": c.get("state", "India"),
                "latitude": c.get("latitude", 22.5),
                "longitude": c.get("longitude", 78.5),
                "risk_score": c.get("base_risk", c.get("risk_score", 85.0)),
                "risk_tier": "HIGH" if c.get("base_risk", 85.0) >= 80 else "MEDIUM" if c.get("base_risk", 85.0) >= 65 else "LOW",
                "historical_withdrawals": 120,
                "expected_time_window": c.get("expected_window", "6:00 PM - 9:00 PM (Today)"),
                "atm_count": c.get("atm_count", 35),
                "bank_branches": c.get("bank_branches", 15),
                "active_threats": c.get("active_threats", 5)
            }
            for idx, c in enumerate(ATM_CLUSTERS)
        ]
    return clusters

@router.get("/{cluster_id}")
def get_location_detail(cluster_id: str, db: Session = Depends(get_db)):
    cluster = db.query(LocationCluster).filter(LocationCluster.cluster_id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Location cluster not found")
    
    return {
        "cluster_id": cluster.cluster_id,
        "name": cluster.name,
        "city": cluster.city,
        "state": cluster.state,
        "latitude": cluster.latitude,
        "longitude": cluster.longitude,
        "risk_score": cluster.risk_score,
        "risk_tier": cluster.risk_tier,
        "historical_withdrawals": cluster.historical_withdrawals,
        "expected_time_window": cluster.expected_time_window,
        "atm_count": cluster.atm_count,
        "bank_branches": cluster.bank_branches,
        "active_threats": cluster.active_threats,
        "corridors": [
            {"from": "Delhi NCR", "volume": "₹4.2M", "threat_level": "HIGH"},
            {"from": "Mumbai Suburbs", "volume": "₹2.8M", "threat_level": "MEDIUM"},
            {"from": "Bengaluru East", "volume": "₹1.9M", "threat_level": "MEDIUM"}
        ]
    }
