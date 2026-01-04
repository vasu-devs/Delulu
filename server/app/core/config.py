from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Delulu API"
    GROQ_API_KEY: str = "" # Default to empty to prevent startup crash
    SECRET_KEY: str = "SUPER_SECRET_KEY_CHANGE_ME_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
