# Campus Twin FastAPI Endpoints Reference

Base URL: `http://localhost:8000`

---

## 1. POST `/api/chat`
Ask natural language questions to Databricks Genie assistant.

**Request**:
```json
{
  "question": "I want to become an AI engineer. I have 6 hours per week.",
  "student_profile": {
    "goal": "AI Engineer",
    "available_hours_per_week": 6.0
  }
}
```

**Response**:
```json
{
  "answer": "Databricks Genie queried connected campus datasets...",
  "recommendations": [ ... ],
  "conversation_id": "genie_conv_1234",
  "sources": ["campus.courses", "campus.clubs", "campus.research_projects"],
  "query_executed": "SELECT ..."
}
```

---

## 2. POST `/api/path`
Generate multi-step candidate journey paths.

**Request**:
```json
{
  "goal": "AI Engineer",
  "available_hours": 6.0
}
```

**Response**:
```json
{
  "paths": [
    {
      "path_id": "path_career_focus",
      "title": "Path A — Career & Industry Focus",
      "total_hours_per_week": 6.0,
      "steps": [ ... ],
      "metrics": { "goal_alignment": 92.0, "research_exposure": 40.0 }
    }
  ]
}
```

---

## 3. POST `/api/what-if`
Execute scenario modifications on candidate paths.

**Request**:
```json
{
  "base_path_id": "path_career_focus",
  "scenario": {
    "operation": "REPLACE",
    "target": "AI Club",
    "replacement_type": "Research"
  }
}
```

**Response**:
```json
{
  "original_path": { ... },
  "alternative_path": { ... },
  "changes": ["Removed 'AI Club'", "Added research 'RES_01'"],
  "metric_comparisons": [ ... ],
  "trade_offs": ["+ Research exposure increases from 40% to 90%"],
  "explanation": "What-If Transformation Complete..."
}
```

---

## 4. POST `/api/compare`
Side-by-side metric comparison of candidate paths.

---

## 5. GET `/api/opportunities`
Filterable directory endpoint supporting query parameters `type`, `skill`, `difficulty`, `max_hours`.
