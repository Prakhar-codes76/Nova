from datetime import datetime
from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskReschedule
from app.services.priority_engine import check_task_delays, calculate_priority_score

class TaskService:
    @staticmethod
    def get_user_tasks(db: Session, user_id: int = 1, status: str = None):
        query = db.query(Task).filter(Task.user_id == user_id)
        if status:
            query = query.filter(Task.status == status)
        tasks = query.all()
        # Perform live delay check on fetched pending tasks
        check_task_delays(tasks)
        db.commit()
        return tasks

    @staticmethod
    def get_task_by_id(db: Session, task_id: int, user_id: int = 1):
        return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()

    @staticmethod
    def create_task(db: Session, task_data: TaskCreate, user_id: int = 1):
        db_task = Task(
            user_id=user_id,
            title=task_data.title,
            description=task_data.description,
            subject=task_data.subject,
            priority=task_data.priority or "medium",
            status="pending",
            due_date=task_data.due_date or datetime.now().strftime("%Y-%m-%d"),
            due_time=task_data.due_time or "20:00"
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def update_task(db: Session, task_id: int, task_data: TaskUpdate, user_id: int = 1):
        db_task = TaskService.get_task_by_id(db, task_id, user_id)
        if not db_task:
            return None
        
        update_dict = task_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_task, field, value)
        
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def complete_task(db: Session, task_id: int, user_id: int = 1):
        db_task = TaskService.get_task_by_id(db, task_id, user_id)
        if not db_task:
            return None
        db_task.status = "completed"
        db_task.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def reschedule_task(db: Session, task_id: int, reschedule_data: TaskReschedule, user_id: int = 1):
        db_task = TaskService.get_task_by_id(db, task_id, user_id)
        if not db_task:
            return None
        db_task.due_date = reschedule_data.due_date
        if reschedule_data.due_time:
            db_task.due_time = reschedule_data.due_time
        db_task.status = "pending"
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def delete_task(db: Session, task_id: int, user_id: int = 1):
        db_task = TaskService.get_task_by_id(db, task_id, user_id)
        if not db_task:
            return False
        db.delete(db_task)
        db.commit()
        return True
