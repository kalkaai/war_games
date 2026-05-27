import type { Metadata } from "next";
import HeroesClient from "./HeroesClient";

export const metadata: Metadata = {
  title: "Heroes — WarGuard | Last Z",
  description: "Last Z hero tier list across Blood Rose, Wings of Dawn, and Guard of Order factions. Includes skills, troop types, and Season 4 rankings.",
  openGraph: {
    title: "Heroes — WarGuard | Last Z",
    description: "Last Z hero tier list across Blood Rose, Wings of Dawn, and Guard of Order factions. Skills and Season 4 rankings included.",

  },
  alternates: {
    canonical: "https://warguard.app/heroes",
  },
};

export default function HeroesPage() {
  return <HeroesClient />;
}
