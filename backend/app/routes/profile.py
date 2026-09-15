from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import ProfileOut, ProfileUpdate
from app.utils.security import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("", response_model=ProfileOut)
def update_user_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_dict = profile_in.dict(exclude_unset=True)
    for field, value in update_dict.items():
        if value is not None:
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user
