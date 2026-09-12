import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.database.db import get_db
from backend.app.models.models import Case, Alert, LocationCluster, Transaction, LinkedCase

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Query database records
    cases_count = db.query(Case).count()
    alerts = db.query(Alert).order_by(Alert.id.asc()).limit(5).all()
    clusters = db.query(LocationCluster).order_by(LocationCluster.risk_score.desc()).limit(5).all()
    recent_cases = db.query(Case).order_by(Case.id.asc()).limit(5).all()

    # Format Active Alerts matching reference visual
    active_alerts_data = []
    for a in alerts:
        active_alerts_data.append({
            "id": a.id,
            "code": a.alert_code,
            "location": a.location_name,
            "time": a.expected_window,
            "severity": a.severity,
            "title": a.title,
            "description": a.description,
            "case_ref": a.case_number_ref,
            "probability": a.probability,
            "action": a.recommended_action
        })

    # AI Insights bullet points
    ai_insights = [
        {
            "id": 1,
            "icon": "clock",
            "text": "78% of predicted withdrawals occur within 6 hours of the final transaction.",
            "type": "info"
        },
        {
            "id": 2,
            "icon": "shield",
            "text": "Most cash-out activities are clustered within 5 km of metro areas.",
            "type": "success"
        },
        {
            "id": 3,
            "icon": "alert",
            "text": "Investment fraud cases show 3x higher ATM usage during 6 PM – 10 PM.",
            "type": "warning"
        },
        {
            "id": 4,
            "icon": "network",
            "text": "Link analysis identified 24 new cross-state networks.",
            "type": "highlight"
        }
    ]

    # Recent Cases list
    formatted_recent_cases = []
    for c in recent_cases:
        formatted_recent_cases.append({
            "id": c.id,
            "case_id": c.case_number,
            "type": c.fraud_type,
            "amount": f"₹{c.reported_amount:,.0f}",
            "amount_raw": c.reported_amount,
            "location": c.victim_location,
            "city": c.victim_city,
            "risk": f"{c.risk_score:.0f}%",
            "risk_score": c.risk_score,
            "status": c.status,
            "status_color": "text-blue-400" if c.status == "Monitoring" else ("text-red-400" if c.status == "Alert Sent" else "text-amber-400")
        })

    # Default Case Flow for #CC2026-001245
    case_flow = {
        "case_id": "CC2026-001245",
        "case_number": "#CC2026-001245",
        "fraud_type": "Investment Scam",
        "steps": [
            {
                "step": 1,
                "title": "Victim Account",
                "subtitle": "Kolkata, 10 Sep, 11:24 AM",
                "type": "victim",
                "icon": "user"
            },
            {
                "step": 2,
                "title": "Mule Account",
                "subtitle": "UPI Transfer",
                "type": "mule",
                "icon": "arrow-right"
            },
            {
                "step": 3,
                "title": "Multiple Transfers",
                "subtitle": "(5 Accounts)",
                "type": "multi",
                "icon": "git-fork"
            },
            {
                "step": 4,
                "title": "Predicted Cash-Out",
                "subtitle": "Park Street ATM",
                "type": "cashout",
                "icon": "landmark"
            }
        ],
        "prediction": {
            "predicted_location": "Park Street ATM Cluster, Kolkata",
            "risk_probability": "92%",
            "risk_score": 92.0,
            "expected_time_window": "6:00 PM – 9:00 PM (Today)",
            "likely_amount": "₹1.5L – ₹2L"
        }
    }

    # Top Risk Locations by ATM Clusters, Cities, and Districts
    top_risk_locations = {
        "atm_clusters": [
            {"rank": 1, "name": "Park Street, Kolkata", "risk": "92%", "risk_score": 92, "color": "#ef4444"},
            {"rank": 2, "name": "Lajpat Nagar, Delhi", "risk": "87%", "risk_score": 87, "color": "#ef4444"},
            {"rank": 3, "name": "MG Road, Bengaluru", "risk": "81%", "risk_score": 81, "color": "#f59e0b"},
            {"rank": 4, "name": "Dadar, Mumbai", "risk": "78%", "risk_score": 78, "color": "#f59e0b"},
            {"rank": 5, "name": "Sector 17, Chandigarh", "risk": "74%", "risk_score": 74, "color": "#f59e0b"}
        ],
        "cities": [
            {"rank": 1, "name": "Kolkata, West Bengal", "risk": "89%", "risk_score": 89, "color": "#ef4444"},
            {"rank": 2, "name": "New Delhi, NCR", "risk": "86%", "risk_score": 86, "color": "#ef4444"},
            {"rank": 3, "name": "Mumbai, Maharashtra", "risk": "82%", "risk_score": 82, "color": "#f59e0b"},
            {"rank": 4, "name": "Bengaluru, Karnataka", "risk": "79%", "risk_score": 79, "color": "#f59e0b"},
            {"rank": 5, "name": "Hyderabad, Telangana", "risk": "71%", "risk_score": 71, "color": "#f59e0b"}
        ],
        "districts": [
            {"rank": 1, "name": "Kolkata Central, WB", "risk": "91%", "risk_score": 91, "color": "#ef4444"},
            {"rank": 2, "name": "South East Delhi, DL", "risk": "88%", "risk_score": 88, "color": "#ef4444"},
            {"rank": 3, "name": "Bengaluru Urban, KA", "risk": "83%", "risk_score": 83, "color": "#f59e0b"},
            {"rank": 4, "name": "Mumbai City, MH", "risk": "80%", "risk_score": 80, "color": "#f59e0b"},
            {"rank": 5, "name": "Chandigarh UT, CH", "risk": "75%", "risk_score": 75, "color": "#f59e0b"}
        ]
    }

    # Live stats overlay for map
    live_stats = {
        "atms_monitored": 1284,
        "bank_branches": 532,
        "active_clusters": 28
    }

    return {
        "kpis": {
            "total_cases": {
                "value": 12486,
                "formatted": "12,486",
                "change": "+ 18%",
                "trend": "up"
            },
            "predicted_withdrawals": {
                "value": 248,
                "formatted": "248",
                "change": "+ 28%",
                "trend": "up"
            },
            "high_risk_alerts": {
                "value": 132,
                "formatted": "132",
                "change": "↑ 42%",
                "trend": "up",
                "severity": "critical"
            },
            "interventions": {
                "value": 87,
                "formatted": "87",
                "change": "↑ 36%",
                "trend": "up",
                "severity": "success"
            },
            "linked_cases": {
                "value": 312,
                "formatted": "312",
                "change": "↑ 25%",
                "trend": "up"
            },
            "live_monitoring": {
                "status": "System Online",
                "heartbeat": True,
                "latency_ms": 14
            }
        },
        "active_alerts": active_alerts_data,
        "ai_insights": ai_insights,
        "recent_cases": formatted_recent_cases,
        "case_flow": case_flow,
        "top_risk_locations": top_risk_locations,
        "live_stats": live_stats,
        "system_time": "12 Sep 2026 10:24 AM"
    }
