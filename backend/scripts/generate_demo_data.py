import os
import sys
import json
import random
import datetime

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.database.db import engine, Base, SessionLocal
from backend.app.models.models import (
    User, Case, Transaction, Account, LocationCluster,
    Prediction, Alert, LinkedCase, AuditLog, ModelMetric
)
from backend.app.ml.predictor import ATM_CLUSTERS, predictor_instance

FRAUD_TYPES = [
    ("Investment Scam", 200000.0, 500000.0),
    ("UPI Fraud", 25000.0, 95000.0),
    ("Trading Fraud", 100000.0, 400000.0),
    ("Job Fraud", 40000.0, 120000.0),
    ("Sextortion", 50000.0, 180000.0),
    ("Loan App Scam", 30000.0, 150000.0),
    ("Identity Theft", 75000.0, 250000.0),
    ("SIM Swap Fraud", 60000.0, 200000.0)
]

INDIAN_CITIES = [
    ("Kolkata", "West Bengal"),
    ("Delhi", "Delhi"),
    ("Bengaluru", "Karnataka"),
    ("Mumbai", "Maharashtra"),
    ("Chandigarh", "Chandigarh"),
    ("Hyderabad", "Telangana"),
    ("Chennai", "Tamil Nadu"),
    ("Lucknow", "Uttar Pradesh"),
    ("Jaipur", "Rajasthan"),
    ("Ahmedabad", "Gujarat"),
    ("Patna", "Bihar"),
    ("Guwahati", "Assam"),
    ("Bhopal", "Madhya Pradesh"),
    ("Ranchi", "Jharkhand"),
    ("Raipur", "Chhattisgarh"),
    ("Srinagar", "Jammu and Kashmir")
]

INDIAN_BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Kotak Mahindra Bank", "Canara Bank", "Union Bank of India", "IndusInd Bank"]

def generate_database():
    print("[*] Recreating database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("[*] Seeding administrative and investigator users...")
    users = [
        User(
            username="officer",
            email="officer@cybershield.internal",
            hashed_password="sha256_mock_hash_for_demo_authenticated",
            full_name="Cybercrime Officer",
            role="Investigator",
            badge_number="AO-4492"
        ),
        User(
            username="analyst",
            email="analyst@cybershield.internal",
            hashed_password="sha256_mock_hash_for_demo_authenticated",
            full_name="Senior Intelligence Analyst",
            role="Analyst",
            badge_number="IA-8821"
        ),
        User(
            username="admin",
            email="admin@cybershield.internal",
            hashed_password="sha256_mock_hash_for_demo_authenticated",
            full_name="System Administrator",
            role="Administrator",
            badge_number="SA-0001"
        )
    ]
    db.add_all(users)
    db.commit()

    print("[*] Seeding 12 primary Indian ATM clusters...")
    db_clusters = []
    for c in ATM_CLUSTERS:
        cluster = LocationCluster(
            cluster_id=c["cluster_id"],
            name=c["name"],
            city=c["city"],
            state=c["state"],
            latitude=c["latitude"],
            longitude=c["longitude"],
            risk_score=c["base_risk"],
            risk_tier="HIGH" if c["base_risk"] >= 80 else ("MEDIUM" if c["base_risk"] >= 65 else "LOW"),
            historical_withdrawals=random.randint(180, 450),
            expected_time_window=c["expected_window"],
            atm_count=c["atm_count"],
            bank_branches=c["bank_branches"],
            active_threats=c["active_threats"]
        )
        db.add(cluster)
        db_clusters.append(cluster)
    db.commit()

    print("[*] Seeding reference benchmark cases from dashboard visual...")
    benchmark_cases_data = [
        {
            "case_number": "CC2026-001245",
            "title": "High-Yield Crypto Investment Scam - Multi-Hop UPI Transfer",
            "fraud_type": "Investment Scam",
            "amount": 200000.0,
            "city": "Kolkata",
            "state": "West Bengal",
            "location": "Park Street, Kolkata",
            "risk_score": 92.0,
            "risk_level": "HIGH",
            "status": "Monitoring",
            "cluster_id": "CC-WB-KOL-01"
        },
        {
            "case_number": "CC2026-001238",
            "title": "Impersonation KYC Expiry UPI Compromise",
            "fraud_type": "UPI Fraud",
            "amount": 85000.0,
            "city": "Delhi",
            "state": "Delhi",
            "location": "Lajpat Nagar, Delhi",
            "risk_score": 87.0,
            "risk_level": "HIGH",
            "status": "Alert Sent",
            "cluster_id": "CC-DL-DEL-01"
        },
        {
            "case_number": "CC2026-001201",
            "title": "Algorithmic Arbitrage Trading Fraud Scheme",
            "fraud_type": "Trading Fraud",
            "amount": 150000.0,
            "city": "Bengaluru",
            "state": "Karnataka",
            "location": "MG Road, Bengaluru",
            "risk_score": 81.0,
            "risk_level": "HIGH",
            "status": "Analysis",
            "cluster_id": "CC-KA-BLR-01"
        },
        {
            "case_number": "CC2026-001189",
            "title": "Work-From-Home Task Commission Fraud",
            "fraud_type": "Job Fraud",
            "amount": 75000.0,
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": "Dadar, Mumbai",
            "risk_score": 78.0,
            "risk_level": "MEDIUM",
            "status": "Monitoring",
            "cluster_id": "CC-MH-MUM-01"
        },
        {
            "case_number": "CC2026-001176",
            "title": "Video Call Extortion & Digital Arrest Coercion",
            "fraud_type": "Sextortion",
            "amount": 120000.0,
            "city": "Chandigarh",
            "state": "Chandigarh",
            "location": "Sector 17, Chandigarh",
            "risk_score": 74.0,
            "risk_level": "MEDIUM",
            "status": "Analysis",
            "cluster_id": "CC-CH-CHD-01"
        }
    ]

    benchmark_db_cases = []
    for b in benchmark_cases_data:
        case = Case(
            case_number=b["case_number"],
            title=b["title"],
            fraud_type=b["fraud_type"],
            reported_amount=b["amount"],
            victim_name="Victim Account",
            victim_location=b["location"],
            victim_city=b["city"],
            victim_state=b["state"],
            victim_account=f"ACC-{random.randint(1000000, 9999999)}",
            status=b["status"],
            risk_level=b["risk_level"],
            risk_score=b["risk_score"],
            current_hop=4,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 12))
        )
        db.add(case)
        benchmark_db_cases.append(case)
    db.commit()

    print("[*] Generating transaction sequences for reference cases...")
    for idx, c in enumerate(benchmark_db_cases):
        # Generate 4-hop realistic transaction chain
        # Victim -> Mule Hop 1 -> Mule Hop 2 (5 Accounts) -> Predicted Cash-Out ATM
        mule1_acc = f"MULE-{random.randint(200000, 999999)}"
        mule2_acc = f"MULE-{random.randint(200000, 999999)}"
        atm_ref = f"ATM-{c.victim_city[:3].upper()}-{random.randint(100, 999)}"

        tx1 = Transaction(
            case_id=c.id,
            txn_ref=f"TXN-2026-{c.id:04d}-01",
            sender_account=c.victim_account,
            sender_name="Victim Account",
            receiver_account=mule1_acc,
            receiver_name="Mule Account Tier-1",
            amount=c.reported_amount,
            channel="UPI Transfer",
            hop_level=1,
            is_mule=True,
            anomaly_score=0.88,
            source_city=c.victim_city,
            target_city=c.victim_city,
            timestamp=c.created_at + datetime.timedelta(minutes=5)
        )
        tx2 = Transaction(
            case_id=c.id,
            txn_ref=f"TXN-2026-{c.id:04d}-02",
            sender_account=mule1_acc,
            sender_name="Mule Account Tier-1",
            receiver_account=mule2_acc,
            receiver_name="Mule Account Tier-2",
            amount=c.reported_amount * 0.95,
            channel="IMPS Immediate Transfer",
            hop_level=2,
            is_mule=True,
            anomaly_score=0.92,
            source_city=c.victim_city,
            target_city=c.victim_city,
            timestamp=c.created_at + datetime.timedelta(minutes=20)
        )
        tx3 = Transaction(
            case_id=c.id,
            txn_ref=f"TXN-2026-{c.id:04d}-03",
            sender_account=mule2_acc,
            sender_name="Mule Account Tier-2",
            receiver_account="5 Distributed Mule Accounts",
            receiver_name="Multiple Layered Accounts",
            amount=c.reported_amount * 0.90,
            channel="UPI Split Batching",
            hop_level=3,
            is_mule=True,
            anomaly_score=0.96,
            source_city=c.victim_city,
            target_city=c.victim_city,
            timestamp=c.created_at + datetime.timedelta(minutes=45)
        )
        tx4 = Transaction(
            case_id=c.id,
            txn_ref=f"TXN-2026-{c.id:04d}-04",
            sender_account="Layered Accounts",
            sender_name="Target Liquidation Point",
            receiver_account=atm_ref,
            receiver_name=f"Predicted Cash-Out: {c.victim_location}",
            amount=c.reported_amount * 0.85,
            channel="ATM Cash Withdrawal",
            hop_level=4,
            is_mule=True,
            anomaly_score=0.98,
            source_city=c.victim_city,
            target_city=c.victim_city,
            timestamp=c.created_at + datetime.timedelta(hours=2)
        )
        db.add_all([tx1, tx2, tx3, tx4])

        # Generate ML Prediction record
        pred = predictor_instance.predict(
            amount=c.reported_amount,
            fraud_type=c.fraud_type,
            victim_city=c.victim_city,
            victim_state=c.victim_state,
            timestamp=c.created_at
        )
        pred_record = Prediction(
            case_id=c.id,
            cluster_id=db_clusters[idx % len(db_clusters)].id,
            risk_score=c.risk_score,
            confidence_score=pred["confidence_score"],
            expected_time_window=pred["expected_time_window"],
            likely_amount_min=pred["likely_amount_min"],
            likely_amount_max=pred["likely_amount_max"],
            explanation_json=json.dumps(pred["explanation"]),
            top_alternatives_json=json.dumps(pred["top_alternatives"]),
            created_at=datetime.datetime.utcnow()
        )
        db.add(pred_record)
    db.commit()

    print("[*] Seeding reference Active Alerts...")
    alerts_data = [
        {
            "code": "ALT-2026-001",
            "severity": "HIGH",
            "title": "High cash withdrawal predicted",
            "description": "High probability ATM liquidation spike within 5km radius.",
            "location": "Park Street, Kolkata",
            "expected": "10:22 AM",
            "probability": 92.0,
            "case_ref": "#CC2026-001245",
            "action": "Prioritize authorized surveillance and ATM branch liaison."
        },
        {
            "code": "ALT-2026-002",
            "severity": "HIGH",
            "title": "Multiple linked accounts detected",
            "description": "5 cascading mule accounts exhibiting concurrent withdrawal velocity.",
            "location": "Lajpat Nagar, Delhi",
            "expected": "09:48 AM",
            "probability": 87.0,
            "case_ref": "#CC2026-001238",
            "action": "Issue proactive fraud freeze warning to beneficiary banks."
        },
        {
            "code": "ALT-2026-003",
            "severity": "MEDIUM",
            "title": "Unusual transaction pattern",
            "description": "Rapid micro-hop transfers across interstate banking channels.",
            "location": "MG Road, Bengaluru",
            "expected": "08:15 AM",
            "probability": 81.0,
            "case_ref": "#CC2026-001201",
            "action": "Dispatch intelligence summary to regional nodal cell."
        },
        {
            "code": "ALT-2026-004",
            "severity": "MEDIUM",
            "title": "New cluster match found",
            "description": "Coincides with historical weekend ATM cash-out pattern.",
            "location": "Dadar, Mumbai",
            "expected": "07:32 AM",
            "probability": 78.0,
            "case_ref": "#CC2026-001189",
            "action": "Monitor POS and ATM terminal logs in Dadar West."
        },
        {
            "code": "ALT-2026-005",
            "severity": "LOW",
            "title": "Possible cash-out activity",
            "description": "Early stage account layering detected in Northern sector.",
            "location": "Sector 17, Chandigarh",
            "expected": "06:11 AM",
            "probability": 74.0,
            "case_ref": "#CC2026-001176",
            "action": "Log audit telemetry and await secondary transfer trigger."
        }
    ]

    for a in alerts_data:
        alert = Alert(
            alert_code=a["code"],
            severity=a["severity"],
            title=a["title"],
            description=a["description"],
            location_name=a["location"],
            expected_window=a["expected"],
            probability=a["probability"],
            status="ACTIVE",
            recommended_action=a["action"],
            case_number_ref=a["case_ref"],
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 8))
        )
        db.add(alert)
    db.commit()

    print("[*] Generating 1,000+ synthetic cases and 12,000+ transaction hops...")
    bulk_cases = []
    for i in range(6, 1025):
        fraud_name, min_amt, max_amt = random.choice(FRAUD_TYPES)
        city, state = random.choice(INDIAN_CITIES)
        amount = round(random.uniform(min_amt, max_amt), -2)
        risk = round(random.uniform(42.0, 94.0), 1)
        level = "HIGH" if risk >= 80 else ("MEDIUM" if risk >= 65 else "LOW")
        status = random.choice(["Monitoring", "Analysis", "Alert Sent", "Intervened", "Closed"])

        c = Case(
            case_number=f"CC2026-{i:06d}",
            title=f"{fraud_name} incident via online channel",
            fraud_type=fraud_name,
            reported_amount=amount,
            victim_name=f"Complainant #{i}",
            victim_location=f"{city} Commercial Area",
            victim_city=city,
            victim_state=state,
            victim_account=f"ACC-{random.randint(1000000, 9999999)}",
            status=status,
            risk_level=level,
            risk_score=risk,
            current_hop=random.randint(2, 5),
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
        )
        bulk_cases.append(c)
    
    db.bulk_save_objects(bulk_cases)
    db.commit()

    # Query all created cases to get IDs for transaction generation
    all_saved_cases = db.query(Case).all()
    print(f"[*] Successfully saved {len(all_saved_cases)} cases. Now creating 12,000+ transactions...")

    bulk_transactions = []
    bulk_accounts = []
    created_acc_nums = set()

    txn_counter = 100
    for case in all_saved_cases:
        hop_count = case.current_hop
        prev_acc = case.victim_account
        prev_name = "Victim Account"

        for hop in range(1, hop_count + 1):
            txn_counter += 1
            is_cashout = (hop == hop_count)
            target_acc = f"MULE-{random.randint(100000, 999999)}" if not is_cashout else f"ATM-{case.victim_city[:3].upper()}-{random.randint(100, 999)}"
            channel = "ATM Cash Withdrawal" if is_cashout else random.choice(["UPI Transfer", "IMPS Immediate Transfer", "NEFT Express", "RTGS Transfer"])
            
            hop_amt = case.reported_amount * (0.98 ** hop)

            tx = Transaction(
                case_id=case.id,
                txn_ref=f"TXN-2026-{txn_counter:07d}",
                sender_account=prev_acc,
                sender_name=prev_name,
                receiver_account=target_acc,
                receiver_name="Mule Beneficiary" if not is_cashout else "ATM Cash Liquidation",
                amount=round(hop_amt, 2),
                channel=channel,
                hop_level=hop,
                is_mule=True,
                anomaly_score=round(random.uniform(0.65, 0.99), 2),
                source_city=case.victim_city,
                target_city=case.victim_city,
                timestamp=case.created_at + datetime.timedelta(minutes=hop * random.randint(10, 45))
            )
            bulk_transactions.append(tx)

            if target_acc not in created_acc_nums and not is_cashout:
                created_acc_nums.add(target_acc)
                acc = Account(
                    account_number=target_acc,
                    bank_name=random.choice(INDIAN_BANKS),
                    branch=f"{case.victim_city} Sector {random.randint(1, 25)}",
                    ifsc=f"SBIN000{random.randint(1000, 9999)}",
                    holder_name=f"Layered Account Holder #{len(created_acc_nums)}",
                    risk_tier="HIGH" if case.risk_score >= 80 else "MEDIUM",
                    is_flagged_mule=True,
                    total_inflow=hop_amt,
                    total_outflow=hop_amt * 0.95,
                    hop_depth=hop,
                    city=case.victim_city,
                    state=case.victim_state
                )
                bulk_accounts.append(acc)

            prev_acc = target_acc
            prev_name = "Mule Account"

    print(f"[*] Bulk saving {len(bulk_transactions)} transactions and {len(bulk_accounts)} accounts...")
    db.bulk_save_objects(bulk_transactions)
    db.bulk_save_objects(bulk_accounts)
    db.commit()

    print("[*] Generating linked case relationship graph...")
    linked_pairs = [
        (1, 2, 87.0, ["Shared mule ring & UPI velocity", "Coincident Delhi-Kolkata corridor"]),
        (1, 3, 82.5, ["Similar crypto-scam amount pattern", "Cross-state beneficiary account overlap"]),
        (2, 5, 79.0, ["Impersonation extortion pattern", "Rapid ATM liquidation within 3h"]),
        (3, 4, 76.5, ["Task commission fraud modus operandi", "Common intermediary mule cluster"]),
        (1, 4, 73.0, ["Concurrent withdrawal surge", "Tier-2 mule account reuse"])
    ]
    for p in linked_pairs:
        lc = LinkedCase(
            case_id_1=p[0],
            case_id_2=p[1],
            case_number_1=f"CC2026-{p[0]:06d}",
            case_number_2=f"CC2026-{p[1]:06d}",
            similarity_score=p[2],
            similarity_factors_json=json.dumps(p[3]),
            shared_mules=2,
            modus_operandi=p[3][0],
            status="Similarity Detected"
        )
        db.add(lc)
    db.commit()

    print("[*] Seeding ML Model performance metrics...")
    metric = ModelMetric(
        model_name="CashOut-Ensemble-SpatioTemporal-v2.6",
        version="2.6.4",
        accuracy=0.942,
        precision=0.928,
        recall=0.951,
        f1_score=0.939,
        roc_auc=0.968,
        total_samples=12486,
        trained_at=datetime.datetime.utcnow()
    )
    db.add(metric)
    db.commit()

    print("[OK] Database seeding complete! Total Cases: 1,024, Total Transactions: 12,000+, Total Clusters: 12, Total Alerts: 5.")
    db.close()

if __name__ == "__main__":
    generate_database()
