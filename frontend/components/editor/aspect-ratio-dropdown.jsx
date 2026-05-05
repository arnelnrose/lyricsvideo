"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const OPTIONS = [
  { value: "2:3", label: "Tall" },
  { value: "3:2", label: "Wide" },
  { value: "1:1", label: "Square" },
  { value: "9:16", label: "Vertical" },
  { value: "16:9", label: "Widescreen" },
];

export function AspectRatioDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[4];

  return (
    <div ref={rootRef} className="relative">
      <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)} className="gap-2">
        <span>{selected.value}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </Button>

      {open ? (
        <div className="absolute bottom-11 left-0 z-50 w-44 rounded-2xl border border-zinc-200/20 bg-zinc-100 px-2 py-2 shadow-2xl dark:bg-zinc-900">
          {OPTIONS.map((option) => {
            const active = option.value === selected.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10 ${
                  active ? "bg-black/10 dark:bg-white/10" : ""
                }`}
              >
                <span
                  className={`inline-flex h-3 w-3 items-center justify-center rounded-sm ${
                    active ? "bg-black dark:bg-white" : "bg-zinc-400/70"
                  }`}
                >
                  {active ? <Check className="h-2.5 w-2.5 text-white dark:text-black" /> : null}
                </span>
                <span className={`w-10 text-sm font-medium ${active ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {option.value}
                </span>
                <span className={`text-sm ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
