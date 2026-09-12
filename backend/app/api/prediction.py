from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any

from backend.app.database.db import get_db
from backend.app.models.models import Case, Prediction
from backend.app.ml.predictor import predictor_instance
from backend.app.schemas.schemas import PredictionResponse

router = APIRouter(prefix="/api/prediction", tags=["Prediction"])

class StandalonePredictRequest(BaseModel):
    amount: float = 200000.0
    fraud_type: str = "Investment Scam"
    victim_city: str = "Kolkata"
    victim_state: str = "West Bengal"
    suspected_cluster_id: Optional[str] = None
    hop_count: int = 3

@router.post("/predict", response_model=PredictionResponse)
def run_standalone_prediction(payload: StandalonePredictRequest):
    result = predictor_instance.predict(
        amount=payload.amount,
        fraud_type=payload.fraud_type,
        victim_city=payload.victim_city,
        victim_state=payload.victim_state,
        suspected_cluster_id=payload.suspected_cluster_id,
        hop_count=payload.hop_count
    )
    return result

@router.get("/case/{case_id}", response_model=PredictionResponse)
def get_prediction_for_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    result = predictor_instance.predict(
        amount=case.reported_amount,
        fraud_type=case.fraud_type,
        victim_city=case.victim_city,
        victim_state=case.victim_state,
        timestamp=case.created_at
    )
    result["case_id"] = case.id
    result["case_number"] = case.case_number
    return result
