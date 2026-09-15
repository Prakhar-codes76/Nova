import logging
from sqlalchemy.orm import Session
from app.config import settings
from app.ai.intent_parser import IntentParser
from app.ai.tool_registry import ToolRegistry

logger = logging.getLogger(__name__)

class AIService:
    @staticmethod
    def process_chat(message: str, db: Session, user_id: int = 1) -> dict:
        """
        Main entrypoint for Nova AI assistant.
        1. Analyzes user message intent & multi-turn state.
        2. Executes relevant backend tool.
        3. Formulates concise, natural response (1-3 sentences for voice suitability).
        """
        parsed = IntentParser.parse_user_intent(message, user_id=user_id)
        intent = parsed["intent"]
        tool_name = parsed.get("tool")
        tool_args = parsed.get("args", {})

        if intent == "AWAITING_PARAM":
            return {
                "success": True,
                "response": parsed.get("prompt", "What time would you like to schedule that for?"),
                "intent": intent,
                "action_performed": None,
                "data": None
            }

        tool_result = None
        action_performed = None

        if tool_name:
            tool_result = ToolRegistry.execute_tool(tool_name, tool_args, db=db, user_id=user_id)
            if tool_result.get("success"):
                action_performed = tool_name

        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                prompt = f"""
You are Nova, an AI Student Life Assistant. Your name is Nova.
The student asked: "{message}"
Detected Intent: {intent}
Executed Action: {action_performed}
Action Result: {tool_result}

Rules:
- Give a short, friendly, natural, and helpful response (1-3 sentences).
- If asked about your identity or name, naturally state that you are Nova, their AI Student Life Assistant (e.g. "I'm Nova, your AI Student Life Assistant.").
- Consistently use the name "Nova" instead of generic titles like "AI Assistant", "AI Bot", or "Assistant".
- Do NOT introduce yourself repeatedly on every message unless explicitly asked or at the start of a conversation.
- Match user language (English, Hinglish, Hindi, Tamil, Telugu).
- Do NOT claim actions succeeded unless Action Result confirms success.
"""
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                if response and response.text:
                    return {
                        "success": True,
                        "response": response.text.strip(),
                        "intent": intent,
                        "action_performed": action_performed,
                        "data": tool_result
                    }
            except Exception as e:
                logger.warning(f"Gemini API call skipped: {e}. Using natural fallback engine.")

        natural_response = AIService._generate_natural_fallback(message, intent, action_performed, tool_result)
        return {
            "success": True,
            "response": natural_response,
            "intent": intent,
            "action_performed": action_performed,
            "data": tool_result
        }

    @staticmethod
    def _generate_natural_fallback(user_msg: str, intent: str, action: str, result: dict) -> str:
        if intent == "IDENTITY_QUERY":
            return "I'm Nova, your AI Student Life Assistant. How can I help you today?"

        elif intent == "VIEW_SCHEDULE":
            if result and result.get("success"):
                schedule = result.get("schedule", [])
                if not schedule:
                    return "Aaj koi scheduled classes nahi hain! Aap free ho. 🚀"
                lines = [f"• {item['subject']} ({item['start']} - {item['end']})" for item in schedule]
                return f"Aaj ka schedule:\n" + "\n".join(lines)
            return "Aaj ka schedule fetch nahi ho paya."

        elif intent == "VIEW_TASKS":
            if result and result.get("success"):
                tasks = result.get("tasks", [])
                if not tasks:
                    return "Aapke paas koi pending tasks nahi hain! 🎉"
                lines = [f"• {t['title']} ({t['subject'] or 'General'})" for t in tasks]
                return f"Aapke pending tasks:\n" + "\n".join(lines)
            return "Pending tasks fetch nahi ho paye."

        elif intent == "ADD_TASK":
            if result and result.get("success"):
                task = result.get("task", {})
                return f"Done! Task '{task.get('title')}' add ho gaya hai for {task.get('due_date')} at {task.get('due_time')}. 📝"
            return "Task add karne me error aaya."

        elif intent == "COMPLETE_TASK":
            if result and result.get("success"):
                return f"Awesome! Task complete mark kar diya gaya hai. Great progress! ✅"
            return "Task complete mark karne ke liye specific task nahi mila."

        elif intent == "RESCHEDULE_TASK":
            if result and result.get("success"):
                task = result.get("task", {})
                return f"Done! Task reschedule kar diya for {task.get('due_date')} at {task.get('due_time')}. ⏰"
            return "Task reschedule karne me error aaya."

        elif intent == "START_FOCUS":
            if result and result.get("success"):
                return f"Focus Session start ho gaya hai! Next 25 minutes tak full concentration on studies. 💪"
            return "Focus session start ho gaya!"

        elif intent == "CREATE_STUDY_PLAN":
            if result and result.get("success"):
                plan = result.get("plan", {})
                return f"Exam preparation study plan ready hai for {plan.get('subject')}! Total {plan.get('total_days')} days ka custom roadmap Study Planner me update ho gaya hai. 📚"
            return "Study plan generate ho gaya!"

        elif intent == "VIEW_PROGRESS":
            if result and result.get("success"):
                stats = result.get("stats", {})
                return f"Aapka completion rate {stats.get('completion_rate')}% hai with {stats.get('completed_tasks')} completed tasks! 🔥"
            return "Progress stats available hain!"

        return "I'm Nova! Main aapke schedules, tasks, focus sessions, aur study plans me help kar sakta hoon. Kuch poochna chahte ho?"
