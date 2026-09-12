from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from backend.app.database.db import get_db
from backend.app.models.models import Case, Transaction, Account, LocationCluster
from backend.app.schemas.schemas import NetworkGraphResponse

router = APIRouter(prefix="/api/network", tags=["Network Graph"])

@router.get("/{case_id}", response_model=NetworkGraphResponse)
def get_network_graph(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        case = db.query(Case).first()

    nodes = [
        {
            "id": "node-victim",
            "label": f"Victim: {case.victim_account}",
            "type": "victim",
            "risk_level": "LOW",
            "details": {
                "account": case.victim_account,
                "holder": case.victim_name,
                "city": case.victim_city,
                "amount": f"₹{case.reported_amount:,.0f}"
            }
        },
        {
            "id": "node-mule-1",
            "label": "Mule Tier-1 (UPI)",
            "type": "mule",
            "risk_level": "HIGH",
            "details": {
                "bank": "State Bank of India",
                "risk_tier": "HIGH",
                "velocity": "4 tx / 15m",
                "kyc": "Flagged Incomplete"
            }
        },
        {
            "id": "node-mule-2",
            "label": "Mule Tier-2 (IMPS Layer)",
            "type": "mule",
            "risk_level": "HIGH",
            "details": {
                "bank": "HDFC Bank",
                "risk_tier": "HIGH",
                "velocity": "6 tx / 30m",
                "kyc": "Suspected Synthetic ID"
            }
        },
        {
            "id": "node-split-1",
            "label": "Layered Mule #1",
            "type": "mule",
            "risk_level": "MEDIUM",
            "details": {"amount": "₹40,000", "bank": "ICICI Bank"}
        },
        {
            "id": "node-split-2",
            "label": "Layered Mule #2",
            "type": "mule",
            "risk_level": "MEDIUM",
            "details": {"amount": "₹45,000", "bank": "Axis Bank"}
        },
        {
            "id": "node-split-3",
            "label": "Layered Mule #3",
            "type": "mule",
            "risk_level": "MEDIUM",
            "details": {"amount": "₹50,000", "bank": "PNB"}
        },
        {
            "id": "node-atm-target",
            "label": "Park Street ATM Cluster (Kolkata)",
            "type": "atm",
            "risk_level": "HIGH",
            "details": {
                "cluster": "CC-WB-KOL-01",
                "risk_score": "92%",
                "expected_window": "6:00 PM – 9:00 PM",
                "active_surveillance": "Requested"
            }
        },
        {
            "id": "node-linked-case-1",
            "label": "Case #CC2026-001238",
            "type": "case",
            "risk_level": "HIGH",
            "details": {"fraud_type": "UPI Fraud", "similarity": "87%"}
        },
        {
            "id": "node-linked-case-2",
            "label": "Case #CC2026-001201",
            "type": "case",
            "risk_level": "MEDIUM",
            "details": {"fraud_type": "Trading Fraud", "similarity": "81%"}
        }
    ]

    edges = [
        {"id": "e1", "source": "node-victim", "target": "node-mule-1", "label": f"₹{case.reported_amount:,.0f} (UPI)", "amount": case.reported_amount, "channel": "UPI Transfer", "is_threat": True},
        {"id": "e2", "source": "node-mule-1", "target": "node-mule-2", "label": "₹1,90,000 (IMPS)", "amount": 190000.0, "channel": "IMPS", "is_threat": True},
        {"id": "e3", "source": "node-mule-2", "target": "node-split-1", "label": "₹40,000 (Split)", "amount": 40000.0, "channel": "UPI Batch", "is_threat": True},
        {"id": "e4", "source": "node-mule-2", "target": "node-split-2", "label": "₹45,000 (Split)", "amount": 45000.0, "channel": "UPI Batch", "is_threat": True},
        {"id": "e5", "source": "node-mule-2", "target": "node-split-3", "label": "₹50,000 (Split)", "amount": 50000.0, "channel": "UPI Batch", "is_threat": True},
        {"id": "e6", "source": "node-split-1", "target": "node-atm-target", "label": "Predicted ATM Cash-Out", "amount": 40000.0, "channel": "ATM", "is_threat": True},
        {"id": "e7", "source": "node-split-2", "target": "node-atm-target", "label": "Predicted ATM Cash-Out", "amount": 45000.0, "channel": "ATM", "is_threat": True},
        {"id": "e8", "source": "node-split-3", "target": "node-atm-target", "label": "Predicted ATM Cash-Out", "amount": 50000.0, "channel": "ATM", "is_threat": True},
        {"id": "e9", "source": "node-mule-1", "target": "node-linked-case-1", "label": "Shared Mule Ring (87%)", "is_threat": False},
        {"id": "e10", "source": "node-mule-2", "target": "node-linked-case-2", "label": "Pattern Overlap (81%)", "is_threat": False}
    ]

    return {"nodes": nodes, "edges": edges}
