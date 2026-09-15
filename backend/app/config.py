import os
import shutil
import tempfile

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def get_effective_db_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if url:
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    # Default fallback: SQLite
    is_vercel = bool(os.getenv("VERCEL") or os.getenv("VERCEL_ENV"))
    
    # Test if current directory is writable
    is_writable = True
    test_file = "./.write_test_tmp"
    try:
        with open(test_file, "w") as f:
            f.write("1")
        os.remove(test_file)
    except Exception:
        is_writable = False

    if is_vercel or not is_writable:
        tmp_dir = tempfile.gettempdir()
        tmp_db_path = os.path.join(tmp_dir, "nova.db")
        if not os.path.exists(tmp_db_path):
            possible_seeds = ["./nova.db", "nova.db", "backend/nova.db", "../nova.db"]
            for seed in possible_seeds:
                if os.path.exists(seed) and os.path.isfile(seed):
                    try:
                        shutil.copyfile(seed, tmp_db_path)
                        os.chmod(tmp_db_path, 0o666)
                        break
                    except Exception:
                        pass
        else:
            try:
                os.chmod(tmp_db_path, 0o666)
            except Exception:
                pass
        
        normalized_path = os.path.abspath(tmp_db_path).replace("\\", "/")
        return f"sqlite:///{normalized_path}"

    return "sqlite:///./nova.db"

class Settings:
    PROJECT_NAME: str = "NOVA AI Student Life Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ELEVENLABS_AGENT_ID: str = os.getenv("VITE_ELEVENLABS_AGENT_ID", "")

    @property
    def DATABASE_URL(self) -> str:
        return get_effective_db_url()

settings = Settings()
