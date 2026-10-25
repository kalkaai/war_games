import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Furnace Upgrade Requirements (Lv. 1–30 + FC1–FC5) | GAMIDES",
  description:
    "Complete Whiteout Survival Furnace upgrade table from Level 1 to Level 30 and Fire Crystal FC1–FC5: prerequisite buildings, Meat, Wood, Coal, Iron, Fire Crystals, and build times.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/furnace",
  },
};

export default function WhiteoutFurnaceIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Furnace &amp; Fire Crystal
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Furnace 1–30 &amp; Fire Crystal FC1–FC5 Table
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Every Furnace level requirement, prerequisite building, resource cost, Fire Crystal gate, and build duration. Click any level for its full speed-up breakdown.
        </p>
      </div>
      <WhiteoutClient section="furnace" />
    </div>
  );
}
