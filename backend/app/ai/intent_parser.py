import re
from datetime import datetime, timedelta

class ConversationContextManager:
    _session_context = {}

    @classmethod
    def get_context(cls, user_id: int = 1) -> dict:
        return cls._session_context.get(user_id, {})

    @classmethod
    def update_context(cls, user_id: int = 1, context_data: dict = None):
        if user_id not in cls._session_context:
            cls._session_context[user_id] = {}
        if context_data:
            cls._session_context[user_id].update(context_data)

    @classmethod
    def clear_context(cls, user_id: int = 1):
        cls._session_context[user_id] = {}


class IntentParser:
    @staticmethod
    def parse_user_intent(message: str, user_id: int = 1) -> dict:
        """
        Parses multilingual natural language queries into structured backend intents.
        Supports multi-turn follow-up context.
        """
        msg_lower = message.lower().strip()
        context = ConversationContextManager.get_context(user_id)

        # Multi-turn context resolution: If waiting for time input
        if context.get("awaiting_param") == "task_time":
            time_match = re.search(r'(\d{1,2})\s*(pm|am|baje)?', msg_lower)
            if time_match:
                hr = int(time_match.group(1))
                if "pm" in msg_lower or hr < 7:
                    hr = (hr + 12) if hr < 12 else hr
                due_time = f"{hr:02d}:00"

                title = context.get("pending_title", "Task")
                due_date = context.get("pending_date", datetime.now().strftime("%Y-%m-%d"))

                ConversationContextManager.clear_context(user_id)
                return {
                    "intent": "ADD_TASK",
                    "tool": "add_task",
                    "args": {"title": title, "due_date": due_date, "due_time": due_time, "subject": "General"}
                }

        # IDENTITY_QUERY
        if any(k in msg_lower for k in [
            "who are you", "what is your name", "who am i talking to", 
            "what should i call you", "who are u", "your name", 
            "whats your name", "what's your name", "who's this", 
            "who is this", "tell me your name", "apka naam", 
            "aapka naam", "tu kaun hai", "kaun ho"
        ]):
            return {"intent": "IDENTITY_QUERY", "tool": None, "args": {}}

        # VIEW_SCHEDULE / TIMETABLE
        if any(k in msg_lower for k in ["schedule", "timetable", "class", "classes", "kya scene hai", "aaj ka scene", "routine", "sollu"]):
            return {"intent": "VIEW_SCHEDULE", "tool": "get_today_schedule", "args": {}}

        # COMPLETE_TASK
        if any(k in msg_lower for k in ["complete", "completed", "finish", "done", "mark done", "kar diya", "ho gaya"]):
            title = msg_lower.replace("complete", "").replace("mark", "").replace("done", "").replace("ho gaya", "").replace("kar diya", "").strip()
            return {"intent": "COMPLETE_TASK", "tool": "complete_task", "args": {"title": title if len(title) > 2 else ""}}

        # RESCHEDULE_TASK
        if any(k in msg_lower for k in ["reschedule", "shift", "postpone", "move", "delay", "baje kar de"]):
            time_match = re.search(r'(\d{1,2})\s*(pm|am|baje)?', msg_lower)
            due_time = "20:00"
            if time_match:
                hr = int(time_match.group(1))
                if "pm" in msg_lower or hr < 7:
                    hr = (hr + 12) if hr < 12 else hr
                due_time = f"{hr:02d}:00"

            due_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d") if any(k in msg_lower for k in ["tomorrow", "kal", "next day"]) else datetime.now().strftime("%Y-%m-%d")
            title = re.sub(r'(reschedule|shift|postpone|move|delay|tomorrow|kal|\d{1,2}\s*(pm|am|baje)?)', '', msg_lower).strip()

            return {"intent": "RESCHEDULE_TASK", "tool": "reschedule_task", "args": {"title": title, "due_date": due_date, "due_time": due_time}}

        # START_FOCUS
        if any(k in msg_lower for k in ["focus", "pomodoro", "timer", "study mode", "concentration"]):
            duration_match = re.search(r'(\d+)\s*(min|minute|mins)', msg_lower)
            duration = int(duration_match.group(1)) if duration_match else 25
            return {"intent": "START_FOCUS", "tool": "start_focus_session", "args": {"duration": duration}}

        # CREATE_STUDY_PLAN
        if any(k in msg_lower for k in ["study plan", "plan my exam", "exam coming", "roadmap", "exam hai", "preparation"]):
            subject = "Mathematics"
            if "dsa" in msg_lower or "data structure" in msg_lower:
                subject = "Data Structures"
            elif "python" in msg_lower:
                subject = "Python Programming"
            elif "coa" in msg_lower or "computer organization" in msg_lower:
                subject = "Computer Organization"

            return {
                "intent": "CREATE_STUDY_PLAN",
                "tool": "create_study_plan",
                "args": {
                    "subject": subject,
                    "exam_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
                    "topics": [f"{subject} Fundamentals", "Core Problem Solving", "Practice Problems", "Final Review"]
                }
            }

        # ADD_TASK (with incomplete info detection)
        if any(k in msg_lower for k in ["add task", "add", "remind me", "schedule task", "task banao", "kar dena"]):
            time_match = re.search(r'(\d{1,2})\s*(pm|am|baje)?', msg_lower)
            due_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d") if any(k in msg_lower for k in ["tomorrow", "kal"]) else datetime.now().strftime("%Y-%m-%d")
            clean_title = re.sub(r'(add task|add|remind me|schedule task|task banao|tomorrow|kal|\d{1,2}\s*(pm|am|baje)?)', '', msg_lower).strip()

            if not time_match and clean_title:
                # Save pending context for follow-up
                ConversationContextManager.update_context(user_id, {
                    "awaiting_param": "task_time",
                    "pending_title": clean_title.capitalize(),
                    "pending_date": due_date
                })
                return {
                    "intent": "AWAITING_PARAM",
                    "tool": None,
                    "args": {},
                    "prompt": f"Got it! What time should I schedule '{clean_title.capitalize()}'?"
                }

            due_time = "20:00"
            if time_match:
                hr = int(time_match.group(1))
                if "pm" in msg_lower or hr < 7:
                    hr = (hr + 12) if hr < 12 else hr
                due_time = f"{hr:02d}:00"

            return {"intent": "ADD_TASK", "tool": "add_task", "args": {"title": (clean_title or "New Task").capitalize(), "subject": "General", "due_date": due_date, "due_time": due_time}}

        # VIEW_PROGRESS
        if any(k in msg_lower for k in ["progress", "analytics", "stats", "performance", "score"]):
            return {"intent": "VIEW_PROGRESS", "tool": "get_progress", "args": {}}

        # VIEW_TASKS
        if any(k in msg_lower for k in ["task", "tasks", "pending", "todo", "kya baaki hai"]):
            return {"intent": "VIEW_TASKS", "tool": "get_pending_tasks", "args": {}}

        return {"intent": "GENERAL_CHAT", "tool": None, "args": {}}
