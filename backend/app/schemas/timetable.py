from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TimetableBase(BaseModel):
    subject: str
    day: str
    start_time: str
    end_time: str
    room: Optional[str] = None

class TimetableCreate(TimetableBase):
    user_id: Optional[int] = 1

class TimetableOut(TimetableBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
