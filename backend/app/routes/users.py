from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from app.services.suggestion_service import NovaSuggestionService

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserOut)
def update_user_profile(profile_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_dict = profile_data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(user, field, val)
    
    db.commit()
    db.refresh(user)
    return user

@router.get("/me/suggestions")
def get_user_suggestions(db: Session = Depends(get_db)):
    return {
        "success": True,
        "suggestions": NovaSuggestionService.get_dashboard_suggestions(db, user_id=1)
    }
