import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Troop Formation & Assembly Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Last Z: Survival Shooter troop formation guide. T1–T10 tier overview, Assaulter vs Shooter vs Rider roles, march slot optimisation, promotion mechanics, and training speed-up strategy.",
  openGraph: {
    title: "Troop Formation & Assembly Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Troop tier overview, faction roles, formation slots, promotion mechanics, and training speed-up strategy for Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/troop-formation",
  },
};

const TROOP_TYPES = [
  {
    name: "Assaulter",
    faction: "Blood Rose",
    icon: "⚔️",
    counters: "Rider",
    weakTo: "Shooter",
    role: "Close-range front-line fighter. Highest individual burst damage. Excels in base attacks and rally combat where enemies cannot easily kite.",
    camp: "Assaulter Camp",
    bestHeroes: "Yu Chan, Licia, Bella",
  },
  {
    name: "Shooter",
    faction: "Wings of Dawn",
    icon: "🎯",
    counters: "Assaulter",
    weakTo: "Rider",
    role: "Ranged DPS. Counters the most common troop type (Assaulter — used by ~70% of players). Recommended for most new players and F2P builds.",
    camp: "Shooter Camp",
    bestHeroes: "Queenie, Liliana, Laura",
  },
  {
    name: "Rider",
    faction: "Guard of Order",
    icon: "🏇",
    counters: "Shooter",
    weakTo: "Assaulter",
    role: "High march speed and mobility. Strongest in late-game PvP with the Amber + Dodomeki combo. Best for SVS turret captures and time-sensitive marches.",
    camp: "Rider Camp",
    bestHeroes: "Amber, Dodomeki, Selena",
  },
];

const TIER_GUIDE = [
  { tier: "T1–T3", label: "Early game only", detail: "Train immediately to progress. Stop training entirely once T4 is available — T1–T3 troops provide negligible combat value and consume food/wood that could feed higher tiers." },
  { tier: "T4", label: "First real troops", detail: "Unlocked at HQ11 (Rider Camp / Guard of Order). Worth training in bulk early as a food-efficient fighting force until T6+ is accessible." },
  { tier: "T5–T6", label: "Mid-game standard", detail: "Viable combat troops. Train these as your primary army while working toward higher camps. Don't permanently discard T4s — keep a reserve for wall defense." },
  { tier: "T7–T8", label: "Competitive baseline", detail: "T7–T8 is the standard for competitive alliance events (Canyon Clash, Zombie Siege). Reach this before pushing seriously into PvP. F2P target for months 4–6." },
  { tier: "T9", label: "Near-endgame", detail: "Strong enough for most endgame content. HQ27 + T9 troops is the optimal trap account configuration — a low HQ that appears weak but has near-top-tier combat power." },
  { tier: "T10", label: "Endgame cap", detail: "Requires Lab/HQ/Barracks all Lv30 AND completion of the Unit Special Training research tree (~1.4M badges). ~500 days of badge income for F2P. The definitive late-game target." },
];

const FORMATION_RULES = [
  {
    title: "Commit to one troop type completely",
    body: "Unit Special Training (UST) research is type-specific — badges spent on Assaulter UST do not transfer to Shooter. Switching troop types mid-game means starting the research over. Choose once and stick with it.",
  },
  {
    title: "Match camp upgrades to your chosen type only",
    body: "Upgrade only the camp for your chosen faction to the required level. Do not upgrade all three camps in parallel — resource and research costs multiply while the other camps provide zero combat value for your focused build.",
  },
  {
    title: "Fill march slots with a single troop type",
    body: "Mixed-type marches split the faction bonus. A march of 100% Shooters under a Wings of Dawn commander receives the full faction synergy. A mixed march dilutes it. Purge old tier troops before major battles.",
  },
  {
    title: "Stop training low-tier troops as soon as a higher tier is available",
    body: "Low-tier troops cost food and time, occupy hospital beds when wounded, and die permanently when hospital overflows. Once T7+ is your standard, stop training T4–T5 entirely. Keep a small wall-defense reserve only.",
  },
  {
    title: "Promotion vs training from scratch",
    body: "Promotion upgrades existing troops to the next tier using resource multipliers — it preserves your troop count. Training from scratch gives you a full count of the new tier but does not consume existing troops. Both are valid: promote when you want to preserve count; train when you want to expand.",
  },
  {
    title: "Use training speed-ups on Friday (VS Training Day)",
    body: "Friday is VS Training Day — using training speed-ups earns event points that count toward weekly VS scores. Save training speed-ups all week and bulk-spend on Friday. This doubles the value of every training item.",
  },
];

const MARCH_TIPS = [
  "Expand march capacity via Military Center upgrades — each level adds march slots that compound over months.",
  "Your formation (5 heroes) applies to all troops in that single march. Send your strongest heroes with your largest march.",
  "For garrison defense, your wall hero formation applies — set it separately from your active march formation.",
  "In SVS and rally combat, march size matters more than troop tier at the margins — a larger T8 march often beats a smaller T10 march.",
  "Deploy shields before sending marches out on long trips — a shieldless base is vulnerable while troops are away.",
];

export default function TroopFormationGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">Guide</Link>
        <span>›</span>
        <span className="text-purple-200">Troop Formation</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Troop Formation & Assembly Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        Troop tier progression, faction roles, march slot optimisation, and the formation decisions that define your account long-term.
      </p>

      {/* Core commitment warning */}
      <div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <p className="font-semibold text-amber-200">Your troop type is a permanent commitment</p>
        <p className="mt-1 text-sm text-amber-100/80">
          Unit Special Training badges are invested per troop type and cannot be transferred. Switching from Assaulter to Shooter mid-game means restarting ~1.4 million badges of research. Choose your faction based on your hero roster and long-term goals, then never deviate.
        </p>
      </div>

      {/* Troop types */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">The Three Troop Types</h2>
        <div className="mt-4 space-y-3">
          {TROOP_TYPES.map((t) => (
            <div key={t.name} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">{t.icon}</span>
                <p className="font-bold text-white">{t.name}</p>
                <span className="rounded-full border border-purple-700/50 bg-purple-900/40 px-2 py-0.5 text-xs text-purple-300">{t.faction}</span>
                <span className="text-xs text-green-400">beats {t.counters}</span>
                <span className="text-xs text-red-400">weak to {t.weakTo}</span>
              </div>
              <p className="mt-2 text-sm text-purple-100/90">{t.role}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-purple-400">
                <span>Camp: <span className="text-white">{t.camp}</span></span>
                <span>Top heroes: <span className="text-white">{t.bestHeroes}</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tier guide */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Troop Tier Overview (T1–T10)</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Camp level determines your max trainable tier — Camp Lv 10 = T10 max (plus Lab/HQ/Barracks Lv30 for T10).
        </p>
        <div className="mt-4 space-y-2">
          {TIER_GUIDE.map((t) => (
            <div key={t.tier} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <div className="shrink-0 w-16 text-center">
                <p className="text-xs font-mono font-bold text-amber-400">{t.tier}</p>
                <p className="text-xs text-purple-500">{t.label}</p>
              </div>
              <p className="text-sm text-purple-100/90">{t.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <Link href="/calc/t10" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            T10 Research Calculator →
          </Link>
        </div>
      </section>

      {/* Formation rules */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Formation Rules</h2>
        <div className="mt-4 space-y-3">
          {FORMATION_RULES.map((r, i) => (
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
      </section>

      {/* March tips */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">March & Deployment Tips</h2>
        <ul className="mt-4 space-y-2">
          {MARCH_TIPS.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3 text-sm text-purple-100/90">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/pvp" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">PvP & Formations →</Link>
          <Link href="/heroes" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">Hero Tier List →</Link>
          <Link href="/guide/f2p" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">F2P Guide →</Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Reflects Season 4 meta. Last updated June 2026.
      </p>
    </div>
  );
}
