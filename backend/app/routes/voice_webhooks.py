from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.services.task_service import TaskService
from app.services.timetable_service import TimetableService
from app.services.study_planner_service import StudyPlannerService
from app.services.focus_service import FocusService
from app.schemas.task import TaskCreate, TaskReschedule
from app.schemas.ai import StudyPlanRequest
from app.schemas.focus import FocusStart
from app.utils.security import get_current_user

router = APIRouter(prefix="/voice", tags=["ElevenLabs Voice Agent Webhooks"])

class VoiceAddTaskPayload(BaseModel):
    title: str
    subject: Optional[str] = "General"
    due_date: Optional[str] = None
    due_time: Optional[str] = "20:00"
    priority: Optional[str] = "medium"

class VoiceCompleteTaskPayload(BaseModel):
    title: Optional[str] = None
    task_id: Optional[int] = None

class VoiceRescheduleTaskPayload(BaseModel):
    title: Optional[str] = None
    task_id: Optional[int] = None
    due_date: str
    due_time: Optional[str] = "10:00"

class VoiceDeleteTaskPayload(BaseModel):
    title: Optional[str] = None
    task_id: Optional[int] = None

class VoiceStudyPlanPayload(BaseModel):
    subject: str
    exam_date: str
    topics: Optional[List[str]] = ["Core Concepts", "Practice", "Revision"]
    available_hours_per_day: Optional[float] = 2.0

class VoiceFocusStartPayload(BaseModel):
    duration: Optional[int] = 25

@router.post("/get-today-schedule")
def voice_get_today_schedule(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = datetime.now().strftime("%A")
    schedule = TimetableService.get_user_schedule(db, user_id=current_user.id, day=today)
    
    if not schedule:
        voice_text = "Today you have no scheduled classes! You are completely free to study."
    else:
        class_names = [f"{s.subject} at {s.start_time}" for s in schedule]
        voice_text = f"Today you have {len(schedule)} class(es): " + ", ".join(class_names) + "."

    return {
        "success": True,
        "voice_response": voice_text,
        "day": today,
        "schedule": [{"id": s.id, "subject": s.subject, "start": s.start_time, "end": s.end_time, "room": s.room} for s in schedule]
    }

@router.post("/get-pending-tasks")
def voice_get_pending_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = TaskService.get_user_tasks(db, user_id=current_user.id, status="pending")
    
    if not tasks:
        voice_text = "You have no pending tasks! Excellent performance."
    else:
        titles = [t.title for t in tasks[:3]]
        voice_text = f"You have {len(tasks)} pending task(s), including: " + ", ".join(titles) + "."

    return {
        "success": True,
        "voice_response": voice_text,
        "count": len(tasks),
        "tasks": [{"id": t.id, "title": t.title, "subject": t.subject, "priority": t.priority, "due_date": t.due_date} for t in tasks]
    }

@router.post("/add-task")
def voice_add_task(
    payload: VoiceAddTaskPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    date_val = payload.due_date or datetime.now().strftime("%Y-%m-%d")
    time_val = payload.due_time or "20:00"

    task = TaskService.create_task(
        db,
        TaskCreate(
            title=payload.title,
            subject=payload.subject or "General",
            due_date=date_val,
            due_time=time_val,
            priority=payload.priority or "medium"
        ),
        user_id=current_user.id
    )

    voice_text = f"Done! I added '{task.title}' for {task.due_date} at {task.due_time}."
    return {
        "success": True,
        "voice_response": voice_text,
        "task": {"id": task.id, "title": task.title, "due_date": task.due_date, "due_time": task.due_time}
    }

@router.post("/complete-task")
def voice_complete_task(
    payload: VoiceCompleteTaskPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task_id = payload.task_id
    if not task_id and payload.title:
        title_q = payload.title.lower()
        tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
        for t in tasks:
            if title_q in t.title.lower() or title_q in (t.subject or "").lower():
                task_id = t.id
                break

    if task_id:
        task = TaskService.complete_task(db, task_id=task_id, user_id=current_user.id)
        if task:
            voice_text = f"Great job! Marked '{task.title}' as completed."
            return {"success": True, "voice_response": voice_text, "task_id": task.id}

    return {"success": False, "voice_response": "I couldn't find that task to mark as complete."}

@router.post("/reschedule-task")
def voice_reschedule_task(
    payload: VoiceRescheduleTaskPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task_id = payload.task_id
    if not task_id and payload.title:
        title_q = payload.title.lower()
        tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
        for t in tasks:
            if title_q in t.title.lower():
                task_id = t.id
                break

    if task_id:
        task = TaskService.reschedule_task(
            db,
            task_id,
            TaskReschedule(due_date=payload.due_date, due_time=payload.due_time),
            user_id=current_user.id
        )
        if task:
            voice_text = f"Rescheduled '{task.title}' to {task.due_date} at {task.due_time}."
            return {"success": True, "voice_response": voice_text, "task": {"id": task.id, "due_date": task.due_date, "due_time": task.due_time}}

    return {"success": False, "voice_response": "I couldn't find that task to reschedule."}

@router.post("/delete-task")
def voice_delete_task(
    payload: VoiceDeleteTaskPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task_id = payload.task_id
    if not task_id and payload.title:
        title_q = payload.title.lower()
        tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
        for t in tasks:
            if title_q in t.title.lower():
                task_id = t.id
                break

    if task_id and TaskService.delete_task(db, task_id=task_id, user_id=current_user.id):
        return {"success": True, "voice_response": "Task removed successfully."}

    return {"success": False, "voice_response": "Unable to delete task."}

@router.post("/create-study-plan")
def voice_create_study_plan(
    payload: VoiceStudyPlanPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = StudyPlannerService.generate_plan(
        StudyPlanRequest(
            subject=payload.subject,
            exam_date=payload.exam_date,
            topics=payload.topics or ["Core Concepts", "Practice", "Revision"],
            available_hours_per_day=payload.available_hours_per_day or 2.0,
            user_id=current_user.id
        ),
        db=db
    )
    voice_text = f"Created a {plan.total_days}-day study plan for {plan.subject}. Your roadmap is updated on the dashboard."
    return {"success": True, "voice_response": voice_text, "plan": plan.dict()}

@router.post("/get-progress")
def voice_get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
    completed = [t for t in all_tasks if t.status == "completed"]
    focus = FocusService.get_history(db, user_id=current_user.id)
    total_focus_min = sum(f.duration for f in focus if f.completed)

    rate = round((len(completed) / max(1, len(all_tasks))) * 100, 1)
    voice_text = f"Your task completion rate is {rate} percent with {len(completed)} completed tasks and {total_focus_min} focus minutes."
    return {"success": True, "voice_response": voice_text, "completion_rate": rate, "completed_count": len(completed)}

@router.post("/start-focus-session")
def voice_start_focus_session(
    payload: VoiceFocusStartPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    duration = payload.duration or 25
    session = FocusService.start_session(db, FocusStart(duration=duration), user_id=current_user.id)
    voice_text = f"Started a {duration} minute Pomodoro focus session. Let's study!"
    return {"success": True, "voice_response": voice_text, "session_id": session.id}
