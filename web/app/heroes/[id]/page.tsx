import type { Metadata } from "next";
import { notFound } from "next/navigation";
import heroesData from "@/data/heroes.json";
import type { Hero } from "@/types";
import HeroDetailClient from "./HeroDetailClient";
import HeroCompareClient from "./HeroCompareClient";

const heroes = heroesData.heroes as Hero[];

function parseComparisonSlug(
  slug: string
): { heroA: Hero; heroB: Hero; canonicalSlug: string } | null {
  if (!slug.includes("-vs-")) return null;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const [idA, idB] = parts;
  if (idA === idB) return null;

  const heroA = heroes.find((h) => h.id === idA);
  const heroB = heroes.find((h) => h.id === idB);
  if (!heroA || !heroB) return null;

  const canonicalSlug = idA < idB ? `${idA}-vs-${idB}` : `${idB}-vs-${idA}`;
  return { heroA, heroB, canonicalSlug };
}

export function generateStaticParams() {
  const singleHeroParams = heroes.map((h) => ({ id: h.id }));

  const comparisonParams: { id: string }[] = [];
  for (let i = 0; i < heroes.length; i++) {
    for (let j = i + 1; j < heroes.length; j++) {
      const id1 = heroes[i].id;
      const id2 = heroes[j].id;
      const canonical = id1 < id2 ? `${id1}-vs-${id2}` : `${id2}-vs-${id1}`;
      comparisonParams.push({ id: canonical });
    }
  }

  return [...singleHeroParams, ...comparisonParams];
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const comparison = parseComparisonSlug(params.id);
  if (comparison) {
    const { heroA, heroB, canonicalSlug } = comparison;
    const title = `${heroA.name} vs ${heroB.name} — Which Hero is Better? | GAMIDES Last Z`;
    const desc = `Compare ${heroA.name} (${heroA.tier} ${heroA.troopType}) vs ${heroB.name} (${heroB.tier} ${heroB.troopType}) in Last Z: Survival Shooter. Side-by-side PvP/PvE ratings, faction counters, skills, and investment priority.`;
    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        images: [
          {
            url: "https://www.gamides.com/opengraph-image",
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: `https://www.gamides.com/heroes/${canonicalSlug}`,
      },
    };
  }

  const hero = heroes.find((h) => h.id === params.id);
  if (!hero) return {};
  const desc = `${hero.name} Last Z: Survival Shooter hero guide: ${hero.tier} tier ${hero.role}. PvP ${hero.pvpRating} · PvE ${hero.pveRating}. Skills, ratings, and investment priority.`;
  return {
    title: `${hero.name} — GAMIDES | Last Z: Survival Shooter`,
    description: desc,
    openGraph: {
      title: `${hero.name} — GAMIDES | Last Z: Survival Shooter`,
      description: desc,
      images: [
        {
          url: "https://www.gamides.com/opengraph-image",
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `https://www.gamides.com/heroes/${params.id}`,
    },
  };
}

export default function HeroDetailPage({ params }: { params: { id: string } }) {
  const comparison = parseComparisonSlug(params.id);
  if (comparison) {
    const { heroA, heroB, canonicalSlug } = comparison;
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
          name: "Heroes",
          item: "https://www.gamides.com/heroes",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${heroA.name} vs ${heroB.name}`,
          item: `https://www.gamides.com/heroes/${canonicalSlug}`,
        },
      ],
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Is ${heroA.name} better than ${heroB.name} in Last Z: Survival Shooter?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${heroA.name} is a ${heroA.tier}-tier ${heroA.role} (${heroA.troopType}, PvP ${heroA.pvpRating}, PvE ${heroA.pveRating}, priority ${heroA.priority}/5), while ${heroB.name} is a ${heroB.tier}-tier ${heroB.role} (${heroB.troopType}, PvP ${heroB.pvpRating}, PvE ${heroB.pveRating}, priority ${heroB.priority}/5).`,
          },
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <HeroCompareClient heroA={heroA} heroB={heroB} />
      </>
    );
  }

  const hero = heroes.find((h) => h.id === params.id);
  if (!hero) notFound();

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
        name: "Heroes",
        item: "https://www.gamides.com/heroes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hero.name,
        item: `https://www.gamides.com/heroes/${params.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HeroDetailClient hero={hero} />
    </>
  );
}
