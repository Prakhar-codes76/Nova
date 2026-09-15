from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FocusStart(BaseModel):
    duration: int # Minutes
    user_id: Optional[int] = 1

class FocusSessionOut(BaseModel):
    id: int
    user_id: int
    duration: int
    started_at: datetime
    completed: bool

    class Config:
        from_attributes = True

class StudySessionCreate(BaseModel):
    subject: str
    topic: Optional[str] = None
    duration: int
    date: str
    user_id: Optional[int] = 1

class StudySessionOut(BaseModel):
    id: int
    user_id: int
    subject: str
    topic: Optional[str] = None
    duration: int
    date: str

    class Config:
        from_attributes = True
