import type { Metadata } from "next";
import HeroesClient from "./HeroesClient";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who are the best heroes in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "The top S+ tier heroes in Last Z are Yu Chan, Licia, Queenie, Liliana, Amber, and Dodomeki. S+ heroes offer the highest impact in PvP and PvE combat. A+ tier heroes such as Bella, Nyx, and Selena are strong alternatives that are easier to obtain." }
    },
    {
      "@type": "Question",
      "name": "What are the hero factions in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Last Z has three hero factions: Blood Rose (commands Assaulter troops), Wings of Dawn (commands Shooter troops), and Guard of Order (commands Rider troops). Troop type counters apply: Assaulters beat Riders, Riders beat Shooters, Shooters beat Assaulters." }
    },
    {
      "@type": "Question",
      "name": "What do hero tiers mean in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Hero tiers rank combat power and utility. S+ is the highest tier (meta-defining heroes), followed by A+ (strong and widely used), A (solid but situational), and B (niche or outclassed). Tier ratings reflect both PvP and PvE performance." }
    }
  ]
};

export const metadata: Metadata = {
  title: "Heroes — GAMIDES | Last Z",
  description: "Last Z hero tier list (S+, A+, A, B) across Blood Rose, Wings of Dawn, and Guard of Order factions. Includes skills, troop types, and Season 4 rankings.",
  openGraph: {
    title: "Heroes — GAMIDES | Last Z",
    description: "Last Z hero tier list (S+, A+, A, B) across three factions. Skills and Season 4 rankings included.",
  },
  alternates: {
    canonical: "https://www.gamides.com/heroes",
  },
};

export default function HeroesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z Heroes &amp; Tier List</h1>
      <p className="mt-2 text-purple-100/95">
        Last Z has 30 heroes across three factions: <strong>Blood Rose</strong> (Assaulters), <strong>Wings of Dawn</strong> (Shooters), and <strong>Guard of Order</strong> (Riders). Heroes are ranked S+, A+, A, and B tier based on PvP and PvE performance.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroesClient />
    </div>
  );
}
