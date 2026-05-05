from pydantic import BaseModel


class ProjectResponse(BaseModel):
    id: str
    created_at: str
    status: str
    output_path: str | None
    last_error: str | None


class JobResponse(BaseModel):
    id: str
    project_id: str
    created_at: str
    status: str
    progress: int
    output_path: str | None
    error: str | None


class StartRenderResponse(BaseModel):
    job_id: str
    project_id: str
    status: str
