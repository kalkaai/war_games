import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Research & War Academy Helios T11 Guide | GAMIDES",
  description:
    "Complete Whiteout Survival Research Center priority guide (Growth, Economy, Battle) and War Academy Helios T11 Fire Crystal Shard (13,040) & Steel costs.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/research",
  },
};

export default function WhiteoutResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Research &amp; War Academy
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Research Trees &amp; War Academy (Helios T11)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Optimize your Research Speed-ups across Growth, Economy, and Battle trees, and calculate exact Fire Crystal Shards and Steel required for Helios T11 Infantry, Marksman, and Lancer unlocks.
        </p>
      </div>
      <WhiteoutClient section="research" />
    </div>
  );
}
