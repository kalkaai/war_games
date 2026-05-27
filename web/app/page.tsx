import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WarGuard — Last Z Reference",
  description: "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z players. The complete game reference site.",
  openGraph: {
    title: "WarGuard — Last Z Reference",
    description: "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z players.",

  },
  alternates: {
    canonical: "https://warguard.app/",
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
    href: "/hq",
    emoji: "🏰",
    title: "HQ",
    description:
      "Headquarters upgrade requirements for levels 1–40: required buildings, resource costs, and heroes cap.",
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
          The Last Z Reference
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-purple-200/80 sm:text-xl">
          Event schedules, upgrade tables, research trees, and calculators for
          serious Last Z players.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={discordInviteUrl}
            className="rounded-md bg-purple-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-purple-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Add Discord Bot →
          </a>
          <Link
            href="/events"
            className="rounded-md border border-purple-700 px-6 py-3 text-base font-semibold text-purple-300 transition-colors hover:border-purple-500 hover:text-white"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* Section cards */}
      <section className="pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          What Does WarGuard Cover?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-purple-800/50 bg-purple-900/50 p-6 transition-all duration-200 hover:border-purple-600 hover:bg-purple-900/70"
            >
              <div className="mb-3 text-3xl">{section.emoji}</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-200">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-purple-300/70">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
