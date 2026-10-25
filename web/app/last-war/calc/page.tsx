import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War HQ 1–30 Resource, Speed-Up & UR Shard Calculator | GAMIDES",
  description:
    "Interactive Last War: Survival Game calculator: plan Iron, Food, Gold, and construction speed-ups for HQ 1–30, plus UR Hero Shards and Skill Medals.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/calc",
  },
};

export default function LastWarCalcPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival Game · Calculators
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War HQ Resource &amp; UR Hero Shard Calculators
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Calculate exact Iron, Food, Gold, and speed-up hours between any two HQ levels, or plan your Thursday VS Duel UR Hero star upgrades.
        </p>
      </div>
      <LastWarClient section="calc" />
    </div>
  );
}
