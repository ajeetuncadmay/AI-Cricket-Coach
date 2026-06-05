from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import get_current_user
from app.models import User, Session as DBSession, Report
from app.schemas import ReportResponse
import os

router = APIRouter(tags=["Reports"])

@router.get("/report/{session_id}", response_model=ReportResponse)
def get_report(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get report details for a specific session.
    """
    session = db.query(DBSession).filter(DBSession.id == session_id, DBSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    report = db.query(Report).filter(Report.session_id == session_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not generated yet")
        
    return report

@router.get("/report/{session_id}/download")
def download_report_pdf(session_id: int, db: Session = Depends(get_db)):
    """
    Download the generated PDF report.
    """
    session = db.query(DBSession).filter(DBSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    report = db.query(Report).filter(Report.session_id == session_id).first()
    if not report or not report.pdf_path or not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF Report not found")
        
    return FileResponse(
        path=report.pdf_path, 
        filename=f"Cricket_Coach_Report_{session_id}.pdf",
        media_type="application/pdf"
    )

@router.get("/report/{session_id}/image")
def get_annotated_image(session_id: int, db: Session = Depends(get_db)):
    """
    Get the annotated frame image for a session.
    """
    session = db.query(DBSession).filter(DBSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    image_path = f"uploads/reports/image_{session_id}.jpg"
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
        
    return FileResponse(image_path, media_type="image/jpeg")

@router.get("/report/{session_id}/video")
def get_annotated_video(session_id: int, db: Session = Depends(get_db)):
    """
    Get the annotated breakdown video for a session.
    """
    session = db.query(DBSession).filter(DBSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    video_path = f"uploads/videos/annotated_{session_id}.mp4"
    if not os.path.exists(video_path):
        # Fallback to original video if annotated not found
        if os.path.exists(session.video_path):
            return FileResponse(session.video_path, media_type="video/mp4")
        raise HTTPException(status_code=404, detail="Annotated video not found")
        
    return FileResponse(video_path, media_type="video/mp4")

@router.get("/session/{session_id}", response_model=SessionResponse)
def get_session_details(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get session details including the report for a specific session ID.
    """
    session = db.query(DBSession).filter(DBSession.id == session_id, DBSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
