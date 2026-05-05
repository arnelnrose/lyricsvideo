"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Link from "next/link";
import { Ellipsis, FileAudio2, HelpCircle, ListMusic, Music2, Plus, Upload, Video, X } from "lucide-react";

import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { fetchJSON } from "@/lib/fetch-json";
import { useAuthStore } from "@/store/auth-store";

function formatDuration(totalSec) {
  if (!totalSec || totalSec <= 0) return "--:--";
  const m = Math.floor(totalSec / 60);
  const s = String(totalSec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export function TracksPage({ user }) {
  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState(false);
  const uploadInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  const tracksQuery = useQuery({
    queryKey: ["tracks", user?.id],
    queryFn: async () => {
      const data = await fetchJSON("/api/tracks");
      return data.tracks || [];
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

  const uploadTracksMutation = useMutation({
    mutationFn: async (files) => {
      const form = new FormData();
      for (const file of files) form.append("files", file);
      const res = await fetch("/api/tracks/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed.");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      setAddTrackDialogOpen(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    },
  });

  const tracks = tracksQuery.data || [];

  return (
    <div className="min-h-screen bg-[#f3f5fb] text-zinc-900 dark:bg-[#16171c] dark:text-zinc-100">
      <input
        ref={uploadInputRef}
        type="file"
        accept=".mp3,.ogg,.wav,.aac,.flac,.aiff,audio/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) uploadTracksMutation.mutate(files);
        }}
      />

      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-zinc-300/80 bg-white lg:flex lg:flex-col dark:border-white/10 dark:bg-[#111216]">
          <div className="border-b border-zinc-300/80 px-6 py-6 dark:border-white/10">
            <p className="font-[Montserrat] text-2xl font-black tracking-tight text-zinc-900 dark:text-white">LyricForge</p>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300/80">Studio Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="/video">
              <Video className="h-4 w-4" />
              Videos
            </Link>
            <Link className="flex items-center gap-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-cyan-700 dark:text-cyan-200" href="/tracks">
              <Music2 className="h-4 w-4" />
              Music
            </Link>
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="#">
              <ListMusic className="h-4 w-4" />
              Clips
            </a>
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5" href="#">
              <Upload className="h-4 w-4" />
              Uploads
            </a>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-zinc-300/80 bg-white px-4 sm:px-6 dark:border-white/10 dark:bg-[#1b1c22]">
            <div />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="rounded-lg bg-zinc-200 p-2 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700/70 dark:text-zinc-200 dark:hover:bg-zinc-600">
                <HelpCircle className="h-4 w-4" />
              </button>
              <ProfileMenu userEmail={user.email} onLogout={() => logoutMutation.mutate()} />
            </div>
          </header>

          <section className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-4xl font-bold">All Tracks</h2>
              <Button className="rounded-full bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => setAddTrackDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Track
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-300 dark:border-white/15">
              <table className="w-full text-left">
                <thead className="bg-zinc-100/80 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-300">
                  <tr>
                    <th className="px-4 py-3">Title & Artist</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">File Size</th>
                    <th className="px-4 py-3">File Type</th>
                    <th className="px-4 py-3">Added</th>
                    <th className="px-4 py-3">Videos</th>
                    <th className="px-4 py-3">More</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400">
                        No tracks yet. Upload tracks using Add Track.
                      </td>
                    </tr>
                  ) : null}
                  {tracks.map((track) => (
                    <tr key={track.id} className="border-t border-zinc-300 dark:border-white/10">
                      <td className="px-4 py-4">
                        <p className="font-semibold">{track.title}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{track.artist}</p>
                      </td>
                      <td className="px-4 py-4">{formatDuration(track.durationSec)}</td>
                      <td className="px-4 py-4">{track.fileSizeMb} MB</td>
                      <td className="px-4 py-4">{track.fileType}</td>
                      <td className="px-4 py-4">{formatDate(track.createdAt)}</td>
                      <td className="px-4 py-4">{track.videosCount} Video</td>
                      <td className="px-4 py-4"><Ellipsis className="h-4 w-4" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {addTrackDialogOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button aria-label="Close add track dialog" className="absolute inset-0 bg-black/25 dark:bg-black/55" onClick={() => setAddTrackDialogOpen(false)} />
          <div className="relative w-full max-w-4xl rounded-xl border border-zinc-300 bg-white p-6 text-zinc-900 shadow-2xl dark:border-white/15 dark:bg-[#1d1d20] dark:text-white sm:p-8">
            <button
              className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setAddTrackDialogOpen(false)}
              type="button"
            >
              <X className="h-7 w-7" />
            </button>

            <h3 className="text-center text-4xl font-extrabold">Add tracks</h3>

            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 dark:border-white/35 dark:bg-[#16171c]">
              <div className="mx-auto max-w-lg text-center">
                <FileAudio2 className="mx-auto h-14 w-14 text-zinc-500 dark:text-zinc-300" />
                <p className="mt-5 text-4xl font-bold">Drop tracks and albums here</p>
                <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-300">or</p>

                <button
                  className="mt-5 h-12 rounded-full bg-cyan-500 px-8 text-2xl font-semibold text-black hover:bg-cyan-400"
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  {uploadTracksMutation.isPending ? "Uploading..." : "Select files to upload"}
                </button>

                <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">We support .mp3, .ogg, .wav, .aac, .flac or .aiff</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {uploadTracksMutation.isPending ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/25 dark:bg-black/55" />
          <div className="relative w-full max-w-3xl rounded-xl border border-zinc-300 bg-white px-6 py-10 text-center text-zinc-900 shadow-2xl dark:border-white/20 dark:bg-[#131419] dark:text-white">
            <FileAudio2 className="mx-auto h-12 w-12 text-zinc-500 dark:text-zinc-300" />
            <h4 className="mt-4 text-4xl font-bold">Uploading your tracks</h4>
            <p className="mt-3 text-2xl text-zinc-600 dark:text-zinc-300">Shouldn't take too long...</p>

            <div className="mx-auto mt-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-zinc-200 dark:bg-black/40">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-cyan-500" />
            </div>

            <button type="button" disabled className="mx-auto mt-8 h-12 min-w-56 rounded-full bg-zinc-400 px-8 text-2xl font-semibold text-white dark:bg-zinc-700">
              Uploading...
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
