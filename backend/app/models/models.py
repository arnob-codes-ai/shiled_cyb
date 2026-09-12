import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(128), nullable=False)
    role = Column(String(32), default="Investigator")  # Investigator, Analyst, Administrator
    badge_number = Column(String(32), default="AO-4492")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(32), unique=True, index=True, nullable=False)  # CC2026-001245
    title = Column(String(255), nullable=False)
    fraud_type = Column(String(64), nullable=False)  # Investment Scam, UPI Fraud, Trading Fraud, Job Fraud, Sextortion, Loan App Scam
    reported_amount = Column(Float, nullable=False)
    victim_name = Column(String(128), default="Anonymous")
    victim_location = Column(String(128), nullable=False)
    victim_city = Column(String(64), nullable=False)
    victim_state = Column(String(64), nullable=False)
    victim_account = Column(String(64), nullable=False)
    status = Column(String(32), default="Monitoring")  # Monitoring, Alert Sent, Analysis, Intervened, Closed
    risk_level = Column(String(16), default="HIGH")  # HIGH, MEDIUM, LOW
    risk_score = Column(Float, default=92.0)  # 0.0 to 100.0
    current_hop = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    transactions = relationship("Transaction", back_populates="case", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="case", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="case", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    txn_ref = Column(String(64), unique=True, index=True, nullable=False)
    sender_account = Column(String(64), nullable=False)
    sender_name = Column(String(128), default="Account Holder")
    receiver_account = Column(String(64), nullable=False)
    receiver_name = Column(String(128), default="Recipient")
    amount = Column(Float, nullable=False)
    channel = Column(String(32), default="UPI Transfer")  # UPI Transfer, IMPS, NEFT, RTGS, ATM Withdrawal
    hop_level = Column(Integer, default=1)  # 1: Victim->Mule1, 2: Mule1->Mule2, 3: Multiple Transfers, 4: Cash-Out
    is_mule = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.75)
    source_city = Column(String(64), default="Kolkata")
    target_city = Column(String(64), default="Kolkata")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="transactions")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(64), unique=True, index=True, nullable=False)
    bank_name = Column(String(64), nullable=False)
    branch = Column(String(64), default="Main Branch")
    ifsc = Column(String(32), default="SBIN0001234")
    holder_name = Column(String(128), default="Holder Name")
    risk_tier = Column(String(16), default="HIGH")  # HIGH, MEDIUM, LOW
    is_flagged_mule = Column(Boolean, default=False)
    total_inflow = Column(Float, default=0.0)
    total_outflow = Column(Float, default=0.0)
    hop_depth = Column(Integer, default=1)
    city = Column(String(64), default="Delhi")
    state = Column(String(64), default="Delhi")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LocationCluster(Base):
    __tablename__ = "location_clusters"

    id = Column(Integer, primary_key=True, index=True)
    cluster_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)  # "Park Street ATM Cluster"
    city = Column(String(64), nullable=False)  # "Kolkata"
    state = Column(String(64), nullable=False)  # "West Bengal"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk_score = Column(Float, default=92.0)
    risk_tier = Column(String(16), default="HIGH")
    historical_withdrawals = Column(Integer, default=320)
    expected_time_window = Column(String(64), default="6:00 PM - 9:00 PM (Today)")
    atm_count = Column(Integer, default=42)
    bank_branches = Column(Integer, default=18)
    active_threats = Column(Integer, default=14)

    predictions = relationship("Prediction", back_populates="cluster")
    alerts = relationship("Alert", back_populates="cluster")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    cluster_id = Column(Integer, ForeignKey("location_clusters.id"), nullable=False)
    risk_score = Column(Float, default=92.0)  # 92%
    confidence_score = Column(Float, default=0.92)
    expected_time_window = Column(String(64), default="6:00 PM - 9:00 PM (Today)")
    likely_amount_min = Column(Float, default=150000.0)
    likely_amount_max = Column(Float, default=200000.0)
    explanation_json = Column(Text, nullable=False)  # JSON string with feature contributions
    top_alternatives_json = Column(Text, nullable=False)  # JSON list of top 5 alternative locations
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="predictions")
    cluster = relationship("LocationCluster", back_populates="predictions")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=True)
    cluster_id = Column(Integer, ForeignKey("location_clusters.id"), nullable=True)
    alert_code = Column(String(32), unique=True, index=True, nullable=False)
    severity = Column(String(16), default="HIGH")  # HIGH, MEDIUM, LOW
    title = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    location_name = Column(String(128), nullable=False)  # "Park Street, Kolkata"
    expected_window = Column(String(64), default="10:22 AM")
    probability = Column(Float, default=92.0)
    status = Column(String(32), default="ACTIVE")  # ACTIVE, ACKNOWLEDGED, INVESTIGATING, RESOLVED
    recommended_action = Column(String(255), default="Prioritize authorized monitoring and ATM branch coordination.")
    case_number_ref = Column(String(32), default="#CC2026-001245")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="alerts")
    cluster = relationship("LocationCluster", back_populates="alerts")

class LinkedCase(Base):
    __tablename__ = "linked_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id_1 = Column(Integer, nullable=False, index=True)
    case_id_2 = Column(Integer, nullable=False, index=True)
    case_number_1 = Column(String(32), nullable=False)
    case_number_2 = Column(String(32), nullable=False)
    similarity_score = Column(Float, default=87.0)  # 87%
    similarity_factors_json = Column(Text, nullable=False)
    shared_mules = Column(Integer, default=2)
    modus_operandi = Column(String(128), default="Shared mule ring & UPI velocity")
    status = Column(String(32), default="Similarity Detected")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_badge = Column(String(32), default="AO-4492")
    action = Column(String(64), nullable=False)
    target = Column(String(128), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(64), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(64), default="CashOut-Ensemble-v2.6")
    version = Column(String(16), default="2.6.4")
    accuracy = Column(Float, default=0.942)
    precision = Column(Float, default=0.928)
    recall = Column(Float, default=0.951)
    f1_score = Column(Float, default=0.939)
    roc_auc = Column(Float, default=0.968)
    total_samples = Column(Integer, default=12486)
    trained_at = Column(DateTime, default=datetime.datetime.utcnow)
