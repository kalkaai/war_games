"use client";

import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import tanksData from "@/data/tanks.json";
import type { TankModification } from "@/types";

const mods = tanksData.modifications as TankModification[];
const MAX_WRENCHES = 70700;
const STORAGE_KEY = "wg_tank_mods";

const MILESTONES = [
  { name: "Cheetah",      wrenches: 150 },
  { name: "Hercules",     wrenches: 1730 },
  { name: "Destroyer",    wrenches: 10440 },
  { name: "Destroyer EX", wrenches: 35300 },
  { name: "Lv 240 (Max)", wrenches: 70700 },
];

const TIER_STYLES: Record<string, { badge: string; header: string }> = {
  "Intern Modifier":      { badge: "border-slate-600 text-slate-300",   header: "bg-slate-900/40" },
  "Novice Modifier":      { badge: "border-green-700 text-green-300",   header: "bg-green-900/20" },
  "Veteran Modifier":     { badge: "border-cyan-700 text-cyan-300",     header: "bg-cyan-900/20" },
  "Elite Modifier":       { badge: "border-blue-700 text-blue-300",     header: "bg-blue-900/20" },
  "Expert Modifier":      { badge: "border-purple-600 text-purple-200", header: "bg-purple-900/30" },
  "Master Modifier":      { badge: "border-amber-600 text-amber-300",   header: "bg-amber-900/20" },
  "Grandmaster Modifier": { badge: "border-orange-600 text-orange-300", header: "bg-orange-900/20" },
  "Modding Overlord":     { badge: "border-rose-600 text-rose-300",     header: "bg-rose-900/20" },
};

function fmtWrenches(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toString();
}

function fmtTime(weeks: number): string {
  if (weeks < 1) return "< 1 week";
  if (weeks < 9) return `~${Math.ceil(weeks)} wks`;
  const months = weeks / 4.33;
  if (months < 24) return `~${Math.ceil(months)} mo`;
  return `~${(months / 12).toFixed(1)} yrs`;
}

// Build tier groups preserving order
function groupByTier(list: TankModification[]) {
  const groups: { tier: string; items: TankModification[] }[] = [];
  for (const mod of list) {
    const last = groups[groups.length - 1];
    if (!last || last.tier !== mod.tier) {
      groups.push({ tier: mod.tier, items: [mod] });
    } else {
      last.items.push(mod);
    }
  }
  return groups;
}

const tierGroups = groupByTier(mods);

export default function TankTrackerClient() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [weeklyRate, setWeeklyRate] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompleted(new Set(parsed as number[]));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function persist(next: Set<number>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // ignore
    }
  }

  function toggle(level: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      const completing = !prev.has(level);
      if (completing) next.add(level); else next.delete(level);
      sendGAEvent("event", "tank_mod_toggle", { level, completed: completing });
      persist(next);
      return next;
    });
  }

  function reset() {
    sendGAEvent("event", "tank_mod_reset", {});
    setCompleted(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  const spentWrenches = mods
    .filter((m) => completed.has(m.level))
    .reduce((s, m) => s + m.totalWrenches, 0);

  const pct = Math.min(100, (spentWrenches / MAX_WRENCHES) * 100);
  const rate = parseInt(weeklyRate) || 0;

  return (
    <div>
      {/* Progress summary */}
      <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-purple-200">
            <span className="font-semibold text-white">{loaded ? fmtWrenches(spentWrenches) : "—"}</span> wrenches spent
          </span>
          <span className="text-purple-400">
            {loaded ? fmtWrenches(MAX_WRENCHES - spentWrenches) : "—"} remaining
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Vehicle modification progress"
          className="mt-2 h-2 overflow-hidden rounded-full bg-purple-900/60"
        >
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${pct.toFixed(1)}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-purple-400">{pct.toFixed(1)}% complete</p>
      </div>

      {/* Weekly rate + milestone estimates */}
      <div className="mt-4 rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="weekly-rate" className="text-sm text-purple-200">
            Weekly 🔧 wrenches earned:
          </label>
          <input
            id="weekly-rate"
            type="number"
            min={0}
            value={weeklyRate}
            onChange={(e) => setWeeklyRate(e.target.value)}
            placeholder="e.g. 500"
            className="w-28 rounded-md border border-purple-600/60 bg-purple-950/60 px-3 py-1.5 text-sm text-white placeholder-purple-600 focus:border-purple-400 focus:outline-none"
          />
          {rate > 0 && (
            <span className="text-xs text-purple-400">Estimating time to each milestone →</span>
          )}
        </div>

        {rate > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map((m) => {
              const done = spentWrenches >= m.wrenches;
              const remaining = Math.max(0, m.wrenches - spentWrenches);
              const weeks = remaining / rate;
              return (
                <div
                  key={m.name}
                  className={`rounded-lg border p-2.5 text-center text-xs ${
                    done
                      ? "border-green-700/60 bg-green-900/20"
                      : "border-purple-800/40 bg-purple-950/30"
                  }`}
                >
                  <p className={`font-semibold ${done ? "text-green-300" : "text-white"}`}>{m.name}</p>
                  {done ? (
                    <p className="mt-1 text-green-500">Complete ✓</p>
                  ) : (
                    <>
                      <p className="mt-1 text-amber-400">{fmtWrenches(remaining)} more</p>
                      <p className="text-purple-300">{fmtTime(weeks)}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      {completed.size > 0 && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={reset}
            className="rounded-md border border-red-800/60 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-600 hover:text-red-300"
          >
            Reset progress
          </button>
        </div>
      )}

      {/* Modification list grouped by tier */}
      <div className="mt-6 space-y-5">
        {tierGroups.map(({ tier, items }) => {
          const styles = TIER_STYLES[tier] ?? { badge: "border-purple-600 text-purple-300", header: "bg-purple-900/30" };
          return (
            <div key={tier}>
              {/* Tier header */}
              <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${styles.badge} ${styles.header}`}>
                <span className={`text-xs font-bold uppercase tracking-wider`}>{tier}</span>
              </div>

              <div className="mt-2 space-y-1.5">
                {items.map((mod) => {
                  const done = loaded && completed.has(mod.level);
                  return (
                    <div key={mod.level}>
                      {/* Vehicle milestone divider */}
                      {mod.vehicleUnlock && (
                        <div className="my-2 flex items-center gap-2">
                          <div className="h-px flex-1 bg-amber-700/30" />
                          <span className="rounded-full border border-amber-600/50 bg-amber-900/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                            🚗 {mod.vehicleUnlock} unlocks
                          </span>
                          <div className="h-px flex-1 bg-amber-700/30" />
                        </div>
                      )}

                      <button
                        onClick={() => toggle(mod.level)}
                        aria-pressed={done}
                        aria-label={`Lv ${mod.level} ${mod.name} — ${done ? "completed" : "not completed"}`}
                        className={[
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                          done
                            ? "border-purple-500/40 bg-purple-600/15 opacity-60"
                            : "border-purple-700/60 bg-purple-900/20 hover:border-purple-600 hover:bg-purple-900/40",
                        ].join(" ")}
                      >
                        {/* Checkbox */}
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                            done ? "border-purple-400 bg-purple-500 text-white" : "border-purple-600 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                        {/* Level */}
                        <span className="w-12 shrink-0 font-mono text-xs text-purple-500">Lv {mod.level}</span>

                        {/* Name */}
                        <span className={`flex-1 text-sm ${done ? "line-through text-purple-500" : "text-white"}`}>
                          {mod.name}
                        </span>

                        {/* Cost */}
                        <div className="ml-2 text-right">
                          <p className="text-xs font-mono text-amber-400">{fmtWrenches(mod.totalWrenches)} 🔧</p>
                          <p className="text-xs text-purple-600">{mod.subLevels} sub-lvls</p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from community wikis. Total: ~70,700 wrenches to reach Lv 240. Last updated May 2026.
      </p>
    </div>
  );
}
