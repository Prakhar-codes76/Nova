from datetime import datetime, date

class TaskPriorityService:
    @staticmethod
    def calculate_priority_score(due_date_str: str, due_time_str: str = None, explicit_priority: str = "medium", status: str = "pending") -> dict:
        """
        Transparent dynamic priority engine.
        Calculates a priority score (0-10) using deadline proximity, user tag, and status.
        Returns calculated level ('high', 'medium', 'low'), numerical score, and reasoning string.
        """
        explicit_map = {"low": 0, "medium": 2, "high": 4}
        base_user_score = explicit_map.get((explicit_priority or "medium").lower(), 2)

        if status == "completed":
            return {
                "priority": "low",
                "score": 0,
                "explanation": "Task is completed."
            }

        if not due_date_str:
            return {
                "priority": explicit_priority or "medium",
                "score": 3 + base_user_score,
                "explanation": f"No due date set. Tagged as {explicit_priority}."
            }

        try:
            today = date.today()
            task_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
            diff_days = (task_date - today).days

            if diff_days < 0 or status == "delayed":
                score = min(10, 8 + base_user_score)
                return {
                    "priority": "high",
                    "score": score,
                    "explanation": f"Task is overdue by {abs(diff_days)} day(s)! Urgent attention required."
                }
            elif diff_days == 0:
                score = min(10, 7 + base_user_score)
                return {
                    "priority": "high",
                    "score": score,
                    "explanation": "Due today! High urgency for completion."
                }
            elif diff_days == 1:
                score = 5 + base_user_score
                p_level = "high" if base_user_score >= 2 else "medium"
                return {
                    "priority": p_level,
                    "score": score,
                    "explanation": "Due tomorrow. Plan to complete today."
                }
            elif diff_days <= 3:
                score = 3 + base_user_score
                return {
                    "priority": "medium",
                    "score": score,
                    "explanation": f"Due in {diff_days} days. On track."
                }
            else:
                score = max(1, 1 + base_user_score)
                return {
                    "priority": "low" if score < 4 else "medium",
                    "score": score,
                    "explanation": f"Due in {diff_days} days. Sufficient preparation window."
                }
        except Exception as e:
            return {
                "priority": explicit_priority or "medium",
                "score": 3,
                "explanation": f"Priority calculation defaulted: {str(e)}"
            }

    @staticmethod
    def check_task_delays(tasks: list) -> list:
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        current_time_str = now.strftime("%H:%M")

        for task in tasks:
            if task.status == "pending" and task.due_date:
                if task.due_date < today_str:
                    task.status = "delayed"
                elif task.due_date == today_str and task.due_time and task.due_time < current_time_str:
                    task.status = "delayed"
        return tasks

# Backwards compatibility alias
calculate_priority_score = TaskPriorityService.calculate_priority_score
check_task_delays = TaskPriorityService.check_task_delays
