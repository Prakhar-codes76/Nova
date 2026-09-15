from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.timetable import TimetableOut, TimetableCreate
from app.services.timetable_service import TimetableService
from app.utils.security import get_current_user

router = APIRouter(prefix="/timetable", tags=["Timetable"])

@router.get("", response_model=List[TimetableOut])
def get_timetable(
    day: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TimetableService.get_user_schedule(db, user_id=current_user.id, day=day)

@router.post("", response_model=TimetableOut)
def add_timetable_entry(
    entry_in: TimetableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TimetableService.add_entry(db, entry_in, user_id=current_user.id)

@router.delete("/{entry_id}")
def delete_timetable_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = TimetableService.delete_entry(db, entry_id=entry_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    return {"success": True, "message": "Schedule entry deleted"}

@router.get("/next-activity")
def get_next_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = TimetableService.get_next_activity(db, user_id=current_user.id)
    return {"success": True, "next_activity": activity}
