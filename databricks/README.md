# Databricks Platform & Genie Agent Setup Guide

This document provides step-by-step instructions for deploying Campus Twin dataset tables and configuring Databricks Genie Agent on Databricks Free Edition / Community / Enterprise Workspaces.

---

## Step-by-Step Databricks Deployment

### 1. Provision / Access Workspace
1. Log into your Databricks Workspace.
2. Ensure you have permissions to create catalogs, schemas, and Databricks SQL Warehouses.

### 2. Create Unity Catalog & Schema
1. Open **Databricks SQL Editor** or a **Databricks Notebook** with SQL kernel.
2. Execute `sql/01_create_schema.sql`:
   ```sql
   CREATE CATALOG IF NOT EXISTS campus_twin;
   USE CATALOG campus_twin;
   CREATE SCHEMA IF NOT EXISTS campus;
   ```

### 3. Create Tables
1. Execute `sql/02_create_tables.sql` and `sql/03_create_relationships.sql` to define Delta tables.

### 4. Upload Datasets
1. In the Databricks UI, navigate to **Catalog** > **campus_twin** > **campus**.
2. Click **Create or modify table** > **Upload files**.
3. Upload the synthetic CSV files from `data/`:
   - `courses.csv` -> `campus.courses`
   - `clubs.csv` -> `campus.clubs`
   - `events.csv` -> `campus.events`
   - `research_projects.csv` -> `campus.research_projects`
   - `opportunities.csv` -> `campus.opportunities`
   - `facilities.csv` -> `campus.facilities`
   - `skills.csv` -> `campus.skills`
   - `city_events.csv` -> `campus.city_events`
   - `relationships.csv` -> `campus.relationships`

### 5. Validate Integrity
1. Execute `sql/04_validation.sql` to ensure record counts match:
   - Courses: 51
   - Clubs: 21
   - Events: 50
   - Research Projects: 30
   - Opportunities: 30
   - Facilities: 15
   - Skills: 50
   - City Events: 30
   - Relationships: 190

### 6. Create & Configure Databricks Genie Space
1. In Databricks UI, select **Genie** from the left navigation menu.
2. Click **New Space** and name it `Campus Twin Explorer`.
3. Add the tables from `campus_twin.campus` catalog.
4. Copy instructions from `genie/instructions.md` into the **Instructions** tab.
5. Add example questions from `genie/example_questions.md` to train the text-to-SQL engine.

### 7. Retrieve Credentials for FastAPI Integration
1. Obtain your Workspace Host URL (e.g. `https://dbc-xxxx.cloud.databricks.com`).
2. Generate a Personal Access Token under **User Settings** > **Developer** > **Access Tokens**.
3. Retrieve your SQL Warehouse ID from **SQL Warehouses**.
4. Retrieve Genie Space ID from the Genie Space URL or API response.
5. Update `backend/.env`:
   ```env
   DATABRICKS_HOST=https://your-workspace.cloud.databricks.com
   DATABRICKS_TOKEN=dapi_xxxx
   DATABRICKS_WAREHOUSE_ID=1234567890abcdef
   GENIE_SPACE_ID=your-genie-space-id
   MOCK_GENIE=false
   ```
