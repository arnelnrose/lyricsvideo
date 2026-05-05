"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_CARDS = [
  {
    title: "Spotify Canvas Video",
    subtitle: "A 3-8 second loop video for your track on Spotify",
    tone: "from-emerald-500/20 to-zinc-800",
  },
  {
    title: "Apple Music Album Motion",
    subtitle: "Put your Album Art in motion with our tool designed for Apple Music",
    tone: "from-pink-500/20 to-zinc-800",
  },
  {
    title: "Music Video",
    subtitle: "Use our footage or upload clips to create your music video",
    tone: "from-fuchsia-500/20 to-zinc-800",
  },
  {
    title: "Lyric Video",
    subtitle: "Promote your music with dynamic, professional lyric videos",
    tone: "from-indigo-500/20 to-zinc-800",
    href: "/studio",
  },
  {
    title: "Album Artwork Video",
    subtitle: "Just add your artwork for a video that vibes to the beat",
    tone: "from-amber-500/20 to-zinc-800",
  },
];

export function NewVideoDialog({ open, onOpenChange }) {
  const router = useRouter();

  useEffect(() => {
    function onEsc(event) {
      if (event.key === "Escape") onOpenChange(false);
    }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/25 backdrop-blur-[1px] dark:bg-black/55"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-[1040px] rounded-xl border border-zinc-300 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1d1d20] sm:p-8">
        <button
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-center text-3xl font-extrabold leading-tight text-zinc-900 dark:text-white sm:text-4xl">What do you want to create?</h3>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MOCK_CARDS.map((card) => (
            <button
              key={card.title}
              type="button"
              className="group relative flex min-h-[350px] cursor-pointer flex-col rounded-sm border border-zinc-300 bg-zinc-50 px-3 py-4 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/60 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/15 focus-visible:-translate-y-1 focus-visible:border-cyan-500/60 focus-visible:bg-white focus-visible:shadow-xl focus-visible:shadow-cyan-500/15 focus-visible:outline-none dark:border-white/25 dark:bg-[#1b1b1e] dark:hover:border-cyan-400/60 dark:hover:bg-[#202128] dark:hover:shadow-cyan-400/10 dark:focus-visible:border-cyan-400/60 dark:focus-visible:bg-[#202128]"
              onClick={() => {
                if (!card.href) return;
                onOpenChange(false);
                router.push(card.href);
              }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.18),transparent_45%)]" />
              <div className={`mb-4 h-[120px] w-full rounded-sm bg-gradient-to-br transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] ${card.tone}`} />
              <p className="text-sm leading-none text-zinc-400 dark:text-zinc-500">•</p>
              <p className="mt-1 text-sm leading-none text-zinc-400 dark:text-zinc-500">•</p>
              <h4 className="mt-3 text-2xl font-bold leading-tight text-zinc-900 transition-colors duration-300 group-hover:text-cyan-700 group-focus-visible:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300 dark:group-focus-visible:text-cyan-300">{card.title}</h4>
              <p className="mt-2 text-sm leading-snug text-zinc-600 dark:text-zinc-300">{card.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
