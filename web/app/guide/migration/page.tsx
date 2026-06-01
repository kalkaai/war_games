import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Season Migration Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Last Z: Survival Shooter season migration guide. How migration score works, tier requirements, what carries over vs resets, server selection, and pre-migration strategy.",
  openGraph: {
    title: "Season Migration Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Season migration score, tier requirements, what carries over, server selection, and pre-migration strategy for Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/migration",
  },
};

const SCORE_FACTORS = [
  { factor: "HQ Level", weight: "High", note: "One of the largest contributors. HQ30 is the target floor for competitive migration tiers. Each level above 28 adds significant score." },
  { factor: "Research Completion", weight: "High", note: "Badge-heavy trees (Military Strategies, Peace Shield, Alliance Recognition, T10 path) all contribute. More completed nodes = higher score." },
  { factor: "Hero Stars & Skills", weight: "High", note: "Total hero investment across your roster. Focus stars and skill books on your core 5 before migration to maximise this metric." },
  { factor: "Troop Power (CP)", weight: "High", note: "Total troop count × troop tier. T8–T10 troops weigh significantly more per unit than T4–T5. Higher-tier troops in larger quantities = better tier placement." },
  { factor: "Building Levels", weight: "Medium", note: "All buildings contribute to your base CP score. Camp, Lab, Alliance Center, and Military Center levels all count." },
  { factor: "Gear & Equipment", weight: "Medium", note: "Hero gear quality and enhancement level contributes to your power score. Orange-tier gear with high enhancement adds meaningful score." },
  { factor: "VIP Level", weight: "Low", note: "VIP level contributes a small amount to migration score. F2P players should not grind VIP specifically for migration." },
];

const CARRIES_OVER = [
  "All buildings and their current levels",
  "All research progress (every node completed stays completed)",
  "All heroes and their star/skill levels",
  "All troops (type and tier preserved)",
  "All gear and equipment",
  "All items in your bag (speed-ups, resources, chests)",
  "VIP level and experience",
  "Alliance Recognition research",
];

const RESETS = [
  "Server rank and leaderboard position (you start unranked on the new server)",
  "Alliance membership (you leave your current alliance; must rejoin or create on new server)",
  "Map position (your base relocates to the new server map)",
  "Server-specific titles (e.g. President title from Battle for the Capital)",
  "State-specific buffs and territory bonuses",
];

const TIERS = [
  { tier: "Elite", color: "border-amber-600 bg-amber-900/20 text-amber-300", req: "High CP + HQ28+ + strong research", note: "Top-tier migration bracket. Placed on servers with other high-power players. Maximum prestige but also highest competition on arrival." },
  { tier: "Advanced", color: "border-blue-700 bg-blue-900/20 text-blue-300", req: "Mid-high CP, HQ24–28", note: "Competitive placement. Good balance of strong alliances and room to grow. Most active mid-game players land here." },
  { tier: "Standard", color: "border-purple-700 bg-purple-900/20 text-purple-300", req: "Low-mid CP, HQ under 24", note: "Lower competition but also fewer alliance benefits. Growing players may find Elite servers more rewarding despite higher competition." },
];

const PRE_MIGRATION_TIPS = [
  {
    title: "Maximise research completion before the window opens",
    body: "Every completed research node increases your migration score. The weeks before migration are the highest-ROI time to burn badges — each node completed now boosts your tier placement on the new server.",
  },
  {
    title: "Push HQ level if you are near a major threshold",
    body: "HQ28, HQ30, and HQ32 are tier-inflection points. If you are within 2–3 weeks of a major level, it is worth prioritising that upgrade before migration to lock in a higher score bracket.",
  },
  {
    title: "Star up your core heroes",
    body: "Hero investment contributes to migration score. If you have fragments stockpiled, spend them before migration rather than carrying them over — starred heroes count; unspent fragments do not.",
  },
  {
    title: "Do not spend resource items without queuing an upgrade",
    body: "Resources in bags carry over; loose resources (food/wood in city) carry over too. But if you have a major upgrade queued before migration, it completes using resources you already spent — do not cancel upgrades mid-migration.",
  },
  {
    title: "Co-ordinate with your alliance",
    body: "Migrating together with your current alliance is far stronger than migrating solo and rebuilding. Agree on a target server in advance and migrate as a group on the same day.",
  },
  {
    title: "Scout the destination server before committing",
    body: "Check the leaderboard of target servers. Look for active alliances, a healthy mid-tier population, and a dominant alliance that is not excessively aggressive toward new arrivals. A server where the top alliance is friendly to growing players is worth more than raw match score.",
  },
];

const MISTAKES = [
  "Migrating solo while your alliance stays behind — you lose all construction help, Zombie Siege coordination, and Alliance Duel benefits immediately.",
  "Migrating under-powered to an Elite server and being farmed on arrival by established players with months of head-start.",
  "Not maxing research before migration — every node counts toward score and you cannot go back.",
  "Carrying excess food/wood without a queued upgrade — resources can be raided on the new server the moment you land without a shield.",
  "Expecting the new server to be easier — if you migrate to a competitive server, the existing players have more time on that server and often stronger alliances.",
  "Forgetting to set a shield immediately on arrival — your base spawns without one and your location is visible to the entire new server.",
];

export default function MigrationGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">Guide</Link>
        <span>›</span>
        <span className="text-purple-200">Season Migration</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Season Migration Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        What migration is, how your tier placement is determined, what carries over, and how to arrive on the new server in the strongest possible position.
      </p>

      {/* What is migration */}
      <div className="mt-6 rounded-xl border border-blue-800/40 bg-blue-900/10 p-5">
        <h2 className="font-semibold text-blue-200">What is Season Migration?</h2>
        <p className="mt-1 text-sm text-blue-100/80">
          At the end of each season, players have the opportunity to migrate their account to a new server. Your migration score — based on HQ level, research, hero investment, and troop power — determines which tier bracket you are placed into on the new server. Migrating is optional: players who stay remain on their current server for the next season.
        </p>
      </div>

      {/* Migration score */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Migration Score Factors</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Your migration score is a combined measure of account power. All of these factors contribute.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-purple-800/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-800/40 bg-purple-900/40">
                <th className="px-4 py-2 text-left text-xs font-semibold text-purple-300">Factor</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-purple-300">Weight</th>
                <th className="hidden px-4 py-2 text-left text-xs font-semibold text-purple-300 sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {SCORE_FACTORS.map((f, i) => (
                <tr key={f.factor} className={`border-b border-purple-900/30 ${i % 2 === 0 ? "bg-purple-950/20" : "bg-purple-900/10"}`}>
                  <td className="px-4 py-2.5 font-medium text-white">{f.factor}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.weight === "High" ? "bg-amber-900/40 text-amber-300 border border-amber-700/50"
                      : f.weight === "Medium" ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
                      : "bg-purple-900/40 text-purple-300 border border-purple-700/50"
                    }`}>
                      {f.weight}
                    </span>
                  </td>
                  <td className="hidden px-4 py-2.5 text-purple-300/80 sm:table-cell">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tiers */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Migration Tiers</h2>
        <div className="mt-4 space-y-3">
          {TIERS.map((t) => (
            <div key={t.tier} className={`rounded-xl border p-4 ${t.color}`}>
              <div className="flex items-baseline gap-2">
                <p className="font-bold">{t.tier}</p>
                <span className="text-xs text-purple-400">Requirement: {t.req}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed">{t.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Carries over vs resets */}
      <section className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-green-800/40 bg-green-900/10 p-4">
            <h2 className="font-bold text-green-200">Carries Over ✓</h2>
            <ul className="mt-3 space-y-1.5">
              {CARRIES_OVER.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-green-100/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-800/40 bg-red-900/10 p-4">
            <h2 className="font-bold text-red-200">Resets ✗</h2>
            <ul className="mt-3 space-y-1.5">
              {RESETS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-100/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pre-migration tips */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Pre-Migration Strategy</h2>
        <p className="mt-1 text-sm text-purple-200/80">Do these in the weeks before migration opens.</p>
        <div className="mt-4 space-y-3">
          {PRE_MIGRATION_TIPS.map((t, i) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{t.title}</p>
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mistakes */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Common Mistakes</h2>
        <ul className="mt-4 space-y-2">
          {MISTAKES.map((m) => (
            <li key={m} className="flex items-start gap-2 rounded-lg border border-red-800/40 bg-red-900/10 px-4 py-3 text-sm text-red-100/80">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              {m}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/guide/f2p" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">F2P Progression Guide →</Link>
          <Link href="/research" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">Research Trees →</Link>
          <Link href="/hq" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">HQ Upgrade Table →</Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Migration mechanics reflect Season 4/5. Details may change each season — verify specifics in official Last Z Discord before migration window opens. Last updated June 2026.
      </p>
    </div>
  );
}
