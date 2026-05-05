"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleDollarSign, CreditCard, Link2, Lock, LogOut, Mail, UserCircle2 } from "lucide-react";

function getDisplayName(email) {
  if (!email) return "User";
  const base = email.split("@")[0] || "User";
  return base
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ProfileMenu({ userEmail, onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const displayName = getDisplayName(userEmail);

  useEffect(() => {
    function onDocClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const items = [
    { label: "Profile Picture", icon: UserCircle2 },
    { label: "Account & Password", icon: Lock },
    { label: "Connections", icon: Link2 },
    { label: "Credits", icon: CircleDollarSign },
    { label: "Billing", icon: CreditCard },
    { label: "Emails & Privacy", icon: Mail },
  ];

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700/70 dark:text-zinc-200 dark:hover:bg-zinc-600"
      >
        <UserCircle2 className="h-4 w-4" />
        <span className="max-w-36 truncate">{displayName}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-zinc-300 bg-white p-1 shadow-xl dark:border-white/15 dark:bg-zinc-800">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Icon className="h-4 w-4 opacity-80" />
                {item.label}
              </button>
            );
          })}
          <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
