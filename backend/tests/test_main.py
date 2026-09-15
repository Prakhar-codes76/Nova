import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_auth_and_profile_persistence():
    uid = str(uuid.uuid4())[:8]
    email = f"alpha_{uid}@test.com"
    # 1. Register User A
    user_a = {
        "name": "User Alpha",
        "email": email,
        "password": "Password123!"
    }
    reg_a = client.post("/api/auth/register", json=user_a)
    assert reg_a.status_code == 200
    token_a = reg_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Duplicate registration attempt should return 400
    dup = client.post("/api/auth/register", json=user_a)
    assert dup.status_code == 400
    assert "already exists" in dup.json()["detail"]

    # 3. Get profile for User A
    prof_a = client.get("/api/profile", headers=headers_a)
    assert prof_a.status_code == 200
    assert prof_a.json()["name"] == "User Alpha"

    # 4. Update User A profile (change daily_study_hours 3.0 -> 4.5)
    update_data = {
        "college": "IIT Delhi",
        "course": "B.Tech AI",
        "daily_study_hours": 4.5
    }
    upd_res = client.put("/api/profile", json=update_data, headers=headers_a)
    assert upd_res.status_code == 200
    assert upd_res.json()["daily_study_hours"] == 4.5

    # 5. Verify DB persistence by fetching profile again
    refreshed_prof = client.get("/api/profile", headers=headers_a)
    assert refreshed_prof.status_code == 200
    assert refreshed_prof.json()["college"] == "IIT Delhi"
    assert refreshed_prof.json()["daily_study_hours"] == 4.5

def test_multi_user_data_isolation():
    uid_b = str(uuid.uuid4())[:8]
    uid_c = str(uuid.uuid4())[:8]
    # Register User B
    user_b = {
        "name": "User Beta",
        "email": f"beta_{uid_b}@test.com",
        "password": "Password123!"
    }
    reg_b = client.post("/api/auth/register", json=user_b)
    assert reg_b.status_code == 200
    token_b = reg_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User B creates Task B
    task_b = {
        "title": "Secret Task for User Beta",
        "subject": "Private",
        "priority": "high",
        "due_date": "2026-12-01",
        "due_time": "12:00"
    }
    create_b = client.post("/api/tasks", json=task_b, headers=headers_b)
    assert create_b.status_code == 200
    task_b_id = create_b.json()["id"]

    # Register User C
    user_c = {
        "name": "User Gamma",
        "email": f"gamma_{uid_c}@test.com",
        "password": "Password123!"
    }
    reg_c = client.post("/api/auth/register", json=user_c)
    assert reg_c.status_code == 200
    token_c = reg_c.json()["access_token"]
    headers_c = {"Authorization": f"Bearer {token_c}"}

    # User C lists tasks — must NOT see User B's task!
    tasks_c = client.get("/api/tasks", headers=headers_c)
    assert tasks_c.status_code == 200
    titles_c = [t["title"] for t in tasks_c.json()]
    assert "Secret Task for User Beta" not in titles_c

def test_voice_webhooks_authenticated():
    uid_v = str(uuid.uuid4())[:8]
    user_v = {
        "name": "Voice User",
        "email": f"voice_{uid_v}@test.com",
        "password": "Password123!"
    }
    reg_v = client.post("/api/auth/register", json=user_v)
    assert reg_v.status_code == 200
    token_v = reg_v.json()["access_token"]
    headers_v = {"Authorization": f"Bearer {token_v}"}

    # Voice Add Task
    add_payload = {
        "title": "Voice Created Task",
        "due_date": "2026-11-01",
        "due_time": "19:00"
    }
    add_res = client.post("/api/voice/add-task", json=add_payload, headers=headers_v)
    assert add_res.status_code == 200
    assert add_res.json()["success"] is True

    # Voice Get Pending Tasks
    get_res = client.post("/api/voice/get-pending-tasks", headers=headers_v)
    assert get_res.status_code == 200
    assert get_res.json()["success"] is True

