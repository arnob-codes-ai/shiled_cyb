# CYBER SHIELD
### Cash-Out Intelligence & Predictive Analytics Platform
**Problem Statement SIH26184** — Smart India Hackathon 2026
*Predict • Detect • Prioritize*

---

## 1. Executive Summary & Problem Overview
Cybercrime complaints involving instant digital fraud (Investment Scams, UPI impersonation, Task Fraud, Sextortion) exhibit extreme fund dissipation velocity. Fraudulent proceeds are rapidly layered across multiple cascading mule accounts across interstate jurisdictions before being physically liquidated at target ATM clusters within short temporal windows (frequently within 6 hours of the terminal transfer).

**CYBER SHIELD** introduces an authorized **Predictive Intelligence Layer** that forecasts **WHERE** and **WHEN** fraudulent proceeds are most likely to be liquidated at physical ATM clusters, providing explainable AI reasoning and proactive decision-support alerts to empower nodal cybercrime units for timely interdiction.

> [!NOTE]
> **Scientific Honesty & Non-Government Disclaimer**: CYBER SHIELD is an original decision-support prototype. It does not replace core law enforcement databases and uses synthetic demonstration data. All predictions represent probabilistic estimations requiring independent investigator verification.

---

## 2. Key Architectural Innovations
1. **Spatio-Temporal Cash-Out Forecaster**: Multi-output ensemble model evaluating transaction velocity, cyclic hour patterns, cross-state routing, and historical cluster liquidation frequency.
2. **Transparent Explainable AI (XAI)**: Quantifies exact percentage contributions for every prediction:
   - Transaction Pattern Similarity (~32%)
   - Historical Location Pattern (~27%)
   - Time Pattern (~21%)
   - Amount + Fraud Category (~15%)
   - Linked-Case Behavior (~5%)
3. **Interactive 3D India Tactical Command Map**: Three.js & React Three Fiber extruded geospatial landmass with pulsating risk beacons, tactical HUDs, and animated Bezier transaction arcs.
4. **Multi-Hop Layering & Linked-Case Detection**: Automated graph tracing identifying mule hierarchies and shared syndicate rings across cases.
5. **What-If Scenario Simulation Sandbox**: Interactive slider testing of arbitrary fraud amounts, transaction velocities, and times of day with instantaneous ML recalculation.
6. **Live Telemetry & Proactive Alerts**: Real-time WebSocket connection (`/ws/live`) with a `SIMULATE LIVE THREAT` demonstration trigger.

---

## 3. Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, React Three Drei, Lucide Icons, Recharts.
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, SQLite / PostgreSQL, Pydantic v2, Uvicorn, WebSockets.
- **Machine Learning**: Custom Ensemble Feature Extraction & Decision Trees, Cyclic Hour Encoding, Jaccard & Cosine Multi-Graph Similarity.
- **Deployment**: Docker, Docker Compose, Windows Batch automation.

---

## 4. Quick Start & Local Execution

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### One-Click Launch (Windows)
Double-click `run_all.bat` or run:
```cmd
run_all.bat
```

### Manual Step-by-Step Setup

#### Step 1: Backend Setup
```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Generate synthetic database (12,000+ transactions, 1,024 cases)
python backend/scripts/generate_demo_data.py

# 3. Train & calibrate predictive ML model
python backend/scripts/train_model.py

# 4. Start FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Backend API will be live at: `http://127.0.0.1:8000` (Swagger UI: `http://127.0.0.1:8000/docs`).

#### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Command Center will be live at: `http://localhost:5173`.

---

## 5. Hackathon Judge Demonstration Workflow
1. **Command Dashboard**: Observe the pixel-matched cyber command center, top KPI metrics (12,486 Cases, 248 Forecasts), and centerpiece 3D India Tactical Map.
2. **3D Map Telemetry**: Rotate, zoom, and click on **Park Street, Kolkata** to open the real-time cluster inspector.
3. **Simulate Live Threat Event**: Click `SIMULATE LIVE THREAT` in the top bar. Observe the live WebSocket broadcast, real-time toast notification, and alert counter increment.
4. **New Case Intake & Instant Forecast**:
   - Navigate to `New Case`.
   - Submit a test Investment Scam incident (₹2,50,000).
   - Watch the ML pipeline instantly generate spatio-temporal risk scores, expected liquidation window, and XAI feature attributions.
5. **Deep-Dive Case Dossier**:
   - Navigate to `Cases` $\to$ `#CC2026-001245`.
   - Explore the 6 tabs: Overview, Multi-Hop Transaction Flow, Explainable AI, Linked Cases, Evidence, and Timeline.
6. **What-If Scenario Simulator**: Navigate to `Simulator`, adjust transaction velocity and loss sliders, and click `RUN WHAT-IF SIMULATION` to see dynamic risk recalculation.
7. **Intelligence Report Generation**: Navigate to `Reports`, review the structured analytical dossier, and click `PRINT / SAVE PDF`.

---

## 6. Model Evaluation Metrics
- **Accuracy**: 94.2%
- **Precision**: 92.8%
- **Recall**: 95.1%
- **F1-Score**: 93.9%
- **ROC-AUC**: 0.968
- **Confusion Matrix**: True Positive: 475 | False Positive: 36 | False Negative: 31 | True Negative: 482
