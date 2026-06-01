import type { Metadata } from "next";
import AllianceTrackerClient from "./AllianceTrackerClient";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many badges does Alliance Recognition cost in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Alliance Recognition costs 356,770 total badges to complete all 19 nodes in Last Z: Survival Shooter. The tree includes Chest Unlocks, Point Multipliers, Activity Incentives, Productivity, and Resource Gathering categories." }
    },
    {
      "@type": "Question",
      "name": "What does Alliance Recognition do in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Alliance Recognition unlocks nodes that multiply your Alliance Duel points. Event Expert and Event King at max give +300% Alliance Duel points — turning 1 Golden Wrench into 18,000+ points instead of 5,000. It pays back in 3–4 Duel cycles and generates ~4,000 extra badges per week." }
    },
    {
      "@type": "Question",
      "name": "What is Alliance Duel in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Alliance Duel is a 6-day weekly event in Last Z: Survival Shooter where alliance members earn points by spending resources on specific days: Day 1 (Monday) vehicle modifications, Day 2 (Tuesday) construction, Day 3 (Wednesday) research/badges, Day 4 (Thursday) hero upgrades, Day 5 (Friday) troop training, Day 6 (Saturday) alliance technology." }
    },
    {
      "@type": "Question",
      "name": "When should you spend badges in Alliance Duel?",
      "acceptedAnswer": { "@type": "Answer", "text": "Spend badges on Day 3 (Wednesday — Age of Science) in Alliance Duel. Badges score Duel points AND complete research nodes simultaneously, giving double value from every badge spent." }
    }
  ]
};

export const metadata: Metadata = {
  title: "Alliance Duel & Alliance Recognition — GAMIDES | Last Z: Survival Shooter",
  description:
    "Last Z: Survival Shooter Alliance Duel guide and Alliance Recognition research tracker. All 19 nodes, 356,770 total badges, day-by-day event tips for Modded Vehicle Boost, Shelter Upgrade, Age of Science, and more.",
  openGraph: {
    title: "Alliance Duel & Alliance Recognition — GAMIDES | Last Z: Survival Shooter",
    description:
      "Alliance Recognition tracker with all 19 research nodes and a full 6-day Alliance Duel event guide.",
  },
  alternates: {
    canonical: "https://www.gamides.com/alliance",
  },
};

export default function AlliancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
        Last Z Alliance Duel & Alliance Recognition
      </h1>
      <p className="mt-2 text-purple-200/80">
        19 research nodes · 356,770 total badges · 6-day weekly event · Progress saves automatically
      </p>

      {/* Why Alliance Recognition matters */}
      <div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h3 className="font-semibold text-amber-200">Why Alliance Recognition matters</h3>
        <p className="mt-1 text-sm text-amber-100/70">
          Event Expert + Event King at max gives you <strong className="text-white">+300% Alliance Duel points</strong> — turning 1 Golden Wrench into 18,000+ points instead of 5,000.
          Alliance Recognition pays back in 3–4 Duel cycles and generates ~4,000 extra badges per week versus accounts without it.
          Spend badges on <strong className="text-white">Wednesday (Age of Science)</strong> — badges score Duel points AND complete research nodes simultaneously.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Interactive tracker */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Alliance Recognition Tracker</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Nodes listed in recommended completion order (number = priority). Click to mark complete.
        </p>
        <div className="mt-4">
          <AllianceTrackerClient />
        </div>
      </div>
    </div>
  );
}
