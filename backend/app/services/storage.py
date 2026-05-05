from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.config import PROJECTS_DIR


def new_project_id() -> str:
    return uuid4().hex


def get_project_dir(project_id: str) -> Path:
    project_dir = PROJECTS_DIR / project_id
    project_dir.mkdir(parents=True, exist_ok=True)
    return project_dir


def save_upload_file(upload: UploadFile, destination: Path) -> None:
    with destination.open("wb") as f:
        while True:
            chunk = upload.file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)


def write_text_file(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")
