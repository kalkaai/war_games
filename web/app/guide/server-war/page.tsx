import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Server War (SVS) Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Complete Server War (SVS) guide for Last Z: Survival Shooter. Two-phase structure, turret mechanics, capital conquest, attacker vs defender strategy, and alliance coordination.",
  openGraph: {
    title: "Server War (SVS) Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Server War SVS guide: turret control, capital mechanics, no-shield zone, attacker and defender strategy for Last Z.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/server-war",
  },
};

const PHASES = [
  {
    label: "Prep Phase — Point Accumulation",
    icon: "📋",
    body: "Alliances compete within their own server to earn ranking points. Top-ranked alliances earn the right to lead the attack or coordinate capital defense in Phase 2. Focus on VS events, Tyrant kills, and alliance activity to maximise your server rank.",
  },
  {
    label: "Phase 2 — Capital Conquest",
    icon: "⚔️",
    body: "At AT 00:30 (UTC 02:30), the top attacking alliances teleport to the enemy server. The goal is to capture and hold the enemy capital while defending your own. This phase is the highest-stakes PvP in the game — every online member matters.",
  },
];

const MECHANICS = [
  {
    title: "The Capital Zone",
    body: "Shields cannot be activated inside the capital zone — this is an open battlefield with no protection. Any base inside the hexagon is vulnerable. Defenders pre-position around the capital perimeter; attackers must navigate through active fire.",
  },
  {
    title: "Three Turrets",
    body: "Three turrets surround the capital. Controlling all three simultaneously triggers automatic damage against the enemy capital — eliminating 1% of garrison soldiers at regular intervals. Attackers must hold all three at once to drain the capital garrison.",
  },
  {
    title: "Garrison Limit",
    body: "Each turret and the capital itself supports a maximum of 10 garrison troops simultaneously. Fill garrison slots with your highest-tier troops — T10 or T8+ elite if available. Partial fills waste potential defensive strength.",
  },
];

const ATTACKER_TIPS = [
  "At 00:30, your alliance leader initiates the teleport. Have all members online and ready — the window is narrow.",
  "First objective: capture the 12:00 (north) turret. Use clock positions for all callouts — 12=north, 3=east, 6=south, 9=west.",
  "Once you hold two turrets, concentrate force on the third. Do not split into 3 equal groups — outnumber defenders at each point sequentially.",
  "Avoid the capital interior until all three turrets are held — fighting in the capital zone before turret control wastes resources and loses troops.",
  "Use farm accounts to body-block enemy march paths outside the capital zone — they can hold shields there.",
  "Assign dedicated rally leaders for each turret. Everyone else joins rallies — solo marches accomplish nothing at this level of competition.",
];

const DEFENDER_TIPS = [
  "Pre-position your top-power bases inside or adjacent to the capital perimeter before Phase 2 begins.",
  "Fill all garrison slots in the capital and each turret with elite troops before the attack window opens.",
  "Assign R4/R5 members to each turret and the capital. Defenders have the positional advantage — use it.",
  "Deploy farm accounts with shields just outside the capital hexagon to block teleport landing zones.",
  "If a turret is about to fall, immediately rally to retake it — losing all three simultaneously starts the 1% drain timer.",
  "Keep reinforcements staged nearby at all times. Empty garrison slots can be filled mid-combat if troops are available.",
];

export default function ServerWarGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">
          Guide
        </Link>
        <span>›</span>
        <span className="text-purple-200">Server War (SVS)</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Server War (SVS) Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        The highest-stakes PvP event in Last Z. Two servers fight for capital control — shields are off inside the combat zone.
      </p>

      {/* Quick facts */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Frequency", value: "Bi-weekly" },
          { label: "Format", value: "Server vs Server" },
          { label: "Attack Window", value: "AT 00:30" },
          { label: "Shields Inside?", value: "No" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-purple-700/60 bg-purple-900/20 p-3 text-center">
            <p className="text-xs text-purple-400">{label}</p>
            <p className="mt-1 font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <div className="mt-6 rounded-xl border border-red-800/40 bg-red-900/10 p-4">
        <p className="text-sm font-semibold text-red-300">No shields inside the capital zone</p>
        <p className="mt-1 text-sm text-red-200/80">
          Any base inside the capital hexagon is fully exposed. If you are not a top-power player with elite troops and coordinated backup, do not position inside the hexagon. Losing troops inside SVS is permanent if your hospital overflows.
        </p>
      </div>

      {/* Phases */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Event Phases</h2>
        <div className="mt-4 space-y-4">
          {PHASES.map((p, i) => (
            <div key={p.label} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.icon}</span>
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-white">{p.label}</p>
                  <span className="text-xs text-purple-400">Phase {i + 1}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-purple-100/90 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key mechanics */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Key Mechanics</h2>
        <div className="mt-4 space-y-3">
          {MECHANICS.map((m) => (
            <div key={m.title} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <p className="font-semibold text-white">{m.title}</p>
              <p className="mt-1 text-sm text-purple-100/90 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attacker vs Defender */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-800/40 bg-red-900/10 p-5">
          <h2 className="font-bold text-red-200">Attacker Strategy</h2>
          <ul className="mt-3 space-y-2">
            {ATTACKER_TIPS.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-100/80">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-900/60 text-xs font-bold text-red-300">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-blue-800/40 bg-blue-900/10 p-5">
          <h2 className="font-bold text-blue-200">Defender Strategy</h2>
          <ul className="mt-3 space-y-2">
            {DEFENDER_TIPS.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-100/80">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-900/60 text-xs font-bold text-blue-300">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h3 className="font-semibold text-amber-200">Battle for the Capital</h3>
        <p className="mt-1 text-sm text-amber-100/80">
          The alliance that holds the capital when the event concludes wins. The winning alliance leader gains the <strong className="text-white">President</strong> title, which grants server-wide buffs and special privileges for all members of that alliance until the next SVS event. This is the primary long-term power incentive for top alliances.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/guide/canyon-clash" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Canyon Clash Guide →
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
