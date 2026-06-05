# AI Cricket Coach

A production-ready SaaS platform that analyzes batting and bowling videos, calculates joint angles using MediaPipe, and generates performance reports.

## Features
- **Authentication**: JWT-based Secure Login & Registration.
- **AI Processing**: MediaPipe Pose detection to calculate precise elbow, shoulder, and knee angles.
- **Scoring System**: Generates a grade out of 100 based on the angles.
- **Automated Reports**: Generates downloadable PDF reports with technique tips.
- **Dashboard**: Track your progress over time visually using Chart.js.

## Tech Stack
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, MediaPipe, OpenCV, Passlib, ReportLab.
- **Frontend**: React, Vite, Tailwind CSS, Axios, Chart.js.
- **Deployment**: Docker & Docker Compose setup, with optional Nginx proxy.

## Step-by-Step Run Instructions

### 1. Prerequisite
Ensure you have Docker and Docker Compose installed on your machine.

### 2. Run the Application
From the root directory (`ai_cricket_coach/`), simply run:
```bash
docker-compose up --build
```
This will start both:
- **Backend API**: `http://localhost:8000`
- **Frontend React App**: `http://localhost:5173`

*(Note: SQLite is used as the default database for immediate execution without needing a separate Postgres container. Data persists in `backend/cricket_coach.db`)*

### 3. Usage
- Go to `http://localhost:5173`.
- Register a new account.
- Navigate to the **Upload Video** section.
- Upload any `.mp4` video showing a cricket stroke or bowling action.
- Wait a few seconds for the AI engine to process the frames.
- Navigate to your **Dashboard** to view your score and download the auto-generated PDF.

---

## Production Deployment Guide

1. **Environment Variables**: Update `backend/.env` with secure production values (a high-entropy `SECRET_KEY`). Change `DATABASE_URL` to point to a managed PostgreSQL cluster (e.g., AWS RDS, DigitalOcean Managed DB).
2. **Domain Mapping**: Uncomment the `nginx` service in `docker-compose.yml`. Replace `localhost` in `nginx.conf` with your actual domain name. 
3. **CORS Security**: In `backend/app/main.py`, replace `allow_origins=["*"]` with your exact production domain url (e.g., `https://app.cricketcoach.ai`).
4. **HTTPS / SSL**: Use Let's Encrypt / Certbot inside your Nginx container or put Cloudflare in front of your server.
5. **Storage**: Currently, videos are saved to `backend/uploads`. In production, refactor the code in `backend/app/routers/video.py` to upload these streams directly to an AWS S3 Bucket or GCP Cloud Storage. 
6. **Deploy**: SSH into your VPS (e.g., Ubuntu EC2 instance) and run `docker-compose up -d --build`.

---

## Monetization Suggestions (SaaS Subscription)

To operate this as a profitable SaaS platform, consider the following tiers:

1. **Free Tier (Freemium)**: 
   - 2 Video analyses per month.
   - Basic scoring without deep personalized tips.
   - Good for lead generation and user acquisition.

2. **Pro Tier ($9.99/mo)**: 
   - Up to 20 video analyses per month.
   - Comprehensive joint angle analysis and coach tips.
   - Downloadable PDF reports.
   - History tracking (Dashboard Charts).

3. **Academy / Coach Tier ($49.99/mo)**: 
   - Specific UI for Coaches to manage multiple players under one account.
   - Unlimited analyses.
   - White-labeled PDF reports with the Academy's logo.

4. **Implementation Note for Subscriptions**: Integrate **Stripe Billing** by adding a `subscription_tier` column to the `users` table and configuring a Stripe webhook endpoint in FastAPI to update their status when a payment succeeds.
