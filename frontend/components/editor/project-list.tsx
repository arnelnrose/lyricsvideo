import { Button } from "@/components/ui/button";

export function ProjectList({ projects, loading, onStartRender, onRefresh }) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950 p-4">
      <h3 className="mb-3 font-semibold text-white">Projects</h3>
      {loading ? <p className="text-sm text-zinc-400">Loading...</p> : null}
      <div className="space-y-2">
        {(projects || []).map((project) => {
            const downloadUrl =
              project.status === "completed"
                ? `${process.env.NEXT_PUBLIC_ENGINE_BASE || "http://127.0.0.1:8000"}/projects/${project.lyricsProjectId}/download`
                : "";
          return (
            <div key={project.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-zinc-400">{project.lyricsProjectId}</p>
              <p className="text-sm text-white">Status: {project.status}</p>
              {project.lastError ? <p className="text-xs text-red-400">{project.lastError}</p> : null}
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" onClick={() => onStartRender(project)}>
                  Start
                </Button>
                <Button size="sm" variant="outline" onClick={() => onRefresh(project)}>
                  Refresh
                </Button>
                {downloadUrl ? (
                  <a className="text-xs text-cyan-300 underline underline-offset-4" href={downloadUrl} target="_blank">
                    Download
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
