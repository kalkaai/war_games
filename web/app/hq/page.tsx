import type { Metadata } from "next";
import { Suspense } from "react";
import HQTable from "./HQTable";

export const metadata: Metadata = {
  title: "HQ Upgrades — WarGuard | Last Z",
  description: "Last Z HQ upgrade requirements for levels 1–35: required buildings, resource costs, heroes cap, and build times. Updated for 2026.",
  openGraph: {
    title: "HQ Upgrades — WarGuard | Last Z",
    description: "Last Z HQ upgrade requirements for levels 1–35: required buildings, resource costs, heroes cap, and build times.",

  },
  alternates: {
    canonical: "https://warguard.app/hq",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What resources does each HQ level require in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "HQ upgrades in Last Z require Food, Wood, and Zent resources in increasing amounts at each level, along with specific buildings being upgraded to a minimum level. A Laboratory is required for every HQ upgrade from level 8 onward." }
    },
    {
      "@type": "Question",
      "name": "Why is HQ level important in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "HQ level is the single most important progression gate in Last Z. It determines your hero level cap, building level caps, troop tier access, and which research trees you can unlock. Key milestones: HQ 11 unlocks Rider Camp T4, HQ 25 dramatically accelerates research, HQ 30 unlocks the T10 troop research path." }
    }
  ]
};

export default function HQPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">HQ Upgrades</h1>
      <p className="mt-2 text-purple-300/70">
        Levels 1–35 · Laboratory required for every upgrade from level 8 onward
      </p>
      <h2 className="mt-8 text-xl font-bold text-white">What Resources Does Each HQ Level Require?</h2>
      <Suspense fallback={null}>
        <HQTable />
      </Suspense>
      <p className="mt-6 text-xs text-purple-400/50">
        Data sourced from lastz.stresswar.com and lastzguides.com. Last updated May 2026.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
