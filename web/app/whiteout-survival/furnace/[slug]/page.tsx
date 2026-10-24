import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import wosData from "@/data/whiteoutSurvival.json";

const furnaceLevels = wosData.furnaceLevels;

function parseLevelSlug(slug: string): number | null {
  const match = /^level-(\d+)-requirements$/.exec(slug);
  if (!match) return null;
  const lv = parseInt(match[1], 10);
  if (lv < 1 || lv > 35) return null;
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
  return furnaceLevels.map((f) => ({
    slug: `level-${f.level}-requirements`,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lv = parseLevelSlug(params.slug);
  const f = furnaceLevels.find((row) => row.level === lv);
  if (!f) return {};

  const title = `Whiteout Survival Furnace ${f.label} Requirements & Cost — GAMIDES`;
  const description = `Whiteout Survival Furnace ${f.label} upgrade requirements: ${f.requiredBuildings.join(", ") || "None"}. Costs ${fmt(f.meat)} Meat, ${fmt(f.wood)} Wood, ${fmt(f.coal)} Coal, ${fmt(f.iron)} Iron${f.fireCrystals > 0 ? `, ${f.fireCrystals} Fire Crystals` : ""}. Unlocks ${f.unlock}.`;

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
      canonical: `https://www.gamides.com/whiteout-survival/furnace/level-${f.level}-requirements`,
    },
  };
}

export default function WosFurnaceLevelPage({
  params,
}: {
  params: { slug: string };
}) {
  const lv = parseLevelSlug(params.slug);
  const f = furnaceLevels.find((row) => row.level === lv);
  if (!f) notFound();

  const prev = furnaceLevels.find((r) => r.level === f.level - 1);
  const next = furnaceLevels.find((r) => r.level === f.level + 1);
  const speedups1h = Math.ceil(f.buildTimeMinutes / 60);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/whiteout-survival"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← Whiteout Survival Hub &amp; Calculator
        </Link>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/whiteout-survival/furnace/level-${prev.level}-requirements`}
              className="rounded border border-purple-700 px-3 py-1 text-xs text-purple-200 hover:text-white"
            >
              ← {prev.label}
            </Link>
          )}
          {next && (
            <Link
              href={`/whiteout-survival/furnace/level-${next.level}-requirements`}
              className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white hover:bg-purple-500"
            >
              {next.label} →
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/30 p-6">
        <span className="rounded bg-purple-800 px-2.5 py-1 text-xs font-bold uppercase text-purple-200">
          Whiteout Survival Furnace Guide
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Furnace {f.label} Upgrade Requirements &amp; Resource Cost
        </h1>
        <p className="mt-2 text-sm text-purple-200/85">
          Milestone Unlock: <strong className="text-white">{f.unlock}</strong>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Prerequisite Buildings</p>
            <p className="mt-1 font-bold text-white">
              {f.requiredBuildings.join(" + ") || "None"}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Base Build Time</p>
            <p className="mt-1 font-mono font-bold text-white">
              {fmtTime(f.buildTimeMinutes)} ({speedups1h.toLocaleString()}h)
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Fire Crystals Needed</p>
            <p className="mt-1 font-mono font-bold text-amber-300">
              {f.fireCrystals > 0
                ? `${f.fireCrystals.toLocaleString()} FC`
                : "None (Standard RSS)"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "🥩 Meat", val: f.meat },
            { label: "🪵 Wood", val: f.wood },
            { label: "🪨 Coal", val: f.coal },
            { label: "⛏️ Iron", val: f.iron },
          ].map((r) => (
            <div
              key={r.label}
              className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4"
            >
              <p className="text-xs text-purple-300">{r.label}</p>
              <p className="mt-1 font-mono text-xl font-extrabold text-white">
                {fmt(r.val)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Browse All Furnace Levels */}
      <div className="mt-8 rounded-xl border border-purple-800/50 bg-purple-950/40 p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-300">
          All Whiteout Survival Furnace Levels (1–30 + FC1–FC5)
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {furnaceLevels.map((row) => (
            <Link
              key={row.level}
              href={`/whiteout-survival/furnace/level-${row.level}-requirements`}
              className={`rounded px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                row.level === f.level
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-300 hover:bg-purple-800 hover:text-white"
              }`}
            >
              {row.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
