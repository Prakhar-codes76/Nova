from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.task import TaskOut, TaskCreate, TaskUpdate, TaskReschedule
from app.services.task_service import TaskService
from app.services.priority_engine import calculate_priority_score
from app.utils.security import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskOut])
def get_tasks(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TaskService.get_user_tasks(db, user_id=current_user.id, status=status)

@router.post("", response_model=TaskOut)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TaskService.create_task(db, task_in, user_id=current_user.id)

@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = TaskService.get_task_by_id(db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = TaskService.update_task(db, task_id=task_id, task_data=task_in, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}/complete", response_model=TaskOut)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = TaskService.complete_task(db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}/reschedule", response_model=TaskOut)
def reschedule_task(
    task_id: int,
    reschedule_in: TaskReschedule,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = TaskService.reschedule_task(db, task_id=task_id, reschedule_data=reschedule_in, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = TaskService.delete_task(db, task_id=task_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True, "message": "Task deleted successfully"}

@router.get("/{task_id}/priority-explanation")
def get_priority_explanation(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = TaskService.get_task_by_id(db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    res = calculate_priority_score(task.due_date, task.due_time, task.priority, task.status)
    return {
        "task_id": task.id,
        "title": task.title,
        "calculated_priority": res["priority"],
        "score": res["score"],
        "explanation": res["explanation"]
    }
