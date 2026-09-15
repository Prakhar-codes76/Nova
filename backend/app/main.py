from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import settings
from app.database import engine, Base
from app.seed_data import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Include API routers
from app.routes import health, auth, profile, users, tasks, timetable, focus, progress, ai, search, voice_webhooks

# Initialize Database tables and Seed data
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    logger.warning(f"Database initialization note: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API service for Nova — AI Student Life Assistant"
)

# Global Exception Handler to prevent raw stack traces and provide clean 500 error details
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your request. Please try again."}
    )

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)
app.include_router(timetable.router, prefix=settings.API_V1_STR)
app.include_router(focus.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(voice_webhooks.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs"
    }
