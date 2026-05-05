from dataclasses import dataclass, field
from datetime import datetime, timezone


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Project:
    id: str
    created_at: str = field(default_factory=utc_now)
    audio_path: str | None = None
    background_path: str | None = None
    lyrics_path: str | None = None
    output_path: str | None = None
    status: str = "uploaded"
    last_error: str | None = None


@dataclass
class Job:
    id: str
    project_id: str
    created_at: str = field(default_factory=utc_now)
    status: str = "queued"
    progress: int = 0
    output_path: str | None = None
    error: str | None = None
