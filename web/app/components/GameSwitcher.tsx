"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GAMES = [
  {
    id: "last-z",
    label: "Last Z",
    href: "/",
    match: (path: string) =>
      !path.startsWith("/whiteout-survival") && !path.startsWith("/last-war"),
  },
  {
    id: "whiteout-survival",
    label: "Whiteout",
    href: "/whiteout-survival",
    match: (path: string) => path.startsWith("/whiteout-survival"),
  },
  {
    id: "last-war",
    label: "Last War",
    href: "/last-war",
    match: (path: string) => path.startsWith("/last-war"),
  },
] as const;

export function GameSwitcher() {
  const pathname = usePathname();

  return (
    <div
      aria-label="Game Switcher"
      className="flex items-center rounded-lg border border-purple-700/70 bg-purple-900/40 p-0.5 text-xs"
    >
      {GAMES.map((g) => {
        const active = g.match(pathname);
        return (
          <Link
            key={g.id}
            href={g.href}
            className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
              active
                ? "bg-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            {g.label}
          </Link>
        );
      })}
    </div>
  );
}
