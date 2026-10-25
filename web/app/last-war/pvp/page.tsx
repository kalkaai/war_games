import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War PvP Guide — Counter Triangle, Squad Aura & Capitol War | GAMIDES",
  description:
    "Master Last War: Survival Game PvP: Tank → Missile → Aircraft counter triangle (+20% DMG), 5-of-a-Kind Squad Aura, and zero-loss Capitol War Wall defense.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/pvp",
  },
};

export default function LastWarPvpPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · PvP &amp; Squad Formations
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War PvP Counter Triangle, Squad Aura &amp; Capitol War Guide
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Learn how Tank, Aircraft, and Missile squads counter each other, how to position front and back rows, and how to fight in the Capitol Mud Zone without losing troops.
        </p>
      </div>
      <LastWarClient section="pvp" />
    </div>
  );
}
