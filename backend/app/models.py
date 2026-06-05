from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("Session", back_populates="user")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    video_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="processing") # processing, completed, failed

    user = relationship("User", back_populates="sessions")
    report = relationship("Report", back_populates="session", uselist=False)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    score = Column(Float, nullable=False)
    grade = Column(String, nullable=False) # Excellent, Good, Average, Poor
    elbow_angle = Column(Float, nullable=False)
    shoulder_rotation = Column(Float, nullable=False)
    knee_bend = Column(Float, nullable=False)
    tips = Column(String, nullable=True) # AI Coaching Solutions
    recommendations = Column(String, nullable=True) # Key Recommendations (drills)
    pdf_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("Session", back_populates="report")

class PlayerProfile(Base):
    __tablename__ = "player_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer, nullable=True)
    role = Column(String, nullable=True) # Batsman / Bowler
    experience = Column(String, nullable=True) # Beginner, Pro etc
    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer, nullable=False) # 1 to 5
    comments = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
