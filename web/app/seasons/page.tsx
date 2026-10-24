import type { Metadata } from "next";
import Link from "next/link";
import seasonsData from "@/data/seasons.json";
import type { SeasonData } from "@/types";
import SeasonsClient from "./SeasonsClient";

const seasons = seasonsData.seasons as SeasonData[];

export const metadata: Metadata = {
  title: "Seasons Hub & Prep Checklist — GAMIDES | Last Z: Survival Shooter",
  description:
    "Interactive Last Z: Survival Shooter seasonal prep checklist, Season 3 Biotech Lab calculator, Season 4 Primal Dinosaurs planner, Season 5 Night Falls guide, and Hero Pivot Calculator.",
  openGraph: {
    title: "Seasons Hub & Prep Checklist — GAMIDES | Last Z: Survival Shooter",
    description:
      "Interactive Last Z: Survival Shooter seasonal prep checklist, Biotech Lab / Dinosaurs / Night Falls progression calculators, and Hero Pivot planner.",
    images: [
      {
        url: "https://www.gamides.com/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.gamides.com/seasons",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should I hoard before a new Season starts in Last Z: Survival Shooter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before any Season transition (S2 Frozen Wasteland, S3 Biotech Lab, S4 Primal Dinosaurs, or S5 Night Falls), hoard at least 80-150 Stamina Cans for Day 1 seasonal currency farming, 350-975 Universal Gold Hero Fragments for the new seasonal S+ heroes, and 180,000+ Courage Badges for T10 research gates.",
      },
    },
    {
      "@type": "Question",
      name: "How many Universal Gold Fragments does it take to 5-star a Seasonal Hero in Last Z?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upgrading a hero from 0 stars to 5 stars requires 975 total Universal Gold Fragments (25 for 1-star, 50 for 2-star, 150 for 3-star, 300 for 4-star, and 450 for 5-star) alongside 163,000 Skill Medals to maximize their skills.",
      },
    },
    {
      "@type": "Question",
      name: "How long does each Season last in Last Z: Survival Shooter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each server season in Last Z: Survival Shooter runs for 8 weeks (56 days), followed by a brief off-season settlement and server migration window.",
      },
    },
  ],
};

export default function SeasonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
        Last Z: Survival Shooter Seasons Hub &amp; Prep Planner
      </h1>
      <p className="mt-2 max-w-3xl text-purple-200/85">
        Plan every server season transition from{" "}
        <strong>Season 1: Outbreak</strong> through{" "}
        <strong>Season 5: Night Falls</strong>. Track your hoarding checklist,
        calculate daily seasonal progression currency targets, and budget your
        S+ hero meta pivot.
      </p>

      {/* Quick Direct Links to Dedicated Season Guides */}
      <div className="mt-6 flex flex-wrap gap-2">
        {seasons.map((s) => (
          <Link
            key={s.id}
            href={`/seasons/${s.id}`}
            className="rounded-lg border border-purple-700/60 bg-purple-900/40 px-3.5 py-2 text-xs font-semibold text-purple-200 transition-colors hover:border-purple-500 hover:bg-purple-800/60 hover:text-white"
          >
            S{s.number}: {s.name.replace(/^Season \d+:\s*/, "")} Guide →
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <SeasonsClient initialSeasonId="s3" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
