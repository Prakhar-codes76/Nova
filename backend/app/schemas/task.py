from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject: Optional[str] = None
    priority: Optional[str] = "medium" # low, medium, high
    status: Optional[str] = "pending"  # pending, completed, delayed
    due_date: Optional[str] = None    # YYYY-MM-DD
    due_time: Optional[str] = None    # HH:MM

class TaskCreate(TaskBase):
    user_id: Optional[int] = 1

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    due_time: Optional[str] = None

class TaskReschedule(BaseModel):
    due_date: str
    due_time: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
