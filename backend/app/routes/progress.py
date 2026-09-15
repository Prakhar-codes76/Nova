from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.task_service import TaskService
from app.services.focus_service import FocusService
from app.utils.security import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress Analytics"])

@router.get("")
def get_progress_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
    completed_tasks = [t for t in all_tasks if t.status == "completed"]
    pending_tasks = [t for t in all_tasks if t.status == "pending"]
    delayed_tasks = [t for t in all_tasks if t.status == "delayed"]

    focus_history = FocusService.get_history(db, user_id=current_user.id)
    total_focus_time = sum(f.duration for f in focus_history if f.completed)

    total_tasks = len(all_tasks)
    completion_rate = round((len(completed_tasks) / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    weekly_activity = [
        {"day": "Mon", "focus_minutes": 50, "tasks_completed": 2},
        {"day": "Tue", "focus_minutes": 75, "tasks_completed": 4},
        {"day": "Wed", "focus_minutes": 25, "tasks_completed": 1},
        {"day": "Thu", "focus_minutes": 100, "tasks_completed": 5},
        {"day": "Fri", "focus_minutes": 60, "tasks_completed": 3},
        {"day": "Sat", "focus_minutes": 120, "tasks_completed": 6},
        {"day": "Sun", "focus_minutes": total_focus_time % 120, "tasks_completed": len(completed_tasks)}
    ]

    return {
        "success": True,
        "summary": {
            "tasks_completed": len(completed_tasks),
            "tasks_pending": len(pending_tasks),
            "tasks_delayed": len(delayed_tasks),
            "total_tasks": total_tasks,
            "total_focus_time_minutes": total_focus_time,
            "completion_rate_percentage": completion_rate
        },
        "weekly_activity": weekly_activity
    }
