import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival SSR Hero Tier List (Gen 1–4) & Bear Trap Rally Guide | GAMIDES",
  description:
    "Whiteout Survival Generation 1 to Generation 4 SSR & SR hero tier list: Jeronimo, Flint, Alonso, Mia, Ahmose, Reina, Lynn, and mandatory Bear Trap rally joiners (Jessie).",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/heroes",
  },
};

export default function WhiteoutHeroesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Heroes
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival SSR Hero Tier List &amp; Rally Joiner Guide (Gen 1–4)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Filter by Generation 1–4 to see the best Infantry, Lancer, and Marksman rally leaders, Lucky Wheel F2P priorities, and Slot 1 Bear Hunt rally joiners.
        </p>
      </div>
      <WhiteoutClient section="heroes" />
    </div>
  );
}
