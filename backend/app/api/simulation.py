import json
import random
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.models.models import Case, Alert, Transaction
from backend.app.schemas.schemas import SimulationRequest, SimulationResponse
from backend.app.ml.predictor import predictor_instance
from backend.app.api.websocket import manager

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/run", response_model=SimulationResponse)
def run_scenario_simulation(payload: SimulationRequest):
    # Simulated time based on hour_of_day
    now = datetime.datetime.now(datetime.timezone.utc)
    sim_time = now.replace(hour=payload.hour_of_day % 24, minute=0, second=0)

    pred = predictor_instance.predict(
        amount=payload.amount,
        fraud_type=payload.fraud_type,
        victim_city=payload.victim_city,
        victim_state=payload.victim_state,
        timestamp=sim_time,
        hop_count=payload.hop_count
    )

    # Adjust simulated risk score based on velocity parameter
    velocity_boost = (payload.velocity_tx_per_hour - 3.0) * 2.2
    simulated_risk = round(min(98.5, max(30.0, pred["risk_score"] + velocity_boost)), 1)

    return SimulationResponse(
        simulated_risk_score=simulated_risk,
        predicted_location=pred["location_name"],
        expected_time_window=pred["expected_time_window"],
        confidence=pred["confidence_score"],
        breakdown=pred["explanation"]["breakdown"],
        top_alternatives=pred["top_alternatives"]
    )

@router.post("/trigger-live-event")
async def trigger_live_simulated_event(db: Session = Depends(get_db)):
    """
    Hackathon Demo Feature: Fires a live cybercrime event, updates DB,
    broadcasts event to frontend over WebSocket, and triggers map/alert animations.
    """
    case_count = db.query(Case).count() + 1
    new_case_num = f"CC2026-{case_count:06d}"
    cities = [
        ("Park Street ATM Cluster, Kolkata", "Kolkata", "West Bengal", 94.0, 22.5512, 88.3524),
        ("Lajpat Nagar ATM Cluster, Delhi", "Delhi", "Delhi", 91.0, 28.5677, 77.2433),
        ("MG Road ATM Cluster, Bengaluru", "Bengaluru", "Karnataka", 88.0, 12.9756, 77.6066),
        ("Dadar ATM Cluster, Mumbai", "Mumbai", "Maharashtra", 86.0, 19.0178, 72.8478)
    ]
    target_loc, city, state, risk, lat, lng = random.choice(cities)
    amount = round(random.uniform(150000.0, 350000.0), -2)

    # Create new live alert
    unique_ts = int(datetime.datetime.now(datetime.timezone.utc).timestamp() * 1000) % 10000000
    alert = Alert(
        alert_code=f"ALT-LIVE-{unique_ts}",
        severity="HIGH",
        title="LIVE THREAT: Immediate ATM Cash-Out Surge Detected",
        description=f"Rapid 4-hop fund routing identified toward {target_loc}. Probability {risk:.0f}%.",
        location_name=f"{target_loc.split(',')[0]}, {city}",
        expected_window="Within 45 Minutes (URGENT)",
        probability=risk,
        status="ACTIVE",
        recommended_action=f"Dispatch high-priority alert to {city} nodal cybercell and coordinate ATM branch freeze.",
        case_number_ref=f"#{new_case_num}",
        created_at=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(alert)
    db.commit()

    event_payload = {
        "type": "LIVE_THREAT_DETECTED",
        "case_number": f"#{new_case_num}",
        "fraud_type": "Investment Scam",
        "amount": f"₹{amount:,.0f}",
        "location": f"{target_loc.split(',')[0]}, {city}",
        "city": city,
        "state": state,
        "coordinates": [lat, lng],
        "risk_probability": f"{risk:.0f}%",
        "risk_score": risk,
        "expected_window": "Within 45 Minutes",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%I:%M:%S %p"),
        "alert": {
            "id": alert.id,
            "code": alert.alert_code,
            "title": alert.title,
            "severity": "HIGH",
            "location": alert.location_name,
            "probability": alert.probability
        }
    }

    # Broadcast event to all active WebSocket clients
    await manager.broadcast(event_payload)

    return {"status": "BROADCASTED", "event": event_payload}
