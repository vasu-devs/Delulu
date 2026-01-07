from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Delulu API v2 (Phoenix)"
    GROQ_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
