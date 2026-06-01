import type { Metadata } from "next";
import Link from "next/link";
import T10TrackerClient from "./T10TrackerClient";

export const metadata: Metadata = {
  title: "T10 Research Calculator — GAMIDES | Last Z: Survival Shooter",
  description:
    "Last Z: Survival Shooter T10 research tracker. All 22 Unit Special Training nodes, 1,488,100 total badges, full prerequisite chain, phase milestones. Track your path to Tier 10 troops.",
  openGraph: {
    title: "T10 Research Calculator — GAMIDES | Last Z: Survival Shooter",
    description:
      "Track all 22 T10 research nodes with prerequisite enforcement. 1,488,100 badges total. Unlock Tier 10 troops in Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/calc/t10",
  },
};

export default function T10Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/calc" className="hover:text-purple-200 transition-colors">Calculators</Link>
        <span>›</span>
        <span className="text-purple-200">T10 Research</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Last Z T10 Research Calculator
      </h1>
      <p className="mt-2 text-purple-200/80">
        22 nodes · 1,488,100 total badges · Full prerequisite chain · Progress saves automatically
      </p>

      {/* Requirements callout */}
      <div className="mt-6 rounded-xl border border-blue-700/40 bg-blue-900/10 p-5">
        <h3 className="font-semibold text-blue-200">Building Requirements to Train T10 Troops</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          {[
            { label: "Laboratory", level: "Lv 30" },
            { label: "HQ", level: "Lv 30" },
            { label: "Barracks", level: "Lv 30" },
          ].map(({ label, level }) => (
            <span key={label} className="rounded-lg border border-blue-800/50 bg-blue-900/30 px-3 py-1.5">
              <span className="text-blue-300">{label}</span>{" "}
              <span className="font-bold text-white">{level}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-blue-200/70">
          All three buildings must reach Lv 30 before T10 troops can be trained — even after the Unit Special Training research is complete.
        </p>
      </div>

      {/* Recharge Shield callout */}
      <div className="mt-4 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h3 className="font-semibold text-amber-200">Priority node: Recharge Shield</h3>
        <p className="mt-1 text-sm text-amber-100/70">
          <strong className="text-white">Recharge Shield</strong> (Phase 4, 219,000 badges / 20 levels) grants <strong className="text-white">+50% Troop HP</strong> — the single most powerful buff in the entire tree.
          Even partial levels provide significant HP scaling that multiplies with your base defense.
          Invest here as soon as it unlocks — do not skip to Unit Special Training immediately.
        </p>
      </div>

      {/* Interactive tracker */}
      <div className="mt-8">
        <T10TrackerClient />
      </div>
    </div>
  );
}
