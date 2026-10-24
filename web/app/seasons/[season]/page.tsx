import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import seasonsData from "@/data/seasons.json";
import type { SeasonData, SeasonId } from "@/types";
import SeasonsClient from "../SeasonsClient";

const seasons = seasonsData.seasons as SeasonData[];

export function generateStaticParams() {
  return seasons.map((s) => ({ season: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: { season: string };
}): Metadata {
  const season = seasons.find((s) => s.id === params.season);
  if (!season) return {};

  const title = `${season.name} Guide & ${season.mechanicName} Calculator — GAMIDES | Last Z`;
  const description = `Complete ${season.name} (${season.subtitle}) guide for Last Z: Survival Shooter. Interactive ${season.mechanicName} (${season.mechanicCurrency}) calculator, hoarding checklist, and S+ hero meta.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "https://www.gamides.com/opengraph-image",
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `https://www.gamides.com/seasons/${season.id}`,
    },
  };
}

export default function SeasonDetailPage({
  params,
}: {
  params: { season: string };
}) {
  const season = seasons.find((s) => s.id === params.season);
  if (!season) notFound();

  const totalCurrency = season.mechanicNodes.reduce(
    (sum, n) => sum + n.totalCost,
    0
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.gamides.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Seasons",
        item: "https://www.gamides.com/seasons",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: season.name,
        item: `https://www.gamides.com/seasons/${season.id}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How does ${season.mechanicName} work in Last Z ${season.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `In ${season.name}, players collect ${season.mechanicCurrency} (roughly ${season.dailyFreeCurrency.toLocaleString()} per day for F2P players) to upgrade ${season.mechanicNodes.length} progression branches in the ${season.mechanicName}, requiring ${totalCurrency.toLocaleString()} total ${season.mechanicCurrency} to fully max.`,
        },
      },
      {
        "@type": "Question",
        name: `What should I hoard for ${season.name} in Last Z: Survival Shooter?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: season.hoardingChecklist
            .map(
              (item) =>
                `${item.resource}: ${item.targetAmount.toLocaleString()} ${item.unit} (${item.reason})`
            )
            .join(" "),
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/seasons"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← All Seasons Hub
        </Link>
        <div className="flex flex-wrap gap-1.5">
          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/seasons/${s.id}`}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                s.id === season.id
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/60 hover:text-white"
              }`}
            >
              S{s.number}
            </Link>
          ))}
        </div>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
        Last Z {season.name}: {season.subtitle} Guide &amp; Calculator
      </h1>
      <p className="mt-2 max-w-3xl text-purple-200/85">{season.summary}</p>

      <div className="mt-8">
        <SeasonsClient initialSeasonId={season.id as SeasonId} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
