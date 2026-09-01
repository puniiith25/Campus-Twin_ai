# Campus Twin System Architecture

Campus Twin is a Genie-powered "What-If" Explorer for campus life, built as a decoupled monorepo with Next.js frontend, FastAPI backend, and Databricks platform integration.

## High-Level Architecture Diagram

```
                    ┌──────────────────┐
                    │     STUDENT      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Next.js Frontend │
                    │ (App Router)     │
                    │  - Chat          │
                    │  - Explore       │
                    │  - Path Journey  │
                    │  - What-If Exec  │
                    │  - Compare Radar │
                    │  - Dashboard     │
                    └────────┬─────────┘
                             │ REST / JSON
                             ▼
                    ┌──────────────────┐
                    │ FastAPI Backend  │
                    │                  │
                    │  - Scoring       │
                    │  - Path Gen      │
                    │  - What-If Engine│
                    │  - Genie Client  │
                    └────────┬─────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
 ┌──────────────────────┐        ┌───────────────────────┐
 │   Databricks Genie   │        │ Application Logic     │
 │   Natural Language   │        │ Scoring Engine        │
 │   Query Generation   │        │ Prerequisite Graph    │
 └──────────┬───────────┘        │ Time Limits           │
            │                    └───────────┬───────────┘
            ▼                                │
 ┌──────────────────────┐                    │
 │ Databricks Unity     │                    │
 │ Catalog (campus_twin)│◄───────────────────┘
 └──────────┬───────────┘
            │
            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Delta Tables:                                          │
 │ courses | clubs | events | research_projects |         │
 │ opportunities | facilities | skills | city_events |    │
 │ relationships                                          │
 └────────────────────────────────────────────────────────┘
```

## Security & Secrets Protocol
- All communication with Databricks SQL Warehouses and Genie Agent APIs takes place strictly server-side inside the FastAPI backend.
- Credentials (`DATABRICKS_HOST`, `DATABRICKS_TOKEN`, `DATABRICKS_WAREHOUSE_ID`, `GENIE_SPACE_ID`) are never exposed to frontend code or client browser context.
