from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.ai import AIChatRequest, AIChatResponse, StudyPlanRequest, StudyPlanResponse
from app.ai.gemini_service import AIService
from app.services.study_planner_service import StudyPlannerService
from app.utils.security import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Integration"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat_endpoint(
    request: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = AIService.process_chat(request.message, db=db, user_id=current_user.id)
    return AIChatResponse(**result)

@router.post("/study-plan", response_model=StudyPlanResponse)
def generate_study_plan_endpoint(
    request: StudyPlanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request.user_id = current_user.id
    return StudyPlannerService.generate_plan(request, db=db)
