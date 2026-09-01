"""
conftest.py - Loads backend/.env before any tests so real Databricks credentials
are available and MOCK_GENIE=false is respected during the test run.

Strategy: load_dotenv sets env vars, then we mutate the already-imported
`settings` singleton IN PLACE so every module that holds `from app.config import settings`
sees the updated values without needing a reload.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load backend/.env FIRST — sets env vars in os.environ
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)

# Mutate the shared settings singleton in-place so every already-imported
# module that did `from app.config import settings` sees the new values.
from app.config import settings

settings.MOCK_GENIE = os.getenv("MOCK_GENIE", "true").lower() in ("true", "1", "t")
settings.DATABRICKS_HOST = os.getenv("DATABRICKS_HOST", "")
settings.DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "")
settings.DATABRICKS_WAREHOUSE_ID = os.getenv("DATABRICKS_WAREHOUSE_ID", "")
settings.GENIE_SPACE_ID = os.getenv("GENIE_SPACE_ID", "")

# Also refresh the DatabricksService instance attributes which were set
# from settings at __init__ time (before conftest ran).
from app.services.databricks_service import databricks_service

databricks_service.host = settings.DATABRICKS_HOST.rstrip("/")
databricks_service.token = settings.DATABRICKS_TOKEN
databricks_service.warehouse_id = settings.DATABRICKS_WAREHOUSE_ID
databricks_service.headers = {
    "Authorization": f"Bearer {settings.DATABRICKS_TOKEN}",
    "Content-Type": "application/json",
}

