import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginPayload(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(payload: LoginPayload):
    # Standard authentication for demonstration
    # Supports "officer", "analyst", "admin" or any test credentials
    username = payload.username.strip()
    role = "Investigator"
    full_name = "Cybercrime Officer"
    badge_number = "AO-4492"

    if "analyst" in username.lower():
        role = "Analyst"
        full_name = "Senior Intelligence Analyst"
        badge_number = "IA-8821"
    elif "admin" in username.lower():
        role = "Administrator"
        full_name = "System Administrator"
        badge_number = "SA-0001"

    token_data = {
        "access_token": f"cybershield_token_{username}_{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}",
        "token_type": "bearer",
        "user_info": {
            "id": 1,
            "username": username or "officer",
            "full_name": full_name,
            "role": role,
            "badge_number": badge_number,
            "initials": "AO" if role == "Investigator" else ("IA" if role == "Analyst" else "SA")
        }
    }
    return token_data

@router.get("/me")
def get_current_user():
    return {
        "id": 1,
        "username": "officer",
        "full_name": "Cybercrime Officer",
        "role": "Investigator",
        "badge_number": "AO-4492",
        "initials": "AO",
        "system_status": "Online",
        "clearance": "Operational Intel Level 3"
    }
