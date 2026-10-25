import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War Tech Trees & T10 Special Forces Gold/Valor Calculator | GAMIDES",
  description:
    "Calculate remaining Gold (10.3B) and Valor Badges (152,000) to unlock T10 Special Forces troops in Last War: Survival Game, plus Alliance Duel & Age of Oil tech priorities.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/research",
  },
};

export default function LastWarResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · Tech Center &amp; T10 Special Forces
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War Research Trees &amp; T10 Special Forces Calculator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Track the 40% minimum Special Forces path to T10 Troops, max Alliance Duel (VS) tech first, and unlock the Age of Oil HQ 31–35 gate.
        </p>
      </div>
      <LastWarClient section="research" />
    </div>
  );
}
