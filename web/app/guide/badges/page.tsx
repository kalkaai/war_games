import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Badge Farming Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Complete Last Z: Survival Shooter badge farming guide. All badge sources ranked by efficiency: Explore Treasure, Alliance Duel, State Ruler, Lucky Discounter, Duel League. Earn 138K–280K badges per month.",
  openGraph: {
    title: "Badge Farming Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "All badge sources ranked by efficiency. Earn 138K–280K badges/month with the right schedule in Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/badges",
  },
};

const SOURCES = [
  {
    tier: "S",
    tierColor: "text-amber-300 border-amber-600 bg-amber-900/20",
    name: "Explore Treasure",
    monthly: "up to 90,000",
    schedule: "Daily — passive",
    tip: "The single biggest badge source. Complete all 5 daily explorations and open treasure chests. Top players earn ~90K/month from this alone. Never skip a day.",
  },
  {
    tier: "S",
    tierColor: "text-amber-300 border-amber-600 bg-amber-900/20",
    name: "State Ruler",
    monthly: "~43,000",
    schedule: "Monthly event",
    tip: "State Ruler (monthly competition) awards up to ~43K badges for top performers. Strong alliances co-ordinate to maximise placement. Participate every month without fail.",
  },
  {
    tier: "A",
    tierColor: "text-blue-300 border-blue-600 bg-blue-900/20",
    name: "Lucky Discounter",
    monthly: "10,000–42,000",
    schedule: "Periodic event",
    tip: "Highly variable. F2P players earn ~10K/run; spenders can extract 42K+ per event cycle. Always complete the free Lucky Discounter tasks — skip the paid tiers unless you're budgeted for it.",
  },
  {
    tier: "A",
    tierColor: "text-blue-300 border-blue-600 bg-blue-900/20",
    name: "Duel League",
    monthly: "~20,000",
    schedule: "Monthly PvP season",
    tip: "Badge rewards scale with Duel League rank. Aim for Platinum or higher to hit the 20K range. Arena fights are quick — complete your daily matches every day.",
  },
  {
    tier: "A",
    tierColor: "text-blue-300 border-blue-600 bg-blue-900/20",
    name: "Alliance Duel",
    monthly: "5,000–10,000/week (~20,000–40,000/month)",
    schedule: "Weekly Mon–Sat event",
    tip: "Unlocking Event Expert nodes in Alliance Recognition multiplies your Alliance Duel points by up to +300%. Badge rewards scale directly with your total score — invest in Event Expert research first.",
  },
  {
    tier: "B",
    tierColor: "text-purple-300 border-purple-600 bg-purple-900/20",
    name: "Dual Mastery Boxes",
    monthly: "~18,000",
    schedule: "Daily/event",
    tip: "Open Dual Mastery Boxes consistently. These drop from VS events and daily rewards. Don't hoard them — open immediately as badge rates don't improve.",
  },
  {
    tier: "B",
    tierColor: "text-purple-300 border-purple-600 bg-purple-900/20",
    name: "Seasonal Events",
    monthly: "~37,000 (during season)",
    schedule: "Periodic seasonal events",
    tip: "Major seasonal events (Christmas, New Year, Anniversary, Spring) include dedicated badge reward tracks. Always complete the full event pass during these windows — they represent a large one-time badge spike.",
  },
  {
    tier: "B",
    tierColor: "text-purple-300 border-purple-600 bg-purple-900/20",
    name: "Zombie Saga",
    monthly: "~5,200",
    schedule: "Ongoing",
    tip: "Steady trickle of badges from Zombie Saga progression. Complete daily and weekly missions. Low effort, worth doing consistently.",
  },
  {
    tier: "C",
    tierColor: "text-slate-300 border-slate-600 bg-slate-900/20",
    name: "Danger Lurks",
    monthly: "~6,000",
    schedule: "Event-dependent",
    tip: "Danger Lurks provides a moderate badge yield during active event periods. Participate when active but don't schedule around it.",
  },
  {
    tier: "C",
    tierColor: "text-slate-300 border-slate-600 bg-slate-900/20",
    name: "VS Events (Research/Build days)",
    monthly: "variable",
    schedule: "Thursday (Research), Monday (Build)",
    tip: "VS events reward badges for completing qualifying actions. Align your research and construction speed-ups with VS event days to earn points and badges simultaneously.",
  },
];

const RULES = [
  {
    title: "Spend badges only on Wednesday",
    body: "Wednesday is Age of Science VS day — spending badges on research earns double VS points. Stockpile badges the rest of the week and mass-research on Wednesday for maximum event efficiency.",
  },
  {
    title: "Alliance Recognition: Event Expert first",
    body: "The Event Expert node in Alliance Recognition provides +100% Alliance Duel Points per level (up to +300% at max). This multiplier compounds with everything else. Research it as your first Alliance Recognition priority — the ROI is the fastest in the game.",
  },
  {
    title: "Never miss daily Explore Treasure",
    body: "Explore Treasure is your largest passive badge income. Missing even one day costs you ~3,000 badges. Set a reminder and complete all 5 explorations before reset.",
  },
  {
    title: "Plan badge spend against your research tree",
    body: "Use the Research Trees pages to calculate exactly how many badges each node costs before committing. Avoid half-completing expensive nodes — plan full completion budgets so you don't stall at a critical prerequisite.",
  },
  {
    title: "Join an active alliance for Alliance Duel",
    body: "Alliance Duel yields are dramatically higher in active alliances that co-ordinate tasks. A co-ordinated 30-member alliance can earn 2–3× more badges per member than a passive one.",
  },
];

export default function BadgesGuidePage() {
  const totalLow = "138,000";
  const totalHigh = "280,000";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">
          Guide
        </Link>
        <span>›</span>
        <span className="text-purple-200">Badge Farming</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Last Z Badge Farming Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        Every badge source ranked by monthly yield. Use this to plan your research budget and weekly schedule.
      </p>

      {/* Monthly potential callout */}
      <div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h2 className="font-semibold text-amber-200">Monthly Badge Potential</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 px-4 py-3 text-center">
            <p className="text-xs text-amber-300/70">Casual (F2P, partial events)</p>
            <p className="mt-1 text-2xl font-extrabold text-white">{totalLow}</p>
            <p className="text-xs text-amber-400">badges / month</p>
          </div>
          <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 px-4 py-3 text-center">
            <p className="text-xs text-amber-300/70">Active (co-ordinated alliance, full events)</p>
            <p className="mt-1 text-2xl font-extrabold text-white">{totalHigh}</p>
            <p className="text-xs text-amber-400">badges / month</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-amber-200/60">
          Ranges are estimates based on community data. Actual yield depends on VS event performance, alliance activity, and seasonal event availability.
        </p>
      </div>

      {/* Badge sources table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Badge Sources Ranked</h2>
        <p className="mt-1 text-sm text-purple-200/80">S = highest priority, C = marginal but worth doing.</p>
        <div className="mt-4 space-y-3">
          {SOURCES.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-bold ${s.tierColor}`}
                >
                  {s.tier}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-semibold text-white">{s.name}</p>
                    <span className="text-xs text-amber-400 font-mono">{s.monthly} badges/mo</span>
                  </div>
                  <p className="mt-0.5 text-xs text-purple-400">{s.schedule}</p>
                  <p className="mt-1.5 text-sm text-purple-100/90 leading-relaxed">{s.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key rules */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white">Golden Rules for Badge Efficiency</h2>
        <div className="mt-4 space-y-4">
          {RULES.map((r, i) => (
            <div key={r.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{r.title}</p>
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research link */}
      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Plan your badge spend</h3>
        <p className="mt-1 text-sm text-purple-200/80">
          Use the Research Trees to see exactly how many badges each node costs before you commit.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/research"
            className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white"
          >
            Research Trees →
          </Link>
          <Link
            href="/alliance"
            className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white"
          >
            Alliance Duel Calculator →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Badge yield figures sourced from community data (lastzguides.com, Last Z Discord). Actual results vary by server, alliance, and event availability. Last updated June 2026.
      </p>
    </div>
  );
}
