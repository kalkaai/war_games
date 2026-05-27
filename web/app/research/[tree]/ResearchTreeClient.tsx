"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import type { ResearchTree, ResearchNode } from "@/types";

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function storageKey(treeId: string) {
  return `wg_research_${treeId}`;
}

export default function ResearchTreeClient({ tree }: { tree: ResearchTree }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(tree.id));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompleted(new Set(parsed as string[]));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [tree.id]);

  function toggle(nodeId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      const completing = !prev.has(nodeId);
      if (completing) next.add(nodeId);
      else next.delete(nodeId);
      sendGAEvent("event", "research_node_toggle", { tree: tree.id, node: nodeId, completed: completing });
      try {
        localStorage.setItem(storageKey(tree.id), JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function reset() {
    sendGAEvent("event", "research_progress_reset", { tree: tree.id });
    setCompleted(new Set());
    try {
      localStorage.removeItem(storageKey(tree.id));
    } catch {
      // ignore
    }
  }

  const spentBadges = tree.nodes
    .filter((n) => completed.has(n.id))
    .reduce((s, n) => s + n.totalBadges, 0);

  const pct = tree.totalBadges > 0 ? Math.min(100, (spentBadges / tree.totalBadges) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">

      <Link href="/research" className="text-sm text-purple-400 hover:text-purple-300">
        ← All trees
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {tree.icon} {tree.name}
          </h1>
          <p className="mt-1 text-sm text-purple-300/70">{tree.description}</p>
          {tree.unlockRequirement && (
            <p className="mt-2 text-xs text-amber-300/80">🔒 Requires: {tree.unlockRequirement}</p>
          )}
        </div>
        {completed.size > 0 && (
          <button
            onClick={reset}
            className="rounded-md border border-red-800/60 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-600 hover:text-red-300"
          >
            Reset progress
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-6 rounded-xl border border-purple-800/50 bg-purple-900/20 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-purple-200">
            {loaded ? fmtBadges(spentBadges) : "—"} badges spent
          </span>
          <span className="text-purple-400">
            {loaded ? fmtBadges(tree.totalBadges - spentBadges) : "—"} remaining
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${tree.name} research progress`}
          className="mt-2 h-2 overflow-hidden rounded-full bg-purple-900/60"
        >
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-300"
            style={{ width: `${pct.toFixed(1)}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-purple-400">{pct.toFixed(1)}% complete</p>
      </div>

      {/* Nodes list */}
      <h2 className="mt-8 text-xl font-bold text-white">
        Which Nodes Should You Research in {tree.name}?
      </h2>
      {tree.nodes.length > 0 ? (
        <div className="mt-6 space-y-2">
          {tree.nodes.map((node: ResearchNode) => {
            const done = loaded && completed.has(node.id);
            return (
              <button
                key={node.id}
                aria-pressed={done}
                aria-label={`${node.name} — ${done ? "completed" : "not completed"}`}
                onClick={() => toggle(node.id)}
                className={[
                  "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all",
                  done
                    ? "border-purple-500/60 bg-purple-600/20 opacity-70"
                    : "border-purple-800/50 bg-purple-900/20 hover:border-purple-600 hover:bg-purple-900/40",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${done ? "border-purple-400 bg-purple-500 text-white" : "border-purple-600 text-transparent"}`}>
                    ✓
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${done ? "line-through text-purple-400" : "text-white"}`}>
                      {node.name}
                    </p>
                    {node.stat && (
                      <p className="text-xs text-purple-400">
                        {node.stat}
                        {node.statMin && node.statMax ? ` · ${node.statMin} → ${node.statMax}` : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-mono text-purple-300">{node.totalBadges > 0 ? fmtBadges(node.totalBadges) : "—"}</p>
                  <p className="text-xs text-purple-500">Lv {node.maxLevel}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-purple-800/40 bg-purple-900/20 p-8 text-center">
          <p className="text-purple-400">Node-level data for this tree is not yet available.</p>
          <p className="mt-1 text-sm text-purple-500">
            Total: {fmtBadges(tree.totalBadges)} badges · {tree.nodeCount} nodes
          </p>
        </div>
      )}

    </div>
  );
}
