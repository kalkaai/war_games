import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War HQ Upgrade Requirements (Levels 1–30) & T10 Prerequisites | GAMIDES",
  description:
    "Complete Last War: Survival Game Headquarters (HQ) Levels 1–30 table: required buildings, Iron, Food, Gold costs, build times, and T10 Special Forces unlock path.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/hq",
  },
};

export default function LastWarHqIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival Game · HQ &amp; T10
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War HQ Levels 1–30 Requirements &amp; T10 Special Forces Table
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Every Headquarters level requirement, Tech Center prerequisite, Iron/Food/Gold cost, and build time. Click any HQ level for its full speed-up breakdown.
        </p>
      </div>
      <LastWarClient section="hq" />
    </div>
  );
}
