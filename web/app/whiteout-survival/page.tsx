import type { Metadata } from "next";
import WhiteoutClient from "./WhiteoutClient";

export const metadata: Metadata = {
  title:
    "Whiteout Survival Furnace Calculator & Event Scheduler — GAMIDES",
  description:
    "Interactive Whiteout Survival Furnace 1–30 & Fire Crystal (FC1–FC5) upgrade calculator, Bear Hunt & Sunfire Castle timezone event scheduler, and State of Power (SvS) prep guide.",
  openGraph: {
    title:
      "Whiteout Survival Furnace Calculator & Event Scheduler — GAMIDES",
    description:
      "Interactive Whiteout Survival Furnace 1–30 & Fire Crystal calculator, Bear Hunt & Sunfire Castle event scheduler, and SvS prep guide.",
    images: [
      {
        url: "https://www.gamides.com/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many Fire Crystals are required for FC1 to FC5 in Whiteout Survival?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upgrading the Furnace alone from Lv. 30 through Fire Crystal 5 (FC5) in Whiteout Survival requires 5,715 Fire Crystals (660 for FC1, 790 for FC2, 1,190 for FC3, 1,400 for FC4, and 1,675 for FC5), plus additional Fire Crystals for Embassy and Troop Camp prerequisites.",
      },
    },
    {
      "@type": "Question",
      name: "Which heroes should I use to join Bear Hunt rallies in Whiteout Survival?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When joining alliance Bear Hunt rallies in Whiteout Survival, place Jessie, Jasser, Seo-yoon, or Jeronimo as your first-slot (expedition lead) hero so their +25% attack/damage expedition skill applies to the entire rally.",
      },
    },
  ],
};

export default function WhiteoutSurvivalPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-purple-600/60 bg-purple-900/40 px-3 py-1 text-xs font-semibold text-purple-200">
        <span>❄️ Multi-Game Strategy Hub</span>
        <span>•</span>
        <span>Whiteout Survival</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Whiteout Survival — Furnace Calculator &amp; Event Scheduler
      </h1>
      <p className="mt-2 max-w-3xl text-purple-200/85">
        Plan your <strong>Furnace 1–30 &amp; Fire Crystal (FC1–FC5)</strong>{" "}
        upgrades, convert <strong>Bear Hunt</strong>,{" "}
        <strong>Sunfire Castle</strong>, and <strong>Foundry Battle</strong>{" "}
        schedules to your local timezone, and optimize your{" "}
        <strong>State of Power (SvS)</strong> prep days.
      </p>

      <div className="mt-8">
        <WhiteoutClient />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
