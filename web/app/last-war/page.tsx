import type { Metadata } from "next";
import LastWarClient from "./LastWarClient";

export const metadata: Metadata = {
  title:
    "Last War: Survival Game HQ Calculator & VS Duel Guide — GAMIDES",
  description:
    "Interactive Last War: Survival Game HQ 1–30 upgrade requirements table, resource & speed-up calculator, UR Hero Shard planner, and VS Alliance Duel / Arms Race schedule.",
  openGraph: {
    title:
      "Last War: Survival Game HQ Calculator & VS Duel Guide — GAMIDES",
    description:
      "Interactive Last War: Survival Game HQ 1–30 upgrade requirements, UR Hero Shard calculator, and VS Alliance Duel schedule.",
    images: [
      {
        url: "https://www.gamides.com/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.gamides.com/last-war",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What buildings are required for HQ Level 30 in Last War: Survival Game?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HQ Level 30 in Last War: Survival Game requires Tech Center Lv. 29, Barracks Lv. 29, Drill Ground Lv. 29, and Wall Lv. 29, plus 4.3B Iron, 4.3B Food, and 1.38B Gold. Reaching HQ 30 unlocks T10 Special Forces troops (once Special Forces tech is completed) and Hero Level Cap 150.",
      },
    },
    {
      "@type": "Question",
      name: "How many UR Universal Shards does it take to 5-star a Hero in Last War?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taking a UR hero (such as Kimberly, Stetmann, or DVA) from 0 stars to 5 stars requires 975 UR Universal Shards (25 for 1★, 50 for 2★, 150 for 3★, 300 for 4★, and 450 for 5★).",
      },
    },
  ],
};

export default function LastWarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-purple-600/60 bg-purple-900/40 px-3 py-1 text-xs font-semibold text-purple-200">
        <span>⚔️ Multi-Game Strategy Hub</span>
        <span>•</span>
        <span>Last War: Survival Game</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Last War: Survival Game — HQ 1–30 Calculator &amp; VS Duel Hub
      </h1>
      <p className="mt-2 max-w-3xl text-purple-200/85">
        Plan every <strong>HQ 1–30 prerequisite building &amp; Gold cost</strong>
        , calculate <strong>UR Hero Shards &amp; Skill Medals</strong> for
        Kimberly, Stetmann, and DVA, and sync your 4-hour{" "}
        <strong>Arms Race</strong> windows with{" "}
        <strong>VS Alliance Duel</strong> days.
      </p>

      <div className="mt-8">
        <LastWarClient />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
