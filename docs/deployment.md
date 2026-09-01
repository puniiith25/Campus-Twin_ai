# Campus Twin Production & Local Deployment Guide

## 1. Local Development via Docker Compose
```bash
# Clone repository
git clone https://github.com/your-org/campus-twin.git
cd campus-twin

# Copy environment template
cp .env.example .env

# Launch services
docker-compose up --build
```
- Frontend will be accessible at: `http://localhost:3000`
- FastAPI Backend will be accessible at: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

---

## 2. Cloud Deployment Options

### Frontend Deployment (Vercel)
1. Import the `frontend/` directory into Vercel.
2. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Click **Deploy**.

### Backend Deployment (Render / Railway / Fly.io)
1. Deploy the `backend/` directory as a Python / Docker web service.
2. Set Environment Variables:
   - `DATABRICKS_HOST=https://your-workspace.cloud.databricks.com`
   - `DATABRICKS_TOKEN=dapi_xxxx`
   - `DATABRICKS_WAREHOUSE_ID=1234567890abcdef`
   - `GENIE_SPACE_ID=your-space-id`
   - `MOCK_GENIE=false`
   - `CORS_ORIGINS=https://your-frontend.vercel.app`
