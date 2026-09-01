from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_chat():
    response = client.post("/api/chat", json={"question": "I want to become an AI engineer"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "recommendations" in data

def test_paths():
    response = client.post("/api/path", json={"goal": "AI Engineer", "available_hours": 6.0})
    assert response.status_code == 200
    data = response.json()
    assert "paths" in data
    assert len(data["paths"]) >= 2

def test_what_if():
    payload = {
        "scenario": {
            "operation": "REPLACE",
            "target": "AI Club",
            "replacement_type": "Research"
        }
    }
    response = client.post("/api/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "original_path" in data
    assert "alternative_path" in data
    assert len(data["changes"]) > 0

def test_opportunities():
    response = client.get("/api/opportunities")
    assert response.status_code == 200
    assert len(response.json()) > 0
