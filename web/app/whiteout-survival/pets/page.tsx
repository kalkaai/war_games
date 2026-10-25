import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Beast Cage Pets Guide (Gen 1–5) | GAMIDES",
  description:
    "Complete Whiteout Survival Pets guide covering Gen 1–5 beasts (Cave Hyena, Titan Roc, Snow Leopard, Cave Lion, Iron Rhino, Saber-tooth Tiger) and active skill cooldowns.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/pets",
  },
};

export default function WhiteoutPetsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Beast Cage Pets
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Pets Guide &amp; Active Skills (Gen 1–5)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Compare every Gen 1–5 Beast Cage Pet, active skill cooldown, and SvS Day 3 Pet Advancement &amp; Refinement strategy.
        </p>
      </div>
      <WhiteoutClient section="pets" />
    </div>
  );
}
