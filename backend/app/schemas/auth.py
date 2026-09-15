from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    study_goal: Optional[str] = None
    daily_study_hours: Optional[float] = None
    preferred_language: Optional[str] = None

class ProfileOut(BaseModel):
    id: int
    name: str
    email: str
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    study_goal: Optional[str] = None
    daily_study_hours: Optional[float] = 2.0
    preferred_language: Optional[str] = "Hinglish"
    created_at: datetime

    class Config:
        from_attributes = True
