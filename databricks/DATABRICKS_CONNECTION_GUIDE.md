# Databricks & Genie Connection Setup Guide

This document lists **everything you need** to connect Campus Twin to your Databricks Workspace and Databricks Genie Agent, along with exact step-by-step instructions on where to find each credential in the Databricks UI.

---

## 1. Summary of Required Connection Credentials

To connect the application to a live Databricks environment, you need **5 key parameters**:

| Parameter Name | Description | Example Value | Required For |
| :--- | :--- | :--- | :--- |
| `DATABRICKS_HOST` | Your Databricks Workspace URL | `https://dbc-12345678-abcd.cloud.databricks.com` | Backend |
| `DATABRICKS_TOKEN` | Personal Access Token (PAT) | `dapi1234567890abcdef1234567890abcdef` | Backend |
| `DATABRICKS_WAREHOUSE_ID` | Databricks SQL Warehouse ID | `a1b2c3d4e5f67890` | Backend |
| `GENIE_SPACE_ID` | Databricks Genie Space ID | `01ef9876-5432-10fe-dcba-000000000000` | Backend |
| `GENIE_AGENT_ID` | Genie Agent Serving Endpoint ID (Optional) | `01ef9876-5432-10fe-dcba-000000000000` | Backend |

> [!IMPORTANT]
> **Security Requirement**: Never commit your actual Databricks Token or secrets to Git. Keep credentials strictly inside backend `.env` files.

---

## 2. Step-by-Step Instructions: Where to Find Each Value in Databricks

### Parameter 1: `DATABRICKS_HOST`
1. Log into your Databricks Workspace in your web browser.
2. Look at the browser URL bar.
3. Copy the URL up to `.com` (without trailing slashes or subpages).
   - **Correct**: `https://dbc-12345678-abcd.cloud.databricks.com`
   - **Incorrect**: `https://dbc-12345678-abcd.cloud.databricks.com/sql/editor`

---

### Parameter 2: `DATABRICKS_TOKEN`
1. In Databricks UI, click your **user profile email / avatar** in the top right corner.
2. Select **User Settings**.
3. Go to the **Developer** tab on the left sidebar.
4. Click **Access Tokens** > **Generate new token**.
5. Give the token a comment (e.g., `Campus-Twin-Backend`) and set an expiration duration (e.g. 90 days).
6. Click **Generate**.
7. **Copy the token immediately** (`dapi...`). It will not be shown again.

---

### Parameter 3: `DATABRICKS_WAREHOUSE_ID`
1. In Databricks UI, click **SQL Warehouses** on the left navigation bar.
2. Click on your active SQL Warehouse (e.g., `Starter Warehouse`).
3. Click the **Connection Details** tab.
4. Locate the **HTTP Path** field (e.g., `/sql/1.0/warehouses/a1b2c3d4e5f67890`).
5. Copy the 16-character alphanumeric ID at the end of the HTTP path (`a1b2c3d4e5f67890`). That is your `DATABRICKS_WAREHOUSE_ID`.

---

### Parameter 4: `GENIE_SPACE_ID`
1. In Databricks UI, click **Genie** from the left navigation menu.
2. Open your configured `Campus Twin Explorer` space (or create one using `databricks/genie/instructions.md`).
3. Look at your browser URL while inside the Genie Space:
   - Example URL: `https://dbc-xxxx.cloud.databricks.com/genie/rooms/01ef9876-5432-10fe-dcba-000000000000`
4. The long ID string after `/rooms/` (or space settings) is your `GENIE_SPACE_ID`.

---

### Parameter 5: `NEXT_PUBLIC_API_URL` (Frontend Config)
- URL where the FastAPI backend runs:
  - Local Development: `http://localhost:8000`
  - Production Deployment: `https://your-backend-domain.com`

---

## 3. How to Set Up Your `.env` File

Create a `.env` file in the root directory or inside `backend/.env`:

```env
# ===================================================
# CAMPUS TWIN DATABRICKS ENVIRONMENT CONFIGURATION
# ===================================================

# 1. Databricks Workspace Host
DATABRICKS_HOST=https://dbc-12345678-abcd.cloud.databricks.com

# 2. Personal Access Token
DATABRICKS_TOKEN=dapi1234567890abcdef1234567890abcdef

# 3. SQL Warehouse ID
DATABRICKS_WAREHOUSE_ID=a1b2c3d4e5f67890

# 4. Databricks Genie Space ID
GENIE_SPACE_ID=01ef9876-5432-10fe-dcba-000000000000

# 5. Genie Mode Toggle
# Set MOCK_GENIE=false to send queries to live Databricks Workspace
# Set MOCK_GENIE=true for offline local development without Databricks
MOCK_GENIE=false

# 6. General Settings
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 4. Switching Modes: Mock Mode vs Live Databricks

Campus Twin includes a toggle to switch seamlessly between offline synthetic mode and live Databricks integration:

### Mode A: Offline Local Mock Mode (`MOCK_GENIE=true`)
- **Use Case**: Local UI development, testing offline, or running without cloud credentials.
- **Behavior**: Backend queries local CSV datasets in `data/` (`courses.csv`, `clubs.csv`, `research_projects.csv`, etc.).

### Mode B: Live Databricks Genie Mode (`MOCK_GENIE=false`)
- **Use Case**: Hackathon judge evaluation, live production demo, real Databricks SQL execution.
- **Behavior**: Backend connects to Databricks REST APIs (`/api/2.0/genie/spaces/{space_id}/start-conversation` and `/api/2.0/sql/statements`) to run real queries on `campus_twin.campus` Delta tables.

---

## 5. How to Test Your Databricks Connection

After creating your `.env` file with real credentials, verify the connection:

### Test 1: Check Backend Health
Run in terminal:
```bash
curl http://localhost:8000/
```
Expected output:
```json
{
  "status": "online",
  "service": "Campus Twin Backend",
  "version": "1.0.0",
  "mock_genie": false,
  "environment": "development"
}
```

### Test 2: Test Chat API with Genie
Run in terminal:
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What AI courses exist in the campus database?"}'
```

If connected successfully, Genie will query `campus_twin.campus.courses` and return data-backed recommendations!
