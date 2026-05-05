from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.models import Project
from app.schemas import JobResponse, ProjectResponse, StartRenderResponse
from app.services.jobs import (
    get_job,
    get_project,
    save_project,
    start_render_job,
)
from app.services.storage import (
    get_project_dir,
    new_project_id,
    save_upload_file,
    write_text_file,
)

app = FastAPI(title="Lyrics Video API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/projects/upload", response_model=ProjectResponse)
def create_project(
    audio: UploadFile = File(...),
    background_video: UploadFile | None = File(default=None),
    lyrics: str = Form(...),
) -> ProjectResponse:
    project_id = new_project_id()
    project_dir = get_project_dir(project_id)

    audio_suffix = Path(audio.filename or "audio.mp3").suffix or ".mp3"
    audio_path = project_dir / f"audio{audio_suffix}"
    save_upload_file(audio, audio_path)

    background_path: Path | None = None
    if background_video:
        bg_suffix = Path(background_video.filename or "background.mp4").suffix or ".mp4"
        background_path = project_dir / f"background{bg_suffix}"
        save_upload_file(background_video, background_path)

    lyrics_path = project_dir / "lyrics.txt"
    write_text_file(lyrics_path, lyrics)

    project = Project(
        id=project_id,
        audio_path=str(audio_path),
        background_path=str(background_path) if background_path else None,
        lyrics_path=str(lyrics_path),
        status="uploaded",
    )
    save_project(project)

    return ProjectResponse(
        id=project.id,
        created_at=project.created_at,
        status=project.status,
        output_path=project.output_path,
        last_error=project.last_error,
    )


@app.post("/projects/{project_id}/render", response_model=StartRenderResponse)
def render_project(project_id: str) -> StartRenderResponse:
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    if not project.audio_path:
        raise HTTPException(status_code=400, detail="Audio file is missing.")

    job = start_render_job(project)
    return StartRenderResponse(job_id=job.id, project_id=project_id, status=job.status)


@app.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project_status(project_id: str) -> ProjectResponse:
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return ProjectResponse(
        id=project.id,
        created_at=project.created_at,
        status=project.status,
        output_path=project.output_path,
        last_error=project.last_error,
    )


@app.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_status(job_id: str) -> JobResponse:
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return JobResponse(
        id=job.id,
        project_id=job.project_id,
        created_at=job.created_at,
        status=job.status,
        progress=job.progress,
        output_path=job.output_path,
        error=job.error,
    )


@app.get("/projects/{project_id}/download")
def download_output(project_id: str) -> FileResponse:
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    if not project.output_path:
        raise HTTPException(status_code=400, detail="Output is not ready yet.")

    output = Path(project.output_path)
    if not output.exists():
        raise HTTPException(status_code=404, detail="Output file missing.")

    return FileResponse(
        path=str(output),
        media_type="video/mp4",
        filename=f"lyrics-video-{project_id}.mp4",
    )
