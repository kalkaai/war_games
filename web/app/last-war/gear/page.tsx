import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War UR Legendary & Mythic Red Gear Guide (Railgun, Radar, Armor & Chip) | GAMIDES",
  description:
    "Complete Last War: Survival Game UR Gear crafting guide: M5-A Thor Railgun, Predator Radar, Guardian Armor & Data Chip 4★ Blueprint costs and Mythic Red Gear priority.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/gear",
  },
};

export default function LastWarGearPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · UR &amp; Mythic Red Gear
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War UR Legendary &amp; Mythic Red Hero Gear Guide
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Optimize your Upgrade Ore, Dielectric Ceramics, Legendary Blueprints, and 10-Blueprint Mythic Red Gear promotions across Attackers and Frontline Defenders.
        </p>
      </div>
      <LastWarClient section="gear" />
    </div>
  );
}
