import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival PvP, Sunfire Castle & Rally Formation Guide | GAMIDES",
  description:
    "Master Whiteout Survival PvP: Slot-1 Rally Joiner mechanics, Sunfire Castle Double-Rally timing, Garrison Captain swaps, and 50/20/30 vs 60/40/0 troop ratios.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/pvp",
  },
};

export default function WhiteoutPvpPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · PvP &amp; Rally Strategy
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival PvP, Sunfire Castle &amp; Bear Rally Meta
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Optimize your Infantry/Lancer/Marksman formations, synchronize double rallies on Sunfire Castle, and enforce the mandatory Slot-1 Rally Joiner rule.
        </p>
      </div>
      <WhiteoutClient section="pvp" />
    </div>
  );
}
