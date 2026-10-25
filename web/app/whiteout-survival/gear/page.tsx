import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Chief Gear & Chief Charms Calculator | GAMIDES",
  description:
    "Calculate Whiteout Survival Chief Gear (Hardened Alloy, Polishing Solution, Design Plans, Lunar Amber) and Chief Charms (Lv. 1–16 Charm Guides, Designs & Jewel Secrets).",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/gear",
  },
};

export default function WhiteoutGearPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Chief Gear &amp; Charms
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Chief Gear &amp; Chief Charms Planner
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Plan your 6-piece Chief Gear upgrades from Green to Red T3 (Lunar Amber) and calculate all 18 Chief Charm slots from Level 1 to Level 16.
        </p>
      </div>
      <WhiteoutClient section="gear" />
    </div>
  );
}
