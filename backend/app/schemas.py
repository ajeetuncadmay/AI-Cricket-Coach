from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Report Schemas ---
class ReportResponse(BaseModel):
    id: int
    score: float
    grade: str
    elbow_angle: float
    shoulder_rotation: float
    knee_bend: float
    tips: str
    recommendations: Optional[str]
    pdf_path: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Session Schemas ---
class SessionResponse(BaseModel):
    id: int
    video_path: str
    status: str
    created_at: datetime
    report: Optional[ReportResponse] = None
    
    class Config:
        from_attributes = True

# --- Additional Data Schemas ---
class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    role: Optional[str] = None
    experience: Optional[str] = None

class FeedbackCreate(BaseModel):
    rating: int
    comments: Optional[str] = None
