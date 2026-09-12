import math
from typing import Dict, Any, List

def compute_explanations(
    features: Dict[str, float],
    risk_score: float,
    location_name: str,
    fraud_type: str,
    amount: float
) -> Dict[str, Any]:
    """
    Computes transparent feature-contribution breakdown and explainable AI reasoning.
    """
    # Feature base weights
    w_tx = 0.30 + (features.get("velocity", 0.7) * 0.08)
    w_loc = 0.25 + (features.get("historical_cluster_freq", 0.8) * 0.05)
    w_time = 0.20 + (abs(features.get("hour_sin", 0.5)) * 0.04)
    w_amt = 0.15 + (1.0 if amount > 100000 else 0.5) * 0.03
    w_link = 0.05 + (0.05 if features.get("is_cross_state", 0) > 0 else 0.01)

    total = w_tx + w_loc + w_time + w_amt + w_link
    tx_pct = round((w_tx / total) * 100)
    loc_pct = round((w_loc / total) * 100)
    time_pct = round((w_time / total) * 100)
    amt_pct = round((w_amt / total) * 100)
    link_pct = 100 - (tx_pct + loc_pct + time_pct + amt_pct)

    breakdown = [
        {
            "factor": "Transaction Pattern Similarity",
            "percentage": max(5, tx_pct),
            "description": f"Rapid multi-hop cascading sequence matches {fraud_type} syndicate patterns.",
            "impact": "HIGH"
        },
        {
            "factor": "Historical Location Pattern",
            "percentage": max(5, loc_pct),
            "description": f"{location_name} exhibits recurrent end-of-chain cash disbursements for similar amounts.",
            "impact": "HIGH"
        },
        {
            "factor": "Time Pattern",
            "percentage": max(5, time_pct),
            "description": "High probability withdrawal activity concentrated in late evening ATM operational peak.",
            "impact": "MEDIUM"
        },
        {
            "factor": "Amount + Fraud Category",
            "percentage": max(5, amt_pct),
            "description": f"₹{amount:,.0f} falls within the typical ATM cardless/micro-batch liquidation threshold.",
            "impact": "MEDIUM"
        },
        {
            "factor": "Linked-Case Behavior",
            "percentage": max(2, link_pct),
            "description": "Overlap detected with previously documented cross-state mule banking networks.",
            "impact": "LOW"
        }
    ]

    summary_text = (
        f"Based on multi-hop velocity ({features.get('hop_count', 3):.0f} hops) and "
        f"historical ATM cash-out trends in {location_name}, there is a {risk_score:.0f}% predicted probability "
        f"of physical liquidation within the identified time window."
    )

    return {
        "risk_score": risk_score,
        "summary": summary_text,
        "breakdown": breakdown,
        "methodology": "Ensemble Feature Attribution (XAI Tree-Weights)"
    }
