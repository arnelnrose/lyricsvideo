"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
}) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 0 });

  const selected = options.find((opt) => opt.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    function updatePosition() {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative isolate">
      <div ref={triggerRef}>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-xl bg-background"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </div>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed z-[9999] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl ring-1 ring-black/10 dark:ring-white/15"
              style={{ top: menuStyle.top, left: menuStyle.left, width: menuStyle.width }}
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="mb-2 bg-background"
              />
              <div className="max-h-56 overflow-auto rounded-lg bg-popover">
                {filtered.length === 0 ? <p className="px-2 py-3 text-sm text-muted-foreground">No results.</p> : null}
                {filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-2 text-left text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground",
                      value === opt.value ? "border-primary/30 bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    <Check className={cn("h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
