import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "F2P Progression Guide — Last Z: Survival Shooter | GAMIDES",
  description:
    "Complete Last Z: Survival Shooter free-to-play guide. Diamond management, HQ vs research balance, daily checklist, shield strategy, hero priorities, and monthly milestones for F2P players.",
  openGraph: {
    title: "F2P Progression Guide — Last Z: Survival Shooter | GAMIDES",
    description:
      "Last Z F2P guide: diamond management, daily checklist, HQ vs research balance, shield strategy, and common mistakes to avoid.",
  },
  alternates: {
    canonical: "https://www.gamides.com/guide/f2p",
  },
};

const DIAMOND_BUY = [
  { item: "Key Licenses", note: "Research License, Strategy License, Modification License. Permanent unlocks — buy first before anything else." },
  { item: "All 4 Builders", note: "Second builder is the single highest-ROI diamond spend. Each additional construction queue compounds over months." },
  { item: "Refugee Tickets (Butler + Scientist)", note: "Permanent construction and research speed bonuses that apply forever. Better long-term value than any one-time speed-up." },
  { item: "VIP Shop — Golden Wrenches only", note: "300 diamonds each, limit 10/week. The only consistent VIP shop buy — skip speed-ups completely." },
  { item: "Lucky Discounter (90% discount tiers)", note: "Badges at 90% cost 0.3 diamonds each vs 1.5 in VIP shop — a 5× efficiency gain. Full 32-ticket participation costs ~30,700 diamonds. Save up before each cycle." },
  { item: "Trade Trucks (orange/purple only)", note: "100 diamonds per roll. Buying equivalent orange hero fragments in VIP shop costs 1,000 diamonds — 10× more expensive." },
  { item: "Weekly shield reserve", note: "Keep 2,000 diamonds by Friday every week as fallback in case Alliance Shop shields are sold out before the weekend raid window." },
];

const DIAMOND_NEVER = [
  "Speed-ups from VIP shop — better sources exist at lower effective cost",
  "Purple hero fragments — poor value vs orange",
  "Resource packs — gather them or earn through events",
  "Gacha rolls unless specifically saving keys across multiple event cycles (base rate: ~410 diamonds per Golden Wrench vs 300 guaranteed in VIP shop)",
];

const DIAMOND_INCOME = [
  { source: "Daily Tasks (150-pt golden chest)", monthly: "~6,000+" },
  { source: "Arena (Gold tier+)", monthly: "4,000–20,000/mo" },
  { source: "Fury Lord (4 attacks/day)", monthly: "variable" },
  { source: "Diamond Mining (world map)", monthly: "~3,000" },
  { source: "Alliance Duel chests", monthly: "included in chests" },
  { source: "SVS Personal Reward Boxes", monthly: "per SVS cycle" },
  { source: "Gift Codes", monthly: "100–2,000 per code" },
];

const DAILY_CHECKLIST = [
  { task: "Trucks", detail: "4 deliveries + 4 attacks immediately after login. Counts toward multiple overlapping events simultaneously." },
  { task: "Bounty Missions", detail: "Complete 5 plunders + 5 alliance helps. Prioritise orange-tier help requests for best rewards." },
  { task: "Full Preparedness", detail: "Earn 18 points minimum for the merit chest. Actions during Golden Hour (AT 08:00 and 20:00) count double." },
  { task: "Fury Lord", detail: "Attack 4 times daily with the opponent attack buff active and Supreme General appointed. 4 spawn windows per day." },
  { task: "Danger Lurks", detail: "Use Auto Team-Up until main reward. ~200 badges/day from this alone — never skip." },
  { task: "Radar", detail: "Claim every 8 hours (caps). Tip: complete on Sunday/Thursday, claim Monday/Friday for Alliance Duel scoring multiplier." },
  { task: "Mines", detail: "Occupy 4 mines at all times for passive resource income. Refresh after returning from each." },
  { task: "Idle Reward", detail: "Claim 3 times daily (caps at 8 hours). Scan all tabs for unclaimed red-dot rewards." },
  { task: "Arena", detail: "Win 5 battles. Use the free refresh to target weaker opponents — easy wins count equally toward weekly rewards." },
  { task: "Daily Tasks", detail: "Reach 150 points for the Golden Chest. Completing the above automatically fulfils this." },
];

const HQ_CHECKPOINTS = [
  { range: "HQ 1–18", label: "Fast phase", detail: "Reach HQ18 in 1–2 days with bonuses. Rush without pausing — timers are short." },
  { range: "HQ 18", label: "Timers lengthen", detail: "End of the fast phase. Each upgrade now takes hours. Establish your daily research routine here." },
  { range: "HQ 21, 24, 27", label: "Checkpoint pauses", detail: "Natural pause points with substantially longer timers. Run research between upgrades. Stop camps at level 27 — the research cost for 28–30 is enormous relative to the gain." },
  { range: "HQ 27", label: "Competitive sweet spot", detail: "With T9 troops, HQ27 is the trap-account sweet spot. Do not rush past without strong combat research in place." },
  { range: "HQ 30", label: "Major milestone", detail: "Unlocks T10 troop research prerequisites (requires Lab/Barracks/Camps all Lv30). Steel becomes required. Pause extensively before pushing to 31." },
  { range: "HQ 31–35", label: "Endgame grind", detail: "Months per level unbuffed. Prepare large steel stockpiles before beginning any of these upgrades." },
];

const RESEARCH_ORDER = [
  { name: "New Home, Shelter Building, HQ Management, Rapid Growth", cost: "No badges", note: "Do these first always — zero badge cost, permanent quality-of-life gains." },
  { name: "Elite Troops", cost: "No badges", note: "No badge cost. Unlocks higher troop tiers. Do alongside the above." },
  { name: "Hero Training → Cockpit only", cost: "Low badges", note: "Stop at Cockpit. Nodes beyond Cockpit have poor badge-to-power ratio — do not go deeper." },
  { name: "Military Strategies", cost: "Medium badges", note: "Core ATK/DEF/HP bonuses for all troop types. Essential foundation for all combat research." },
  { name: "Peace Shield → Urgent Rescue", cost: "Medium badges", note: "Urgent Rescue reduces permanent troop deaths by up to 20% in PvP. Critical survivability unlock." },
  { name: "Siege to Seize + Recharge Shield", cost: "High badges", note: "Combined with Peace Shield provides 35–40% extra troop HP. Major late-game power spike." },
  { name: "Field Research", cost: "~594,000 badges total", note: "First 11 nodes (~183,000 badges) unlock before the rest. Complete those first, then reassess." },
  { name: "Unit Special Training (T10)", cost: "~1,488,100 badges", note: "~500 days at standard F2P badge income. Long-term target — use the T10 Calculator to track progress." },
];

const SHIELD_RULES = [
  { rule: "Shield when offline during high-risk windows", detail: "Enemy Buster, cross-state battles, State Ruler event periods. Your alliance chat will warn you." },
  { rule: "Shield when holding excess resources", detail: "If you are above your Warehouse protection limit and cannot spend it on an upgrade, shield." },
  { rule: "Check Alliance Shop first", detail: "8-hour and 24-hour shields available with alliance points (free). Always check here before using diamonds." },
  { rule: "Spend resources before logging off", detail: "Queue a long upgrade that consumes your food and wood surplus. Upgrades cannot be raided — hoarded resources can." },
  { rule: "Keep 2,000 diamonds on Friday", detail: "As a fallback if Alliance Shop shields sell out before the weekend." },
  { rule: "Do not shield reflexively", detail: "Resources below Warehouse capacity cannot be raided at all. No shield needed unless you are genuinely exposed." },
];

const MISTAKES = [
  {
    category: "Building",
    items: [
      "Upgrading resource production buildings (Farmhouse, Lumberyard, etc.) — even maxed, output is negligible relative to progression needs.",
      "Pushing camps to level 28–30 early — research requirements for those levels are enormous. Stop at 27 until HQ demands it.",
      "Upgrading non-prerequisite buildings — anything not on the HQ prerequisite chain wastes construction time.",
      "Not mapping the next 3 HQ prerequisites before using speed-ups — the bottleneck is almost always a prerequisite building, not resources.",
    ],
  },
  {
    category: "Research",
    items: [
      "Rushing Alliance Recognition before combat trees — sets you back 2–3 months in power. Get 9 chests worth, then shift to combat trees.",
      "Going past Cockpit in Hero Training — nodes beyond Cockpit have high cost and diminishing returns.",
      "Spreading badges across multiple troop types in Unit Special Training — focus on one troop type completely before starting another.",
      "Opening Dual Mastery Supply Boxes daily — batch all boxes and open monthly for statistically better outcomes.",
    ],
  },
  {
    category: "Heroes",
    items: [
      "Upgrading too many heroes — a tight core 5 consistently outperforms a spread roster at the same progression level.",
      "Pushing secondary heroes past 4 stars — stop at 4 unless they are core to your formation.",
      "Not matching troop type to hero bonuses — mismatched deployment leaves significant combat power unused.",
      "Switching faction mid-game — Unit Special Training investment is troop-type specific and cannot be transferred.",
    ],
  },
  {
    category: "Economy",
    items: [
      "Buying speed-ups from VIP shop — use diamonds for licenses, builders, and Lucky Discounter instead.",
      "Spending merit medals outside State Ruler — medals saved for State Ruler return far higher value.",
      "Staying in an inactive alliance — missing Explore Treasure, construction help, and tech buffs is one of the largest hidden losses for F2P.",
      "Not keeping 2,000 diamonds on Fridays — raided resources can erase weeks of work.",
    ],
  },
];

const MILESTONES = [
  {
    label: "Month 1",
    color: "border-slate-700/60 bg-slate-900/20",
    items: [
      "HQ18 completed in first 1–2 days (fast phase)",
      "HQ18–22 over the remainder of the month",
      "No-badge growth research complete (New Home, Shelter Building, HQ Management, Rapid Growth)",
      "Elite Troops research started",
      "2nd builder acquired (highest-priority diamond spend)",
      "Active alliance joined — construction help established",
      "Daily checklist consistent",
    ],
  },
  {
    label: "Month 2–3",
    color: "border-blue-800/40 bg-blue-900/10",
    items: [
      "HQ22–25 range (~333M food + wood required for HQ25)",
      "Hero Training at Cockpit; Military Strategies underway",
      "Alliance Recognition at 9-chest unlock level",
      "Core 5-hero faction committed — all resources concentrated",
      "First Lucky Discounter cycle completed",
      "Camps at 20–24 (prerequisite-driven only)",
      "200,000+ badges/month consistently",
    ],
  },
  {
    label: "Month 4–6",
    color: "border-purple-800/40 bg-purple-900/10",
    items: [
      "HQ27–28 range (HQ30 requires ~1.4B resources)",
      "Peace Shield / Siege to Seize research active",
      "Main formation heroes at 5 stars minimum",
      "T7 or T8 troops unlocked on primary troop type",
      "Steel management in place for future HQ30 push",
      "Alliance Recognition providing doubled Alliance Duel rewards",
      "200,000–280,000+ badges/month with full event participation",
    ],
  },
  {
    label: "Month 6+",
    color: "border-amber-800/40 bg-amber-900/10",
    items: [
      "HQ30 push begins — the primary medium-term milestone",
      "T10 research started (~500 days at standard badge rate)",
      "Recharge Shield research active (+50% Troop HP)",
      "HQ31–35 is endgame — months per level",
    ],
  },
];

const ALLIANCE_TIPS = [
  "A 60%+ login rate within 48 hours is more diagnostic than total member count.",
  "Top 5–10 server ranking controls premium territory and event bonuses.",
  "Check alliance technology advancement — reflects member investment quality.",
  "Active R5 leadership with event coordination (Alliance Duel saves, SVS calls).",
  "Do not hesitate to leave an inactive alliance — the daily compounding loss from missing Explore Treasure and construction help is enormous.",
];

export default function F2PGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <Link href="/guide" className="hover:text-purple-200 transition-colors">
          Guide
        </Link>
        <span>›</span>
        <span className="text-purple-200">F2P Progression</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        Last Z F2P Progression Guide
      </h1>
      <p className="mt-2 text-purple-200/80">
        Diamond management, daily routine, HQ vs research balance, and the mistakes that cost F2P players months of progress.
      </p>

      {/* Diamond Management */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Diamond Management</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          F2P players earn ~20,000–40,000 diamonds/month from all free sources. Every diamond matters.
        </p>

        <h3 className="mt-5 font-semibold text-white">What to buy — in priority order</h3>
        <div className="mt-3 space-y-2">
          {DIAMOND_BUY.map((d, i) => (
            <div key={d.item} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{d.item}</p>
                <p className="mt-0.5 text-xs text-purple-300/80">{d.note}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-5 font-semibold text-red-300">Never buy with diamonds</h3>
        <ul className="mt-2 space-y-1.5">
          {DIAMOND_NEVER.map((n) => (
            <li key={n} className="flex items-start gap-2 text-sm text-red-200/80">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              {n}
            </li>
          ))}
        </ul>

        <h3 className="mt-5 font-semibold text-white">Free diamond sources</h3>
        <div className="mt-3 overflow-hidden rounded-xl border border-purple-800/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-800/40 bg-purple-900/40">
                <th className="px-4 py-2 text-left text-xs font-semibold text-purple-300">Source</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-purple-300">Est. monthly</th>
              </tr>
            </thead>
            <tbody>
              {DIAMOND_INCOME.map((d, i) => (
                <tr key={d.source} className={`border-b border-purple-900/30 ${i % 2 === 0 ? "bg-purple-950/20" : "bg-purple-900/10"}`}>
                  <td className="px-4 py-2 text-purple-100/90">{d.source}</td>
                  <td className="px-4 py-2 font-mono text-xs text-amber-400">{d.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Daily Checklist */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Daily Checklist</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          ~20–30 minutes/day. Completing this list automatically satisfies daily task requirements.
        </p>
        <div className="mt-4 space-y-2">
          {DAILY_CHECKLIST.map((c, i) => (
            <div key={c.task} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{c.task}</p>
                <p className="mt-0.5 text-xs text-purple-300/80">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HQ vs Research */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">HQ Rush vs Research Balance</h2>
        <div className="mt-3 rounded-xl border border-blue-800/40 bg-blue-900/10 p-4 text-sm text-blue-100/80">
          <strong className="text-white">Core principle:</strong> Always have something in the Laboratory. Only upgrade buildings that are prerequisites for your next HQ level. Never upgrade resource production buildings — their output is negligible.
        </div>

        <h3 className="mt-5 font-semibold text-white">HQ level checkpoints</h3>
        <div className="mt-3 space-y-2">
          {HQ_CHECKPOINTS.map((c) => (
            <div key={c.range} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <div className="shrink-0 text-center">
                <p className="text-xs font-mono font-bold text-amber-400">{c.range}</p>
                <p className="text-xs text-purple-400">{c.label}</p>
              </div>
              <p className="text-sm text-purple-100/90">{c.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-5 font-semibold text-white">Research priority order</h3>
        <div className="mt-3 space-y-2">
          {RESEARCH_ORDER.map((r, i) => (
            <div key={r.name} className="flex items-start gap-3 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <span className="text-xs font-mono text-amber-400">{r.cost}</span>
                </div>
                <p className="mt-0.5 text-xs text-purple-300/80">{r.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/research" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Research Trees →
          </Link>
          <Link href="/calc/t10" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            T10 Research Calculator →
          </Link>
        </div>
      </section>

      {/* Shield Strategy */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Shield Strategy</h2>
        <div className="mt-4 space-y-2">
          {SHIELD_RULES.map((s) => (
            <div key={s.rule} className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-4">
              <p className="text-sm font-semibold text-white">{s.rule}</p>
              <p className="mt-1 text-xs text-purple-300/80">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Common Mistakes</h2>
        <p className="mt-1 text-sm text-purple-200/80">Each of these can set an account back by weeks or months.</p>
        <div className="mt-4 space-y-4">
          {MISTAKES.map((m) => (
            <div key={m.category} className="rounded-xl border border-red-800/40 bg-red-900/10 p-4">
              <p className="text-sm font-semibold text-red-300">{m.category}</p>
              <ul className="mt-2 space-y-1.5">
                {m.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-red-100/80">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Milestones */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Monthly Milestones</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Timelines vary by alliance quality, event participation, and play frequency. Use these as benchmarks, not deadlines.
        </p>
        <div className="mt-4 space-y-3">
          {MILESTONES.map((m) => (
            <div key={m.label} className={`rounded-xl border p-4 ${m.color}`}>
              <p className="font-semibold text-white">{m.label}</p>
              <ul className="mt-2 space-y-1">
                {m.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-purple-100/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Alliance selection */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Alliance Selection</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Alliance choice is one of the highest-leverage decisions for F2P — construction help, research buffs, Explore Treasure triggers, and weekly events all depend on it.
        </p>
        <ul className="mt-4 space-y-2">
          {ALLIANCE_TIPS.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-purple-700/60 bg-purple-900/20 px-4 py-3 text-sm text-purple-100/90">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 rounded-xl border border-purple-700/40 bg-purple-900/20 p-5">
        <h3 className="font-semibold text-white">Related guides</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/guide/badges" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Badge Farming Guide →
          </Link>
          <Link href="/guide" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Beginner Guide →
          </Link>
          <Link href="/heroes" className="rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white">
            Hero Tier List →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        Data sourced from lastzguides.com, lastzwiki.com, ldshop.gg, lootbar.gg, and community guides. Reflects Season 4 meta. Last updated June 2026.
      </p>
    </div>
  );
}
