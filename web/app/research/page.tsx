import type { Metadata } from "next";
import Link from "next/link";
import researchData from "@/data/research.json";
import type { ResearchTree } from "@/types";

export const metadata: Metadata = {
  title: "Research Trees — GAMIDES | Last Z",
  description: "All 9 Last Z research trees with badge costs, node counts, and interactive progress tracking. Plan your research investment per tree.",
  openGraph: {
    title: "Research Trees — GAMIDES | Last Z",
    description: "All 9 Last Z research trees with badge costs, node counts, and interactive progress tracking.",

  },
  alternates: {
    canonical: "https://www.gamides.com/research",
  },
};

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const trees = researchData.trees as ResearchTree[];
const totalBadges = trees.reduce((s, t) => s + t.totalBadges, 0);

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z Research Trees</h1>
      <p className="mt-2 text-purple-100/95">
        9 trees · {fmtBadges(totalBadges)} total badges to max everything. <strong>Badges</strong> are the primary research currency in Last Z, earned from daily tasks and events, and spent across trees to unlock stat bonuses (ATK, DEF, HP, march speed, and more).
      </p>

      <h2 className="mt-8 text-xl font-bold text-white">Which Research Tree Should You Focus On First?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trees.map((tree) => (
          <Link
            key={tree.id}
            href={`/research/${tree.id}`}
            className="group rounded-xl border border-purple-700/60 bg-purple-900/30 p-5 transition-all hover:border-purple-500 hover:bg-purple-800/50"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{tree.icon}</span>
              <span className="rounded bg-purple-800/60 px-2 py-0.5 text-xs text-purple-300">
                {tree.nodeCount} nodes
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-white group-hover:text-purple-200">
              {tree.name}
            </h3>
            <p className="mt-1 text-xs text-purple-400">{fmtBadges(tree.totalBadges)} badges to max</p>
            <p className="mt-2 text-xs text-purple-300/60 line-clamp-2">{tree.description}</p>
            {tree.unlockRequirement && (
              <p className="mt-2 rounded bg-purple-950/60 px-2 py-1 text-xs text-amber-300/80">
                🔒 {tree.unlockRequirement}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-purple-800/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Badge Cost Summary</h3>
        <div className="mt-3 overflow-x-auto">
          <table aria-label="Research tree badge cost summary" className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-800/40">
                <th scope="col" className="pb-2 text-left text-purple-300">Tree</th>
                <th scope="col" className="pb-2 text-right text-purple-300">Total Badges</th>
                <th scope="col" className="pb-2 text-right text-purple-300">% of All</th>
              </tr>
            </thead>
            <tbody>
              {[...trees].sort((a, b) => b.totalBadges - a.totalBadges).map((tree) => (
                <tr key={tree.id} className="border-b border-purple-900/20">
                  <td className="py-1.5 text-purple-200">
                    {tree.icon} {tree.name}
                  </td>
                  <td className="py-1.5 text-right font-mono text-purple-100">
                    {fmtBadges(tree.totalBadges)}
                  </td>
                  <td className="py-1.5 text-right text-purple-400">
                    {((tree.totalBadges / totalBadges) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="pt-2 text-white">Total</td>
                <td className="pt-2 text-right font-mono text-white">{fmtBadges(totalBadges)}</td>
                <td className="pt-2 text-right text-purple-300">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/70">
        Last updated May 2026.
      </p>
    </div>
  );
}
