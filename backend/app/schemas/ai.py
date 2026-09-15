from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AIChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = 1

class AIChatResponse(BaseModel):
    success: bool
    response: str
    intent: Optional[str] = None
    action_performed: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class StudyPlanRequest(BaseModel):
    subject: str
    exam_date: str # YYYY-MM-DD
    topics: List[str]
    available_hours_per_day: float = 2.0
    difficulty: Optional[str] = "medium" # easy, medium, hard
    user_id: Optional[int] = 1

class DailyStudyBlock(BaseModel):
    day: int
    date: str
    topic: str
    duration_minutes: int
    session_type: str # Learning, Revision, Practice, Mock Test
    priority: str

class StudyPlanResponse(BaseModel):
    success: bool
    subject: str
    exam_date: str
    total_days: int
    recommended_daily_hours: float
    study_blocks: List[DailyStudyBlock]
    tips: List[str]
