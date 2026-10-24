import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import lastWarData from "@/data/lastWar.json";

const hqLevels = lastWarData.hqLevels;

function parseLevelSlug(slug: string): number | null {
  const match = /^level-(\d+)-requirements$/.exec(slug);
  if (!match) return null;
  const lv = parseInt(match[1], 10);
  if (lv < 1 || lv > 30) return null;
  return lv;
}

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function fmtTime(mins: number): string {
  if (mins === 0) return "Instant";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

export function generateStaticParams() {
  return hqLevels.map((l) => ({
    slug: `level-${l.level}-requirements`,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lv = parseLevelSlug(params.slug);
  const hq = hqLevels.find((row) => row.level === lv);
  if (!hq) return {};

  const title = `Last War HQ Level ${hq.level} Requirements & Gold Cost — GAMIDES`;
  const description = `Last War: Survival Game HQ Level ${hq.level} upgrade requirements: ${hq.requiredBuildings.join(", ") || "None"}. Costs ${fmt(hq.iron)} Iron, ${fmt(hq.food)} Food, ${fmt(hq.gold)} Gold. Unlocks ${hq.unlock}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "https://www.gamides.com/opengraph-image",
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `https://www.gamides.com/last-war/hq/level-${hq.level}-requirements`,
    },
  };
}

export default function LastWarHQLevelPage({
  params,
}: {
  params: { slug: string };
}) {
  const lv = parseLevelSlug(params.slug);
  const hq = hqLevels.find((row) => row.level === lv);
  if (!hq) notFound();

  const prev = hqLevels.find((r) => r.level === hq.level - 1);
  const next = hqLevels.find((r) => r.level === hq.level + 1);
  const speedups1h = Math.ceil(hq.buildTimeMinutes / 60);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/last-war"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← Last War: Survival Game Hub
        </Link>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/last-war/hq/level-${prev.level}-requirements`}
              className="rounded border border-purple-700 px-3 py-1 text-xs text-purple-200 hover:text-white"
            >
              ← HQ {prev.level}
            </Link>
          )}
          {next && (
            <Link
              href={`/last-war/hq/level-${next.level}-requirements`}
              className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white hover:bg-purple-500"
            >
              HQ {next.level} →
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/30 p-6">
        <span className="rounded bg-purple-800 px-2.5 py-1 text-xs font-bold uppercase text-purple-200">
          Last War: Survival Game HQ Guide
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War HQ Level {hq.level} Requirements &amp; Upgrade Cost
        </h1>
        <p className="mt-2 text-sm text-purple-200/85">
          Key Milestone Unlock:{" "}
          <strong className="text-white">{hq.unlock}</strong>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Prerequisite Buildings</p>
            <p className="mt-1 font-bold text-white">
              {hq.requiredBuildings.join(" + ") || "None"}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Base Build Time</p>
            <p className="mt-1 font-mono font-bold text-white">
              {fmtTime(hq.buildTimeMinutes)} ({speedups1h.toLocaleString()}h
              speed-ups)
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">🔩 Iron</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-white">
              {fmt(hq.iron)}
            </p>
          </div>
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">🌽 Food</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-white">
              {fmt(hq.food)}
            </p>
          </div>
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-amber-300">🪙 Gold</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-amber-300">
              {fmt(hq.gold)}
            </p>
          </div>
        </div>
      </div>

      {/* Browse All Last War HQ Levels */}
      <div className="mt-8 rounded-xl border border-purple-800/50 bg-purple-950/40 p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-300">
          All Last War HQ Levels (1–30)
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hqLevels.map((row) => (
            <Link
              key={row.level}
              href={`/last-war/hq/level-${row.level}-requirements`}
              className={`rounded px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                row.level === hq.level
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-300 hover:bg-purple-800 hover:text-white"
              }`}
            >
              Lv.{row.level}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
