"use client";

import { useState, useEffect } from "react";
import researchData from "@/data/research.json";
import type { ResearchTree } from "@/types";

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const trees = researchData.trees as ResearchTree[];
const totalBadges = trees.reduce((s, t) => s + t.totalBadges, 0);

export default function ResearchGlobalStats() {
  const [spentBadges, setSpentBadges] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let total = 0;
    for (const tree of trees) {
      try {
        const raw = localStorage.getItem(`wg_research_${tree.id}`);
        if (raw) {
          const completedIds = new Set<string>(JSON.parse(raw));
          for (const node of tree.nodes) {
            if (completedIds.has(node.id)) total += node.totalBadges;
          }
        }
      } catch {
        // ignore
      }
    }
    setSpentBadges(total);
    setLoaded(true);
  }, []);

  if (!loaded || spentBadges === 0) return null;

  const remaining = totalBadges - spentBadges;
  const pct = Math.min(100, (spentBadges / totalBadges) * 100);

  return (
    <div className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
      <p className="text-sm font-semibold text-white">Your overall progress</p>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-purple-200">{fmtBadges(spentBadges)} badges spent</span>
        <span className="text-purple-400">{fmtBadges(remaining)} remaining</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall research progress across all trees"
        className="mt-2 h-2 overflow-hidden rounded-full bg-purple-900/60"
      >
        <div
          className="h-full rounded-full bg-purple-500 transition-all duration-300"
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-purple-400">{pct.toFixed(1)}% of all research complete</p>
    </div>
  );
}
