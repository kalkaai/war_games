import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — GAMIDES | Last Z: Survival Shooter",
  description: "GAMIDES update history for Last Z: Survival Shooter players: new pages, data updates, balance fixes, and feature releases. Version history from 0.1.0 through 0.4.0.",
  openGraph: {
    title: "Changelog — GAMIDES | Last Z: Survival Shooter",
    description: "GAMIDES update history for Last Z: Survival Shooter players: new pages, data updates, and feature releases.",

  },
  alternates: {
    canonical: "https://www.gamides.com/changelog",
  },
};

const ENTRIES = [
  {
    date: "2026-05-25",
    version: "0.4.0",
    label: "Major Update",
    labelColor: "bg-purple-600",
    changes: [
      "Added Gear reference page with slot guide, tier system, and enhancement tips",
      "Added hero detail pages (/heroes/[id]) with full skill breakdowns",
      "Added PvP & Formations guide with troop counter triangle and formation strategies",
      "Added Beginner Guide covering Day 1 priorities through mid-game",
      "Added CP Gain Planner calculator",
      "Added navigation menu across all pages",
      "Updated HQ table with build time and CP columns",
      "Updated hero cards with PvP/PvE ratings, investment priority, and F2P indicators",
      "Fixed research tree progress bar overflow for Hero Training tree",
      "Fixed localStorage malformed data guard on research tree component",
    ],
  },
  {
    date: "2026-05-01",
    version: "0.3.0",
    label: "Content",
    labelColor: "bg-blue-700",
    changes: [
      "Added Calculators page: Speed-up timer, Badge Budget planner, HQ Resource planner",
      "Added Tank & Vehicles reference page",
      "Added Heroes tier list with portraits, factions, and skills",
      "Populated research.json with node-level data for Army Building, Field, and UST trees",
    ],
  },
  {
    date: "2026-04-15",
    version: "0.2.0",
    label: "Content",
    labelColor: "bg-blue-700",
    changes: [
      "Added Research Trees with interactive progress tracking (localStorage)",
      "Added HQ table (levels 1–35) with resource costs and building requirements",
      "Added Events page with VS rotation and Apocalypse Time display",
    ],
  },
  {
    date: "2026-04-01",
    version: "0.1.0",
    label: "Launch",
    labelColor: "bg-green-700",
    changes: [
      "Initial launch — landing page with Discord bot invite",
      "Phase 1 complete: static site scaffold with Next.js 14, Tailwind CSS, dark theme",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z: Survival Shooter Changelog</h1>
      <p className="mt-2 text-purple-200/80">GAMIDES update history.</p>

      <h2 className="mt-8 text-xl font-bold text-white">What Has Changed in GAMIDES?</h2>
      <div className="mt-4 space-y-6">
        {ENTRIES.map((entry) => (
          <div
            key={entry.version}
            className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-purple-300">{entry.date}</span>
              <span className="font-bold text-white">v{entry.version}</span>
              <span className={`rounded px-2 py-0.5 text-xs text-white ${entry.labelColor}`}>
                {entry.label}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {entry.changes.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-purple-100/95">
                  <span className="mt-0.5 text-purple-500">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
