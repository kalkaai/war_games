import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GAMIDES — Last Z: Survival Shooter Game Guide",
  description: "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z: Survival Shooter players. The complete game guide.",
  openGraph: {
    title: "GAMIDES — Last Z: Survival Shooter Game Guide",
    description: "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z: Survival Shooter players.",
    images: [{ url: "https://www.gamides.com/opengraph-image", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://www.gamides.com/",
  },
};

const discordInviteUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#";

const SECTIONS = [
  {
    href: "/events",
    emoji: "📅",
    title: "Events",
    description:
      "VS Weekly Rotation, Apocalypse Time cycle, Radar Reset, and Arena Brawl schedules with timezone converter.",
  },
  {
    href: "/seasons",
    emoji: "🧬",
    title: "Seasons Hub",
    description:
      "Season 1–5 prep checklists, Biotech & Dinosaurs progression calculators, and S+ Hero Pivot planner.",
  },
  {
    href: "/hq",
    emoji: "🏰",
    title: "HQ",
    description:
      "Headquarters upgrade requirements for levels 1–35: required buildings, resource costs, and heroes cap.",
  },
  {
    href: "/research",
    emoji: "🔬",
    title: "Research",
    description:
      "All 9 research trees with badge costs, stat bonuses, and interactive progress tracking.",
  },
  {
    href: "/heroes",
    emoji: "🦸",
    title: "Heroes",
    description:
      "Hero skills per level, badge costs, and upgrade priority guides.",
  },
  {
    href: "/tank",
    emoji: "🔧",
    title: "Tank",
    description:
      "Vehicle upgrade requirements, blueprint costs, and VS Vehicle Day strategy.",
  },
  {
    href: "/calc",
    emoji: "📊",
    title: "Calculators",
    description:
      "Badge budget, resource planner, and speed-up calculator — all client-side.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">

      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          The Last Z: Survival Shooter Game Guide
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-purple-100/95 sm:text-xl">
          Event schedules, upgrade tables, research trees, and calculators for
          serious Last Z: Survival Shooter players.
        </p>
        <p className="mt-3 max-w-xl text-sm text-purple-200/75">
          <strong>Last Z: Survival Shooter</strong> is a competitive strategy &amp; survival game with base building, research, hero collection, and alliance PvP. <strong>GAMIDES</strong> is the community game guide.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href={discordInviteUrl}
            className="rounded-lg bg-purple-600 px-10 py-4 text-xl font-bold text-white shadow-lg shadow-purple-900/50 transition-all hover:bg-purple-500 hover:scale-105 hover:shadow-purple-700/50"
            target="_blank"
            rel="noopener noreferrer"
          >
            Add Discord Bot →
          </a>
          <Link
            href="/events"
            className="rounded-md border border-purple-700 px-6 py-2.5 text-sm font-medium text-purple-400 transition-colors hover:border-purple-500 hover:text-white"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* Section cards */}
      <section className="pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          What Does GAMIDES Cover?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-purple-700/60 bg-purple-800/50 p-6 transition-all duration-200 hover:border-purple-600 hover:bg-purple-900/70"
            >
              <div className="mb-3 text-3xl">{section.emoji}</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-200">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-purple-200/80">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Multi-Game Cross-Promotion Hub */}
      <section className="pb-20">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-purple-500/40 bg-purple-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200">
            GAMIDES Multi-Game Network
          </span>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Also Playing Other 4X Survival Games?
          </h2>
          <p className="mt-1 text-sm text-purple-200/75">
            Explore our dedicated upgrade databases, calculators, and Discord alert hubs for top survival strategy games.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/whiteout-survival"
            className="group relative overflow-hidden rounded-2xl border border-purple-700/60 bg-purple-900/40 p-6 transition-all duration-200 hover:border-purple-500 hover:bg-purple-900/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❄️</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200">
                    Whiteout Survival Hub
                  </h3>
                </div>
                <p className="mt-2 text-sm text-purple-200/80">
                  Complete Furnace 1–30 &amp; Fire Crystal FC1–FC5 requirements, Bear Trap &amp; Crazy Joe timers, State of Power (SvS) prep planner, and Gen 1–4 SSR hero guides.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-purple-300">
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">35 Furnace &amp; FC Pages</span>
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">SvS &amp; Bear Trap Timers</span>
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">Fire Crystal Calculator</span>
                </div>
              </div>
              <span className="text-purple-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          <Link
            href="/last-war"
            className="group relative overflow-hidden rounded-2xl border border-purple-700/60 bg-purple-900/40 p-6 transition-all duration-200 hover:border-purple-500 hover:bg-purple-900/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎖️</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200">
                    Last War: Survival Game Hub
                  </h3>
                </div>
                <p className="mt-2 text-sm text-purple-200/80">
                  Headquarters 1–30 Iron/Food/Coin table, T10 Special Forces prerequisite tracker, Arms Race 4-hour rotation schedule, and Kimberly / DVA / Tesla UR hero builds.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-purple-300">
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">30 HQ Level Pages</span>
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">VS Alliance Duel &amp; Arms Race</span>
                  <span className="rounded bg-purple-950/70 px-2.5 py-1 border border-purple-800/50">T10 Prerequisite Planner</span>
                </div>
              </div>
              <span className="text-purple-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
