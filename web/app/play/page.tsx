import type { Metadata } from "next";
import { MINIGAMES_MANIFEST } from "@gamides/minigames/manifest";
import ArcadeHubClient from "./ArcadeHubClient";

export const metadata: Metadata = {
  title: "Survival Arcade — 100 Free Mini-Games | GAMIDES",
  description:
    "Play 100 instant-loading survival, base-building, and zombie sniper mini-games on GAMIDES. Built for Last Z: Survival Shooter, Whiteout Survival, and Last War alliance players.",
  openGraph: {
    title: "Survival Arcade — 100 Free Mini-Games | GAMIDES",
    description:
      "100 instant-loading survival, base-building, and zombie combat mini-games. Challenge your alliance on Discord!",
    images: [{ url: "https://www.gamides.com/opengraph-image", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://www.gamides.com/play/",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "GAMIDES 100 Universal Survival Mini-Games",
  numberOfItems: MINIGAMES_MANIFEST.length,
  itemListElement: MINIGAMES_MANIFEST.map((game, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: game.title,
    url: `https://www.gamides.com/play/${game.slug}/`,
  })),
};

export default function PlayArcadeHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mb-8">
        <span className="inline-block rounded-full border border-purple-500/40 bg-purple-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200">
          GAMIDES Survival Arcade • 100 Instant Mini-Games
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          100 Universal Survival &amp; Base-Building Mini-Games
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-purple-100/90">
          Waiting on a 14-hour HQ upgrade or the next Radar Reset? Jump into 100 fast-loading
          survival, base-building, and zombie defense mini-games—then share your high score directly
          to your alliance Discord server.
        </p>
      </div>

      <ArcadeHubClient games={MINIGAMES_MANIFEST} />
    </div>
  );
}
