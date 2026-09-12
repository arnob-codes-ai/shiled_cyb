import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.db import get_db
from backend.app.models.models import Alert
from backend.app.schemas.schemas import AlertResponse, AlertUpdate

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if severity and severity != "ALL":
        query = query.filter(Alert.severity == severity)
    if status and status != "ALL":
        query = query.filter(Alert.status == status)
    
    return query.order_by(Alert.id.asc()).all()

@router.patch("/{id}")
def update_alert_status(id: int, payload: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = payload.status
    if payload.status == "ACKNOWLEDGED":
        alert.acknowledged_at = datetime.datetime.now(datetime.timezone.utc)
    elif payload.status == "RESOLVED":
        alert.resolved_at = datetime.datetime.now(datetime.timezone.utc)
        
    db.commit()
    return {"status": "SUCCESS", "alert_id": id, "new_status": payload.status}
