from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.notification import Notification
from app.utils.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    action_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "study_reminder"
    action_type: Optional[str] = "start_focus"

@router.get("", response_model=List[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    # If user has no notifications yet, initialize seed reminders
    if not items:
        default_notes = [
            Notification(
                user_id=current_user.id,
                title="Upcoming Study Session 📚",
                message="Your Physics study session starts in 15 minutes.",
                type="study_reminder",
                action_type="start_focus"
            ),
            Notification(
                user_id=current_user.id,
                title="Welcome to Nova 🎉",
                message="Plan your day, set focus sessions, and master your student routine!",
                type="ai_assistant",
                action_type=None
            )
        ]
        db.add_all(default_notes)
        db.commit()
        for n in default_notes:
            db.refresh(n)
        return default_notes
        
    return items

@router.post("", response_model=NotificationOut)
def create_notification(
    note_in: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = Notification(
        user_id=current_user.id,
        title=note_in.title,
        message=note_in.message,
        type=note_in.type,
        action_type=note_in.action_type
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    note.is_read = True
    db.commit()
    db.refresh(note)
    return note

@router.patch("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"success": True, "message": "All notifications marked as read"}
