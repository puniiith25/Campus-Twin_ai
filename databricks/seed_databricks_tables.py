#!/usr/bin/env python3
"""
Automated Databricks Seeder Script for Campus Twin
Creates catalog, schema, tables, and inserts all synthetic datasets directly into your Databricks SQL Warehouse.
"""

import os
import csv
import json
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("DATABRICKS_HOST"):
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

DATABRICKS_HOST = os.getenv("DATABRICKS_HOST", "").rstrip("/")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "")
WAREHOUSE_ID = os.getenv("DATABRICKS_WAREHOUSE_ID", "")

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

HEADERS = {
    "Authorization": f"Bearer {DATABRICKS_TOKEN}",
    "Content-Type": "application/json"
}

async def execute_sql(client: httpx.AsyncClient, statement: str) -> dict:
    url = f"{DATABRICKS_HOST}/api/2.0/sql/statements"
    payload = {
        "warehouse_id": WAREHOUSE_ID,
        "statement": statement,
        "wait_timeout": "50s"
    }
    resp = await client.post(url, json=payload, headers=HEADERS)
    resp.raise_for_status()
    data = resp.json()
    state = data.get("status", {}).get("state", "UNKNOWN")
    if state == "FAILED":
        err = data.get("status", {}).get("error", {})
        raise RuntimeError(f"SQL FAILED [{err.get('error_code')}]: {err.get('message','')}")
    if state not in ("SUCCEEDED", "CLOSED"):
        raise RuntimeError(f"SQL statement ended in unexpected state: {state}")
    return data


def escape_sql_val(val: str) -> str:
    if val is None:
        return "NULL"
    cleaned = str(val).replace("'", "''")
    return f"'{cleaned}'"

async def seed_table(client: httpx.AsyncClient, schema_prefix: str, table_name: str, csv_filename: str):
    csv_path = os.path.join(DATA_DIR, csv_filename)
    if not os.path.exists(csv_path):
        print(f"Skipping {table_name}: {csv_filename} not found.")
        return

    full_table = f"{schema_prefix}.{table_name}"
    print(f"Seeding table {full_table}...")
    rows = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    if not rows:
        return

    columns = list(rows[0].keys())
    col_str = ", ".join(columns)

    # Batch insert rows in chunks of 20
    chunk_size = 20
    for i in range(0, len(rows), chunk_size):
        chunk = rows[i:i+chunk_size]
        values_tuples = []
        for r in chunk:
            vals = [escape_sql_val(r[col]) for col in columns]
            values_tuples.append(f"({', '.join(vals)})")

        sql_insert = f"INSERT INTO {full_table} ({col_str}) VALUES {', '.join(values_tuples)};"
        try:
            await execute_sql(client, sql_insert)
            print(f"  Inserted rows {i+1} to {i+len(chunk)} into {table_name}.")
        except Exception as e:
            print(f"  Error inserting rows into {table_name}: {e}")


async def main():
    if not DATABRICKS_HOST or not DATABRICKS_TOKEN or not WAREHOUSE_ID:
        print("ERROR: Missing Databricks environment variables in .env file.")
        print("Please specify DATABRICKS_HOST, DATABRICKS_TOKEN, and DATABRICKS_WAREHOUSE_ID.")
        return

    print(f"Connecting to Databricks Workspace at {DATABRICKS_HOST}...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Step 1: Create Catalog & Schema
        print("1. Creating Catalog and Schema...")
        await execute_sql(client, "CREATE CATALOG IF NOT EXISTS campus_twin;")
        await execute_sql(client, "CREATE SCHEMA IF NOT EXISTS campus_twin.campus;")

        # Step 2: Create DDL Tables
        print("2. Creating Delta Tables DDL...")
        tables_ddl = [
            ("courses", "CREATE TABLE IF NOT EXISTS campus_twin.campus.courses (course_id STRING, course_name STRING, department STRING, description STRING, credits INT, difficulty STRING, skills STRING, prerequisites STRING, hours_per_week INT, semester STRING, level STRING, faculty_id STRING) USING DELTA;"),
            ("clubs", "CREATE TABLE IF NOT EXISTS campus_twin.campus.clubs (club_id STRING, club_name STRING, category STRING, description STRING, interests STRING, skills STRING, hours_per_week INT, meeting_day STRING, meeting_time STRING, membership_level STRING, related_events STRING) USING DELTA;"),
            ("events", "CREATE TABLE IF NOT EXISTS campus_twin.campus.events (event_id STRING, event_name STRING, event_type STRING, description STRING, date STRING, duration_hours INT, location STRING, organizer STRING, skills STRING, related_clubs STRING, related_courses STRING, registration_required STRING) USING DELTA;"),
            ("research_projects", "CREATE TABLE IF NOT EXISTS campus_twin.campus.research_projects (research_id STRING, title STRING, description STRING, domain STRING, faculty STRING, department STRING, skills STRING, prerequisites STRING, difficulty STRING, hours_per_week INT, duration STRING, lab STRING, availability STRING, related_courses STRING) USING DELTA;"),
            ("opportunities", "CREATE TABLE IF NOT EXISTS campus_twin.campus.opportunities (opportunity_id STRING, title STRING, type STRING, organization STRING, description STRING, skills STRING, eligibility STRING, prerequisites STRING, hours_per_week INT, duration STRING, deadline STRING, location STRING, career_domains STRING) USING DELTA;"),
            ("facilities", "CREATE TABLE IF NOT EXISTS campus_twin.campus.facilities (facility_id STRING, name STRING, type STRING, description STRING, location STRING, available_hours STRING, equipment STRING, skills_supported STRING, related_courses STRING, related_clubs STRING, related_research STRING) USING DELTA;"),
            ("skills", "CREATE TABLE IF NOT EXISTS campus_twin.campus.skills (skill_id STRING, skill_name STRING, category STRING, description STRING, beginner_description STRING, intermediate_description STRING, advanced_description STRING) USING DELTA;"),
            ("city_events", "CREATE TABLE IF NOT EXISTS campus_twin.campus.city_events (city_event_id STRING, name STRING, type STRING, description STRING, date STRING, location STRING, skills STRING, organization STRING, distance_from_campus DOUBLE, registration_url STRING) USING DELTA;"),
            ("relationships", "CREATE TABLE IF NOT EXISTS campus_twin.campus.relationships (relationship_id STRING, source_type STRING, source_id STRING, relationship_type STRING, target_type STRING, target_id STRING, weight DOUBLE) USING DELTA;")
        ]

        for tbl, ddl in tables_ddl:
            await execute_sql(client, ddl)
            print(f"  Created table campus_twin.campus.{tbl}")

        # Step 3: Seed Table Data
        print("3. Inserting Datasets into Databricks Delta Tables...")
        await seed_table(client, "campus_twin.campus", "courses", "courses.csv")
        await seed_table(client, "campus_twin.campus", "clubs", "clubs.csv")
        await seed_table(client, "campus_twin.campus", "events", "events.csv")
        await seed_table(client, "campus_twin.campus", "research_projects", "research_projects.csv")
        await seed_table(client, "campus_twin.campus", "opportunities", "opportunities.csv")
        await seed_table(client, "campus_twin.campus", "facilities", "facilities.csv")
        await seed_table(client, "campus_twin.campus", "skills", "skills.csv")
        await seed_table(client, "campus_twin.campus", "city_events", "city_events.csv")
        await seed_table(client, "campus_twin.campus", "relationships", "relationships.csv")

        print("\nDatabricks table creation and data seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
