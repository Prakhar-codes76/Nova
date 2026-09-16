from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.focus import FocusSession
from app.models.task import Task
from app.services.task_service import TaskService
from app.services.focus_service import FocusService
from app.utils.security import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress Analytics"])

@router.get("")
def get_progress_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = today_start - timedelta(days=today_start.weekday()) # Monday of current week
    month_start = datetime(now.year, now.month, 1)

    # 1. Task Statistics
    all_tasks = TaskService.get_user_tasks(db, user_id=current_user.id)
    completed_tasks = [t for t in all_tasks if t.status == "completed"]
    pending_tasks = [t for t in all_tasks if t.status == "pending"]
    delayed_tasks = [t for t in all_tasks if t.status == "delayed"]
    total_tasks = len(all_tasks)
    completion_rate = round((len(completed_tasks) / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    # Today's completed tasks
    today_completed_tasks = [
        t for t in completed_tasks 
        if t.created_at and t.created_at >= today_start
    ]

    # 2. Focus Sessions
    focus_history = db.query(FocusSession).filter(
        FocusSession.user_id == current_user.id,
        FocusSession.completed == True
    ).order_by(FocusSession.started_at.asc()).all()

    total_focus_time = sum(f.duration for f in focus_history)

    # Today's focus sessions
    today_focus_sessions = [f for f in focus_history if f.started_at and f.started_at >= today_start]
    today_study_minutes = sum(f.duration for f in today_focus_sessions)

    # 3. Calculate Streaks & Active Days
    active_dates = set()
    for f in focus_history:
        if f.started_at:
            active_dates.add(f.started_at.date())
    for t in completed_tasks:
        if t.created_at:
            active_dates.add(t.created_at.date())

    active_days_count = len(active_dates)

    # Streak calculation
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    check_date = today_start.date()

    # Check current streak
    if check_date in active_dates or (check_date - timedelta(days=1)) in active_dates:
        curr = check_date if check_date in active_dates else (check_date - timedelta(days=1))
        while curr in active_dates:
            current_streak += 1
            curr -= timedelta(days=1)

    # Longest streak calculation
    sorted_dates = sorted(list(active_dates))
    if sorted_dates:
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(sorted_dates)):
            if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                temp_streak += 1
                if temp_streak > longest_streak:
                    longest_streak = temp_streak
            elif (sorted_dates[i] - sorted_dates[i-1]).days > 1:
                temp_streak = 1
    else:
        longest_streak = current_streak

    # 4. Productivity Score Calculation (0 - 100%)
    target_daily_minutes = (current_user.daily_study_hours or 2.0) * 60
    study_ratio = min(1.0, today_study_minutes / target_daily_minutes) if target_daily_minutes > 0 else 0.5
    task_ratio = (len(completed_tasks) / total_tasks) if total_tasks > 0 else 0.5
    streak_bonus = min(0.2, current_streak * 0.04)
    raw_score = (study_ratio * 45) + (task_ratio * 40) + (streak_bonus * 15)
    productivity_score = min(100, max(0, round(raw_score)))

    # 5. Build Hourly Today Analytics (8 AM to 10 PM)
    hours_labels = ["08 AM", "10 AM", "12 PM", "02 PM", "04 PM", "06 PM", "08 PM", "10 PM"]
    today_hourly = []
    for idx, h_str in enumerate(hours_labels):
        h_val = 8 + (idx * 2) # 8, 10, 12, 14, 16, 18, 20, 22
        # Sum minutes for sessions starting in interval [h_val, h_val+2)
        mins = sum(
            f.duration for f in today_focus_sessions 
            if f.started_at and h_val <= f.started_at.hour < h_val + 2
        )
        today_hourly.append({"label": h_str, "focus_minutes": mins})

    # 6. Build Week Analytics (Mon - Sun)
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    week_activity = []
    for day_idx, day_name in enumerate(days_of_week):
        target_day_date = (week_start + timedelta(days=day_idx)).date()
        day_focus = [f for f in focus_history if f.started_at and f.started_at.date() == target_day_date]
        day_mins = sum(f.duration for f in day_focus)
        day_tasks = len([t for t in completed_tasks if t.created_at and t.created_at.date() == target_day_date])
        week_activity.append({
            "day": day_name,
            "date": target_day_date.strftime("%Y-%m-%d"),
            "focus_minutes": day_mins,
            "tasks_completed": day_tasks,
            "focus_sessions": len(day_focus)
        })

    # 7. Build Month Analytics (Past 30 days)
    month_activity = []
    for i in range(29, -1, -1):
        d = (today_start - timedelta(days=i)).date()
        mins = sum(f.duration for f in focus_history if f.started_at and f.started_at.date() == d)
        tasks_cnt = len([t for t in completed_tasks if t.created_at and t.created_at.date() == d])
        month_activity.append({
            "date": d.strftime("%d %b"),
            "focus_minutes": mins,
            "tasks_completed": tasks_cnt
        })

    # Check if user has sufficient data
    has_sufficient_data = len(focus_history) > 0 or len(completed_tasks) > 0

    return {
        "success": True,
        "has_sufficient_data": has_sufficient_data,
        "productivity_score": productivity_score,
        "summary": {
            "tasks_completed": len(completed_tasks),
            "tasks_pending": len(pending_tasks),
            "tasks_delayed": len(delayed_tasks),
            "total_tasks": total_tasks,
            "total_focus_time_minutes": total_focus_time,
            "completion_rate_percentage": completion_rate,
            "today_study_minutes": today_study_minutes,
            "today_tasks_completed": len(today_completed_tasks),
            "today_focus_sessions": len(today_focus_sessions),
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "active_days_count": active_days_count
        },
        "consistency": {
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "active_days": active_days_count,
            "weekly_consistency": min(100, round((active_days_count / 7) * 100)) if active_days_count <= 7 else 100,
            "monthly_consistency": min(100, round((active_days_count / 30) * 100))
        },
        "today_hourly": today_hourly,
        "weekly_activity": week_activity,
        "monthly_activity": month_activity
    }
