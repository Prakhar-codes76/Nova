import os
import shutil

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def get_effective_db_url() -> str:
    url = os.getenv("DATABASE_URL", "sqlite:///./nova.db")
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    if url.startswith("sqlite"):
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
            tmp_db_path = "/tmp/nova.db"
            if not os.path.exists(tmp_db_path):
                possible_seeds = ["./nova.db", "nova.db", "backend/nova.db", "../nova.db"]
                for seed in possible_seeds:
                    if os.path.exists(seed) and os.path.isfile(seed):
                        try:
                            shutil.copy2(seed, tmp_db_path)
                            break
                        except Exception:
                            pass
            return f"sqlite:///{tmp_db_path}"
    return url

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
