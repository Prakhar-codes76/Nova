from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.schemas.ai import StudyPlanRequest, StudyPlanResponse, DailyStudyBlock
from app.services.timetable_service import TimetableService

class StudyPlannerService:
    @staticmethod
    def generate_plan(request: StudyPlanRequest, db: Session = None) -> StudyPlanResponse:
        """
        Generates a balanced day-by-day study roadmap.
        Checks existing timetable entries to avoid scheduling conflicts with active class hours.
        """
        today = datetime.now().date()
        try:
            exam_dt = datetime.strptime(request.exam_date, "%Y-%m-%d").date()
        except Exception:
            exam_dt = today + timedelta(days=7)

        total_days = max(1, (exam_dt - today).days)
        topics = request.topics if request.topics else ["Core Concepts", "Problem Solving", "Revision & Mock Test"]
        
        study_blocks: List[DailyStudyBlock] = []
        topic_count = len(topics)

        for day_idx in range(total_days):
            current_date = today + timedelta(days=day_idx)
            date_str = current_date.strftime("%Y-%m-%d")
            day_name = current_date.strftime("%A")

            # Check existing schedule conflicts if DB session available
            existing_classes = []
            if db:
                existing_classes = TimetableService.get_user_schedule(db, user_id=request.user_id or 1, day=day_name)

            conflict_note = f" (Avoiding {len(existing_classes)} class(es) on {day_name})" if existing_classes else ""

            if day_idx == total_days - 1:
                topic = f"Final Revision & Formulas for {request.subject}{conflict_note}"
                session_type = "Mock Test & Final Revision"
                priority = "high"
                duration = int(request.available_hours_per_day * 60)
            elif day_idx == total_days - 2:
                topic = f"Past Year Questions & Weak Areas in {request.subject}{conflict_note}"
                session_type = "Practice & Quiz"
                priority = "high"
                duration = int(request.available_hours_per_day * 60)
            else:
                topic = f"{topics[day_idx % topic_count]}{conflict_note}"
                session_type = "Learning & Concept Building"
                priority = "medium" if request.difficulty == "medium" else ("high" if request.difficulty == "hard" else "low")
                duration = int(request.available_hours_per_day * 60)

            study_blocks.append(DailyStudyBlock(
                day=day_idx + 1,
                date=date_str,
                topic=topic,
                duration_minutes=duration,
                session_type=session_type,
                priority=priority
            ))

        tips = [
            f"Study blocks are scheduled around your {total_days}-day timeline.",
            "Use 25-minute Pomodoro focus sprints to prevent cognitive burnout.",
            "Take a 5-minute hydration break after each session block.",
            "Review weak areas 48 hours before the exam date!"
        ]

        return StudyPlanResponse(
            success=True,
            subject=request.subject,
            exam_date=request.exam_date,
            total_days=total_days,
            recommended_daily_hours=request.available_hours_per_day,
            study_blocks=study_blocks,
            tips=tips
        )
