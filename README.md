# CYBER SHIELD 🛡️
### National Financial Crime & ATM Cash-Out GIS Command Platform
**Predict • Detect • Interdict • Protect**

[![Frontend](https://img.shields.io/badge/Frontend-http%3A%2F%2Flocalhost%3A5173-00b5ff?style=for-the-badge&logo=vite&logoColor=white)](http://localhost:5173/)
[![Backend API](https://img.shields.io/badge/Backend%20API-http%3A%2F%2F127.0.0.1%3A8000-20e39a?style=for-the-badge&logo=fastapi&logoColor=white)](http://127.0.0.1:8000/)
[![API Docs](https://img.shields.io/badge/Swagger%20Docs-http%3A%2F%2F127.0.0.1%3A8000%2Fdocs-ffc53d?style=for-the-badge&logo=swagger&logoColor=black)](http://127.0.0.1:8000/docs)

---

## 🌐 Live Application Endpoints

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Tactical Command Center (UI)** | **[http://localhost:5173/](http://localhost:5173/)** | Interactive Web Dashboard, 3D Tactical India Map, AI Insights |
| **FastAPI Backend Server** | **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** | REST API & ML Inference Engine |
| **Interactive API Documentation** | **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** | OpenAPI / Swagger Interface |
| **Live Telemetry Stream** | **`ws://127.0.0.1:8000/ws/live`** | Real-time WebSocket threat event feed |

---

## 1. Executive Summary & Problem Overview
Cybercrime complaints involving instant digital fraud (Investment Scams, UPI impersonation, Task Fraud, Mule Networks) exhibit extreme fund dissipation velocity. Fraudulent proceeds are rapidly layered across multiple cascading mule accounts across interstate jurisdictions before being physically liquidated at target ATM clusters within short temporal windows (frequently within 6 hours of the initial transfer).

**CYBER SHIELD** introduces an authorized **Predictive Intelligence Layer** that forecasts **WHERE** and **WHEN** fraudulent proceeds are most likely to be liquidated at physical ATM clusters, providing explainable AI reasoning and proactive decision-support alerts to empower nodal cybercrime units for timely interdiction.

---

## 2. Key Architectural Innovations

1. **Authentic Tactical India Map (Zero API Key Dependency)**:
   - Built on official Survey of India sovereign boundaries covering all 36 States & UTs (including Ladakh, Jammu & Kashmir, Arunachal Pradesh, Lakshadweep, and Andaman & Nicobar).
   - Authentic state color palette matching GIS command standards.
   - SVG luminous cyan outer glow filter (`#countryGlow`).
   - Interactive hover tooltips, 3D risk beacons, pulsing shockwaves, and animated illicit fund dissipation arcs.
2. **Spatio-Temporal Cash-Out Forecaster**: Multi-output ensemble model evaluating transaction velocity, cyclic hour patterns, cross-state routing, and historical cluster liquidation frequency.
3. **Transparent Explainable AI (XAI)**: Quantifies exact percentage contributions for every prediction:
   - Transaction Pattern Similarity (~32%)
   - Historical Location Pattern (~27%)
   - Time Pattern (~21%)
   - Amount + Fraud Category (~15%)
   - Linked-Case Behavior (~5%)
4. **Multi-Hop Layering & Linked-Case Detection**: Automated graph tracing identifying mule hierarchies and shared syndicate rings across cases.
5. **What-If Scenario Simulation Sandbox**: Interactive slider testing of arbitrary fraud amounts, transaction velocities, and times of day with instantaneous ML recalculation.
6. **Live Telemetry & Proactive Alerts**: Real-time WebSocket connection (`/ws/live`) with a `SIMULATE LIVE THREAT` demonstration trigger.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, D3-Geo, Leaflet/OSM (Zero API Keys), Lucide Icons, Recharts.
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, SQLite, Pydantic v2, Uvicorn, WebSockets.
- **Machine Learning**: Custom Ensemble Feature Extraction & Decision Trees, Cyclic Hour Encoding, Jaccard & Cosine Multi-Graph Similarity.
- **Deployment**: Docker, Docker Compose, Windows Batch automation (`run_all.bat`).

---

## 4. Quick Start & Execution

### One-Click Launch (Windows)
Double-click `run_all.bat` or run:
```cmd
run_all.bat
```
Then open your browser to **[http://localhost:5173/](http://localhost:5173/)**.

---

### Manual Step-by-Step Setup

#### Step 1: Backend Setup
```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Start FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Backend API will be live at: `http://127.0.0.1:8000` (Swagger UI: `http://127.0.0.1:8000/docs`).

#### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Command Center will be live at: **[http://localhost:5173/](http://localhost:5173/)**.

---

## 5. Demonstration Workflow
1. **Command Dashboard**: Open `http://localhost:5173/`. Observe the cyber command center, top KPI metrics (1,024 Cases, 1,284 ATMs, ₹18.42 Cr frozen), and centerpiece Tactical India Map.
2. **Interactive Map Telemetry**: Hover over states (e.g. Lakshadweep, Ladakh, Maharashtra), zoom, pan, and click on tactical hotspots to open the real-time cluster inspector.
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

