import os
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import User, Task, Timetable, FocusSession, StudySession
from app.utils.security import hash_password

def seed_database():
    print("Initializing Database schema...")
    # Drop and recreate tables if schema updated
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if hashed_password column exists on user table
        demo_user = db.query(User).filter(User.id == 1).first()
        if demo_user and hasattr(demo_user, 'hashed_password') and demo_user.hashed_password:
            print("Demo database already seeded.")
            return
        elif demo_user:
            # Update legacy demo user with default password
            demo_user.hashed_password = hash_password("Password123!")
            demo_user.study_goal = "Maintain 9.0+ GPA and master algorithms"
            demo_user.daily_study_hours = 3.0
            db.commit()
            print("Updated legacy demo user credentials.")
            return

        print("Seeding demo data for Prakhar...")

        # 1. Demo User
        demo_user = User(
            id=1,
            name="Prakhar",
            email="prakhar.cse@college.edu",
            hashed_password=hash_password("Password123!"),
            college="Indian Institute of Technology",
            course="B.Tech CSE",
            year="2nd Year",
            study_goal="Maintain 9.0+ GPA and master algorithms",
            daily_study_hours=3.0,
            preferred_language="Hinglish"
        )
        db.add(demo_user)
        db.commit()

        # 2. Demo Tasks
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        next_week = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

        tasks = [
            Task(user_id=1, title="DSA Assignment — Graph Algorithms", description="Implement Dijkstra and Kruskal in C++", subject="Data Structures", priority="high", status="pending", due_date=tomorrow, due_time="23:59"),
            Task(user_id=1, title="Python Practice — FastAPI Microservices", description="Build REST APIs for project submission", subject="Python", priority="medium", status="pending", due_date=today, due_time="19:00"),
            Task(user_id=1, title="Maths Revision — Linear Algebra & Matrices", description="Solve textbook Chapter 4 problems", subject="Mathematics", priority="high", status="pending", due_date=next_week, due_time="21:00"),
            Task(user_id=1, title="COA Unit 1 Revision", description="Pipeline hazards and cache mapping exercises", subject="Computer Organization", priority="low", status="completed", due_date=today, due_time="15:00", completed_at=datetime.utcnow()),
            Task(user_id=1, title="Submit Lab Report", description="Microprocessor 8086 assembly experiment report", subject="COA Lab", priority="high", status="delayed", due_date=yesterday, due_time="18:00")
        ]
        db.add_all(tasks)

        # 3. Demo Timetable
        timetables = [
            Timetable(user_id=1, subject="Data Structures", day="Monday", start_time="09:00", end_time="10:30", room="LH-101"),
            Timetable(user_id=1, subject="Python Programming", day="Monday", start_time="11:00", end_time="12:30", room="CS Lab 2"),
            Timetable(user_id=1, subject="Mathematics III", day="Tuesday", start_time="10:00", end_time="11:30", room="LH-203"),
            Timetable(user_id=1, subject="Computer Organization", day="Tuesday", start_time="14:00", end_time="15:30", room="LH-105"),
            Timetable(user_id=1, subject="Data Structures Lab", day="Wednesday", start_time="11:00", end_time="13:00", room="CS Lab 1"),
            Timetable(user_id=1, subject="Mathematics III", day="Thursday", start_time="09:30", end_time="11:00", room="LH-203"),
            Timetable(user_id=1, subject="Python Project", day="Friday", start_time="14:00", end_time="16:00", room="CS Lab 3")
        ]
        db.add_all(timetables)

        # 4. Demo Focus Sessions
        focus_sessions = [
            FocusSession(user_id=1, duration=25, completed=True, started_at=datetime.utcnow() - timedelta(hours=2)),
            FocusSession(user_id=1, duration=50, completed=True, started_at=datetime.utcnow() - timedelta(days=1)),
            FocusSession(user_id=1, duration=25, completed=True, started_at=datetime.utcnow() - timedelta(days=2))
        ]
        db.add_all(focus_sessions)

        db.commit()
        print("Demo data seeded successfully!")
    except Exception as e:
        print(f"Seed note: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # If nova.db exists locally, reset tables to match new schema
    db_file = "nova.db"
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
            print("Reset old SQLite database for schema update.")
        except Exception:
            pass
    seed_database()
