from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.focus import FocusStart, FocusSessionOut
from app.services.focus_service import FocusService
from app.utils.security import get_current_user

router = APIRouter(prefix="/focus", tags=["Focus"])

@router.post("/start", response_model=FocusSessionOut)
def start_focus_session(
    data: FocusStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return FocusService.start_session(db, data, user_id=current_user.id)

@router.get("/history", response_model=List[FocusSessionOut])
def get_focus_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return FocusService.get_history(db, user_id=current_user.id)
