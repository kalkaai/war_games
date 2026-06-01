import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Canyon Clash Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Complete Canyon Clash guide for Last Z: Survival Shooter. How to score, best hero lineups, faction counters, War Frenzy timing, and alliance coordination tips.",
  openGraph: {
    title: "Canyon Clash Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Canyon Clash scoring, hero lineups, faction counters, and alliance coordination tips for Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/canyon-clash",
  },
};

const PHASES = [
  {
    label: "Registration Phase",
    timing: "Opens Monday",
    body: "Your alliance R4/R5 registers for the event. You are matched against an alliance of similar power. All members should confirm participation — missing members reduce your maximum score potential.",
  },
  {
    label: "Voting / Strategy Phase",
    timing: "Before battle window",
    body: "Alliances vote on attack timing and assign members to roles (attacker vs. reserve). Discuss enemy alliance strength and faction composition. Identify which of your heroes counter their most common faction.",
  },
  {
    label: "Battle",
    timing: "45 minutes",
    body: "Active combat window. Alliances attack each other across designated canyon zones. All active members should be online and ready. Rally coordination dramatically outperforms solo marches — follow your R4/R5 lead.",
  },
  {
    label: "Results",
    timing: "After battle ends",
    body: "Rewards distributed based on individual and alliance performance. Higher combined alliance score = better reward tier.",
  },
];

const FACTION_COUNTERS = [
  { attacker: "Wings of Dawn", defends: "Blood Rose", note: "~70% of players use Blood Rose — making Wings of Dawn the strongest default pick" },
  { attacker: "Guard of Order", defends: "Wings of Dawn", note: "Strong counter but less common since fewer players run WoD" },
  { attacker: "Blood Rose", defends: "Guard of Order", note: "Good into Rider-heavy alliances" },
];

const TIPS = [
  {
    title: "Coordination beats raw power",
    body: "A lower-power alliance with tight rally timing consistently defeats a stronger alliance fighting solo. When your R4/R5 calls a rally, join immediately — every 30-second delay reduces damage output.",
  },
  {
    title: "Use War Frenzy during battle",
    body: "Activate your tank War Frenzy skill at the start of the battle and keep it on cooldown. It provides a hero attack boost that applies to all combat during the window. This is your highest-impact consumable.",
  },
  {
    title: "Match your formation to their faction",
    body: "Run 3 heroes from the faction that counters your enemy's primary faction, plus 2 from a secondary faction. If fighting a Blood Rose alliance, run 3 Wings of Dawn + 2 Blood Rose for synergy.",
  },
  {
    title: "Shield before the battle ends",
    body: "If your base is in a vulnerable position after combat, activate a peace shield before the battle window closes. Enemy stragglers can attack during result calculation. Don&apos;t leave your base exposed.",
  },
  {
    title: "Saturday has doubled hospital capacity",
    body: "If Canyon Clash falls on Saturday, hospital capacity is doubled during Enemy Buster / State Ruler events — meaning fewer permanent troop losses. Coordinate with your alliance to time aggressive pushes on those days.",
  },
  {
    title: "Don&apos;t reinforce without asking",
    body: "Uninvited reinforcements can overflow a garrison and block your alliance members from contributing. Always ask in chat before reinforcing a teammate&apos;s base during Canyon Clash.",
  },
];

const HEROES = [
  { name: "Queenie", faction: "Wings of Dawn", role: "Main DPS", note: "S+ tier. Best for Shooter-based WoD comps. +10% damage to Assaulters via exclusive talent. Skill priority: Raven Reigns → Firefall → All-in Assault." },
  { name: "Yu Chan", faction: "Blood Rose", role: "Main DPS", note: "S+ tier. Massive burst output for BR Assaulter comps. +10% damage to Riders via talent. Skill priority: Death&apos;s Aim → Soul Striker → Wyrm Wrath." },
  { name: "Amber", faction: "Guard of Order", role: "Main DPS", note: "S+ tier for Rider comps. Extremely strong in Season 4. Best paired with Dodomeki in a GoO core." },
  { name: "Licia / Liliana", faction: "Wings of Dawn", role: "Support / Buffer", note: "S tier support. Adds HP and defense buffs to the full composition. Strong all-round pair with Queenie." },
];

export default function CanyonClashGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">
          Guide
        </Link>
        <span>›</span>
        <span className="text-purple-200">Canyon Clash</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Canyon Clash Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        Weekly alliance-vs-alliance PvP event. Coordination and faction counters determine the winner — not raw power.
      </p>

      {/* Quick facts */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Frequency", value: "Weekly" },
          { label: "Battle Duration", value: "45 minutes" },
          { label: "Format", value: "Alliance vs Alliance" },
          { label: "Key Day", value: "Varies by server" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-purple-700/60 bg-purple-900/20 p-3 text-center">
            <p className="text-xs text-purple-400">{label}</p>
            <p className="mt-1 font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Event phases */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Event Structure</h2>
        <div className="mt-4 space-y-3">
          {PHASES.map((p, i) => (
            <div key={p.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {i < PHASES.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-purple-800/40" />
                )}
              </div>
              <div className="pb-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold text-white">{p.label}</p>
                  <span className="text-xs text-purple-400">{p.timing}</span>
                </div>
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faction counters */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Faction Counter Triangle</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Run the faction that counters your enemy&apos;s primary faction. Check their roster before the battle window opens.
        </p>
        <div className="mt-4 space-y-2">
          {FACTION_COUNTERS.map((f) => (
            <div key={f.attacker} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-white">{f.attacker}</span>
                <span className="text-purple-500">beats</span>
                <span className="font-semibold text-red-300">{f.defends}</span>
              </div>
              <p className="mt-1 text-xs text-purple-400/80">{f.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-blue-800/40 bg-blue-900/10 px-4 py-3 text-sm text-blue-200/80">
          <strong className="text-white">Recommended formation:</strong> 3 heroes from your counter faction + 2 from a secondary faction for the synergy bonus. Put your strongest all-troop buffer in the Commander slot.
        </div>
      </div>

      {/* Hero recommendations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Top Heroes</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          All PvP events use the same hero formation — build around your chosen faction.
        </p>
        <div className="mt-4 space-y-3">
          {HEROES.map((h) => (
            <div key={h.name} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="font-semibold text-white">{h.name}</p>
                <span className="rounded-full border border-purple-700/50 bg-purple-900/40 px-2 py-0.5 text-xs text-purple-300">
                  {h.faction}
                </span>
                <span className="text-xs text-purple-400">{h.role}</span>
              </div>
              <p className="mt-1 text-sm text-purple-100/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: h.note }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Strategy Tips</h2>
        <div className="mt-4 space-y-4">
          {TIPS.map((t, i) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: t.title }}
                />
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/heroes" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Hero Tier List →
          </Link>
          <Link href="/pvp" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            PvP Overview →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from lastzguides.com, lastzwiki.com, and community guides. Reflects Season 4 meta. Last updated June 2026.
      </p>
    </div>
  );
}
