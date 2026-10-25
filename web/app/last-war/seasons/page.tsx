import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War Seasons 1–4 & Age of Oil Guide (Crimson Plague to Evernight Isle) | GAMIDES",
  description:
    "Complete Last War: Survival Game seasonal guide covering Season 1 (Crimson Plague), Season 2 (Polar World), Age of Oil (HQ 31–35), Season 3 (Golden Realm), and Season 4.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/seasons",
  },
};

export default function LastWarSeasonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · Seasons 1–4 &amp; Age of Oil
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War: Survival Seasons 1–4 &amp; Age of Oil Progression Guide
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Master Virus Resistance, Polar Blizzard Furnace management, SSR-to-UR hero promotions (Mason, Violet, Scarlett), and Exclusive Weapon waves.
        </p>
      </div>
      <LastWarClient section="seasons" />
    </div>
  );
}
