from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, video, report

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Cricket Coach API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(video.router, prefix="/api")
app.include_router(report.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Cricket Coach API"}
