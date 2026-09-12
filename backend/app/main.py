import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database.db import engine, Base
from backend.app.api import (
    auth,
    dashboard,
    cases,
    prediction,
    locations,
    alerts,
    network,
    transactions,
    analytics,
    simulation,
    reports,
    model,
    websocket
)

# Auto-create database schema on application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CYBER SHIELD: Cash-Out Intelligence & Predictive Analytics Platform",
    description="Probabilistic Cash-Out Forecasting & Spatio-Temporal Intelligence Engine (SIH26184)",
    version="2.6.4"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(cases.router)
app.include_router(prediction.router)
app.include_router(locations.router)
app.include_router(alerts.router)
app.include_router(network.router)
app.include_router(transactions.router)
app.include_router(analytics.router)
app.include_router(simulation.router)
app.include_router(reports.router)
app.include_router(model.router)
app.include_router(websocket.router)

@app.get("/")
def root():
    return {
        "platform": "CYBER SHIELD",
        "subtitle": "Predict • Detect • Prioritize",
        "version": "2.6.4",
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "ml_engine": "READY",
        "telemetry_stream": "ACTIVE"
    }
