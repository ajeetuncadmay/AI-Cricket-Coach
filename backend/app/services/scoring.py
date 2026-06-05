def evaluate_technique(angles: dict):
    """
    Compares calculated angles with professional biomechanical standards.
    Standardized Ideal Ranges for Cricket Batting (Cover Drive):
    - Elbow Angle: 140 - 160 degrees (High elbow)
    - Shoulder Rotation: 120 - 150 degrees (Full swing)
    - Knee Bend: 50 - 70 degrees (Strong stable base)
    """
    
    # Ideal range definitions
    ranges = {
        "elbow": (140.0, 160.0),
        "shoulder": (120.0, 150.0),
        "knee": (50.0, 70.0)
    }
    
    def calculate_angle_score(val, min_val, max_val):
        if min_val <= val <= max_val:
            return 100.0
        # Calculate penalty based on distance from nearest bound
        diff = min(abs(val - min_val), abs(val - max_val))
        return max(0, 100 - (diff / 30.0 * 100)) # 30 degree deviation = 0 score

    elbow_score = calculate_angle_score(angles["elbow_angle"], *ranges["elbow"])
    shoulder_score = calculate_angle_score(angles["shoulder_rotation"], *ranges["shoulder"])
    knee_score = calculate_angle_score(angles["knee_bend"], *ranges["knee"])
    
    total_score = (elbow_score + shoulder_score + knee_score) / 3.0
    
    # Grade assignment
    grade = "Poor"
    if total_score >= 85:
        grade = "Excellent"
    elif total_score >= 70:
        grade = "Good"
    elif total_score >= 50:
        grade = "Average"
        
    # Tips & Recommendations generation
    tips = []
    recommendations = []
    
    # Elbow analysis
    if angles["elbow_angle"] < ranges["elbow"][0]:
        tips.append("Keep your front elbow higher and straighter dynamically through the shot.")
        recommendations.append("High Elbow Shadow Practice; 5 sets of 20 reps daily")
    elif angles["elbow_angle"] > ranges["elbow"][1]:
        tips.append("Avoid overextending the elbow; maintain a controlled lock for stability.")
        recommendations.append("Controlled Swing Drills; 10 mins daily")
    
    # Shoulder analysis
    if angles["shoulder_rotation"] < ranges["shoulder"][0]:
        tips.append("Work on rotating your shoulder more freely to increase bat swing momentum.")
        recommendations.append("Shoulder Mobility Drills; 10 mins, 5 days a week")
    elif angles["shoulder_rotation"] > ranges["shoulder"][1]:
        tips.append("Shoulder rotation is too wide; keep it compact for better timing.")
        recommendations.append("Compact Swing Drills; 8 sets of 10 reps")

    # Knee analysis
    if angles["knee_bend"] < ranges["knee"][0]:
        tips.append("Bend your front knee more to get closer to the line of the ball.")
        recommendations.append("Front Foot Lunges; 14 sets of 15 reps daily")
    elif angles["knee_bend"] > ranges["knee"][1]:
        tips.append("Avoid lunging too deep; maintain a stable base on your front knee.")
        recommendations.append("Balance Stability Drills; 5 mins, 3 times daily")

    if not tips:
        tips.append("Great technique! Maintain consistency and keep playing in the V.")
        recommendations.append("Record front on & side on videos; Review and compare weekly")
        recommendations.append("Focus on controlled shots, not power; Accuracy first, power will follow")
        
    return {
        "score": round(total_score, 1),
        "grade": grade,
        "tips": " | ".join(tips),
        "recommendations": " | ".join(recommendations)
    }
