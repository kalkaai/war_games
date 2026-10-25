"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GAMES = [
  {
    id: "last-z",
    emoji: "🧟",
    shortLabel: "Last Z",
    fullLabel: "Last Z: Survival",
    href: "/",
    match: (path: string) =>
      !path.startsWith("/whiteout-survival") && !path.startsWith("/last-war"),
  },
  {
    id: "whiteout-survival",
    emoji: "❄️",
    shortLabel: "Whiteout",
    fullLabel: "Whiteout Survival",
    href: "/whiteout-survival",
    match: (path: string) => path.startsWith("/whiteout-survival"),
  },
  {
    id: "last-war",
    emoji: "🎖️",
    shortLabel: "Last War",
    fullLabel: "Last War: Survival",
    href: "/last-war",
    match: (path: string) => path.startsWith("/last-war"),
  },
] as const;

export function GameSwitcher() {
  const pathname = usePathname();

  return (
    <div
      role="navigation"
      aria-label="Select Game"
      className="grid w-full grid-cols-3 gap-1 rounded-xl border border-purple-700/70 bg-purple-900/40 p-1 sm:w-auto sm:inline-flex"
    >
      {GAMES.map((g) => {
        const active = g.match(pathname);
        return (
          <Link
            key={g.id}
            href={g.href}
            aria-current={active ? "true" : undefined}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
              active
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
            }`}
          >
            <span aria-hidden="true">{g.emoji}</span>
            <span className="md:hidden">{g.shortLabel}</span>
            <span className="hidden md:inline">{g.fullLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}
