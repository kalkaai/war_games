import type { Metadata } from "next";
import gearData from "@/data/gear.json";

export const metadata: Metadata = {
  title: "Gear Guide — GAMIDES | Last Z: Survival Shooter",
  description: "Last Z: Survival Shooter hero gear slots, tiers, enhancement levels, and upgrade priority. Covers purple, orange, exclusive, and mythic gear with max enhancement stats.",
  openGraph: {
    title: "Gear Guide — GAMIDES | Last Z: Survival Shooter",
    description: "Last Z: Survival Shooter hero gear slots, tiers, enhancement levels, and upgrade priority. Purple, orange, exclusive, and mythic gear.",

  },
  alternates: {
    canonical: "https://www.gamides.com/gear",
  },
};

const { slots, tiers, priorityGuide, statGuide } = gearData as typeof gearData;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best gear upgrade priority in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "For DPS heroes: Gun first, Helmet second, Boots third, Armor last. For Tank/Support heroes: Armor first, Boots second, Helmet third, Gun last. Never spend Enhancement Alloy on purple, blue, or green gear. The first hexagon promotion (Orange Lv50) costs 100 Power Cores and provides the highest stat gain per resource in the game." }
    },
    {
      "@type": "Question",
      "name": "What are the gear tiers in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Last Z: Survival Shooter has four gear tiers: Purple (max Lv 30 — convert to Alloy immediately), Orange (max Lv 50, extends to 75 with hexagons — the F2P endgame target), Exclusive (hero-specific, max Lv 100 — craft after completing orange set), and Mythic (endgame tier, adds +25 to max enhancement cap)." }
    },
    {
      "@type": "Question",
      "name": "What is damage resistance in Last Z: Survival Shooter gear?",
      "acceptedAnswer": { "@type": "Answer", "text": "Damage resistance is the rarest and most impactful PvP stat in Last Z: Survival Shooter. It applies as a separate multiplier that stacks multiplicatively with DEF%. It is only found on high-tier Armor pieces and is a key reason why Licia and Liliana are top-tier heroes — their passives provide this stat." }
    }
  ]
};

export default function GearPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">

      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z: Survival Shooter Gear Guide</h1>
      <p className="mt-2 text-purple-200/80">
        Hero equipment slots, tiers, and investment priorities for Last Z: Survival Shooter.
      </p>

      {/* Slots */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Equipment Slots</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{slot.icon}</span>
                <div>
                  <p className="font-semibold text-white">{slot.name}</p>
                  <p className="text-xs text-purple-400">{slot.primaryStat}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-purple-200/80">{slot.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Gear Tiers</h2>
        <div className="mt-4 space-y-3">
          {tiers.map((tier) => {
            const borderColor =
              tier.id === "purple"   ? "border-purple-600/60 bg-purple-900/20" :
              tier.id === "orange"   ? "border-orange-600/60 bg-orange-900/10" :
              tier.id === "exclusive"? "border-amber-500/60 bg-amber-900/10"   :
              "border-red-600/60 bg-red-900/10";
            const labelColor =
              tier.id === "purple"   ? "text-purple-300" :
              tier.id === "orange"   ? "text-orange-300" :
              tier.id === "exclusive"? "text-amber-300"  :
              "text-red-300";
            return (
              <div key={tier.id} className={`rounded-xl border p-4 ${borderColor}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`font-semibold ${labelColor}`}>
                      {tier.name} Tier
                      <span className="ml-2 text-xs text-purple-400/60">max Lv {tier.maxLevel}</span>
                    </p>
                    <p className="mt-1 text-sm text-purple-100/95">{tier.notes}</p>
                  </div>
                  {"hexagons" in tier && (
                    <span className="shrink-0 rounded bg-purple-800/50 px-2 py-0.5 text-xs text-purple-300">
                      +{tier.hexagons} hexagons
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Priority Guide */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">What Is the Best Gear Upgrade Priority?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
            <p className="font-semibold text-purple-200">DPS Heroes</p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              {priorityGuide.dpsHeroes.map((s) => (
                <li key={s} className="text-sm text-purple-200/90">{s}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
            <p className="font-semibold text-purple-200">Tank / Support Heroes</p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              {priorityGuide.tankHeroes.map((s) => (
                <li key={s} className="text-sm text-purple-200/90">{s}</li>
              ))}
            </ol>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {priorityGuide.generalTips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-purple-100/95">
              <span className="shrink-0 text-purple-500">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Stat Guide */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Key Stats</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-purple-800/40">
          <table aria-label="Key gear stats" className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-800/40 bg-[#0a0014]">
                <th scope="col" className="px-4 py-3 text-left text-purple-300">Stat</th>
                <th scope="col" className="px-4 py-3 text-left text-purple-300">Best For</th>
                <th scope="col" className="px-4 py-3 text-left text-purple-300">Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(statGuide).map((row) => (
                <tr key={row.stat} className="border-b border-purple-900/20">
                  <td className="px-4 py-2.5 font-medium text-white">{row.stat}</td>
                  <td className="px-4 py-2.5 text-purple-300">{row.role}</td>
                  <td className="px-4 py-2.5 text-purple-200/80">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-xs text-purple-300/70">
        Last updated May 2026.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
