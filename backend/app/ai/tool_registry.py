from sqlalchemy.orm import Session
from app.models.user import User
from app.models.task import Task
from app.services.task_service import TaskService
from app.services.timetable_service import TimetableService
from app.services.study_planner_service import StudyPlannerService
from app.services.focus_service import FocusService
from app.schemas.task import TaskCreate, TaskReschedule
from app.schemas.ai import StudyPlanRequest
from app.schemas.focus import FocusStart
from datetime import datetime

class ToolRegistry:
    @staticmethod
    def execute_tool(tool_name: str, args: dict, db: Session, user_id: int = 1) -> dict:
        try:
            if tool_name == "get_user_profile":
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    return {"success": True, "user": {"id": user.id, "name": user.name, "course": user.course, "year": user.year, "college": user.college, "language": user.preferred_language}}
                return {"success": False, "message": "User not found"}

            elif tool_name == "get_today_schedule":
                today = datetime.now().strftime("%A")
                schedule = TimetableService.get_user_schedule(db, user_id=user_id, day=today)
                return {"success": True, "day": today, "schedule": [{"id": s.id, "subject": s.subject, "start": s.start_time, "end": s.end_time, "room": s.room} for s in schedule]}

            elif tool_name == "get_week_schedule":
                schedule = TimetableService.get_user_schedule(db, user_id=user_id)
                return {"success": True, "schedule": [{"id": s.id, "subject": s.subject, "day": s.day, "start": s.start_time, "end": s.end_time, "room": s.room} for s in schedule]}

            elif tool_name == "get_pending_tasks":
                tasks = TaskService.get_user_tasks(db, user_id=user_id, status="pending")
                return {"success": True, "tasks": [{"id": t.id, "title": t.title, "subject": t.subject, "priority": t.priority, "due_date": t.due_date, "due_time": t.due_time} for t in tasks]}

            elif tool_name == "get_task":
                task_id = args.get("task_id")
                task = TaskService.get_task_by_id(db, task_id=task_id, user_id=user_id)
                if task:
                    return {"success": True, "task": {"id": task.id, "title": task.title, "status": task.status, "priority": task.priority, "due_date": task.due_date}}
                return {"success": False, "message": "Task not found"}

            elif tool_name == "add_task":
                title = args.get("title", "New Task")
                subject = args.get("subject", "General")
                due_date = args.get("due_date", datetime.now().strftime("%Y-%m-%d"))
                due_time = args.get("due_time", "20:00")
                priority = args.get("priority", "medium")

                task = TaskService.create_task(db, TaskCreate(
                    title=title, subject=subject, due_date=due_date, due_time=due_time, priority=priority
                ), user_id=user_id)

                return {"success": True, "message": f"Task '{task.title}' added successfully", "task": {"id": task.id, "title": task.title, "due_date": task.due_date, "due_time": task.due_time}}

            elif tool_name == "complete_task":
                task_id = args.get("task_id")
                # If title provided instead of ID, search by title
                if not task_id and args.get("title"):
                    title_query = args.get("title").lower()
                    all_tasks = TaskService.get_user_tasks(db, user_id=user_id)
                    for t in all_tasks:
                        if title_query in t.title.lower() or title_query in (t.subject or "").lower():
                            task_id = t.id
                            break

                if task_id:
                    task = TaskService.complete_task(db, task_id=task_id, user_id=user_id)
                    if task:
                        return {"success": True, "message": f"Task '{task.title}' marked completed", "task_id": task.id}

                return {"success": False, "message": "Task not found to complete"}

            elif tool_name == "reschedule_task":
                task_id = args.get("task_id")
                new_date = args.get("due_date", datetime.now().strftime("%Y-%m-%d"))
                new_time = args.get("due_time")

                if not task_id and args.get("title"):
                    title_query = args.get("title").lower()
                    all_tasks = TaskService.get_user_tasks(db, user_id=user_id)
                    for t in all_tasks:
                        if title_query in t.title.lower():
                            task_id = t.id
                            break

                if task_id:
                    task = TaskService.reschedule_task(db, task_id, TaskReschedule(due_date=new_date, due_time=new_time), user_id=user_id)
                    if task:
                        return {"success": True, "message": f"Task '{task.title}' rescheduled to {task.due_date} {task.due_time or ''}", "task": {"id": task.id, "due_date": task.due_date, "due_time": task.due_time}}
                
                return {"success": False, "message": "Task not found to reschedule"}

            elif tool_name == "delete_task":
                task_id = args.get("task_id")
                if not task_id and args.get("title"):
                    title_query = args.get("title").lower()
                    all_tasks = TaskService.get_user_tasks(db, user_id=user_id)
                    for t in all_tasks:
                        if title_query in t.title.lower():
                            task_id = t.id
                            break
                if task_id and TaskService.delete_task(db, task_id, user_id=user_id):
                    return {"success": True, "message": f"Task #{task_id} deleted"}
                return {"success": False, "message": "Unable to delete task"}

            elif tool_name == "create_study_plan":
                subject = args.get("subject", "Maths")
                exam_date = args.get("exam_date", (datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d") if hasattr(datetime, 'timedelta') else "2026-09-25")
                topics = args.get("topics", ["Unit 1 Concepts", "Problem Solving", "Revision"])
                plan = StudyPlannerService.generate_plan(StudyPlanRequest(
                    subject=subject, exam_date=exam_date, topics=topics, user_id=user_id
                ))
                return {"success": True, "plan": plan.dict()}

            elif tool_name == "start_focus_session":
                duration = args.get("duration", 25)
                session = FocusService.start_session(db, FocusStart(duration=duration), user_id=user_id)
                return {"success": True, "message": f"{duration} minute focus session started", "session_id": session.id}

            elif tool_name == "get_progress":
                all_tasks = TaskService.get_user_tasks(db, user_id=user_id)
                completed = [t for t in all_tasks if t.status == "completed"]
                pending = [t for t in all_tasks if t.status == "pending"]
                delayed = [t for t in all_tasks if t.status == "delayed"]
                focus = FocusService.get_history(db, user_id=user_id)
                total_focus_min = sum([f.duration for f in focus if f.completed])
                return {
                    "success": True,
                    "stats": {
                        "completed_tasks": len(completed),
                        "pending_tasks": len(pending),
                        "delayed_tasks": len(delayed),
                        "total_tasks": len(all_tasks),
                        "total_focus_minutes": total_focus_min,
                        "completion_rate": round(len(completed) / max(1, len(all_tasks)) * 100, 1)
                    }
                }

            return {"success": False, "message": f"Unknown tool: {tool_name}"}

        except Exception as e:
            return {"success": False, "message": f"Tool execution failed: {str(e)}"}
