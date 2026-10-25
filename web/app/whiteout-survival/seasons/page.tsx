import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Server Age & Generation Timeline (Gen 1–8) | GAMIDES",
  description:
    "Track Whiteout Survival server age milestones from Gen 1 launch through Fire Crystal Era (FC1–FC10), War Academy Helios T11, and Gen 8 SSR Heroes.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/seasons",
  },
};

export default function WhiteoutSeasonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Seasons &amp; Server Timeline
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Server Age &amp; Generation Unlock Calendar
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Plan your Gems, Mythic General Shards, and Fire Crystals ahead of every server age milestone from Day 1 through Generation 8.
        </p>
      </div>
      <WhiteoutClient section="seasons" />
    </div>
  );
}
