"""
Resolve AI Configuration Settings
Loads configuration from environment variables (.env).
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # IBM Db2 credentials
    db2_host: str = os.getenv("DB2_HOST", "")
    db2_port: int = int(os.getenv("DB2_PORT", "50001"))
    db2_database: str = os.getenv("DB2_DATABASE", os.getenv("DB2_NAME", "BLUDB"))
    db2_user: str = os.getenv("DB2_USER", "")
    db2_password: str = os.getenv("DB2_PASSWORD", "")
    db2_ssl: str = os.getenv("DB2_SSL", os.getenv("DB2_SECURITY", "SSL"))
    
    # Embeddings / AI endpoints
    embed_base_url: str = os.getenv("EMBED_BASE_URL", "")
    embed_model: str = os.getenv("EMBED_MODEL", "ibm-granite/granite-embedding-278m")
    
    # Security & CORS
    frontend_url: str = os.getenv("FRONTEND_URL", "https://resolve-ai.vercel.app")
    cors_extra_origins: str = os.getenv("CORS_EXTRA_ORIGINS", "")
    rate_limit_solve: str = "10/minute"
    rate_limit_feedback: str = "30/minute"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
