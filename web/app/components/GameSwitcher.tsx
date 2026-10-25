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
      !path.startsWith("/whiteout-survival") &&
      !path.startsWith("/last-war") &&
      !path.startsWith("/play"),
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
  const isArcade = pathname.startsWith("/play");

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <div
        role="navigation"
        aria-label="Select Game"
        className="grid flex-1 grid-cols-3 gap-1 rounded-xl border border-purple-700/70 bg-purple-900/40 p-1 sm:flex-initial sm:inline-flex"
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

      <Link
        href="/play"
        aria-current={isArcade ? "page" : undefined}
        className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold whitespace-nowrap transition-all ${
          isArcade
            ? "border-purple-400 bg-purple-600 text-white shadow-sm"
            : "border-purple-700/70 bg-purple-900/40 text-purple-200/90 hover:border-purple-500 hover:bg-purple-800/60 hover:text-white"
        }`}
      >
        <span aria-hidden="true">🕹️</span>
        <span>Arcade</span>
      </Link>
    </div>
  );
}
