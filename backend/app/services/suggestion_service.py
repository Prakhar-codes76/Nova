from sqlalchemy.orm import Session
from datetime import datetime
from app.services.task_service import TaskService
from app.services.timetable_service import TimetableService
from app.services.focus_service import FocusService

class NovaSuggestionService:
    @staticmethod
    def get_dashboard_suggestions(db: Session, user_id: int = 1) -> list:
        """
        Generates data-driven contextual suggestions based on actual stored user data.
        """
        suggestions = []
        all_tasks = TaskService.get_user_tasks(db, user_id=user_id)
        
        delayed_tasks = [t for t in all_tasks if t.status == "delayed"]
        pending_tasks = [t for t in all_tasks if t.status == "pending"]
        high_priority = [t for t in pending_tasks if t.priority == "high"]
        
        # Rule 1: Delayed tasks check
        if delayed_tasks:
            suggestions.append({
                "type": "warning",
                "title": "Missed Tasks Detected",
                "message": f"You have {len(delayed_tasks)} delayed task(s) (e.g. '{delayed_tasks[0].title}'). Use quick reschedule to move them to tomorrow.",
                "action": "reschedule",
                "task_id": delayed_tasks[0].id
            })

        # Rule 2: High priority focus
        elif high_priority:
            suggestions.append({
                "type": "urgent",
                "title": "High Priority Focus",
                "message": f"Focus on '{high_priority[0].title}' ({high_priority[0].subject or 'General'}). It is tagged high priority with upcoming deadline.",
                "action": "start_task",
                "task_id": high_priority[0].id
            })

        # Rule 3: Timetable gap / free slot
        today_name = datetime.now().strftime("%A")
        today_classes = TimetableService.get_user_schedule(db, user_id=user_id, day=today_name)
        if len(today_classes) == 0:
            suggestions.append({
                "type": "info",
                "title": "No Classes Scheduled Today",
                "message": "You have a full free day! Perfect time to start a 25-minute Pomodoro focus session or plan for upcoming exams.",
                "action": "focus"
            })
        else:
            suggestions.append({
                "type": "schedule",
                "title": f"Next Class: {today_classes[0].subject}",
                "message": f"Class scheduled today from {today_classes[0].start_time} to {today_classes[0].end_time} in {today_classes[0].room or 'LH'}.",
                "action": "view_timetable"
            })

        # Rule 4: Focus session encouragement
        focus_history = FocusService.get_history(db, user_id=user_id)
        if not focus_history:
            suggestions.append({
                "type": "tip",
                "title": "Try Focus Mode",
                "message": "Boost your study productivity with a 25-minute Pomodoro sprint.",
                "action": "focus"
            })

        return suggestions
