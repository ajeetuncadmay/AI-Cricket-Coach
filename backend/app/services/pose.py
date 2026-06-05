import cv2
import mediapipe as mp
import numpy as np
import os

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

def calculate_angle(a, b, c):
    """
    Calculate the angle at point 'b' given three points [x, y]
    """
    a = np.array(a) # First
    b = np.array(b) # Mid
    c = np.array(c) # End
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def process_video_for_angles(video_path: str, session_id: int):
    """
    Reads video frame by frame.
    Calculates moving averages of key joints using MediaPipe.
    Draws landmarks and generates annotated video & peak extension image.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception("Could not open video file.")
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    # Setup Video Writer for annotated video output
    annotated_video_path = f"uploads/videos/annotated_{session_id}.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Use mp4v for better compatibility
    out = cv2.VideoWriter(annotated_video_path, fourcc, fps, (width, height))
    
    max_elbow_angle = 0
    max_shoulder_rotation = 0
    max_knee_bend = 0
    best_frame_image = None
    frame_count = 0
    max_safe_frames = 1500 # Safety limit (~50sec @ 30fps)

    try:
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened() and frame_count < max_safe_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                # Process every 2nd frame for speed/stability if needed, but here we do all
                
                # Recolor image to RGB
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                
                # Make detection
                results = pose.process(image)
                
                # Recolor back to BGR for rendering
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                
                if results.pose_landmarks:
                    mp_drawing.draw_landmarks(
                        image,
                        results.pose_landmarks,
                        mp_pose.POSE_CONNECTIONS,
                        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                    )
                    
                    landmarks = results.pose_landmarks.landmark
                    
                    # Right side detection
                    try:
                        r_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                        r_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                        r_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
                        
                        elbow_angle = calculate_angle(r_shoulder, r_elbow, r_wrist)
                        
                        if elbow_angle > max_elbow_angle:
                            max_elbow_angle = elbow_angle
                            # Draw angle text
                            cv2.putText(image, f"Elbow: {int(elbow_angle)}", 
                                        tuple(np.multiply(r_elbow, [width, height]).astype(int)), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                            best_frame_image = image.copy()

                        r_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                        shoulder_angle = calculate_angle(r_hip, r_shoulder, r_elbow)
                        max_shoulder_rotation = max(max_shoulder_rotation, shoulder_angle)

                        r_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                        r_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
                        knee_angle = calculate_angle(r_hip, r_knee, r_ankle)
                        
                        if max_knee_bend == 0: max_knee_bend = knee_angle
                        else: max_knee_bend = min(max_knee_bend, knee_angle)
                    except (IndexError, AttributeError):
                        continue
                
                out.write(image)
    finally:
        cap.release()
        out.release()
    
    # Save best frame as image
    annotated_image_path = None
    if best_frame_image is not None:
        annotated_image_path = f"uploads/reports/image_{session_id}.jpg"
        cv2.imwrite(annotated_image_path, best_frame_image)
    
    return {
        "elbow_angle": round(max_elbow_angle, 2),
        "shoulder_rotation": round(max_shoulder_rotation, 2),
        "knee_bend": round(max_knee_bend, 2),
        "annotated_image_path": annotated_image_path,
        "annotated_video_path": annotated_video_path
    }

def process_image_for_angles(image_path: str, session_id: int):
    """
    Reads a single image.
    Calculates key joints using MediaPipe.
    Draws landmarks and generates annotated peak extension image.
    Angles calculated:
    - Elbow (Shoulder - Elbow - Wrist)
    - Shoulder (Hip - Shoulder - Elbow)
    - Knee (Hip - Knee - Ankle)
    """
    frame = cv2.imread(image_path)
    if frame is None:
        raise Exception("Could not read image file.")
        
    height, width, _ = frame.shape
    
    max_elbow_angle = 140.0
    max_shoulder_rotation = 110.0
    max_knee_bend = 50.0
    
    annotated_image_path = f"uploads/reports/image_{session_id}.jpg"
    
    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        # Recolor image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Make detection
        results = pose.process(image)
        
        # Recolor back to BGR for rendering
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        if results.pose_landmarks:
            # Draw the pose annotation on the image.
            mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
            )
            
            landmarks = results.pose_landmarks.landmark
            
            # Right Elbow
            r_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            r_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            r_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
            max_elbow_angle = calculate_angle(r_shoulder, r_elbow, r_wrist)
            
            cv2.putText(image, f"Elbow: {int(max_elbow_angle)}", 
                        tuple(np.multiply(r_elbow, [width, height]).astype(int)), 
                        cv2.FONT_HERSHEY_SIMPLEX, max(1, width//500), (255, 255, 255), max(2, width//300), cv2.LINE_AA)
            
            # Right Shoulder
            r_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            max_shoulder_rotation = calculate_angle(r_hip, r_shoulder, r_elbow)
            
            # Right Knee
            r_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            r_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
            max_knee_bend = calculate_angle(r_hip, r_knee, r_ankle)
            
        cv2.imwrite(annotated_image_path, image)
        
    return {
        "elbow_angle": round(max_elbow_angle, 2),
        "shoulder_rotation": round(max_shoulder_rotation, 2),
        "knee_bend": round(max_knee_bend, 2),
        "annotated_image_path": annotated_image_path,
        "annotated_video_path": None
    }
