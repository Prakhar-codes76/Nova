from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.task import Task
from app.models.timetable import Timetable
from app.utils.security import get_current_user

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("")
def global_search(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query_str = f"%{q}%"
    
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        (Task.title.ilike(query_str)) |
        (Task.subject.ilike(query_str)) |
        (Task.description.ilike(query_str))
    ).all()

    schedules = db.query(Timetable).filter(
        Timetable.user_id == current_user.id,
        (Timetable.subject.ilike(query_str)) |
        (Timetable.room.ilike(query_str)) |
        (Timetable.day.ilike(query_str))
    ).all()

    return {
        "query": q,
        "results": {
            "tasks": [{"id": t.id, "title": t.title, "subject": t.subject, "status": t.status, "due_date": t.due_date} for t in tasks],
            "schedule": [{"id": s.id, "subject": s.subject, "day": s.day, "time": f"{s.start_time} - {s.end_time}", "room": s.room} for s in schedules]
        }
    }
