from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
import os
from datetime import datetime

def generate_pdf_report(user_name: str, score_data: dict, angles: dict, output_path: str, annotated_image_path: str = None):
    """
    Generates a premium, highly detailed PDF report.
    """
    # Use landscape for a dashboard-like layout in PDF
    c = canvas.Canvas(output_path, pagesize=landscape(letter))
    width, height = landscape(letter)
    
    # Background (Dark theme to match UI)
    c.setFillColor(HexColor("#0f111a"))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # ---------------- HEADER ----------------
    # Header Banner Background
    c.setFillColor(HexColor("#020205")) 
    c.rect(0, height - 1.2 * inch, width, 1.2 * inch, fill=1, stroke=0)
    
    # Gradient accent line
    c.setFillColor(HexColor("#6366f1"))
    c.rect(0, height - 0.05 * inch, width, 0.05 * inch, fill=1, stroke=0)

    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(HexColor("#ffffff"))
    c.drawString(0.5 * inch, height - 0.6 * inch, "AI CRICKET COACH")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#94a3b8"))
    c.drawString(0.5 * inch, height - 0.9 * inch, "BIOMECHANICAL PERFORMANCE ANALYSIS")
    
    # Report Metadata
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(HexColor("#10b981"))
    c.drawRightString(width - 0.5 * inch, height - 0.5 * inch, f"REPORT ID: #ACC-{datetime.now().strftime('%Y%m%d')}")
    
    c.setFillColor(HexColor("#cbd5e1"))
    c.drawRightString(width - 0.5 * inch, height - 0.75 * inch, f"DATE: {datetime.now().strftime('%d %b %Y')}")

    # ---------------- COLUMN 1: Profile & Visuals ----------------
    col1_x = 0.5 * inch
    
    # Profile View
    c.setFillColor(HexColor("#0a0a0f"))
    c.setStrokeColor(HexColor("#1e1b4b"))
    c.roundRect(col1_x, height - 2.4 * inch, 3 * inch, 1 * inch, 12, fill=1, stroke=1)
    
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(col1_x + 0.2 * inch, height - 1.7 * inch, str(user_name).upper())
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(HexColor("#6366f1"))
    c.drawString(col1_x + 0.2 * inch, height - 2.0 * inch, "ROLE: BATSMAN   |   EXP: PRO")

    # Image Box
    img_y_start = height - 6.2 * inch
    img_height = 3.6 * inch
    img_width = 3 * inch
    c.setFillColor(HexColor("#0a0a0f"))
    c.roundRect(col1_x, img_y_start, img_width, img_height, 12, fill=1, stroke=1)
    
    if annotated_image_path and os.path.exists(annotated_image_path):
        c.drawImage(annotated_image_path, col1_x + 0.1 * inch, img_y_start + 0.1 * inch, width=img_width - 0.2 * inch, height=img_height - 0.2 * inch, preserveAspectRatio=True)
    
    # ---------------- COLUMN 2: Scores & Angles ----------------
    col2_x = 3.8 * inch
    
    # Score Card
    c.setFillColor(HexColor("#0a0a0f"))
    c.roundRect(col2_x, height - 2.4 * inch, 3.5 * inch, 1 * inch, 12, fill=1, stroke=1)
    
    score_val = score_data['score']
    score_color = "#10b981" if score_val >= 85 else "#6366f1" if score_val >= 70 else "#ef4444"
    
    c.setFont("Helvetica-Bold", 42)
    c.setFillColor(HexColor(score_color))
    c.drawString(col2_x + 0.3 * inch, height - 2.1 * inch, str(score_val))
    
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(HexColor("#94a3b8"))
    c.drawString(col2_x + 1.2 * inch, height - 1.8 * inch, "/ 100")
    
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(HexColor("#ffffff"))
    c.drawRightString(col2_x + 3.3 * inch, height - 1.9 * inch, score_data['grade'].upper())

    # Comparison Metrics
    c.setFillColor(HexColor("#0a0a0f"))
    c.roundRect(col2_x, height - 6.2 * inch, 3.5 * inch, 3.6 * inch, 12, fill=1, stroke=1)
    
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(col2_x + 0.3 * inch, height - 3.2 * inch, "BIOMECHANICAL METRICS")
    
    metrics = [
        ("Elbow Angle", angles['elbow_angle'], "140 - 160"),
        ("Shoulder Rotation", angles['shoulder_rotation'], "120 - 150"),
        ("Knee Bend", angles['knee_bend'], "50 - 70")
    ]
    
    yLine = height - 3.8 * inch
    for label, val, target in metrics:
        c.setFont("Helvetica", 10)
        c.setFillColor(HexColor("#94a3b8"))
        c.drawString(col2_x + 0.3 * inch, yLine, label)
        
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(HexColor("#ffffff"))
        c.drawRightString(col2_x + 3.2 * inch, yLine, f"{val}\u00b0")
        
        # Target range indicator
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(HexColor("#475569"))
        c.drawString(col2_x + 0.3 * inch, yLine - 0.18 * inch, f"IDEAL RANGE: {target}\u00b0")
        yLine -= 0.7 * inch

    # ---------------- COLUMN 3: Analysis & Recs ----------------
    col3_x = 7.6 * inch
    
    # Problems Card
    c.setFillColor(HexColor("#0a0a0f"))
    c.setStrokeColor(HexColor("#450a0a"))
    c.roundRect(col3_x, height - 3.2 * inch, 3 * inch, 1.8 * inch, 12, fill=1, stroke=1)
    
    c.setFillColor(HexColor("#f87171"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(col3_x + 0.2 * inch, height - 1.7 * inch, "DETECTED IRREGULARITIES")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#cbd5e1"))
    yProb = height - 2.1 * inch
    
    tips = score_data['tips'].split('|')
    for tip in tips[:4]:
        if tip.strip():
            from textwrap import wrap
            lines = wrap(f"> {tip.strip()}", width=35)
            for line in lines:
                c.drawString(col3_x + 0.2 * inch, yProb, line)
                yProb -= 0.18 * inch
            yProb -= 0.05 * inch

    # Recommendations Card
    c.setFillColor(HexColor("#0a0a0f"))
    c.setStrokeColor(HexColor("#064e3b"))
    c.roundRect(col3_x, height - 6.2 * inch, 3 * inch, 2.8 * inch, 12, fill=1, stroke=1)
    
    c.setFillColor(HexColor("#10b981"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(col3_x + 0.2 * inch, height - 3.7 * inch, "KEY RECOMMENDATIONS")
    
    yRec = height - 4.1 * inch
    recs = score_data['recommendations'].split('|')
    for rec in recs[:3]:
        title = rec.split(';')[0].strip()
        c.setFillColor(HexColor("#ffffff"))
        c.setFont("Helvetica-Bold", 9)
        c.drawString(col3_x + 0.2 * inch, yRec, f"\u2713 {title}")
        yRec -= 0.35 * inch

    # ---------------- FOOTER ----------------
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(HexColor("#475569"))
    c.drawCentredString(width/2, 0.4 * inch, "THIS IS AN AI-GENERATED BIOMECHANICAL ANALYSIS. CONSULT A CERTIFIED COACH FOR ON-FIELD GUIDANCE.")
    
    c.save()
    return output_path
