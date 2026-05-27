"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import hqData from "@/data/hq.json";
import type { HQLevel } from "@/types";

function fmt(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}G`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

function fmtTime(mins: number): string {
  if (mins === 0) return "—";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

const RESOURCE_COLS = [
  { key: "wood" as const,  label: "🪵 Wood" },
  { key: "food" as const,  label: "🍖 Food" },
  { key: "zent" as const,  label: "💰 Zent" },
  { key: "steel" as const, label: "⚙️ Steel" },
];

const levels = hqData.levels as HQLevel[];

export default function HQTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlight = searchParams.get("level") ? parseInt(searchParams.get("level")!, 10) : null;

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lv = fd.get("level") as string;
    if (lv) {
      sendGAEvent("event", "hq_search", { level: lv });
      router.push(`/hq?level=${lv}#level-${lv}`);
    } else {
      router.push("/hq");
    }
  }

  return (
    <>
      {/* Search box */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-3">
        <label htmlFor="hq-level-search" className="sr-only">Jump to HQ level</label>
        <input
          id="hq-level-search"
          type="number"
          name="level"
          min={1}
          max={35}
          placeholder="Jump to level…"
          defaultValue={highlight ?? ""}
          className="w-36 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white placeholder:text-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
        >
          Go
        </button>
        {highlight && (
          <a
            href="/hq"
            className="rounded-md border border-purple-700 px-4 py-2 text-sm text-purple-300 transition-colors hover:text-white"
          >
            Clear
          </a>
        )}
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-purple-800/50">
        <table aria-label="HQ upgrade requirements" className="w-full text-sm">
          <thead className="sticky top-[57px] z-20">
            <tr className="border-b border-purple-800/50 bg-[#0a0014]">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-purple-200">Level</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-purple-200">Required Buildings</th>
              {RESOURCE_COLS.map((c) => (
                <th key={c.key} scope="col" className="px-4 py-3 text-right font-semibold text-purple-200 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right font-semibold text-purple-200 whitespace-nowrap">
                🦸 Heroes Cap
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-purple-200 whitespace-nowrap">
                ⏱ Build Time
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-purple-200 whitespace-nowrap">
                CP
              </th>
            </tr>
          </thead>
          <tbody>
            {levels.map((row, i) => {
              const isHighlight = row.level === highlight;
              return (
                <tr
                  key={row.level}
                  id={`level-${row.level}`}
                  className={[
                    "border-b border-purple-900/30 transition-colors",
                    isHighlight
                      ? "bg-purple-600/20 outline outline-1 outline-purple-500"
                      : i % 2 === 0 ? "bg-purple-900/10" : "bg-transparent",
                  ].join(" ")}
                >
                  <td className="px-4 py-2.5 font-bold text-white">
                    {row.level}
                    {row.level === 30 && (
                      <span className="ml-2 rounded bg-amber-600/70 px-1.5 py-0.5 text-xs">T10</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-purple-200">
                    {row.requiredBuildings.length > 0
                      ? row.requiredBuildings.join(", ")
                      : <span className="text-purple-400/50">—</span>}
                  </td>
                  {RESOURCE_COLS.map((c) => (
                    <td key={c.key} className="px-4 py-2.5 text-right font-mono text-purple-200">
                      {fmt(row.cost[c.key])}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right font-semibold text-purple-100">
                    {row.heroesCap}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200 whitespace-nowrap">
                    {fmtTime(row.buildTimeMinutes)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200">
                    {row.cp > 0 ? fmt(row.cp) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-purple-400/60">
        Steel required from HQ 31.
      </p>
    </>
  );
}
