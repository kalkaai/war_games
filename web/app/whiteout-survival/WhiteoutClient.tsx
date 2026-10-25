"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import wosData from "@/data/whiteoutSurvival.json";

export type WhiteoutSection =
  | "all"
  | "events"
  | "seasons"
  | "furnace"
  | "research"
  | "heroes"
  | "pets"
  | "gear"
  | "pvp"
  | "codes"
  | "calc";

const furnaceLevels = wosData.furnaceLevels;
const allianceEvents = wosData.allianceEvents;
const svsRotation = wosData.svsPrepRotation;
const seasons = wosData.seasons;
const researchTrees = wosData.researchTrees;
const pets = wosData.pets;
const pvpStrategies = wosData.pvpStrategies;
const ssrHeroes = wosData.ssrHeroes;
const charmLevels = wosData.chiefCharmLevels;
const gearTiers = wosData.chiefGearTiers;
const redeemCodes = wosData.redeemCodes;

const WOS_SECTIONS_GRID = [
  {
    href: "/whiteout-survival/events",
    emoji: "📅",
    title: "Events & SvS",
    description:
      "Bear Hunt, Sunfire Castle, Crazy Joe, Foundry, Canyon Clash, Frostfire Mine & 5-Day SvS Prep rotation with timezone converter.",
  },
  {
    href: "/whiteout-survival/seasons",
    emoji: "🧬",
    title: "Seasons & Gen Timeline",
    description:
      "Complete server age unlock calendar from Gen 1 launch through Fire Crystal Era, War Academy Helios T11, and Gen 8.",
  },
  {
    href: "/whiteout-survival/furnace",
    emoji: "🔥",
    title: "Furnace 1–30 + FC1–FC5",
    description:
      "Full Furnace & Fire Crystal upgrade requirements table with 35 individual level breakdown pages.",
  },
  {
    href: "/whiteout-survival/research",
    emoji: "🔬",
    title: "Research & War Academy",
    description:
      "Growth, Economy, Battle tech priorities and Helios T11 War Academy Fire Crystal Shard & Steel costs.",
  },
  {
    href: "/whiteout-survival/heroes",
    emoji: "🦸",
    title: "Heroes (Gen 1–8)",
    description:
      "27 SSR & SR heroes, mandatory Slot-1 Bear Trap rally joiners (Jessie, Jasser, Reina, Bradley), and Shard/Widget calculator.",
  },
  {
    href: "/whiteout-survival/pets",
    emoji: "🐾",
    title: "Beast Cage Pets",
    description:
      "Gen 1–5 Pets (Cave Hyena, Titan Roc, Snow Leopard, Cave Lion, Saber-tooth Tiger) active skills & cooldown guide.",
  },
  {
    href: "/whiteout-survival/gear",
    emoji: "⚔️",
    title: "Chief Gear & Charms",
    description:
      "Chief Gear (Green → Red T3 Lunar Amber) and Chief Charms (Lv. 1–16 Jewel Secrets) planners.",
  },
  {
    href: "/whiteout-survival/pvp",
    emoji: "🛡️",
    title: "PvP & Rally Meta",
    description:
      "Sunfire double-rally timing, 50/20/30 vs 60/40/0 troop formations, and Garrison Hero Swap tactics.",
  },
  {
    href: "/whiteout-survival/calc",
    emoji: "📊",
    title: "All Calculators",
    description:
      "Furnace & Fire Crystal, Chief Charms, Chief Gear, SSR Hero Shards & Exclusive Widgets — all client-side.",
  },
] as const;

// Cumulative SSR Hero Shard costs (0★ -> 5★)
const WOS_HERO_STAR_SHARDS = [
  { star: 0, shards: 0, label: "0★ (Unlocked — 10 Shards)" },
  { star: 1, shards: 10, label: "1★ (10 Shards)" },
  { star: 2, shards: 50, label: "2★ (50 Cumulative)" },
  { star: 3, shards: 165, label: "3★ (165 Cumulative)" },
  { star: 4, shards: 465, label: "4★ (465 Cumulative — Max Skills)" },
  { star: 5, shards: 1065, label: "5★ (1,065 Cumulative — Max Stats)" },
];

// Cumulative Exclusive Gear Widget costs (Lv. 0 -> Lv. 10: 5+10+15+20+25+30+35+40+45+50 = 275 Widgets)
function calcWidgetCost(fromLv: number, toLv: number): number {
  let sum = 0;
  for (let lv = fromLv + 1; lv <= toLv; lv++) {
    sum += lv * 5;
  }
  return sum;
}

function fmt(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function fmtTime(mins: number): string {
  if (mins === 0) return "Instant";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

function utcToLocal(utcTime: string, offsetMinutes: number): string {
  const [h, m] = utcTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + offsetMinutes;
  const localH = (((totalMinutes / 60) % 24) + 24) % 24;
  const localM = ((totalMinutes % 60) + 60) % 60;
  return `${String(Math.floor(localH)).padStart(2, "0")}:${String(localM).padStart(2, "0")}`;
}

export default function WhiteoutClient({
  section = "all",
}: {
  section?: WhiteoutSection;
}) {
  const [offsetHours, setOffsetHours] = useState<number>(0);
  const [fromLevel, setFromLevel] = useState<number>(25);
  const [toLevel, setToLevel] = useState<number>(30);
  const [ownedFireCrystals, setOwnedFireCrystals] = useState<string>("0");
  const [genFilter, setGenFilter] = useState<string>("all");
  const [troopFilter, setTroopFilter] = useState<string>("all");

  // Chief Charm Calculator state (Lv. 1–16 across 1–18 slots)
  const [charmFrom, setCharmFrom] = useState<number>(3);
  const [charmTo, setCharmTo] = useState<number>(11);
  const [charmSlots, setCharmSlots] = useState<number>(18);

  // Chief Gear Calculator state (Green T1 to Red T3 across 1–6 pieces)
  const [gearFrom, setGearFrom] = useState<number>(3);
  const [gearTo, setGearTo] = useState<number>(8);
  const [gearPieces, setGearPieces] = useState<number>(6);

  // SSR Hero Shard & Exclusive Widget Calculator
  const [heroStarFrom, setHeroStarFrom] = useState<number>(0);
  const [heroStarTo, setHeroStarTo] = useState<number>(4);
  const [widgetFrom, setWidgetFrom] = useState<number>(0);
  const [widgetTo, setWidgetTo] = useState<number>(6);

  useEffect(() => {
    const browserOffsetHrs = Math.round(-new Date().getTimezoneOffset() / 60);
    setOffsetHours(browserOffsetHrs);
  }, []);

  const slice = furnaceLevels.filter(
    (f) => f.level > fromLevel && f.level <= toLevel
  );
  const totals = slice.reduce(
    (acc, f) => ({
      meat: acc.meat + f.meat,
      wood: acc.wood + f.wood,
      coal: acc.coal + f.coal,
      iron: acc.iron + f.iron,
      fc: acc.fc + f.fireCrystals,
      mins: acc.mins + f.buildTimeMinutes,
    }),
    { meat: 0, wood: 0, coal: 0, iron: 0, fc: 0, mins: 0 }
  );

  const ownedFcNum = Math.max(0, parseInt(ownedFireCrystals || "0", 10) || 0);
  const fcDeficit = Math.max(0, totals.fc - ownedFcNum);

  // Chief Charm delta calculation
  const charmStartObj = charmLevels.find((c) => c.level === charmFrom) ?? charmLevels[0];
  const charmEndObj = charmLevels.find((c) => c.level === charmTo) ?? charmLevels[charmLevels.length - 1];
  const charmDesignsNeeded = Math.max(0, charmEndObj.designs - charmStartObj.designs) * charmSlots;
  const charmGuidesNeeded = Math.max(0, charmEndObj.guides - charmStartObj.guides) * charmSlots;
  const charmSecretsNeeded = Math.max(0, charmEndObj.secrets - charmStartObj.secrets) * charmSlots;
  const charmPowerGain = Math.max(0, charmEndObj.power - charmStartObj.power) * charmSlots;

  // Chief Gear delta calculation
  const gearStartObj = gearTiers.find((g) => g.tier === gearFrom) ?? gearTiers[0];
  const gearEndObj = gearTiers.find((g) => g.tier === gearTo) ?? gearTiers[gearTiers.length - 1];
  const gearAlloyNeeded = Math.max(0, gearEndObj.alloy - gearStartObj.alloy) * gearPieces;
  const gearSolutionNeeded = Math.max(0, gearEndObj.solution - gearStartObj.solution) * gearPieces;
  const gearPlansNeeded = Math.max(0, gearEndObj.plans - gearStartObj.plans) * gearPieces;
  const gearAmberNeeded = Math.max(0, gearEndObj.amber - gearStartObj.amber) * gearPieces;

  // Hero Shards & Widget calculation
  const heroShardsNeeded = Math.max(
    0,
    (WOS_HERO_STAR_SHARDS[heroStarTo]?.shards ?? 0) -
      (WOS_HERO_STAR_SHARDS[heroStarFrom]?.shards ?? 0)
  );
  const widgetsNeeded = calcWidgetCost(widgetFrom, widgetTo);

  const filteredHeroes = ssrHeroes.filter((h) => {
    const matchGen = genFilter === "all" || h.gen.startsWith(genFilter);
    const matchTroop = troopFilter === "all" || h.type === troopFilter;
    return matchGen && matchTroop;
  });

  const isOverview = section === "all";
  const showEvents = isOverview || section === "events";
  const showSeasons = section === "seasons";
  const showFurnace = section === "furnace";
  const showResearch = section === "research";
  const showHeroes = section === "heroes";
  const showPets = section === "pets";
  const showGear = section === "gear";
  const showPvp = section === "pvp";
  const showCodes = isOverview || section === "codes";
  const showCalc = isOverview || section === "calc";

  return (
    <div className="space-y-8">
      {/* Overview Section Directory Grid (same setup as Last Z home page, fast LCP) */}
      {isOverview && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              ❄️ Explore Whiteout Survival Tools &amp; Databases
            </h2>
            <span className="text-xs text-purple-300">
              10 Dedicated Modules
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WOS_SECTIONS_GRID.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-xl border border-purple-700/60 bg-purple-800/40 p-5 transition-all duration-200 hover:border-purple-500 hover:bg-purple-900/70"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{card.emoji}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-200">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-purple-200/80">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 1. Alliance Event Scheduler & Bear Hunt / Sunfire Tracker */}
      {showEvents && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                ❄️ Whiteout Survival Event Scheduler &amp; Timezone Converter
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Convert Bear Hunt, Sunfire Castle, Crazy Joe, Foundry Battle,
                Canyon Clash, and Frostfire Mine UTC windows into your local time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="wos-tz-select"
                className="text-xs font-medium text-purple-200"
              >
                Your Timezone:
              </label>
              <select
                id="wos-tz-select"
                value={offsetHours}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setOffsetHours(v);
                  sendGAEvent("event", "wos_tz_change", { offset: v });
                }}
                className="rounded-md border border-purple-700 bg-purple-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 27 }, (_, i) => i - 12).map((hr) => (
                  <option key={hr} value={hr}>
                    UTC{hr >= 0 ? `+${hr}` : hr}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {(isOverview ? allianceEvents.slice(0, 4) : allianceEvents).map((ev) => (
              <div
                key={ev.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{ev.name}</h3>
                  <span className="rounded bg-purple-800/70 px-2 py-0.5 text-[11px] text-purple-200">
                    {ev.cadence}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {ev.utcTimes.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-purple-600/50 bg-purple-900/50 px-2.5 py-1 font-mono text-xs font-bold text-white"
                    >
                      {t} UTC → {utcToLocal(t, offsetHours * 60)} Local
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-xs text-purple-200/85">
                  <strong>🎁 Key Rewards:</strong> {ev.keyRewards}
                </p>
                <p className="mt-1.5 text-xs text-amber-300/90">
                  <strong>💡 Strategy:</strong> {ev.strategyTip}
                </p>
              </div>
            ))}
          </div>

          {isOverview && (
            <div className="mt-4 text-right">
              <Link
                href="/whiteout-survival/events"
                className="text-xs font-bold text-purple-300 underline hover:text-white"
              >
                View all 8 events (Canyon Clash, Frostfire Mine, Mercenary Prestige) →
              </Link>
            </div>
          )}

          {/* SvS / Hall of Chiefs 5-Day Prep Table */}
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-purple-300">
            State of Power (SvS) &amp; Hall of Chiefs Prep Rotation
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
            {svsRotation.map((d) => (
              <div
                key={d.day}
                className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-3"
              >
                <span className="text-[11px] font-bold uppercase text-purple-400">
                  Day {d.day}
                </span>
                <p className="mt-0.5 text-sm font-bold text-white">{d.name}</p>
                <p className="mt-1 text-xs text-purple-200/80">{d.focus}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Server Age & Hero Generation Seasons Timeline */}
      {showSeasons && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🧬 Whiteout Survival Server Age &amp; Generation Unlock Timeline (Gen 1–8)
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Whiteout Survival progresses by Server Age (days since State launch).
            Track when each Hero Generation, Fire Crystal tier, Pet wave, and
            War Academy Helios T11 unlocks.
          </p>

          <div className="mt-5 space-y-4">
            {seasons.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{s.era}</h3>
                  <span className="rounded-full bg-purple-800/70 px-3 py-0.5 text-xs font-semibold text-amber-300">
                    ⏱ {s.unlockWindow}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-purple-900/30 p-3">
                    <p className="text-[11px] font-bold uppercase text-purple-300">
                      🦸 Hero Unlocks
                    </p>
                    <p className="mt-1 text-xs text-white">
                      {s.heroes.join(" · ")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-900/30 p-3">
                    <p className="text-[11px] font-bold uppercase text-purple-300">
                      🏰 Buildings &amp; Systems Unlocked
                    </p>
                    <p className="mt-1 text-xs text-white">
                      {s.buildingsAndSystems.join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-amber-300/95">
                  <strong>📦 Hoarding &amp; F2P Priority:</strong>{" "}
                  {s.hoardingPriority}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Research Trees & War Academy Helios T11 Guide */}
      {showResearch && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🔬 Whiteout Survival Research Center &amp; War Academy (Helios T11) Guide
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Complete breakdown of Growth, Economy, Battle tech priorities plus
            exact <strong>Fire Crystal Shard (13,040 per branch)</strong> and{" "}
            <strong>Steel (3.1M)</strong> requirements for Helios T11 troops.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {researchTrees.map((tree) => (
              <div
                key={tree.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tree.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {tree.name}
                      </h3>
                      <p className="text-xs text-purple-300">
                        Unlock: {tree.unlock}
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-purple-800/80 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                    {tree.priority}
                  </span>
                </div>

                {"fcShardsTotal" in tree && tree.fcShardsTotal && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 font-mono font-bold text-amber-300">
                      🔥 {tree.fcShardsTotal.toLocaleString()} FC Shards
                    </span>
                    <span className="rounded bg-purple-900/60 border border-purple-700/60 px-2.5 py-1 font-mono font-bold text-white">
                      ⚙️ {fmt(tree.steelTotal ?? 0)} Steel
                    </span>
                  </div>
                )}

                <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-purple-200">
                  {tree.keyNodes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-purple-200/85">{tree.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Beast Cage Pets Database (Gen 1–5) */}
      {showPets && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🐾 Beast Cage Pets Guide &amp; Active Skill Cooldowns (Gen 1–5)
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Unlocked at Furnace Lv. 18 (Server Day 55). Upgrade combat pets on{" "}
            <strong>SvS Prep Day 3</strong> using Pet Food, Taming Manuals,
            Energizing Potions, and Strengthening Serums.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-purple-300">
                      {p.gen} · {p.role}
                    </p>
                  </div>
                  <span className="rounded bg-purple-800 px-2 py-0.5 text-xs font-bold text-amber-300">
                    {p.rarity}
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-emerald-300">
                  <strong>⚡ Active Skill ({p.cooldown}):</strong> {p.skill}
                </p>
                <p className="mt-2 text-xs text-purple-200/85">{p.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. PvP, Sunfire Castle & Rally Formation Guide */}
      {showPvp && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🛡️ Whiteout Survival PvP, Sunfire Castle &amp; Bear Rally Meta Guide
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Master the Slot-1 Rally Joiner mechanic, Double-Rally timing,
            Garrison Captain swaps, and optimal Infantry/Lancer/Marksman ratios.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {pvpStrategies.map((st) => (
              <div
                key={st.title}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-purple-300">
                    {st.category}
                  </span>
                  <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                    {st.badge}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-purple-200/90">
                  {st.details}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Calculators: Furnace + FC, Chief Charms, Chief Gear, Hero Shards & Widgets */}
      {(showCalc || showGear || showHeroes) && (
        <div className="space-y-8">
          {showCalc && (
            <section
              id="furnace-calc"
              className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6"
            >
              <h2 className="text-xl font-bold text-white">
                🔥 Furnace &amp; Fire Crystal Upgrade Calculator (Lv. 1–30 + FC1–FC5)
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Calculate exact Meat, Wood, Coal, Iron, Fire Crystals, and Speed-ups
                needed between any two Furnace levels.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="wos-from-level"
                    className="block text-xs text-purple-300"
                  >
                    Current Furnace Level
                  </label>
                  <select
                    id="wos-from-level"
                    value={fromLevel}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFromLevel(v);
                      if (toLevel <= v) setToLevel(Math.min(35, v + 1));
                    }}
                    className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {furnaceLevels.slice(0, -1).map((f) => (
                      <option key={f.level} value={f.level}>
                        Furnace {f.label} ({f.unlock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wos-to-level"
                    className="block text-xs text-purple-300"
                  >
                    Target Furnace Level
                  </label>
                  <select
                    id="wos-to-level"
                    value={toLevel}
                    onChange={(e) => setToLevel(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {furnaceLevels
                      .filter((f) => f.level > fromLevel)
                      .map((f) => (
                        <option key={f.level} value={f.level}>
                          Furnace {f.label} ({f.unlock})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wos-owned-fc"
                    className="block text-xs text-purple-300"
                  >
                    Fire Crystals Owned (for FC1–FC5)
                  </label>
                  <input
                    id="wos-owned-fc"
                    type="number"
                    min={0}
                    value={ownedFireCrystals}
                    onChange={(e) => setOwnedFireCrystals(e.target.value)}
                    className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-purple-300">🥩 Meat</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-white">
                    {fmt(totals.meat)}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-purple-300">🪵 Wood</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-white">
                    {fmt(totals.wood)}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-purple-300">🪨 Coal</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-white">
                    {fmt(totals.coal)}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-purple-300">⛏️ Iron</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-white">
                    {fmt(totals.iron)}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-amber-300">🔥 Fire Crystals</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-amber-300">
                    {totals.fc > 0 ? totals.fc.toLocaleString() : "—"}
                  </p>
                  {totals.fc > 0 && (
                    <p className="text-[10px] text-purple-300">
                      {fcDeficit === 0 ? "✅ Ready" : `Need ${fcDeficit} more`}
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-purple-950/60 p-3.5">
                  <p className="text-xs text-purple-300">⏱️ Base Build Time</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-white">
                    {fmtTime(totals.mins)}
                  </p>
                  <p className="text-[10px] text-purple-300">
                    {Math.ceil(totals.mins / 60).toLocaleString()}h speed-ups
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Chief Charms & Chief Gear Calculators (shown on /calc and /gear) */}
          {(section === "calc" || showGear) && (
            <>
              <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      💎 Chief Charms Calculator (Levels 1–16 · Up to 18 Slots)
                    </h2>
                    <p className="mt-1 text-xs text-purple-300">
                      Unlocked at Furnace Lv. 25. Calculate exact{" "}
                      <strong>Charm Designs</strong>, <strong>Charm Guides</strong>,
                      and <strong>Jewel Secrets</strong> (Lv. 12–16) for SvS Day 1
                      &amp; Day 3.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                    💡 Lv. 11 unlocks Charm Material Exchange!
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="wos-charm-from"
                      className="block text-xs text-purple-300"
                    >
                      Current Charm Level
                    </label>
                    <select
                      id="wos-charm-from"
                      value={charmFrom}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCharmFrom(v);
                        if (charmTo <= v) setCharmTo(Math.min(16, v + 1));
                      }}
                      className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                    >
                      {charmLevels.slice(0, -1).map((c) => (
                        <option key={c.level} value={c.level}>
                          Charm Lv. {c.level} (+{c.statPct}% Lethality/HP)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="wos-charm-to"
                      className="block text-xs text-purple-300"
                    >
                      Target Charm Level
                    </label>
                    <select
                      id="wos-charm-to"
                      value={charmTo}
                      onChange={(e) => setCharmTo(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
                    >
                      {charmLevels
                        .filter((c) => c.level > charmFrom)
                        .map((c) => (
                          <option key={c.level} value={c.level}>
                            Charm Lv. {c.level} (+{c.statPct}% Lethality/HP)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="wos-charm-slots"
                      className="block text-xs text-purple-300"
                    >
                      Number of Charm Slots (1–18)
                    </label>
                    <select
                      id="wos-charm-slots"
                      value={charmSlots}
                      onChange={(e) => setCharmSlots(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                    >
                      {[1, 3, 6, 9, 12, 18].map((n) => (
                        <option key={n} value={n}>
                          {n}{" "}
                          {n === 1
                            ? "Charm"
                            : n === 3
                            ? "Charms (1 Gear Piece)"
                            : n === 6
                            ? "Charms (1 Troop Type)"
                            : n === 18
                            ? "Charms (Full 6-Gear Set)"
                            : "Charms"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-purple-300">📐 Charm Designs</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-white">
                      {charmDesignsNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-purple-300">📘 Charm Guides</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-white">
                      {charmGuidesNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-amber-300">💠 Jewel Secrets (Lv.12+)</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-amber-300">
                      {charmSecretsNeeded > 0
                        ? charmSecretsNeeded.toLocaleString()
                        : "0"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-emerald-300">⚡ Total Power Gain</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-emerald-300">
                      +{fmt(charmPowerGain)}
                    </p>
                    <p className="text-[11px] text-purple-300">
                      +{charmEndObj.statPct - charmStartObj.statPct}% per slot
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
                <h2 className="text-xl font-bold text-white">
                  🛡️ Chief Gear Calculator (Hardened Alloy, Polishing Solution, Design Plans &amp; Lunar Amber)
                </h2>
                <p className="mt-1 text-xs text-purple-300">
                  Unlocked at Furnace Lv. 22. Plan your 3-piece and 6-piece set
                  bonuses across Coat, Pants, Belt, Weapon, Cap, and Watch.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="wos-gear-from"
                      className="block text-xs text-purple-300"
                    >
                      Current Gear Tier
                    </label>
                    <select
                      id="wos-gear-from"
                      value={gearFrom}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setGearFrom(v);
                        if (gearTo <= v) setGearTo(Math.min(11, v + 1));
                      }}
                      className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                    >
                      {gearTiers.slice(0, -1).map((g) => (
                        <option key={g.tier} value={g.tier}>
                          {g.label} (+{g.statPct}% ATK/DEF)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="wos-gear-to"
                      className="block text-xs text-purple-300"
                    >
                      Target Gear Tier
                    </label>
                    <select
                      id="wos-gear-to"
                      value={gearTo}
                      onChange={(e) => setGearTo(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
                    >
                      {gearTiers
                        .filter((g) => g.tier > gearFrom)
                        .map((g) => (
                          <option key={g.tier} value={g.tier}>
                            {g.label} (+{g.statPct}% ATK/DEF)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="wos-gear-pieces"
                      className="block text-xs text-purple-300"
                    >
                      Gear Pieces to Upgrade (1–6)
                    </label>
                    <select
                      id="wos-gear-pieces"
                      value={gearPieces}
                      onChange={(e) => setGearPieces(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                    >
                      {[1, 2, 3, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}{" "}
                          {n === 1
                            ? "Piece"
                            : n === 2
                            ? "Pieces (1 Troop Type)"
                            : n === 3
                            ? "Pieces (3-Piece Set Bonus)"
                            : "Pieces (Full 6-Piece Set)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-purple-300">🔩 Hardened Alloy</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-white">
                      {gearAlloyNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-purple-300">🧪 Polishing Solution</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-white">
                      {gearSolutionNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-amber-300">📜 Design Plans</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-amber-300">
                      {gearPlansNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-950/60 p-4">
                    <p className="text-xs text-rose-300">🔴 Lunar Amber (Red Tier)</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-rose-300">
                      {gearAmberNeeded > 0 ? gearAmberNeeded.toLocaleString() : "0"}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* SSR Hero Shard & Exclusive Widget Calculator (shown on /calc and /heroes) */}
          {(section === "calc" || showHeroes) && (
            <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
              <h2 className="text-xl font-bold text-white">
                🧩 SSR Hero Shard (0★–5★) &amp; Exclusive Gear Widget (Lv. 1–10) Calculator
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                4★ (465 total shards) unlocks Level 5 Expedition skills; 5★
                requires 600 additional shards (1,065 total). Exclusive Gear
                Widgets scale 5 → 50 per level (275 total for Lv. 10).
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label
                    htmlFor="wos-star-from"
                    className="block text-xs text-purple-300"
                  >
                    Current Hero Star Tier
                  </label>
                  <select
                    id="wos-star-from"
                    value={heroStarFrom}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setHeroStarFrom(v);
                      if (heroStarTo <= v) setHeroStarTo(Math.min(5, v + 1));
                    }}
                    className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                  >
                    {WOS_HERO_STAR_SHARDS.slice(0, -1).map((s) => (
                      <option key={s.star} value={s.star}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wos-star-to"
                    className="block text-xs text-purple-300"
                  >
                    Target Hero Star Tier
                  </label>
                  <select
                    id="wos-star-to"
                    value={heroStarTo}
                    onChange={(e) => setHeroStarTo(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
                  >
                    {WOS_HERO_STAR_SHARDS.filter((s) => s.star > heroStarFrom).map(
                      (s) => (
                        <option key={s.star} value={s.star}>
                          {s.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wos-widget-from"
                    className="block text-xs text-purple-300"
                  >
                    Current Exclusive Widget Lv.
                  </label>
                  <select
                    id="wos-widget-from"
                    value={widgetFrom}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setWidgetFrom(v);
                      if (widgetTo <= v) setWidgetTo(Math.min(10, v + 2));
                    }}
                    className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
                  >
                    {[0, 1, 2, 4, 6, 8].map((lv) => (
                      <option key={lv} value={lv}>
                        {lv === 0 ? "Locked (Lv. 0)" : `Widget Lv. ${lv}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="wos-widget-to"
                    className="block text-xs text-purple-300"
                  >
                    Target Exclusive Widget Lv.
                  </label>
                  <select
                    id="wos-widget-to"
                    value={widgetTo}
                    onChange={(e) => setWidgetTo(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
                  >
                    {[1, 2, 4, 6, 8, 10]
                      .filter((lv) => lv > widgetFrom)
                      .map((lv) => (
                        <option key={lv} value={lv}>
                          Widget Lv. {lv}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-purple-950/60 p-4">
                  <p className="text-xs text-purple-300">
                    🧩 Mythic Hero Shards ({heroStarFrom}★ → {heroStarTo}★)
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                    {heroShardsNeeded.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-purple-300">
                    Save for SvS Prep Day 2 for maximum points
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-4">
                  <p className="text-xs text-amber-300">
                    ⚔️ Exclusive Widgets (Lv.{widgetFrom} → Lv.{widgetTo})
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-amber-300">
                    {widgetsNeeded.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-purple-300">
                    Farm via Mystery Shop (50% off badges) &amp; Frosty Fortune
                  </p>
                </div>
                <div className="rounded-lg bg-purple-950/60 p-4">
                  <p className="text-xs text-emerald-300">🎯 Lucky Wheel Gem Cost</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-emerald-300">
                    162,000 Gems / 120 Spins
                  </p>
                  <p className="text-[11px] text-purple-300">
                    Always stop at the 35, 70, or 120 spin milestone chests!
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* 7. SSR & SR Heroes Database (Gen 1–8) */}
      {showHeroes && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                🦸 Whiteout Survival Heroes Database &amp; Bear Trap Rally Joiners (Gen 1–8)
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Filter by Generation (Gen 1–8) or Troop Type (Infantry, Lancer,
                Marksman). Includes mandatory SR Slot-1 Rally Joiners.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                "all",
                "Gen 1",
                "Gen 2",
                "Gen 3",
                "Gen 4",
                "Gen 5",
                "Gen 6",
                "Gen 7",
                "Gen 8",
              ].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenFilter(g)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    genFilter === g
                      ? "bg-purple-600 text-white"
                      : "border border-purple-800 bg-purple-950/50 text-purple-300 hover:border-purple-600"
                  }`}
                >
                  {g === "all" ? "All Gens" : g}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {["all", "Infantry", "Lancer", "Marksman"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTroopFilter(t)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  troopFilter === t
                    ? "bg-amber-500 text-black"
                    : "border border-purple-800 bg-purple-950/40 text-purple-300 hover:border-purple-600"
                }`}
              >
                {t === "all" ? `All Troop Types (${ssrHeroes.length})` : t}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHeroes.map((h) => (
              <div
                key={h.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{h.name}</h3>
                    <p className="text-xs text-purple-300">
                      {h.gen} · {h.type}
                    </p>
                  </div>
                  <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-black">
                    {h.tier}
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-purple-200">
                  <strong>🎯 Role:</strong> {h.bearRole}
                </p>
                <p className="mt-1 text-xs text-purple-300">
                  <strong>📦 Source:</strong> {h.acquisition}
                </p>
                <p className="mt-2 text-xs text-purple-200/80">{h.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Full Furnace 1–30 + FC1–FC5 Reference Table */}
      {showFurnace && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🏰 Complete Whiteout Survival Furnace Upgrade Table (Lv. 1–30 + FC1–FC5)
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Click any Furnace level to open its dedicated requirements &amp;
            speed-up breakdown page.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-purple-700/60">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-purple-950">
                <tr className="border-b border-purple-700/60 text-purple-200">
                  <th className="px-3 py-3 text-left font-semibold">Furnace</th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Prerequisite Buildings
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Meat / Wood
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">Coal</th>
                  <th className="px-3 py-3 text-right font-semibold">Iron</th>
                  <th className="px-3 py-3 text-right font-semibold">🔥 FC</th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Build Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {furnaceLevels.map((row) => (
                  <tr key={row.level} className="hover:bg-purple-900/20">
                    <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap">
                      <Link
                        href={`/whiteout-survival/furnace/level-${row.level}-requirements`}
                        className="text-purple-200 underline decoration-purple-600/70 underline-offset-2 hover:text-white"
                      >
                        {row.label}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-purple-200">
                      {row.requiredBuildings.join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200">
                      {fmt(row.meat)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200">
                      {fmt(row.coal)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200">
                      {fmt(row.iron)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-300">
                      {row.fireCrystals > 0
                        ? row.fireCrystals.toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200 whitespace-nowrap">
                      {fmtTime(row.buildTimeMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 9. Whiteout Survival Redeem Codes & Official Gift Center */}
      {showCodes && (
        <section
          className={`rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 ${
            isOverview ? "cv-auto" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">
                🎁 Whiteout Survival Gift Codes &amp; Redemption Portal
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Redeem on iOS &amp; Android via the official Century Games Gift
                Code Center using your 9-digit Chief ID.
              </p>
            </div>
            <a
              href="https://wos-giftcode.centurygame.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Official WoS Gift Code Portal ↗
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {redeemCodes.map((c) => (
              <div
                key={c.code}
                className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <code className="select-all rounded bg-purple-900/70 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                    {c.code}
                  </code>
                  <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                    {c.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-200/85">{c.rewards}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
