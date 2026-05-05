"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { PreviewStage } from "@/components/editor/preview-stage";
import { RightSidebar } from "@/components/editor/right-sidebar";
import { TopBar } from "@/components/editor/top-bar";
import { fetchJSON } from "@/lib/fetch-json";
import { uploadProjectSchema } from "@/lib/schemas";
import { useAuthStore } from "@/store/auth-store";
import { useEditorStore } from "@/store/editor-store";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "http://127.0.0.1:8000";

export function StudioPage({ user }) {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();
  const {
    activePanel,
    setActivePanel,
    audio,
    backgroundVideo,
    lyrics,
    previewText,
    aspectRatio,
    appearance,
    projectError,
    setAudio,
    setBackgroundVideo,
    setLyrics,
    setProjectError,
    setAspectRatio,
    setAppearance,
    resetUpload,
  } = useEditorStore();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState("");

  useEffect(() => {
    if (!audio) {
      setAudioPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(audio);
    setAudioPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audio]);

  useEffect(() => {
    if (!backgroundVideo) {
      setBackgroundPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(backgroundVideo);
    setBackgroundPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [backgroundVideo]);

  const projectsQuery = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const data = await fetchJSON("/api/projects");
      return data.projects;
    },
    enabled: Boolean(user?.id),
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetchJSON("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      setProjectError("");
      const parsed = uploadProjectSchema.safeParse({
        lyrics,
        hasAudio: Boolean(audio),
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid upload fields.");

      const formData = new FormData();
      formData.append("audio", audio);
      formData.append("lyrics", lyrics);
      if (backgroundVideo && backgroundVideo.type?.startsWith("video/")) {
        formData.append("background_video", backgroundVideo);
      }

      const uploadRes = await fetch(`${ENGINE_BASE}/projects/upload`, { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.detail || `Upload failed (${uploadRes.status})`);

      await fetchJSON("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          lyricsProjectId: uploadData.id,
          status: uploadData.status,
          outputPath: uploadData.output_path ?? null,
          lastError: uploadData.last_error ?? null,
        }),
      });
    },
    onSuccess: () => {
      resetUpload();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => setProjectError(error.message),
  });

  const startRenderMutation = useMutation({
    mutationFn: async (project) => {
      const response = await fetch(`${ENGINE_BASE}/projects/${project.lyricsProjectId}/render`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Render failed (${response.status})`);
      await fetchJSON(`/api/projects/${project.id}`, { method: "PATCH", body: JSON.stringify({ status: "queued" }) });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: (error) => setProjectError(error.message),
  });

  const refreshMutation = useMutation({
    mutationFn: async (project) => {
      const engineRes = await fetch(`${ENGINE_BASE}/projects/${project.lyricsProjectId}`);
      const engineData = await engineRes.json();
      if (!engineRes.ok) throw new Error(engineData.detail || `Refresh failed (${engineRes.status})`);
      await fetchJSON(`/api/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: engineData.status,
          outputPath: engineData.output_path ?? null,
          lastError: engineData.last_error ?? null,
        }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: (error) => setProjectError(error.message),
  });

  return (
    <div className="h-screen overflow-hidden bg-background">
      <TopBar userEmail={user.email} onLogout={() => logoutMutation.mutate()} />
      <main className="grid h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[1fr_380px]">
        <div className="min-h-0 p-2 sm:p-4">
          <PreviewStage
            text={previewText}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            mediaUrl={backgroundPreviewUrl || audioPreviewUrl}
            mediaType={
              backgroundPreviewUrl
                ? backgroundVideo?.type?.startsWith("image/")
                  ? "image"
                  : "video"
                : audioPreviewUrl
                  ? "audio"
                  : ""
            }
            appearance={appearance}
          />
        </div>

        <RightSidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          audioName={audio?.name}
          backgroundName={backgroundVideo?.name}
          lyrics={lyrics}
          setLyrics={setLyrics}
          setAudio={setAudio}
          setBackgroundVideo={setBackgroundVideo}
          audioPreviewUrl={audioPreviewUrl}
          onUpload={() => uploadMutation.mutate()}
          uploadLoading={uploadMutation.isPending}
          projectError={projectError}
          appearance={appearance}
          setAppearance={setAppearance}
          projects={projectsQuery.data}
          projectsLoading={projectsQuery.isLoading}
          onStartRender={(project) => startRenderMutation.mutate(project)}
          onRefreshProject={(project) => refreshMutation.mutate(project)}
        />
      </main>
    </div>
  );
}
