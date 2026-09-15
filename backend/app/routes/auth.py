from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
import logging

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, ProfileOut
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    clean_email = (user_in.email or "").strip().lower()
    clean_name = (user_in.name or "").strip()

    if not clean_email or not clean_name or not user_in.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email, and password are required fields."
        )

    # Check if email already exists
    existing = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    try:
        db_user = User(
            name=clean_name,
            email=clean_email,
            hashed_password=hash_password(user_in.password),
            college="IIT Kanpur",
            course="B.Tech CSE",
            year="2nd Year",
            study_goal="Maintain 9.0+ GPA and master algorithms",
            daily_study_hours=3.0,
            preferred_language="Hinglish"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        token = create_access_token({"sub": db_user.id, "email": db_user.email})

        return TokenResponse(
            access_token=token,
            user_id=db_user.id,
            name=db_user.name,
            email=db_user.email
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration error: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    clean_email = (user_in.email or "").strip().lower()
    db_user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not db_user or not verify_password(user_in.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"sub": db_user.id, "email": db_user.email})

    return TokenResponse(
        access_token=token,
        user_id=db_user.id,
        name=db_user.name,
        email=db_user.email
    )

@router.get("/me", response_model=ProfileOut)
def get_auth_me(current_user: User = Depends(get_current_user)):
    return current_user
