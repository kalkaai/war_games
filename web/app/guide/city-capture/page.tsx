import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "City Capture & Defense Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Last Z: Survival Shooter city capture and base defense guide. Shield timing, trap accounts, resource protection, rally mechanics, Enemy Buster strategy, and alliance coordination.",
  openGraph: {
    title: "City Capture & Defense Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Shield timing, trap accounts, resource protection, rally mechanics, and Enemy Buster strategy for Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/city-capture",
  },
};

const DEFENSE_RULES = [
  {
    title: "Resources below Warehouse capacity cannot be raided",
    body: "Your Warehouse protects a fixed amount of each resource type. Any resources inside that threshold are completely safe — no shield needed. Check your Warehouse capacity and only shield when your stockpile exceeds it.",
  },
  {
    title: "Spend resources before logging off",
    body: "Queue a long building upgrade or troop training batch before going offline. Committed resources (actively being consumed by an upgrade) cannot be raided. This is more efficient than shielding defensively.",
  },
  {
    title: "Shield windows: Friday night and event peaks",
    body: "Enemy Buster, State Ruler, and cross-server events dramatically increase attack frequency. Shield before high-risk windows, especially Friday nights heading into weekend raid periods. Maintain 2,000 diamonds as a fallback if Alliance Shop shields sell out.",
  },
  {
    title: "Set your strongest heroes on the wall before going offline",
    body: "Wall defense draws from your active hero formation. Before logging off, switch to your highest-ATK/highest-HP combat formation — not your resource or research heroes. This applies during Zombie Siege too.",
  },
  {
    title: "Recall all troops before risky periods",
    body: "Troops out on marches or gathering cannot defend your base. If a raid or rally lands while your best troops are mining, your wall defense is significantly weakened. Recall before going offline near high-risk windows.",
  },
  {
    title: "Alliance reinforcement is multiplicative",
    body: "Alliance members reinforcing your base stack with your own garrison. Communicate in alliance chat when under attack — a reinforced base with 5 members&apos; troops can repel attacks that would otherwise kill your garrison. Ask for help immediately.",
  },
];

const OFFENSE_RULES = [
  {
    title: "Scout before every march",
    body: "Scouting reveals the target&apos;s troop count, composition, and hero formation before you commit. A base with high power but low kill count is likely a trap account or an inactive account with no real combat setup — scout before wasting troops.",
  },
  {
    title: "Target bases above their Warehouse threshold",
    body: "Only attack bases that are visibly over-stored on resources (farms/food/wood piles visible in city view). Attacking a well-managed base with resources inside Warehouse protection yields nothing and wastes your hospital capacity.",
  },
  {
    title: "Use rallies for strong targets",
    body: "Solo marches against high-power bases typically lose troops permanently. Alliance rallies multiply your effective march size — 6–8 members rallying together can crack targets a solo player cannot. Rally leadership should match troop timing to minimise the first-attacker penalty.",
  },
  {
    title: "Time attacks during Enemy Buster",
    body: "Enemy Buster is active periodically (check Events). During Enemy Buster on Saturdays specifically, hospital capacity doubles — meaning fewer permanent troop losses from attacks. Co-ordinating offensive pushes during this window reduces your losses significantly.",
  },
  {
    title: "Trap accounts: HQ27 + T9 troops",
    body: "A trap account appears weak (HQ27, low power stat) but fields near-endgame combat troops (T9). Attackers who scout and see &ldquo;low power&rdquo; march in — and lose troops permanently to a far stronger defense than expected. Do not attack HQ27+ bases that have suspiciously high kill counts.",
  },
];

const RESOURCE_PROTECTION = [
  { resource: "Food & Wood", tip: "Largest stockpiles; most commonly raided. Queue building upgrades to consume surplus before offline periods. Warehouse protection is your baseline — check it." },
  { resource: "Steel", tip: "Required for HQ30+ upgrades. High-value and harder to farm. Keep steel inside Warehouse capacity at all times — never overshoot it without an upgrade queued." },
  { resource: "Zent (Gold)", tip: "Used for VIP and various purchases. Generally lower raid priority than food/wood but still protected by the same Warehouse mechanics." },
  { resource: "Diamonds", tip: "Cannot be raided — always safe. Never waste diamonds to protect other resources. The 2,000 reserve rule is for shields, not resource protection." },
];

const ALLIANCE_COORD = [
  "Establish a &ldquo;panic channel&rdquo; in Discord/alliance chat for incoming rally alerts — time is critical.",
  "R4/R5 should designate members for base reinforcement duty during high-risk event periods.",
  "Co-ordinate offensive rallies: attackers should match troop type to counter the target&apos;s dominant faction.",
  "During SVS, only the designated capital assault force should leave home base — non-attackers should be shielded.",
  "Share scout reports before any major alliance attack so members can adjust hero formations accordingly.",
];

export default function CityCaptureGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">Guide</Link>
        <span>›</span>
        <span className="text-purple-200">City Capture & Defense</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        City Capture & Defense Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        How to protect your resources, set up a defensible base, and attack effectively — without wasting troops.
      </p>

      {/* Defense */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Defense: Protecting Your Base</h2>
        <div className="mt-4 space-y-3">
          {DEFENSE_RULES.map((r, i) => (
            <div key={r.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: r.title }}
                />
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource protection table */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Resource Protection Reference</h2>
        <div className="mt-4 space-y-2">
          {RESOURCE_PROTECTION.map((r) => (
            <div key={r.resource} className="rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <p className="text-sm font-semibold text-amber-300">{r.resource}</p>
              <p className="mt-0.5 text-sm text-purple-100/90">{r.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offense */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Offense: Attacking Effectively</h2>
        <div className="mt-4 space-y-3">
          {OFFENSE_RULES.map((r, i) => (
            <div key={r.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-800/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: r.title }}
                />
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alliance coordination */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Alliance Coordination</h2>
        <ul className="mt-4 space-y-2">
          {ALLIANCE_COORD.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3 text-sm text-purple-100/90"
              dangerouslySetInnerHTML={{
                __html: `<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 inline-block mr-2 translate-y-1.5"></span>${t}`,
              }}
            />
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/guide/server-war" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Server War (SVS) Guide →
          </Link>
          <Link href="/guide/canyon-clash" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Canyon Clash Guide →
          </Link>
          <Link href="/pvp" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            PvP & Formations →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Reflects Season 4 meta. Last updated June 2026.
      </p>
    </div>
  );
}
