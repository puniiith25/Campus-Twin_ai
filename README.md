# 🎓 CAMPUS TWIN

> **Tagline**: *"Explore Your Campus. Discover Your Path."*

[![Frontend Live](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-success?style=flat-square&logo=vercel)](https://campus-twin-ai-d4lm.vercel.app)
[![Backend Live](https://img.shields.io/badge/Backend-Live%20API-blue?style=flat-square&logo=vercel)](https://campus-twin-ai-mrbl.vercel.app)

- 🌐 **Live Web Application**: [https://campus-twin-ai-d4lm.vercel.app](https://campus-twin-ai-d4lm.vercel.app)
- 🔌 **Live Backend API**: [https://campus-twin-ai-mrbl.vercel.app](https://campus-twin-ai-mrbl.vercel.app)

---

## 🌟 Key Features

1. **Ask Campus Twin (Genie Chat Assistant)**:
   - Natural language queries grounded directly on Databricks Lakehouse tables (`courses`, `clubs`, `opportunities`, `faculty`).
   - Clean, structured markdown responses with breakdown metrics, prerequisite validation, and actionable advice.

2. **What-If Career Simulator**:
   - Test career choices (*"What if I switch from Web Dev to AI Engineer?"* or *"What if I reduce my availability to 4h/week?"*).
   - Real-time recalculation of readiness score, weekly time constraints, and skill delta trade-offs with 0ms latency.

3. **Career Map & Role Readiness Scoring**:
   - Multi-factor match scoring across Verified Skills (60%), Academic CGPA (20%), Experience (10%), and Time Budget (10%).
   - Transparent skill gap diagnosis identifying required proficiency levels (*Beginner*, *Intermediate*, *Advanced*).

4. **Campus Ecosystem Hub**:
   - Searchable directory of 51 courses, 21 clubs, 50 hackathons & events, 30 research projects, 30 opportunities, and 15 labs.
   - Live time-compatibility filter enforcing weekly hour limits.

5. **Profile & Overview Dashboard**:
   - Complete student profile snapshot (CGPA, Course, Semester, Time Budget).
   - Dual-tab drawer to review career trajectory metrics and modify profile parameters.

6. **Databricks Lakehouse SQL Storage**:
   - Profiles persisted via Delta Lake `MERGE INTO campus_twin.campus.student_profiles`.
   - Action & simulation tracking in `campus_twin.campus.student_activity_logs`.
   - Zero-downtime offline fallback using synthetic campus datasets when credentials are not configured.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, Framer Motion, React-Markdown, Remark GFM.
- **Backend**: Node.js 20 (ES Modules), Express.js, Google OAuth, CSV Parser.
- **Data Platform**: Databricks SQL Warehouse, Unity Catalog (`campus_twin.campus`), Databricks Genie AI.
- **Deployment**: Docker, Docker Compose, Nginx (Alpine), Vercel & Render ready.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose (optional)

### 1. Local Development

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:8000`*

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (or `5173`)*

---

## 📦 Production Deployment

### Option A: Docker Compose (Single Command)
```bash
# 1. Setup environment variables
cp .env.example .env

# 2. Build and launch all containers
docker-compose up --build -d
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`

---

### Option B: Deploy to Vercel (Frontend) & Render (Backend)

#### 1. Backend on Render / Railway:
- **Runtime**: `Node`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- Set Environment Variables: `DATABRICKS_HOST`, `DATABRICKS_TOKEN`, `DATABRICKS_WAREHOUSE_ID`, `GENIE_SPACE_ID`, `CORS_ORIGINS=*`.

#### 2. Frontend on Vercel:
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set Environment Variable: `VITE_API_URL` to your backend Render URL.

---

## 🗄️ Databricks Table Seeding

To seed all synthetic campus datasets into your Databricks Unity Catalog (`campus_twin.campus.*`):
```bash
node databricks/seed_databricks_tables.js
```

Seeded Tables:
- `courses` (51 records)
- `clubs` (21 records)
- `events` (50 records)
- `research_projects` (30 records)
- `opportunities` (30 records)
- `facilities` (15 records)
- `skills` (50 records)
- `faculty` (10 records)

---

## 📜 License
MIT License. Built for Databricks Lakehouse Campus Innovation.
