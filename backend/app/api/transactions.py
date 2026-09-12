from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.db import get_db
from backend.app.models.models import Transaction
from backend.app.schemas.schemas import TransactionResponse

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    case_id: Optional[int] = None,
    channel: Optional[str] = None,
    is_mule: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction)
    if case_id:
        query = query.filter(Transaction.case_id == case_id)
    if channel and channel != "ALL":
        query = query.filter(Transaction.channel.ilike(f"%{channel}%"))
    if is_mule is not None:
        query = query.filter(Transaction.is_mule == is_mule)

    return query.order_by(Transaction.id.asc()).offset(skip).limit(limit).all()
