import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PvP & Formations — WarGuard | Last Z",
  description: "Last Z PvP guide: troop type counters, front and back row formations, faction team compositions, and VS event strategy for competitive play.",
  openGraph: {
    title: "PvP & Formations — WarGuard | Last Z",
    description: "Last Z PvP guide: troop counters, formations, faction compositions, and competitive strategy for arena and alliance battles.",

  },
  alternates: {
    canonical: "https://warguard.app/pvp",
  },
};

const COUNTER_TABLE = [
  { attacker: "⚔️ Assaulter", beats: "🏇 Rider", loses: "🎯 Shooter" },
  { attacker: "🎯 Shooter", beats: "⚔️ Assaulter", loses: "🏇 Rider" },
  { attacker: "🏇 Rider", beats: "🎯 Shooter", loses: "⚔️ Assaulter" },
];

const FORMATIONS = [
  {
    name: "Full Faction Stack",
    description:
      "Deploy all 5 heroes of one faction to trigger exclusive skill bonuses from every hero. The strongest formation for players who have invested in a single faction.",
    front: ["Faction Tank Hero", "Faction Tank Hero"],
    back: ["Faction DPS Hero", "Faction DPS Hero", "Faction Support"],
    tag: "Recommended",
    tagColor: "bg-purple-600",
  },
  {
    name: "Mixed Front/Back Split",
    description:
      "Front row takes damage — place HP/DEF heroes here. Back row deals damage — place ATK heroes here. Works when you don't yet have 5 heroes of one faction.",
    front: ["High HP/DEF hero", "High HP/DEF hero"],
    back: ["High ATK hero", "High ATK hero", "Support hero"],
    tag: "Flexible",
    tagColor: "bg-blue-700",
  },
  {
    name: "Speed Assault",
    description:
      "Stack march speed and attack — maximise the ambush window in SVS and Alliance Duel. Rider-based teams excel here due to Amber and Dodomeki's speed passives.",
    front: ["Rider Tank", "Rider ATK"],
    back: ["Rider ATK", "Rider ATK", "Rider Support"],
    tag: "Rider Only",
    tagColor: "bg-amber-700",
  },
];

const META_TIPS = [
  {
    icon: "🛡️",
    tip: "Damage resistance is multiplicative",
    detail:
      "Unlike DEF%, damage resistance applies as a separate multiplier. Stacking both creates exponential survivability. Licia and Liliana's passives provide the rarest damage resistance in the game.",
  },
  {
    icon: "🏆",
    tip: "5-hero faction bonus is mandatory in top PvP",
    detail:
      "Every S+ hero's exclusive skill triggers only when 5 heroes of the same faction are deployed. In competitive play, mixed-faction teams lose their exclusive bonuses — a significant power gap.",
  },
  {
    icon: "⚡",
    tip: "Front row determines survival",
    detail:
      "The front two heroes absorb the bulk of incoming damage. A Licia (damage resistance) + Bella (HP boost) front row for Blood Rose, or Liliana + Queenie for Wings of Dawn, creates a durable backline for DPS heroes.",
  },
  {
    icon: "🎯",
    tip: "Hero skills trigger in the back row",
    detail:
      "Unlike what many beginners assume, a hero's passive skills (Skill 3 and 4) are ALWAYS active regardless of front/back row placement — only deployment (bringing the hero to war) is required, not specific row positioning.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the troop counter system work in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Last Z uses a rock-paper-scissors counter triangle: Assaulters beat Riders, Shooters beat Assaulters, and Riders beat Shooters. Matching your troops against the opponent's weakness provides a significant combat advantage in PvP." }
    },
    {
      "@type": "Question",
      "name": "What is the best PvP formation in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "The strongest formation is a Full Faction Stack — deploy all 5 heroes of one faction to trigger exclusive skill bonuses from every hero. Place HP/DEF heroes in the front row and ATK heroes in the back row. The front two heroes absorb the bulk of incoming damage." }
    },
    {
      "@type": "Question",
      "name": "Do hero passive skills require specific row placement in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. A hero's passive skills (Skill 3 and 4) are always active regardless of front or back row placement — only deploying the hero to war is required, not specific row positioning. This is a common misconception among new players." }
    }
  ]
};

export default function PvPPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z PvP & Formations</h1>
      <p className="mt-2 text-purple-300/70">
        Troop counters, formation strategy, and meta tips for competitive play.
      </p>

      {/* Troop counter triangle */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">How Does the Troop Counter System Work?</h2>
        <p className="mt-1 text-sm text-purple-300/70">
          Each troop type has a hard counter. Match your troops against the opponent&apos;s weakness.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table aria-label="Troop counter triangle" className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-800/50">
                <th scope="col" className="py-2 text-left text-purple-300">Your troops</th>
                <th scope="col" className="py-2 text-left text-green-400">Counters</th>
                <th scope="col" className="py-2 text-left text-red-400">Weak against</th>
              </tr>
            </thead>
            <tbody>
              {COUNTER_TABLE.map((row) => (
                <tr key={row.attacker} className="border-b border-purple-900/30">
                  <td className="py-2.5 font-medium text-white">{row.attacker}</td>
                  <td className="py-2.5 text-green-300">{row.beats}</td>
                  <td className="py-2.5 text-red-300">{row.loses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formations */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Formations</h2>
        <p className="mt-1 text-sm text-purple-300/70">
          Heroes are arranged in a 2-front / 3-back row configuration.
        </p>
        <div className="mt-4 space-y-4">
          {FORMATIONS.map((f) => (
            <div
              key={f.name}
              className="rounded-xl border border-purple-800/50 bg-purple-900/20 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-white">{f.name}</h3>
                <span className={`rounded px-2 py-0.5 text-xs text-white ${f.tagColor}`}>
                  {f.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-purple-200/80">{f.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-400">
                    Front Row (takes hits)
                  </p>
                  {f.front.map((h) => (
                    <div
                      key={h}
                      className="mb-1 rounded bg-red-900/20 px-2 py-1 text-xs text-red-200"
                    >
                      {h}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-400">
                    Back Row (deals damage)
                  </p>
                  {f.back.map((h) => (
                    <div
                      key={h}
                      className="mb-1 rounded bg-green-900/20 px-2 py-1 text-xs text-green-200"
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meta tips */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Meta Tips</h2>
        <div className="mt-4 space-y-3">
          {META_TIPS.map((t) => (
            <div
              key={t.tip}
              className="rounded-xl border border-purple-800/40 bg-purple-900/10 p-4"
            >
              <p className="font-semibold text-white">
                {t.icon} {t.tip}
              </p>
              <p className="mt-1 text-sm text-purple-200/80">{t.detail}</p>
            </div>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
