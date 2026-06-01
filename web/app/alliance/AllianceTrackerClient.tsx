"use client";

import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import allianceData from "@/data/alliance.json";
import type { AllianceNode, AllianceDuelDay } from "@/types";

const nodes = allianceData.nodes as AllianceNode[];
const days = allianceData.days as AllianceDuelDay[];
const MAX_BADGES = allianceData.totalBadges;
const STORAGE_KEY = "wg_alliance_ar";

const CATEGORY_GROUPS: { key: AllianceNode["category"]; label: string; styles: { badge: string; header: string } }[] = [
  { key: "chests",     label: "Chest Unlocks",      styles: { badge: "border-amber-600 text-amber-300",    header: "bg-amber-900/20" } },
  { key: "multiplier", label: "Point Multipliers",   styles: { badge: "border-purple-500 text-purple-200",  header: "bg-purple-900/30" } },
  { key: "incentive",  label: "Activity Incentives", styles: { badge: "border-blue-600 text-blue-300",      header: "bg-blue-900/20" } },
  { key: "utility",    label: "Productivity",        styles: { badge: "border-cyan-700 text-cyan-300",      header: "bg-cyan-900/20" } },
  { key: "gather",     label: "Resource Gathering",  styles: { badge: "border-green-700 text-green-300",    header: "bg-green-900/20" } },
];

const DAY_COLORS = [
  "border-amber-700/60 bg-amber-900/10",
  "border-blue-700/60 bg-blue-900/10",
  "border-purple-700/60 bg-purple-900/20",
  "border-rose-700/60 bg-rose-900/10",
  "border-cyan-700/60 bg-cyan-900/10",
  "border-red-700/60 bg-red-900/10",
];

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toString();
}

export default function AllianceTrackerClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompleted(new Set(parsed as string[]));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function persist(next: Set<string>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // ignore
    }
  }

  function toggle(nodeId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      const completing = !prev.has(nodeId);
      if (completing) next.add(nodeId); else next.delete(nodeId);
      sendGAEvent("event", "alliance_node_toggle", { node: nodeId, completed: completing });
      persist(next);
      return next;
    });
  }

  function reset() {
    sendGAEvent("event", "alliance_reset", {});
    setCompleted(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  const spentBadges = nodes
    .filter((n) => completed.has(n.id))
    .reduce((s, n) => s + n.totalBadges, 0);

  const pct = Math.min(100, (spentBadges / MAX_BADGES) * 100);

  return (
    <div>
      {/* Progress summary */}
      <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-purple-200">
            <span className="font-semibold text-white">{loaded ? fmtBadges(spentBadges) : "—"}</span> badges invested
          </span>
          <span className="text-purple-400">
            {loaded ? fmtBadges(MAX_BADGES - spentBadges) : "—"} remaining
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Alliance Recognition progress"
          className="mt-2 h-2 overflow-hidden rounded-full bg-purple-900/60"
        >
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${pct.toFixed(1)}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-purple-500">{completed.size} / {nodes.length} nodes</span>
          <span className="text-purple-400">{pct.toFixed(1)}% complete</span>
        </div>
      </div>

      {/* Multiplier callout */}
      <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-900/10 px-4 py-2.5 text-sm">
        <span className="font-semibold text-amber-300">Combined multiplier:</span>{" "}
        <span className="text-amber-200/90">
          Event Expert (max) + Event King (max) = <strong className="text-white">+300% Alliance Duel Points</strong>
        </span>
      </div>

      {/* Reset */}
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

      {/* Node list grouped by category */}
      <div className="mt-6 space-y-5">
        {CATEGORY_GROUPS.map(({ key, label, styles }) => {
          const groupNodes = nodes
            .filter((n) => n.category === key)
            .sort((a, b) => a.priority - b.priority);
          if (groupNodes.length === 0) return null;
          return (
            <div key={key}>
              <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${styles.badge} ${styles.header}`}>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {groupNodes.map((node) => {
                  const done = loaded && completed.has(node.id);
                  return (
                    <button
                      key={node.id}
                      onClick={() => toggle(node.id)}
                      aria-pressed={done}
                      aria-label={`${node.name} — ${done ? "completed" : "not completed"}`}
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

                      {/* Priority badge */}
                      <span className="w-5 shrink-0 text-center font-mono text-xs text-purple-600">
                        {node.priority}
                      </span>

                      {/* Name + stat */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${done ? "line-through text-purple-500" : "text-white"}`}>
                          {node.name}
                        </p>
                        <p className="text-xs text-purple-400/80">{node.stat}</p>
                      </div>

                      {/* Cost */}
                      <div className="ml-2 shrink-0 text-right">
                        <p className="text-xs font-mono text-amber-400">{fmtBadges(node.totalBadges)} 🏅</p>
                        <p className="text-xs text-purple-600">Lv {node.maxLevel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day-by-day guide */}
      <h2 className="mt-12 text-xl font-bold text-white">Alliance Duel — Day-by-Day Guide</h2>
      <p className="mt-1 text-sm text-purple-200/80">
        6-day weekly event. Save resources all week and spend them on the correct day to maximize points.
      </p>

      <div className="mt-4 space-y-3">
        {days.map((d, i) => {
          const open = activeDay === d.day;
          return (
            <div key={d.day} className={`rounded-xl border transition-all ${DAY_COLORS[i] ?? DAY_COLORS[0]}`}>
              <button
                onClick={() => setActiveDay(open ? null : d.day)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded bg-purple-800/60 px-2 py-0.5 font-mono text-xs text-purple-300">
                    Day {d.day}
                  </span>
                  <span className="text-xs text-purple-400/70">{d.weekday}</span>
                  <span className="font-semibold text-white">{d.name}</span>
                </div>
                <span className="text-purple-400 text-sm">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className="border-t border-purple-800/30 px-5 pb-5 pt-4">
                  <p className="text-sm text-purple-200/90">{d.description}</p>

                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-purple-400">
                      Key items to use
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {d.keyItems.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-purple-700/50 bg-purple-900/40 px-2.5 py-0.5 text-xs text-purple-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {d.tips.map((tip, ti) => (
                      <div key={ti} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-purple-500">▸</span>
                        <p className="text-sm text-purple-200/80">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from lastzguides.com and lastzdata.com. Total: 356,770 badges to complete all 19 nodes. Last updated May 2026.
      </p>
    </div>
  );
}
