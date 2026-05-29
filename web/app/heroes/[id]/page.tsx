import type { Metadata } from "next";
import { notFound } from "next/navigation";
import heroesData from "@/data/heroes.json";
import type { Hero } from "@/types";
import HeroDetailClient from "./HeroDetailClient";

const heroes = heroesData.heroes as Hero[];

export function generateStaticParams() {
  return heroes.map((h) => ({ id: h.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const hero = heroes.find((h) => h.id === params.id);
  if (!hero) return {};
  const desc = `${hero.name} Last Z hero guide: ${hero.tier} tier ${hero.role}. PvP ${hero.pvpRating} · PvE ${hero.pveRating}. Skills, ratings, and investment priority.`;
  return {
    title: `${hero.name} — GAMIDES | Last Z`,
    description: desc,
    openGraph: {
      title: `${hero.name} — GAMIDES | Last Z`,
      description: desc,
    },
    alternates: {
      canonical: `https://www.gamides.com/heroes/${params.id}`,
    },
  };
}

export default function HeroDetailPage({ params }: { params: { id: string } }) {
  const hero = heroes.find((h) => h.id === params.id);
  if (!hero) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gamides.com" },
      { "@type": "ListItem", "position": 2, "name": "Heroes", "item": "https://www.gamides.com/heroes" },
      { "@type": "ListItem", "position": 3, "name": hero.name, "item": `https://www.gamides.com/heroes/${params.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <HeroDetailClient hero={hero} />
    </>
  );
}
