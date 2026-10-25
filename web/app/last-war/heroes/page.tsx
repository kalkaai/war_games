import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War UR Hero Tier List, Shards & Squad Guide (Kimberly, DVA, Tesla) | GAMIDES",
  description:
    "Last War: Survival Game UR Hero tier list and Universal Shard / Skill Medal calculator for Kimberly, Stetmann, DVA, Murphy, Williams, and Tesla.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/heroes",
  },
};

export default function LastWarHeroesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival Game · UR Heroes
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War UR Hero Tier List &amp; Shard Calculator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Calculate Universal UR Shards and Skill Medals from 0★ to 5★ and compare Tank, Aircraft, and Missile squad carries.
        </p>
      </div>
      <LastWarClient section="heroes" />
    </div>
  );
}
