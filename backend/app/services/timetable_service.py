from datetime import datetime
from sqlalchemy.orm import Session
from app.models.timetable import Timetable
from app.schemas.timetable import TimetableCreate

class TimetableService:
    @staticmethod
    def get_user_schedule(db: Session, user_id: int = 1, day: str = None):
        query = db.query(Timetable).filter(Timetable.user_id == user_id)
        if day:
            query = query.filter(Timetable.day.ilike(day))
        return query.order_by(Timetable.start_time).all()

    @staticmethod
    def add_entry(db: Session, entry: TimetableCreate, user_id: int = 1):
        db_entry = Timetable(
            user_id=user_id,
            subject=entry.subject,
            day=entry.day,
            start_time=entry.start_time,
            end_time=entry.end_time,
            room=entry.room
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry

    @staticmethod
    def delete_entry(db: Session, entry_id: int, user_id: int = 1):
        db_entry = db.query(Timetable).filter(Timetable.id == entry_id, Timetable.user_id == user_id).first()
        if not db_entry:
            return False
        db.delete(db_entry)
        db.commit()
        return True

    @staticmethod
    def get_next_activity(db: Session, user_id: int = 1):
        today = datetime.now().strftime("%A")
        now_time = datetime.now().strftime("%H:%M")
        
        # Look for upcoming class today
        today_entries = db.query(Timetable).filter(
            Timetable.user_id == user_id,
            Timetable.day.ilike(today),
            Timetable.start_time >= now_time
        ).order_by(Timetable.start_time).all()

        if today_entries:
            next_class = today_entries[0]
            return {
                "type": "class",
                "subject": next_class.subject,
                "time": f"{next_class.start_time} - {next_class.end_time}",
                "room": next_class.room or "TBD",
                "day": "Today"
            }
        
        # If no more classes today, get first class for tomorrow or upcoming day
        all_entries = db.query(Timetable).filter(Timetable.user_id == user_id).order_by(Timetable.start_time).all()
        if all_entries:
            next_class = all_entries[0]
            return {
                "type": "class",
                "subject": next_class.subject,
                "time": f"{next_class.start_time} - {next_class.end_time}",
                "room": next_class.room or "TBD",
                "day": next_class.day
            }

        return None
