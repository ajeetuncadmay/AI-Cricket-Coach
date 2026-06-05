from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app.models import User, PlayerProfile, Feedback
from app.schemas import UserCreate, UserResponse, Token, UserLogin, ProfileUpdate, FeedbackCreate
from app.utils.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import settings

router = APIRouter(tags=["Authentication"])

@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/profile/details")
def update_profile_details(profile: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    if not db_profile:
        db_profile = PlayerProfile(user_id=current_user.id, **profile.model_dump())
        db.add(db_profile)
    else:
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(db_profile, key, value)
    db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/profile/details")
def get_profile_details(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    if not db_profile:
        return {"age": 24, "role": "Right Hand Batsman", "experience": "Pro"} # Fallback dummy
    return db_profile

@router.post("/feedback")
def submit_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_feedback = Feedback(user_id=current_user.id, **feedback.model_dump())
    db.add(db_feedback)
    db.commit()
    return {"message": "Feedback submitted globally"}

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Register a new user.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    """
    OAuth2 compatible token login, getting an access token for future requests.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
