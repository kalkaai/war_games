import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War Tactical Drone Calculator (Lv. 10–250), Components & Skill Chips | GAMIDES",
  description:
    "Calculate exact Drone Parts and Battle Data needed from Lv. 10 to Lv. 250 in Last War: Survival Game, plus Right-Side Drone Component priority.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/drone",
  },
};

export default function LastWarDronePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · Tactical Drone &amp; Components
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War Tactical Drone Parts Calculator &amp; Component Guide
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Plan your Monday VS Radar &amp; Drone Day upgrades across Drone Hangar Levels 10–250, Right-Side Lv.8/Lv.9 Components, and UR Combat Skill Chips.
        </p>
      </div>
      <LastWarClient section="drone" />
    </div>
  );
}
