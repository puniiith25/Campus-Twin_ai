import csv
import os
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings

class DatabricksService:
    def __init__(self):
        self.host = settings.DATABRICKS_HOST.rstrip('/')
        self.token = settings.DATABRICKS_TOKEN
        self.warehouse_id = settings.DATABRICKS_WAREHOUSE_ID
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data"))

    async def execute_sql(self, sql_query: str) -> List[Dict[str, Any]]:
        """Executes SQL on Databricks SQL Warehouse or falls back to local CSV querying if mock mode."""
        if settings.MOCK_GENIE or not self.host or not self.token:
            return self._query_local_csv(sql_query)

        url = f"{self.host}/api/2.0/sql/statements"
        payload = {
            "warehouse_id": self.warehouse_id,
            "statement": sql_query,
            "wait_timeout": "30s"
        }
        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                resp = await client.post(url, json=payload, headers=self.headers)
                resp.raise_for_status()
                data = resp.json()
                manifest = data.get("manifest", {}).get("schema", {}).get("columns", [])
                cols = [c["name"] for c in manifest]
                data_array = data.get("result", {}).get("data_array", [])
                
                results = []
                for row in data_array:
                    results.append(dict(zip(cols, row)))
                return results
        except Exception as e:
            print(f"Databricks SQL API execution error: {e}. Falling back to local dataset execution.")
            return self._query_local_csv(sql_query)

    def _query_local_csv(self, query_hint: str) -> List[Dict[str, Any]]:
        """Reads local synthetic CSV datasets for offline mock mode."""
        table_name = "courses"
        query_lower = query_hint.lower()
        if "clubs" in query_lower:
            table_name = "clubs"
        elif "events" in query_lower or "city_events" in query_lower:
            table_name = "events"
        elif "research" in query_lower:
            table_name = "research_projects"
        elif "opportunities" in query_lower:
            table_name = "opportunities"
        elif "facilities" in query_lower:
            table_name = "facilities"
        elif "skills" in query_lower:
            table_name = "skills"

        file_path = os.path.join(self.data_dir, f"{table_name}.csv")
        if not os.path.exists(file_path):
            return []

        results = []
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                results.append(dict(row))
        return results

databricks_service = DatabricksService()
