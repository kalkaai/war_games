import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MINIGAMES_MANIFEST,
  getGameManifestBySlug,
} from "@gamides/minigames/manifest";
import MiniGamePlayer from "../MiniGamePlayer";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams(): { slug: string }[] {
  return MINIGAMES_MANIFEST.map((game) => ({
    slug: game.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const game = getGameManifestBySlug(params.slug);
  if (!game) {
    return {
      title: "Mini-Game Not Found — GAMIDES",
    };
  }

  const canonicalUrl = `https://www.gamides.com/play/${game.slug}/`;
  return {
    title: `${game.title} — Play Free ${game.category} Mini-Game | GAMIDES`,
    description: game.seoDescription,
    openGraph: {
      title: `${game.iconEmoji} ${game.title} — Free Survival Mini-Game | GAMIDES`,
      description: game.shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [{ url: "https://www.gamides.com/opengraph-image", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const discordInviteUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#";

export default function MiniGameSlugPage({ params }: PageProps) {
  const game = getGameManifestBySlug(params.slug);
  if (!game) {
    notFound();
  }

  const siblingGames = MINIGAMES_MANIFEST.filter(
    (g) => g.templateId === game.templateId && g.slug !== game.slug
  );

  const categoryGames = MINIGAMES_MANIFEST.filter(
    (g) => g.category === game.category && g.slug !== game.slug && g.templateId !== game.templateId
  ).slice(0, 6);

  const videoGameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.seoDescription,
    url: `https://www.gamides.com/play/${game.slug}/`,
    genre: [game.category, game.templateName, "Arcade", "Survival Strategy"],
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Web Browser (Mobile & Desktop)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "GAMIDES",
      url: "https://www.gamides.com",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do you play ${game.title} on GAMIDES?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${game.shortDescription} Controls: ${game.controlsHint} Reach a target score of ${game.targetScore} to earn the Mission Cleared badge.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I share my ${game.title} high score to my alliance Discord?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Your personal best score in ${game.title} is saved automatically in your browser. Click the "Share High Score to Alliance Discord" button below the game canvas to copy a formatted challenge link for your alliance server.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs text-purple-300/80">
        <Link href="/" className="hover:text-white transition-colors">
          GAMIDES
        </Link>
        <span>/</span>
        <Link href="/play" className="hover:text-white transition-colors">
          Survival Arcade (100 Games)
        </Link>
        <span>/</span>
        <span className="font-semibold text-white">{game.title}</span>
      </nav>

      {/* Main Two-Column Layout: Player Left, SEO Strategy & Cross-Links Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Game Canvas */}
        <div className="lg:col-span-6">
          <MiniGamePlayer game={game} />
        </div>

        {/* Right Column: Game Info, Instructions, Calculators & Discord CTA */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-2xl border border-purple-700/60 bg-purple-900/40 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-purple-600/60 bg-purple-950/80 px-2.5 py-1 text-xs font-mono text-purple-200">
                Game #{game.id} of 100
              </span>
              <span className="rounded-md bg-purple-700/60 px-2.5 py-1 text-xs font-semibold text-white">
                {game.category}
              </span>
              <span className="rounded-md border border-purple-700/50 px-2.5 py-1 text-xs text-purple-300">
                {game.templateName}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              {game.iconEmoji} {game.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-purple-100/90">
              {game.shortDescription}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-purple-800/60 bg-purple-950/60 p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">
                  Target Clear Score
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-emerald-300">
                  {game.targetScore} PTS
                </p>
              </div>
              <div className="rounded-xl border border-purple-800/60 bg-purple-950/60 p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">
                  Engine Mechanic
                </span>
                <p className="mt-1 text-sm font-bold text-white">{game.templateName}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-purple-800/50 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-200">
                How to Play {game.title}
              </h2>
              <p className="mt-1.5 text-sm text-purple-200/85">{game.controlsHint}</p>
            </div>
          </div>

          {/* Cross-Linking to GAMIDES Calculators & Event Schedules (Phase 4, Step 3) */}
          <div className="rounded-2xl border border-purple-700/60 bg-purple-900/40 p-6">
            <h2 className="text-base font-bold text-white">
              📊 Related GAMIDES Calculators &amp; Upgrade Guides
            </h2>
            <p className="mt-1 text-xs text-purple-200/80">
              Plan your real in-game progression between mini-game runs:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              {game.relatedGamidesRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center justify-between rounded-xl border border-purple-800/60 bg-purple-950/60 px-4 py-3 text-sm font-semibold text-purple-100 transition-colors hover:border-purple-500 hover:bg-purple-800/50 hover:text-white"
                >
                  <span>{route.label}</span>
                  <span className="text-purple-400">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Alliance Discord Bot Growth Engine Card */}
          <div className="rounded-2xl border border-indigo-500/50 bg-indigo-950/40 p-6">
            <h2 className="text-base font-bold text-white">
              🤖 Never Miss an Alliance Event or Radar Reset
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-indigo-200/90">
              Share your <strong>{game.title}</strong> high score in your alliance Discord, and add
              the GAMIDES Discord Bot for automated VS Day, Full Preparedness, and personal upgrade
              timers.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-500"
              >
                Add GAMIDES Bot to Discord →
              </a>
              <Link
                href="/events"
                className="rounded-lg border border-purple-700 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors hover:border-purple-500 hover:text-white"
              >
                View Live Event Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sibling Games in Same Mechanic */}
      <section className="mt-12 border-t border-purple-900/50 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            More {game.templateName} Mini-Games ({siblingGames.length})
          </h2>
          <Link href="/play" className="text-xs font-semibold text-purple-300 hover:text-white">
            Browse All 100 Games →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {siblingGames.map((item) => (
            <Link
              key={item.slug}
              href={`/play/${item.slug}`}
              className="flex items-center justify-between rounded-xl border border-purple-800/60 bg-purple-900/30 p-3.5 transition-colors hover:border-purple-500 hover:bg-purple-900/60"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl" aria-hidden="true">
                  {item.iconEmoji}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-purple-300/75">
                    #{item.id} • Goal: {item.targetScore}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-300">Play →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Related Games in Same Theme Category */}
      {categoryGames.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-white">More {game.category} Missions</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categoryGames.map((item) => (
              <Link
                key={item.slug}
                href={`/play/${item.slug}`}
                className="flex items-center justify-between rounded-xl border border-purple-800/50 bg-purple-950/50 p-3.5 transition-colors hover:border-purple-500 hover:bg-purple-900/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl" aria-hidden="true">
                    {item.iconEmoji}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-purple-300/75">{item.templateName}</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
