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
    title: `${hero.name} — WarGuard | Last Z`,
    description: desc,
    openGraph: {
      title: `${hero.name} — WarGuard | Last Z`,
      description: desc,
  
    },
    alternates: {
      canonical: `https://warguard.app/heroes/${params.id}`,
    },
  };
}

export default function HeroDetailPage({ params }: { params: { id: string } }) {
  const hero = heroes.find((h) => h.id === params.id);
  if (!hero) notFound();
  return <HeroDetailClient hero={hero} />;
}
