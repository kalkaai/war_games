"use client";

import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import t10Data from "@/data/t10.json";
import type { T10Node, T10PhaseMilestone } from "@/types";

const nodes = t10Data.nodes as T10Node[];
const milestones = t10Data.phaseMilestones as T10PhaseMilestone[];
const phaseNames = t10Data.phaseNames as Record<string, string>;
const MAX_BADGES = t10Data.totalBadges;
const STORAGE_KEY = "wg_t10";

type Mode = "sequential" | "custom";

const PHASE_STYLES: Record<number, { badge: string; header: string }> = {
  1: { badge: "border-slate-600 text-slate-300",   header: "bg-slate-900/40" },
  2: { badge: "border-blue-700 text-blue-300",     header: "bg-blue-900/20" },
  3: { badge: "border-purple-600 text-purple-200", header: "bg-purple-900/30" },
  4: { badge: "border-amber-600 text-amber-300",   header: "bg-amber-900/20" },
};

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toString();
}

function getNodeById(id: string): T10Node | undefined {
  return nodes.find((n) => n.id === id);
}

export default function T10TrackerClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>("sequential");

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

  function isUnlocked(node: T10Node): boolean {
    return node.prerequisites.every((prereqId) => completed.has(prereqId));
  }

  function toggle(node: T10Node) {
    if (mode === "sequential" && !isUnlocked(node) && !completed.has(node.id)) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      const completing = !prev.has(node.id);
      if (completing) next.add(node.id); else next.delete(node.id);
      sendGAEvent("event", "t10_node_toggle", { node: node.id, completed: completing });
      persist(next);
      return next;
    });
  }

  function reset() {
    sendGAEvent("event", "t10_reset", {});
    setCompleted(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  const spentBadges = nodes
    .filter((n) => completed.has(n.id))
    .reduce((s, n) => s + n.totalBadges, 0);

  const pct = Math.min(100, (spentBadges / MAX_BADGES) * 100);
  const allComplete = completed.size >= nodes.length;

  // Group nodes by phase
  const phases = [1, 2, 3, 4] as const;

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
          aria-label="T10 research progress"
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

      {/* Phase milestone progress */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {milestones.map((m) => {
          const done = spentBadges >= m.badges;
          const remaining = Math.max(0, m.badges - spentBadges);
          return (
            <div
              key={m.phase}
              className={`rounded-lg border p-2.5 text-center text-xs ${
                done
                  ? "border-green-700/60 bg-green-900/20"
                  : "border-purple-800/40 bg-purple-950/30"
              }`}
            >
              <p className={`font-semibold ${done ? "text-green-300" : "text-white"}`}>{m.label}</p>
              {done ? (
                <p className="mt-1 text-green-500">Complete ✓</p>
              ) : (
                <p className="mt-1 text-amber-400">{fmtBadges(remaining)} more</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Mode toggle + actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-lg border border-purple-700/60 p-0.5">
          {(["sequential", "custom"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-purple-600 text-white"
                  : "text-purple-400 hover:text-purple-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {!allComplete && nodes.length > 0 && (
            <button
              onClick={() => {
                const next = new Set(nodes.map((n) => n.id));
                sendGAEvent("event", "t10_mark_all", {});
                setCompleted(next);
                persist(next);
              }}
              className="rounded-md border border-purple-700/60 px-3 py-1.5 text-xs text-purple-300 transition-colors hover:border-purple-500 hover:text-white"
            >
              Mark all complete
            </button>
          )}
          {completed.size > 0 && (
            <button
              onClick={reset}
              className="rounded-md border border-red-800/60 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-600 hover:text-red-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      {mode === "sequential" && (
        <p className="mt-1.5 text-xs text-purple-500">
          Sequential mode: nodes unlock only when prerequisites are complete.
        </p>
      )}

      {/* Node list grouped by phase */}
      <div className="mt-6 space-y-5">
        {phases.map((phase) => {
          const phaseNodes = nodes.filter((n) => n.phase === phase);
          const styles = PHASE_STYLES[phase];
          const phaseDone = phaseNodes.every((n) => completed.has(n.id));
          return (
            <div key={phase}>
              <div className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${styles.badge} ${styles.header}`}>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Phase {phase} — {phaseNames[String(phase)]}
                </span>
                {loaded && phaseDone && (
                  <span className="text-xs text-green-400">✓ Complete</span>
                )}
              </div>

              <div className="mt-2 space-y-1.5">
                {phaseNodes.map((node) => {
                  const done = loaded && completed.has(node.id);
                  const unlocked = mode === "custom" || isUnlocked(node);
                  const locked = mode === "sequential" && !done && !unlocked;

                  return (
                    <button
                      key={node.id}
                      onClick={() => toggle(node)}
                      disabled={locked}
                      aria-pressed={done}
                      aria-label={`${node.name} — ${done ? "completed" : locked ? "locked" : "not completed"}`}
                      className={[
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                        done
                          ? "border-purple-500/40 bg-purple-600/15 opacity-60"
                          : locked
                          ? "cursor-not-allowed border-purple-900/40 bg-purple-950/20 opacity-40"
                          : "border-purple-700/60 bg-purple-900/20 hover:border-purple-600 hover:bg-purple-900/40",
                      ].join(" ")}
                    >
                      {/* Status icon */}
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                          done
                            ? "border-purple-400 bg-purple-500 text-white"
                            : locked
                            ? "border-purple-800 text-purple-800"
                            : "border-purple-600 text-transparent"
                        }`}
                      >
                        {locked ? "🔒" : "✓"}
                      </span>

                      {/* Name + prereqs + stat */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${done ? "line-through text-purple-500" : locked ? "text-purple-700" : "text-white"}`}>
                          {node.name}
                        </p>
                        <p className={`text-xs ${locked ? "text-purple-800" : "text-purple-400/80"}`}>
                          {node.stat}
                        </p>
                        {locked && node.prerequisites.length > 0 && (
                          <p className="text-xs text-purple-700/80 mt-0.5">
                            Requires: {node.prerequisites
                              .filter((pid) => !completed.has(pid))
                              .map((pid) => getNodeById(pid)?.name ?? pid)
                              .join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Cost */}
                      <div className="ml-2 shrink-0 text-right">
                        <p className={`text-xs font-mono ${locked ? "text-purple-700" : "text-amber-400"}`}>
                          {fmtBadges(node.totalBadges)} 🏅
                        </p>
                        <p className={`text-xs ${locked ? "text-purple-800" : "text-purple-600"}`}>
                          {node.maxLevel === 1 ? "1 level" : `${node.maxLevel} levels`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from lastzguides.com, lastzwiki.com, and ztools.co.uk. Total: 1,488,100 badges. Requires Lab Lv 30, HQ Lv 30, Barracks Lv 30. Last updated May 2026.
      </p>
    </div>
  );
}
