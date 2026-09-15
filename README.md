# NOVA — AI STUDENT LIFE ASSISTANT

> **One intelligent assistant that understands the student's daily routine and helps them plan, execute and improve it.**

Nova is a full-stack, hackathon-ready AI Student Life Assistant combining AI chat, ElevenLabs voice integration, timetable management, smart task prioritization, delay detection, study planning, focus sessions, and progress analytics.

---

## 🌟 Key Features

1. **Intelligent Dashboard**: Displays today's overview, upcoming classes, today's tasks with priority badges, and weekly productivity analytics.
2. **Tool-Call Architecture**: Nova doesn't just chat — it calls backend tools (`add_task`, `reschedule_task`, `complete_task`, `get_today_schedule`, `create_study_plan`, `start_focus_session`) to alter real database state.
3. **ElevenLabs Voice Integration**: Real-time voice agent modal supporting microphone input, state transitions (`LISTENING`, `THINKING`, `SPEAKING`), and audio visualizer animation.
4. **Smart Priority Engine**: Calculates dynamic task urgency based on deadline proximity and explicit priority, offering human-readable explanations.
5. **Gentle Delay Detection**: Automatically flags past-due tasks as `delayed` with non-shaming prompts to move them to tomorrow.
6. **AI Study Roadmap Generator**: Generates day-by-day study sessions based on exam dates and available daily hours.
7. **Pomodoro Focus Timer**: Interactive 25-min focus / 5-min break timer recording completed sessions to database.
8. **Progress Analytics**: Real statistics tracking task completion rate and focus minutes.
9. **Global Search**: Search across tasks, timetable entries, and course subjects.

---

## 🏗️ Architecture

```
Nova/
├── backend/
│   ├── app/
│   │   ├── main.py (FastAPI App Entrypoint)
│   │   ├── config.py
│   │   ├── database.py (SQLAlchemy + SQLite)
│   │   ├── models/ (User, Task, Timetable, FocusSession, StudySession)
│   │   ├── schemas/ (Pydantic Request/Response validation)
│   │   ├── routes/ (API Endpoints: /tasks, /timetable, /focus, /ai, /progress, /search, /users)
│   │   ├── services/ (TaskService, TimetableService, PriorityEngine, StudyPlannerService)
│   │   ├── ai/ (AIService, ToolRegistry, IntentParser, Gemini Integration)
│   │   └── seed_data.py (Seed data script for Prakhar, B.Tech CSE)
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/ (Dashboard, Tasks, Timetable, Focus, Voice, Common)
│   │   ├── pages/ (DashboardPage, TasksPage, TimetablePage, AIChatPage, StudyPlannerPage, FocusPage, ProgressPage, ProfilePage)
│   │   ├── services/ (api.js, aiService.js, elevenlabsService.js)
│   │   ├── context/ (AppContext.jsx)
│   │   ├── index.css (Modern Dark Glassmorphic Design System)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
```

---

## 🚀 Quick Setup & Run Instructions

### 1. Backend Setup (FastAPI)

Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate Python virtual environment:
- **Windows (PowerShell)**:
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- **Linux/macOS**:
  ```bash
  python -m venv venv
  source venv/bin/activate
  ```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Run FastAPI Backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
*The database table creation and demo seeding (for user Prakhar) will execute automatically on launch.*

---

### 2. Frontend Setup (React + Vite)

Open a new terminal window and navigate to the `frontend` directory:
```bash
cd frontend
```

Install npm packages:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables Configuration

### Backend (`backend/.env`)
- `PORT=8000`
- `DATABASE_URL=sqlite:///./nova.db`
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key. If left empty, Nova uses its built-in rule-based Intent Engine to execute all backend tool calls offline without breaking.

### Frontend (`frontend/.env` or system env)
- `VITE_ELEVENLABS_AGENT_ID`: *(Optional)* Your ElevenLabs Voice Agent ID. If left empty, Nova runs in visual voice simulation mode allowing demo voice triggers via microphone and text inputs.

---

## 🧪 Testing Verification Performed

- **Backend Health & APIs**: Verified `GET /api/health`, `GET /api/tasks`, `POST /api/tasks`, `GET /api/timetable`, `POST /api/ai/chat`, `POST /api/focus/start`.
- **Database Seeding**: Database auto-initializes with demo user (Prakhar), realistic timetable, pending and delayed tasks.
- **Frontend Build**: Built with zero compilation errors (`npm run build`).
