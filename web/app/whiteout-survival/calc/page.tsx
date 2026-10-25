import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Furnace & Fire Crystal Calculator | GAMIDES",
  description:
    "Interactive Whiteout Survival Furnace 1–30 and Fire Crystal FC1–FC5 calculator. Calculate exact Meat, Wood, Coal, Iron, Fire Crystals, and construction speed-ups.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/calc",
  },
};

export default function WhiteoutCalcPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Calculator
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Furnace &amp; Fire Crystal Calculator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Select your current and target Furnace or Fire Crystal level to calculate cumulative Meat, Wood, Coal, Iron, Fire Crystal deficits, and speed-up hours.
        </p>
      </div>
      <WhiteoutClient section="calc" />
    </div>
  );
}
