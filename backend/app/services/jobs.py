import threading
from pathlib import Path
from uuid import uuid4

from app.models import Job, Project
from app.services.render import render_lyrics_video


projects: dict[str, Project] = {}
jobs: dict[str, Job] = {}
_lock = threading.Lock()


def get_project(project_id: str) -> Project | None:
    with _lock:
        return projects.get(project_id)


def save_project(project: Project) -> None:
    with _lock:
        projects[project.id] = project


def get_job(job_id: str) -> Job | None:
    with _lock:
        return jobs.get(job_id)


def _set_job(job_id: str, **kwargs) -> None:
    with _lock:
        job = jobs[job_id]
        for key, value in kwargs.items():
            setattr(job, key, value)


def _set_project(project_id: str, **kwargs) -> None:
    with _lock:
        project = projects[project_id]
        for key, value in kwargs.items():
            setattr(project, key, value)


def start_render_job(project: Project) -> Job:
    job_id = uuid4().hex
    job = Job(id=job_id, project_id=project.id, status="queued", progress=0)
    with _lock:
        jobs[job_id] = job
        projects[project.id].status = "queued"
        projects[project.id].last_error = None

    thread = threading.Thread(target=_render_worker, args=(job_id,), daemon=True)
    thread.start()
    return job


def _render_worker(job_id: str) -> None:
    job = get_job(job_id)
    if not job:
        return

    project = get_project(job.project_id)
    if not project:
        _set_job(job_id, status="failed", error="Project not found.")
        return

    try:
        _set_job(job_id, status="running", progress=10)
        _set_project(project.id, status="rendering")

        project_dir = Path(project.audio_path).parent
        output_path = project_dir / "final.mp4"

        render_lyrics_video(
            project_dir=project_dir,
            audio_path=Path(project.audio_path),
            background_path=Path(project.background_path)
            if project.background_path
            else None,
            lyrics_path=Path(project.lyrics_path) if project.lyrics_path else project_dir / "lyrics.txt",
            output_path=output_path,
        )

        _set_job(job_id, status="completed", progress=100, output_path=str(output_path))
        _set_project(project.id, status="completed", output_path=str(output_path), last_error=None)
    except Exception as exc:  # noqa: BLE001
        _set_job(job_id, status="failed", progress=100, error=str(exc))
        _set_project(project.id, status="failed", last_error=str(exc))
