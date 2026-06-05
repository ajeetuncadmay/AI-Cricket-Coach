import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import get_current_user
from app.models import User, Session as DBSession, Report
from app.schemas import SessionResponse, ReportResponse
from app.services.pose import process_video_for_angles, process_image_for_angles
from app.services.scoring import evaluate_technique
from app.services.pdf_gen import generate_pdf_report
from datetime import datetime

router = APIRouter(tags=["Video Processing"])

# Ensure uploads directories exist
os.makedirs("uploads/videos", exist_ok=True)
os.makedirs("uploads/reports", exist_ok=True)

@router.post("/upload", response_model=SessionResponse)
async def upload_video(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Accepts MP4, saves file, processes via MediaPipe, calculates score, generates PDF report.
    """
    if not file.filename.lower().endswith((".mp4", ".webm", ".jpg", ".jpeg", ".png")):
        raise HTTPException(status_code=400, detail="Only MP4, WEBM, JPG, PNG supported.")
        
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{current_user.id}_{timestamp}_{file.filename}"
    video_path = os.path.join("uploads/videos", safe_filename)
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # DB Session start
    db_session = DBSession(user_id=current_user.id, video_path=video_path, status="processing")
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    try:
        # 1. Pose Analysis
        if file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
             angles = process_image_for_angles(video_path, db_session.id)
        else:
            # Video ke liye original AI processing
            angles = process_video_for_angles(video_path, db_session.id)
        
        # 2. Score Calculation
        score_data = evaluate_technique(angles)
        
        # 3. Generating Report PDF
        pdf_filename = f"report_{db_session.id}.pdf"
        pdf_path = os.path.join("uploads/reports", pdf_filename)
        generate_pdf_report(current_user.name or "Player", score_data, angles, pdf_path, angles.get("annotated_image_path"))
        
        # 4. Save Report to DB
        report = Report(
            session_id=db_session.id,
            score=score_data["score"],
            grade=score_data["grade"],
            elbow_angle=angles["elbow_angle"],
            shoulder_rotation=angles["shoulder_rotation"],
            knee_bend=angles["knee_bend"],
            tips=score_data["tips"],
            recommendations=score_data["recommendations"],
            pdf_path=pdf_path
        )
        db.add(report)
        
        # 5. Update Session status
        db_session.status = "completed"
        db.commit()
        db.refresh(db_session)
        
        return db_session
        
    except Exception as e:
        db_session.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")

@router.get("/sessions", response_model=list[SessionResponse])
def get_user_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all processing and completed sessions for the logged-in user.
    """
    sessions = db.query(DBSession).filter(DBSession.user_id == current_user.id).order_by(DBSession.created_at.desc()).all()
    return sessions
