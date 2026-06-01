import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zombie Siege Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Complete Zombie Siege guide for Last Z: Survival Shooter. 30-wave alliance defense event — prep steps, War Frenzy timing, reinforcement rules, and wrench reward optimisation.",
  openGraph: {
    title: "Zombie Siege Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Zombie Siege: 30 waves, ~1h45m, wrench rewards. Prep steps, War Frenzy timing, and reinforcement rules for Last Z: Survival Shooter.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/zombie-siege",
  },
};

const QUICK_FACTS = [
  { label: "Type", value: "Alliance Defense" },
  { label: "Waves", value: "30 total" },
  { label: "Duration", value: "~1h 45m" },
  { label: "Scheduled by", value: "R4 / R5 only" },
  { label: "Best day", value: "Monday" },
  { label: "Rewards dist.", value: "Wednesday reset" },
];

const PREP_STEPS = [
  {
    title: "Recall all troops",
    body: "Any troops out marching, mining, or scouting are unavailable for defense. Recall everything home at least 15 minutes before the event starts. This is the single most common mistake that gets bases eliminated.",
  },
  {
    title: "Put strongest heroes on the wall",
    body: "Your wall defense draws from your equipped hero formation. Make sure your highest-ATK, highest-HP heroes are set as your active formation — not resource heroes or training heroes.",
  },
  {
    title: "Stop mining and boomer formations",
    body: "Sending out gathering marches or boomer rallies during the event drains your available defending troops. Don&apos;t run any outgoing marches during the event window.",
  },
  {
    title: "Check your hospital capacity",
    body: "Wounded troops go to hospital rather than dying permanently — but only if hospital capacity allows. Upgrade your Medical Center before the event if you&apos;re close to overflow. Permanently lost troops cannot be replaced cheaply.",
  },
];

const DURING_TIPS = [
  {
    title: "Use War Frenzy every 10 minutes",
    body: "War Frenzy (tank skill) provides a hero attack boost that applies to your wall defense damage. Activate it at event start and use it every time it comes off cooldown. This is the highest single-activation impact you can have on your defense score.",
  },
  {
    title: "Wait before reinforcing allies",
    body: "Don&apos;t reinforce teammates in the early waves. Lower-level members need to earn their own score from early waves to receive personal rewards. Reinforcing too early steals their points. Wait until mid-event, or until they explicitly request reinforcement in chat.",
  },
  {
    title: "Two failures = eliminated",
    body: "If your base fails to defend twice, it is knocked out of the event. A knocked-out base still receives some rewards based on participation but loses the full score potential from remaining waves. Don&apos;t let your base go undefended.",
  },
  {
    title: "Watch alliance chat",
    body: "R4/R5 leaders coordinate reinforcements during the event. If they call for help on a specific base, respond immediately — a reinforced base in the late waves is far more valuable than a solo defense.",
  },
];

const REWARDS = [
  { item: "Golden Wrenches", note: "Scale with score and alliance performance — your primary reward. Used for tank modifications." },
  { item: "Modification Blueprints", note: "Secondary reward. Also used for tank upgrades." },
  { item: "Speed-ups and resources", note: "Tier scales with score. Higher-ranked alliances receive better resource reward tiers." },
];

export default function ZombieSiegeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">
          Guide
        </Link>
        <span>›</span>
        <span className="text-purple-200">Zombie Siege</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Zombie Siege Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        30-wave alliance defense event. Wrench rewards scale with score — proper preparation doubles your payout.
      </p>

      {/* Quick facts */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {QUICK_FACTS.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-purple-700/60 bg-purple-900/20 p-3 text-center">
            <p className="text-xs text-purple-400">{label}</p>
            <p className="mt-1 font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Scheduling callout */}
      <div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h2 className="font-semibold text-amber-200">Schedule on Monday for best wrench value</h2>
        <p className="mt-1 text-sm text-amber-100/80">
          Zombie Siege can be scheduled Monday or Tuesday (R4/R5 only). Most alliances prefer Monday because wrench rewards distribute on <strong className="text-white">Wednesday</strong> — the same day your Alliance Duel rewards arrive. Monday scheduling keeps all your Alliance Duel-adjacent rewards on the same cycle and lets you plan Wednesday badge spending around a known total.
        </p>
      </div>

      {/* Pre-event prep */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Pre-Event Preparation</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Do all of this before the event starts. Failing to prepare is the most common cause of base elimination.
        </p>
        <div className="mt-4 space-y-3">
          {PREP_STEPS.map((s, i) => (
            <div key={s.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{s.title}</p>
                <p className="mt-1 text-sm text-purple-100/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* During event */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">During the Event</h2>
        <div className="mt-4 space-y-3">
          {DURING_TIPS.map((t) => (
            <div key={t.title} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <p className="font-semibold text-white">{t.title}</p>
              <p className="mt-1 text-sm text-purple-100/90 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Rewards</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Personal rewards arrive after all members complete. Alliance-wide rewards distribute Wednesday after server reset.
        </p>
        <div className="mt-4 space-y-2">
          {REWARDS.map((r) => (
            <div key={r.item} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <span className="font-semibold text-amber-300 shrink-0">{r.item}</span>
              <span className="text-sm text-purple-200/80">{r.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Use your wrenches efficiently</h3>
        <p className="mt-1 text-sm text-purple-200/80">
          Wrenches from Zombie Siege are the same currency used for tank modifications. See the Vehicles page for the full modification tracker and milestone targets (Cheetah, Hercules, Destroyer).
        </p>
        <div className="mt-3">
          <Link href="/tank" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Vehicle Modification Tracker →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from lastzguides.com and community guides. Reflects Season 4 meta. Last updated June 2026.
      </p>
    </div>
  );
}
