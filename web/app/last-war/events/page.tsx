import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War VS Alliance Duel Schedule & 4h Arms Race Rotation | GAMIDES",
  description:
    "Complete Last War: Survival Game 6-day VS Alliance Duel rotation and 4-hour Arms Race cycle. Sync your speed-ups, drone parts, and UR shards for 2× rewards.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/events",
  },
};

export default function LastWarEventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival Game · Events
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War VS Alliance Duel &amp; 4-Hour Arms Race Schedule
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Plan your daily double-dip windows by aligning the 4-hour Arms Race themes with the 6-day VS Alliance Duel schedule.
        </p>
      </div>
      <LastWarClient section="events" />
    </div>
  );
}
