from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App config
    APP_NAME: str = "AI Cricket Coach"
    DEBUG_MODE: bool = True
    
    # Database configuration 
    # Use SQLite for dev, switch to Postgres using env var 'DATABASE_URL' in prod
    DATABASE_URL: str = "sqlite:///./cricket_coach.db"
    
    # Auth configuration
    SECRET_KEY: str = "your-super-secret-key-change-in-prod" 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()
