from datetime import datetime
from sqlalchemy.orm import Session
from app.models.focus import FocusSession
from app.schemas.focus import FocusStart

class FocusService:
    @staticmethod
    def start_session(db: Session, data: FocusStart, user_id: int = 1):
        session = FocusSession(
            user_id=user_id,
            duration=data.duration,
            completed=True,
            started_at=datetime.utcnow()
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_history(db: Session, user_id: int = 1):
        return db.query(FocusSession).filter(FocusSession.user_id == user_id).order_by(FocusSession.started_at.desc()).all()
