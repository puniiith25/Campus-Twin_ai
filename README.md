# CAMPUS TWIN

> **Tagline**: *"Explore Your Campus. Discover Your Path."*

Campus Twin is a Genie-powered "What-If" Explorer for campus life that transforms natural language student goals into personalized, data-backed candidate paths across courses, clubs, events, research projects, opportunities, facilities, skills, and city opportunities.

---

## The Problem & Solution

- **The Problem**: Campus opportunities exist across disconnected siloes (clubs, research labs, course catalogs, hackathons, and internships). Students struggle to see how these opportunities build upon each other toward their long-term career goals.
- **The Solution**: Campus Twin uses **Databricks Genie** to query connected campus datasets, uncover relationships, and construct personalized candidate journey timelines.
- **The Central Differentiator**: **The What-If Campus Explorer**. Instead of static recommendations, students can test alternative scenarios (*"What if I replace this club with research?"*, *"What if I only have 4 hours per week?"*) to compare trade-offs before committing.

---

## Key Features

1. **Natural Language Goal Explorer**: Accepts goals like *"I want to become an AI engineer. I know Python and have 6 hours per week."*
2. **Deterministic Recommendation & Scoring Engine**: Multi-factor scoring across Goal Match (40%), Skill Match (25%), Time Fit (20%), and Opportunity Value (15%).
3. **Strict Time Constraint Validation**: Enforces weekly hour budgets without silent overages.
4. **Path Generation Service**: Generates structured sequence paths (Career Focus vs Research Focus).
5. **Real What-If Simulation Engine**: Supports `REPLACE`, `REMOVE`, `ADD`, and `REDUCE_TIME` operations with animated visual diffs and trade-off explanations.
6. **Multi-Metric Comparison & Recharts Radar**: Side-by-side comparison across Goal Alignment, Time, Research Exposure, Networking, Industry Exposure, Projects, and Faculty Interaction.
7. **Connected Opportunity Directory**: Searchable directory of 51 courses, 21 clubs, 50 events, 30 research projects, 30 opportunities, 15 facilities, 50 skills, and 30 city events.
8. **Databricks Genie Integration**: Connects to Databricks Free Edition & Unity Catalog with server-side credential isolation and structured local mock fallback (`MOCK_GENIE=true`).

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Recharts, React-Markdown.
- **Backend**: Node.js (ES Modules), Express.js, Google OAuth, CSV Parser.
- **Data Platform**: Databricks Free Edition, Unity Catalog (`campus_twin.campus`), Databricks SQL, Databricks Genie Agent.
- **Containerization**: Docker, Docker Compose.

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose (for production deployment)

### 1. Running Locally (Development)

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```
*Server runs on http://localhost:8000*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:3000 (or 5173)*

---

### 2. Production Deployment (Docker Compose)

Deploy both frontend (Nginx production build) and backend (Express container) with one command:
```bash
# 1. Configure environment variables
cp .env.example .env

# 2. Build and launch containers
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`
---

## Databricks & Genie Configuration

For full step-by-step instructions on creating the `campus_twin.campus` catalog, seeding tables, and training Genie Agent, see [databricks/README.md](file:///Users/punith25/Desktop/Campus-Twin/databricks/README.md).

### Development Mock Mode vs Production Genie Mode

- **Mock Mode (`MOCK_GENIE=true`)**: Enabled by default in local development. Uses local synthetic CSV datasets to allow full UI & API testing without active Databricks credentials.
- **Production Mode (`MOCK_GENIE=false`)**: Set `MOCK_GENIE=false` in `.env` along with `DATABRICKS_HOST`, `DATABRICKS_TOKEN`, `DATABRICKS_WAREHOUSE_ID`, and `GENIE_SPACE_ID` to route queries directly to your Databricks Genie Space.

---

## Verification & Testing

Run the full pytest suite for scoring, constraints, What-If engine, and API routes:
```bash
PYTHONPATH=backend backend/.venv/bin/pytest backend/tests
```

---

## Data Privacy Statement

> [!IMPORTANT]
> Campus Twin uses synthetic, anonymized, and open campus-style datasets. No real student academic records, grades, attendance logs, or personally identifiable information (PII) are used or stored.
