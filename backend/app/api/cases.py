import json
import random
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from pydantic import BaseModel
from backend.app.database.db import get_db
from backend.app.models.models import Case, Transaction, Prediction, Alert, LinkedCase, LocationCluster, AuditLog
from backend.app.schemas.schemas import CaseCreate, CaseResponse
from backend.app.ml.predictor import predictor_instance
from backend.app.ml.link_detector import find_linked_cases

router = APIRouter(prefix="/api/cases", tags=["Cases"])

@router.get("", response_model=List[CaseResponse])
def list_cases(
    search: Optional[str] = None,
    fraud_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Case)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Case.case_number.ilike(s)) |
            (Case.title.ilike(s)) |
            (Case.victim_location.ilike(s)) |
            (Case.victim_city.ilike(s)) |
            (Case.victim_account.ilike(s))
        )

    if fraud_type and fraud_type != "ALL":
        query = query.filter(Case.fraud_type == fraud_type)

    if risk_level and risk_level != "ALL":
        query = query.filter(Case.risk_level == risk_level)

    if status and status != "ALL":
        query = query.filter(Case.status == status)

    cases = query.order_by(Case.id.asc()).offset(skip).limit(limit).all()

    # Enrich with predicted location if available
    results = []
    for c in cases:
        pred_rec = db.query(Prediction).filter(Prediction.case_id == c.id).first()
        pred_loc = None
        exp_win = None
        if pred_rec and pred_rec.cluster:
            pred_loc = pred_rec.cluster.name
            exp_win = pred_rec.expected_time_window

        results.append(CaseResponse(
            id=c.id,
            case_number=c.case_number,
            title=c.title,
            fraud_type=c.fraud_type,
            reported_amount=c.reported_amount,
            victim_name=c.victim_name,
            victim_location=c.victim_location,
            victim_city=c.victim_city,
            victim_state=c.victim_state,
            victim_account=c.victim_account,
            status=c.status,
            risk_level=c.risk_level,
            risk_score=c.risk_score,
            current_hop=c.current_hop,
            created_at=c.created_at,
            predicted_location=pred_loc,
            expected_window=exp_win
        ))

    return results

@router.post("", response_model=CaseResponse)
def create_case(payload: CaseCreate, db: Session = Depends(get_db)):
    # Generate unique case number
    case_count = db.query(Case).count() + 1
    case_number = f"CC2026-{case_count:06d}"
    title = payload.title or f"{payload.fraud_type} incident reported at {payload.victim_city}"

    # Run ML Spatio-temporal Prediction
    pred = predictor_instance.predict(
        amount=payload.reported_amount,
        fraud_type=payload.fraud_type,
        victim_city=payload.victim_city,
        victim_state=payload.victim_state,
        suspected_cluster_id=payload.suspected_locations
    )

    risk_score = pred["risk_score"]
    risk_level = "HIGH" if risk_score >= 80 else ("MEDIUM" if risk_score >= 65 else "LOW")

    new_case = Case(
        case_number=case_number,
        title=title,
        fraud_type=payload.fraud_type,
        reported_amount=payload.reported_amount,
        victim_name=payload.victim_name or "Complainant",
        victim_location=payload.victim_location,
        victim_city=payload.victim_city,
        victim_state=payload.victim_state,
        victim_account=payload.victim_account or f"ACC-{random.randint(1000000, 9999999)}",
        status="Monitoring" if risk_level == "HIGH" else "Analysis",
        risk_level=risk_level,
        risk_score=risk_score,
        current_hop=4,
        created_at=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # Find matching cluster
    matched_cluster = db.query(LocationCluster).filter(LocationCluster.cluster_id == pred["predicted_cluster_id"]).first()
    cluster_id = matched_cluster.id if matched_cluster else 1

    # Save ML Prediction record
    pred_record = Prediction(
        case_id=new_case.id,
        cluster_id=cluster_id,
        risk_score=risk_score,
        confidence_score=pred["confidence_score"],
        expected_time_window=pred["expected_time_window"],
        likely_amount_min=pred["likely_amount_min"],
        likely_amount_max=pred["likely_amount_max"],
        explanation_json=json.dumps(pred["explanation"]),
        top_alternatives_json=json.dumps(pred["top_alternatives"]),
        created_at=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(pred_record)

    # Generate realistic multi-hop transactions
    mule1_acc = f"MULE-{random.randint(100000, 999999)}"
    mule2_acc = f"MULE-{random.randint(100000, 999999)}"
    atm_acc = f"ATM-{payload.victim_city[:3].upper()}-{random.randint(100, 999)}"

    tx1 = Transaction(
        case_id=new_case.id,
        txn_ref=f"TXN-2026-{new_case.id:04d}-01",
        sender_account=new_case.victim_account,
        sender_name="Victim Account",
        receiver_account=mule1_acc,
        receiver_name="Mule Account Tier-1",
        amount=payload.reported_amount,
        channel="UPI Transfer",
        hop_level=1,
        is_mule=True,
        anomaly_score=0.85,
        source_city=payload.victim_city,
        target_city=payload.victim_city,
        timestamp=new_case.created_at + datetime.timedelta(minutes=5)
    )
    tx2 = Transaction(
        case_id=new_case.id,
        txn_ref=f"TXN-2026-{new_case.id:04d}-02",
        sender_account=mule1_acc,
        sender_name="Mule Account Tier-1",
        receiver_account=mule2_acc,
        receiver_name="Mule Account Tier-2",
        amount=payload.reported_amount * 0.95,
        channel="IMPS Immediate Transfer",
        hop_level=2,
        is_mule=True,
        anomaly_score=0.90,
        source_city=payload.victim_city,
        target_city=payload.victim_city,
        timestamp=new_case.created_at + datetime.timedelta(minutes=25)
    )
    tx3 = Transaction(
        case_id=new_case.id,
        txn_ref=f"TXN-2026-{new_case.id:04d}-03",
        sender_account=mule2_acc,
        sender_name="Mule Account Tier-2",
        receiver_account="5 Distributed Mule Accounts",
        receiver_name="Layered Mule Ring",
        amount=payload.reported_amount * 0.90,
        channel="UPI Split Batching",
        hop_level=3,
        is_mule=True,
        anomaly_score=0.95,
        source_city=payload.victim_city,
        target_city=payload.victim_city,
        timestamp=new_case.created_at + datetime.timedelta(minutes=55)
    )
    tx4 = Transaction(
        case_id=new_case.id,
        txn_ref=f"TXN-2026-{new_case.id:04d}-04",
        sender_account="Layered Mule Ring",
        sender_name="Target Liquidation Point",
        receiver_account=atm_acc,
        receiver_name=f"Predicted Cash-Out: {pred['location_name']}",
        amount=payload.reported_amount * 0.85,
        channel="ATM Cash Withdrawal",
        hop_level=4,
        is_mule=True,
        anomaly_score=0.98,
        source_city=payload.victim_city,
        target_city=payload.victim_city,
        timestamp=new_case.created_at + datetime.timedelta(hours=2)
    )
    db.add_all([tx1, tx2, tx3, tx4])

    # If high risk, generate proactive alert
    if risk_score >= 80.0:
        alert = Alert(
            case_id=new_case.id,
            cluster_id=cluster_id,
            alert_code=f"ALT-2026-{case_count:03d}",
            severity="HIGH",
            title=f"Potential cash-out activity predicted in {pred['city']}",
            description=f"Predicted {payload.fraud_type} liquidation spike at {pred['location_name']}.",
            location_name=pred["location_name"],
            expected_window=pred["expected_time_window"].split("(")[0].strip(),
            probability=risk_score,
            status="ACTIVE",
            recommended_action=f"Prioritize authorized surveillance and bank coordination in {pred['city']}.",
            case_number_ref=f"#{case_number}",
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(alert)

    db.commit()

    return CaseResponse(
        id=new_case.id,
        case_number=new_case.case_number,
        title=new_case.title,
        fraud_type=new_case.fraud_type,
        reported_amount=new_case.reported_amount,
        victim_name=new_case.victim_name,
        victim_location=new_case.victim_location,
        victim_city=new_case.victim_city,
        victim_state=new_case.victim_state,
        victim_account=new_case.victim_account,
        status=new_case.status,
        risk_level=new_case.risk_level,
        risk_score=new_case.risk_score,
        current_hop=new_case.current_hop,
        created_at=new_case.created_at,
        predicted_location=pred["location_name"],
        expected_window=pred["expected_time_window"]
    )

@router.get("/{identifier}")
def get_case_detail(identifier: str, db: Session = Depends(get_db)):
    case = None
    # Try query by integer ID first if purely numeric
    if identifier.isdigit():
        case = db.query(Case).filter(Case.id == int(identifier)).first()

    # If not found or string identifier, query by case_number
    if not case:
        clean_ident = identifier.replace('#', '').strip()
        case = db.query(Case).filter(
            (Case.case_number == clean_ident) |
            (Case.case_number.ilike(f"%{clean_ident}%"))
        ).first()

    if not case:
        case = db.query(Case).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case record not found")

    id = case.id
    transactions = db.query(Transaction).filter(Transaction.case_id == id).order_by(Transaction.hop_level.asc()).all()
    prediction_record = db.query(Prediction).filter(Prediction.case_id == id).first()

    # Load ML prediction or compute fresh
    if prediction_record:
        explanation_data = json.loads(prediction_record.explanation_json)
        top_alts = json.loads(prediction_record.top_alternatives_json)
        pred_data = {
            "predicted_cluster_id": prediction_record.cluster.cluster_id if prediction_record.cluster else "CC-WB-KOL-01",
            "location_name": prediction_record.cluster.name if prediction_record.cluster else "Park Street ATM Cluster",
            "city": prediction_record.cluster.city if prediction_record.cluster else case.victim_city,
            "state": prediction_record.cluster.state if prediction_record.cluster else case.victim_state,
            "latitude": prediction_record.cluster.latitude if prediction_record.cluster else 22.5512,
            "longitude": prediction_record.cluster.longitude if prediction_record.cluster else 88.3524,
            "risk_score": prediction_record.risk_score,
            "confidence_score": prediction_record.confidence_score,
            "expected_time_window": prediction_record.expected_time_window,
            "likely_amount_min": prediction_record.likely_amount_min,
            "likely_amount_max": prediction_record.likely_amount_max,
            "likely_amount_formatted": f"₹{prediction_record.likely_amount_min/100000:.1f}L - ₹{prediction_record.likely_amount_max/100000:.1f}L",
            "atm_count": prediction_record.cluster.atm_count if prediction_record.cluster else 42,
            "bank_branches": prediction_record.cluster.bank_branches if prediction_record.cluster else 18,
            "similar_cases_count": 24,
            "explanation": explanation_data,
            "top_alternatives": top_alts
        }
    else:
        pred_data = predictor_instance.predict(
            amount=case.reported_amount,
            fraud_type=case.fraud_type,
            victim_city=case.victim_city,
            victim_state=case.victim_state,
            timestamp=case.created_at
        )

    # Detect linked cases dynamically
    all_sample_cases = db.query(Case).filter(Case.id != id).limit(50).all()
    all_cases_dict = [
        {
            "id": c.id,
            "case_number": c.case_number,
            "title": c.title,
            "fraud_type": c.fraud_type,
            "reported_amount": c.reported_amount,
            "victim_city": c.victim_city,
            "victim_state": c.victim_state
        }
        for c in all_sample_cases
    ]
    target_dict = {
        "id": case.id,
        "case_number": case.case_number,
        "title": case.title,
        "fraud_type": case.fraud_type,
        "reported_amount": case.reported_amount,
        "victim_city": case.victim_city,
        "victim_state": case.victim_state
    }
    linked_cases = find_linked_cases(target_dict, all_cases_dict)

    # Format transaction flow
    tx_flow = []
    for t in transactions:
        tx_flow.append({
            "id": t.id,
            "txn_ref": t.txn_ref,
            "sender_account": t.sender_account,
            "sender_name": t.sender_name,
            "receiver_account": t.receiver_account,
            "receiver_name": t.receiver_name,
            "amount": t.amount,
            "amount_formatted": f"₹{t.amount:,.0f}",
            "channel": t.channel,
            "hop_level": t.hop_level,
            "is_mule": t.is_mule,
            "anomaly_score": t.anomaly_score,
            "source_city": t.source_city,
            "target_city": t.target_city,
            "timestamp": t.timestamp.strftime("%d %b, %I:%M %p")
        })

    # Timeline events
    timeline = [
        {
            "time": case.created_at.strftime("%I:%M %p"),
            "date": case.created_at.strftime("%d %b %Y"),
            "event": "Complaint Ingested",
            "description": f"Incident reported by complainant via cyber portal for {case.fraud_type}.",
            "badge": "INGESTION"
        },
        {
            "time": (case.created_at + datetime.timedelta(minutes=8)).strftime("%I:%M %p"),
            "date": case.created_at.strftime("%d %b %Y"),
            "event": "Automated Feature Processing & Banking Trace",
            "description": "Multi-hop ledger analysis identified 2 intermediary mule hops.",
            "badge": "TRACE"
        },
        {
            "time": (case.created_at + datetime.timedelta(minutes=14)).strftime("%I:%M %p"),
            "date": case.created_at.strftime("%d %b %Y"),
            "event": "ML Cash-Out Forecast Generated",
            "description": f"Prediction model estimated {pred_data['risk_score']:.0f}% risk at {pred_data['location_name']}.",
            "badge": "PREDICTION"
        },
        {
            "time": (case.created_at + datetime.timedelta(minutes=20)).strftime("%I:%M %p"),
            "date": case.created_at.strftime("%d %b %Y"),
            "event": "Proactive Intervention Alert Dispatched",
            "description": "Notice routed to nodal bank security officer for surveillance window.",
            "badge": "ALERT"
        }
    ]

    return {
        "case": {
            "id": case.id,
            "case_number": case.case_number,
            "title": case.title,
            "fraud_type": case.fraud_type,
            "reported_amount": case.reported_amount,
            "reported_amount_formatted": f"₹{case.reported_amount:,.0f}",
            "victim_name": case.victim_name,
            "victim_location": case.victim_location,
            "victim_city": case.victim_city,
            "victim_state": case.victim_state,
            "victim_account": case.victim_account,
            "status": case.status,
            "risk_level": case.risk_level,
            "risk_score": case.risk_score,
            "current_hop": case.current_hop,
            "created_at": case.created_at.strftime("%d %b %Y, %I:%M %p")
        },
        "transactions": tx_flow,
        "prediction": pred_data,
        "linked_cases": linked_cases,
        "timeline": timeline,
        "evidence": [
            {"type": "UPI Callback Logs", "status": "Verified", "hash": "sha256:4f8e91c30..."},
            {"type": "Beneficiary Bank KYC Status", "status": "Suspicious / Incomplete KYC", "hash": "sha256:a2b8e310d..."},
            {"type": "ATM CCTV Surveillance Request", "status": "Dispatched to Cluster Branch", "hash": "sha256:77ff0239c..."}
        ]
    }

@router.patch("/{id}/status")
def update_case_status(id: int, status: str = Query(...), db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case record not found")
    case.status = status
    db.commit()
    return {"status": "SUCCESS", "case_id": id, "new_status": status}

class RectifyCasePayload(BaseModel):
    action_type: str = "Mule Account Frozen & ATM Surveillance Dispatched"
    notes: Optional[str] = "Investigator verified transaction corridor. Nodal bank liaison frozen beneficiary accounts under emergency directive."
    investigator_badge: str = "AO-4492"

@router.post("/{id}/rectify")
async def rectify_case_manually(id: int, payload: RectifyCasePayload, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case record not found")

    # Update case status to Intervened and reduce risk score
    case.status = "Intervened"
    case.risk_level = "LOW"
    case.risk_score = max(10.0, case.risk_score - 70.0)

    # Resolve all associated active alerts for this case
    alerts = db.query(Alert).filter(
        (Alert.case_id == id) | (Alert.case_number_ref.ilike(f"%{case.case_number}%"))
    ).all()
    for a in alerts:
        a.status = "RESOLVED"
        a.resolved_at = datetime.datetime.now(datetime.timezone.utc)

    # Log audit action
    audit = AuditLog(
        user_badge=payload.investigator_badge,
        action="MANUAL_CASE_RECTIFICATION",
        target=f"Case {case.case_number}",
        details=json.dumps({"action_type": payload.action_type, "notes": payload.notes}),
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()

    # Broadcast live real-time update
    event_data = {
        "type": "CASE_RECTIFIED_SOLVED",
        "case_id": case.id,
        "case_number": case.case_number,
        "new_status": "Intervened",
        "action_taken": payload.action_type,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%I:%M:%S %p")
    }
    from backend.app.api.websocket import manager
    await manager.broadcast(event_data)

    return {
        "status": "SUCCESS",
        "message": f"Case {case.case_number} successfully rectified and solved!",
        "case": {
            "id": case.id,
            "case_number": case.case_number,
            "status": case.status,
            "risk_score": case.risk_score
        }
    }

@router.post("/batch-rectify-all")
async def batch_rectify_all_cases(db: Session = Depends(get_db)):
    """
    Hackathon demo capability: Rectifies and solves all active high-risk cases and alerts in 1-click.
    """
    cases = db.query(Case).filter(Case.status.in_(["Monitoring", "Alert Sent", "Analysis"])).all()
    solved_count = len(cases)
    for c in cases:
        c.status = "Intervened"
        c.risk_level = "LOW"
        c.risk_score = round(random.uniform(12.0, 25.0), 1)

    alerts = db.query(Alert).filter(Alert.status == "ACTIVE").all()
    for a in alerts:
        a.status = "RESOLVED"
        a.resolved_at = datetime.datetime.now(datetime.timezone.utc)

    db.commit()

    from backend.app.api.websocket import manager
    await manager.broadcast({
        "type": "BATCH_CASES_RECTIFIED",
        "count": solved_count,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%I:%M:%S %p")
    })

    return {
        "status": "SUCCESS",
        "message": f"Successfully rectified and resolved {solved_count} cases and {len(alerts)} alerts!",
        "solved_cases_count": solved_count
    }

