"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Music2, Plus, Sparkles, Upload, Video, Disc3, FileVideo, Layers3, Mic2, Brush, Captions, Clapperboard, WandSparkles } from "lucide-react";

import { NewVideoDialog } from "@/components/new-video-dialog";
import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { fetchJSON } from "@/lib/fetch-json";
import { useAuthStore } from "@/store/auth-store";

export function DashboardPage({ user }) {
  const [newVideoOpen, setNewVideoOpen] = useState(false);
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  const projectsQuery = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const data = await fetchJSON("/api/projects");
      return data.projects || [];
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

  const projects = projectsQuery.data || [];
  const filters = [
    { label: "All Videos", icon: Layers3 },
    { label: "Music Video", icon: Mic2 },
    { label: "Art Track", icon: Brush },
    { label: "Lyrics", icon: Captions },
    { label: "Canvas", icon: Clapperboard },
    { label: "Motion Art", icon: WandSparkles },
  ];

  return (
    <div className="min-h-screen bg-[#f3f5fb] text-zinc-900 dark:bg-[#16171c] dark:text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-zinc-300/80 bg-white lg:flex lg:flex-col dark:border-white/10 dark:bg-[#111216]">
          <div className="border-b border-zinc-300/80 px-6 py-6 dark:border-white/10">
            <p className="font-[Montserrat] text-2xl font-black tracking-tight text-zinc-900 dark:text-white">LyricForge</p>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300/80">Studio Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
            <Link className="flex items-center gap-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-cyan-700 dark:text-cyan-200" href="/video">
              <Video className="h-4 w-4" />
              Videos
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="/tracks">
              <Music2 className="h-4 w-4" />
              Music
            </Link>
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="#">
              <FileVideo className="h-4 w-4" />
              Clips
            </a>
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="#">
              <Upload className="h-4 w-4" />
              Uploads
            </a>
          </nav>
          <div className="p-4">
            <button className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/5">
              Help Center
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-zinc-300/80 bg-white px-4 sm:px-6 dark:border-white/10 dark:bg-[#1b1c22]">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-300 lg:hidden">LyricForge</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="rounded-lg bg-zinc-200 p-2 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700/70 dark:text-zinc-200 dark:hover:bg-zinc-600">
                <HelpCircle className="h-4 w-4" />
              </button>
              <ProfileMenu userEmail={user.email} onLogout={() => logoutMutation.mutate()} />
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#f7fbff] p-6 sm:p-10 dark:bg-[#05070c]">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-pink-500/25 blur-3xl" />
              <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Introducing</p>
              <h1 className="relative mt-3 max-w-3xl font-[Montserrat] text-3xl font-black leading-tight sm:text-5xl">
                Smarter tools for creating lyric videos at studio speed
              </h1>
              <p className="relative mt-3 max-w-2xl text-sm text-zinc-700 dark:text-zinc-300 sm:text-base">
                Build projects, manage renders, and launch straight into your editing studio in one workflow.
              </p>
              <div className="relative mt-6 flex gap-3">
                <Link href="/studio">
                  <Button className="rounded-full bg-pink-500 px-6 hover:bg-pink-400">Try It Now</Button>
                </Link>
                <button className="rounded-full border border-zinc-300 px-6 py-2 text-sm hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-white/10">See Demo</button>
              </div>
            </section>
          </div>

          <section className="px-4 pb-8 sm:px-6">
            <h2 className="mb-4 text-3xl font-semibold">Videos</h2>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="h-8 rounded-full bg-cyan-500 px-3 text-xs text-black hover:bg-cyan-400"
                onClick={() => setNewVideoOpen(true)}
              >
                  <Plus className="h-3.5 w-3.5" />
                  New Video
              </Button>
              {filters.map((filter, idx) => {
                const Icon = filter.icon;
                return (
                <button
                  key={filter.label}
                  className={`h-8 rounded-full border px-3 text-xs ${
                    idx === 0
                      ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-white/80 dark:bg-white/10 dark:text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {filter.label}
                  </span>
                </button>
                );
              })}
            </div>

            {projectsQuery.isLoading ? <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading projects...</p> : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setNewVideoOpen(true)}
                className="group flex h-[260px] w-full max-w-[300px] justify-self-start flex-col items-center justify-center rounded-md border border-zinc-300 bg-white p-4 hover:border-cyan-400/60 hover:bg-cyan-50 dark:border-white/20 dark:bg-[#1c1d22] dark:hover:bg-[#20222a] sm:h-[280px]"
              >
                <div className="mb-4 rounded-2xl border border-zinc-300 p-4 text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                  <Disc3 className="h-10 w-10" />
                </div>
                <p className="text-base font-semibold">Create New Video</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Open studio editor</p>
              </button>

              {projects.slice(0, 8).map((project) => (
                <div key={project.id} className="overflow-hidden rounded-md border border-zinc-300 bg-white dark:border-white/20 dark:bg-[#1c1d22]">
                  <div className="h-[190px] bg-[linear-gradient(120deg,#dfe5ef,#c6cfde)] dark:bg-[linear-gradient(120deg,#2d3038,#111319)]" />
                  <div className="space-y-1 p-3">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{project.lyricsProjectId}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Status: {project.status}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">03:54</p>
                    </div>
                    {project.status === "completed" ? (
                      <p className="flex items-center gap-1 text-xs text-emerald-400">
                        <Sparkles className="h-3 w-3" />
                        Rendered
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <NewVideoDialog open={newVideoOpen} onOpenChange={setNewVideoOpen} />
    </div>
  );
}
