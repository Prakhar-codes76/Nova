from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# SQLite requires check_same_thread=False for multithreaded web applications
db_url = settings.DATABASE_URL
connect_args = {"check_same_thread": False, "timeout": 30} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, connect_args=connect_args)

if db_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode = MEMORY;")
            cursor.execute("PRAGMA temp_store = MEMORY;")
            cursor.execute("PRAGMA busy_timeout = 30000;")
            cursor.close()
        except Exception:
            pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
