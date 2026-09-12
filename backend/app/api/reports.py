import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.db import get_db
from backend.app.models.models import Case, Transaction, Prediction
from backend.app.ml.predictor import predictor_instance

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{case_id}")
def generate_case_intelligence_report(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case record not found")

    pred = predictor_instance.predict(
        amount=case.reported_amount,
        fraud_type=case.fraud_type,
        victim_city=case.victim_city,
        victim_state=case.victim_state,
        timestamp=case.created_at
    )

    report_dossier = {
        "report_id": f"INTEL-DOSSIER-{case.case_number}",
        "generated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%d %B %Y %I:%M:%S UTC"),
        "classification": "CONFIDENTIAL // DECISION SUPPORT ONLY",
        "case_overview": {
            "case_number": case.case_number,
            "title": case.title,
            "fraud_type": case.fraud_type,
            "reported_amount": f"₹{case.reported_amount:,.2f}",
            "victim_location": f"{case.victim_location}, {case.victim_city}, {case.victim_state}",
            "reported_at": case.created_at.strftime("%d %B %Y %I:%M %p"),
            "current_status": case.status,
            "risk_tier": case.risk_level
        },
        "ml_predictive_assessment": {
            "primary_predicted_cluster": pred["location_name"],
            "city": pred["city"],
            "state": pred["state"],
            "risk_probability": f"{pred['risk_score']:.1f}%",
            "model_confidence": f"{pred['confidence_score']*100:.0f}%",
            "forecasted_time_window": pred["expected_time_window"],
            "estimated_liquidation_range": pred["likely_amount_formatted"],
            "top_candidate_locations": pred["top_alternatives"]
        },
        "explainable_ai_reasoning": pred["explanation"]["breakdown"],
        "recommended_investigative_actions": [
            f"Establish immediate coordination with nodal security officers for ATMs in {pred['location_name']}.",
            "Dispatch proactive alert to beneficiary banks requesting temporary velocity hold on identified mule accounts.",
            "Verify surveillance footage logs during the forecasted operational window.",
            "Correlate transaction graph with active regional syndicate networks."
        ],
        "disclaimer": (
            "NOTICE: This document is an AI-assisted predictive analytics assessment designed for investigative prioritization. "
            "Probabilities and time windows represent machine learning estimations based on synthetic/demonstration patterns "
            "and MUST be verified independently by authorized officers before taking enforcement action."
        )
    }

    return report_dossier
