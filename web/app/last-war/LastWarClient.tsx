"use client";

import { useState } from "react";
import Link from "next/link";
import lastWarData from "@/data/lastWar.json";

export type LastWarSection =
  | "all"
  | "events"
  | "seasons"
  | "hq"
  | "research"
  | "heroes"
  | "drone"
  | "gear"
  | "pvp"
  | "codes"
  | "calc";

const hqLevels = lastWarData.hqLevels;
const vsSchedule = lastWarData.vsDuelSchedule;
const armsRace = lastWarData.armsRaceWindows;
const majorEvents = lastWarData.majorEvents;
const urHeroes = lastWarData.urHeroes;
const droneMilestones = lastWarData.droneMilestones;
const droneComponents = lastWarData.droneComponents;
const seasons = lastWarData.seasons;
const researchTrees = lastWarData.researchTrees;
const urGearItems = lastWarData.urGearItems;
const pvpStrategies = lastWarData.pvpStrategies;
const redeemCodes = lastWarData.redeemCodes;

const LW_SECTIONS_GRID = [
  {
    href: "/last-war/events",
    emoji: "📅",
    title: "VS Duel & Arms Race",
    description:
      "6-Day VS Alliance Duel schedule, 4-hour Arms Race double-dip windows, Capitol War, Desert Storm & Winter Storm guides.",
  },
  {
    href: "/last-war/seasons",
    emoji: "🧬",
    title: "Seasons 1–4 & Age of Oil",
    description:
      "Crimson Plague (S1), Polar World (S2), Age of Oil (HQ 31–35), Golden Realm (S3), and Evernight Isle (S4) progression.",
  },
  {
    href: "/last-war/hq",
    emoji: "🏰",
    title: "HQ 1–35 (Age of Oil)",
    description:
      "Complete Headquarters 1–35 Iron, Food, Gold & Oil upgrade table with 35 individual level requirement pages.",
  },
  {
    href: "/last-war/research",
    emoji: "🔬",
    title: "Tech Trees & T10 Path",
    description:
      "Alliance Duel (VS), Special Forces T10 (10.3B Gold & 152K Valor Badges), Age of Oil, Units & Hero research trees.",
  },
  {
    href: "/last-war/heroes",
    emoji: "🦸",
    title: "UR Heroes & Weapons",
    description:
      "18 UR & SSR-to-UR heroes across Tank, Aircraft & Missile squads with Exclusive Weapon Lv. 1–30 shard calculator.",
  },
  {
    href: "/last-war/drone",
    emoji: "🛸",
    title: "Tactical Drone & Chips",
    description:
      "Drone Hangar Lv. 10–250 Parts & Battle Data calculator, Right-Side Component priority, and UR Combat Skill Chips.",
  },
  {
    href: "/last-war/gear",
    emoji: "⚔️",
    title: "UR & Mythic Red Gear",
    description:
      "Thor Railgun, Predator Radar, Guardian Armor & Data Chip 1★–5★ Blueprint costs and Mythic Red Gear priority.",
  },
  {
    href: "/last-war/pvp",
    emoji: "🛡️",
    title: "PvP & Counter Triangle",
    description:
      "Tank → Missile → Aircraft (+20% counter triangle), 5-of-a-Kind Squad Aura, and Capitol War zero-loss Wall toggle.",
  },
  {
    href: "/last-war/calc",
    emoji: "📊",
    title: "All Calculators",
    description:
      "HQ 1–35 + Oil, Tactical Drone Parts, UR Hero Shards & Skill Medals, Exclusive Weapons & T10 Special Forces Gold.",
  },
] as const;

const UR_STAR_COSTS = [
  { star: 0, shards: 0, medals: 0 },
  { star: 1, shards: 25, medals: 3000 },
  { star: 2, shards: 75, medals: 11000 },
  { star: 3, shards: 225, medals: 33000 },
  { star: 4, shards: 525, medals: 78000 },
  { star: 5, shards: 975, medals: 163000 },
];

// Exclusive Weapon shards per level (50 specific shards to unlock at Lv.0 -> Lv.1, then tiered per level)
function calcExclusiveWeaponShards(fromLv: number, toLv: number): number {
  let total = 0;
  for (let lv = fromLv + 1; lv <= toLv; lv++) {
    if (lv === 1) total += 50;
    else if (lv <= 5) total += 20;
    else if (lv <= 10) total += 40;
    else if (lv <= 15) total += 60;
    else if (lv <= 20) total += 100;
    else if (lv <= 25) total += 150;
    else total += 200;
  }
  return total;
}

function fmt(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000_000 >= 0.1 ? (n / 1_000_000).toFixed(0) : (n / 1_000_000).toFixed(1))}M`;
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

export default function LastWarClient({
  section = "all",
}: {
  section?: LastWarSection;
}) {
  const [fromHq, setFromHq] = useState<number>(27);
  const [toHq, setToHq] = useState<number>(30);
  const [selectedHero, setSelectedHero] = useState<string>("kimberly");
  const [curStars, setCurStars] = useState<number>(3);
  const [targetStars, setTargetStars] = useState<number>(5);
  const [ownedShards, setOwnedShards] = useState<string>("150");
  const [squadFilter, setSquadFilter] = useState<string>("all");

  // Tactical Drone Parts Calculator state (Lv. 10–250)
  const [droneFrom, setDroneFrom] = useState<number>(50);
  const [droneTo, setDroneTo] = useState<number>(150);

  // Exclusive Weapon Calculator state (Lv. 0 Locked -> Lv. 30)
  const [ewFrom, setEwFrom] = useState<number>(0);
  const [ewTo, setEwTo] = useState<number>(20);

  // T10 Special Forces Progress Calculator state (0% -> 40% Minimum T10 Path)
  const [sfCurPct, setSfCurPct] = useState<number>(15);

  const slice = hqLevels.filter((l) => l.level > fromHq && l.level <= toHq);
  const totals = slice.reduce(
    (acc, l) => ({
      iron: acc.iron + l.iron,
      food: acc.food + l.food,
      gold: acc.gold + l.gold,
      oil: acc.oil + ("oil" in l && typeof l.oil === "number" ? l.oil : 0),
      mins: acc.mins + l.buildTimeMinutes,
    }),
    { iron: 0, food: 0, gold: 0, oil: 0, mins: 0 }
  );

  const startStarObj = UR_STAR_COSTS[curStars];
  const endStarObj = UR_STAR_COSTS[targetStars];
  const shardsNeeded = Math.max(0, endStarObj.shards - startStarObj.shards);
  const medalsNeeded = Math.max(0, endStarObj.medals - startStarObj.medals);
  const ownedShardNum = Math.max(0, parseInt(ownedShards || "0", 10) || 0);
  const shardDeficit = Math.max(0, shardsNeeded - ownedShardNum);

  const droneStartObj =
    droneMilestones.find((d) => d.level === droneFrom) ?? droneMilestones[0];
  const droneEndObj =
    droneMilestones.find((d) => d.level === droneTo) ??
    droneMilestones[droneMilestones.length - 1];
  const dronePartsNeeded = Math.max(
    0,
    droneEndObj.cumulativeParts - droneStartObj.cumulativeParts
  );
  const droneDataNeeded = Math.max(
    0,
    droneEndObj.battleData - droneStartObj.battleData
  );

  const ewShardsNeeded = calcExclusiveWeaponShards(ewFrom, ewTo);

  // T10 Special Forces remaining cost (40% minimum path = 10.3B Gold & 152,000 Valor Badges; back-loaded in bottom 4 nodes)
  const sfRemainingRatio = Math.max(0, (40 - sfCurPct) / 40);
  const sfGoldRemaining = Math.round(10_300_000_000 * Math.pow(sfRemainingRatio, 1.35));
  const sfValorRemaining = Math.round(152_000 * Math.pow(sfRemainingRatio, 1.25));

  const filteredHeroes =
    squadFilter === "all"
      ? urHeroes
      : urHeroes.filter((h) => h.squad === squadFilter);

  const isOverview = section === "all";
  const showEvents = isOverview || section === "events";
  const showSeasons = section === "seasons";
  const showHq = section === "hq";
  const showResearch = section === "research";
  const showHeroes = section === "heroes";
  const showDrone = section === "drone";
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
              🎖️ Explore Last War: Survival Tools &amp; Databases
            </h2>
            <span className="text-xs text-purple-300">
              10 Dedicated Modules
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LW_SECTIONS_GRID.map((card) => (
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

      {/* 1. HQ 1–35 (Age of Oil) Resource & Speed-Up Calculator */}
      {showCalc && (
        <section
          id="hq-calc"
          className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6"
        >
          <h2 className="text-xl font-bold text-white">
            🏰 Last War HQ 1–35 &amp; Age of Oil Resource Calculator
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Calculate total Iron, Food, Gold,{" "}
            <strong className="text-emerald-300">Oil (HQ 31–35)</strong>, and
            Construction Speed-ups required between any two Headquarters levels.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] sm:flex-initial">
              <label
                htmlFor="lw-from-hq"
                className="block text-xs text-purple-300"
              >
                Current HQ Level
              </label>
              <select
                id="lw-from-hq"
                value={fromHq}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFromHq(v);
                  if (toHq <= v) setToHq(Math.min(35, v + 1));
                }}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {hqLevels.slice(0, -1).map((l) => (
                  <option key={l.level} value={l.level}>
                    HQ Lv. {l.level} ({l.unlock})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px] sm:flex-initial">
              <label
                htmlFor="lw-to-hq"
                className="block text-xs text-purple-300"
              >
                Target HQ Level
              </label>
              <select
                id="lw-to-hq"
                value={toHq}
                onChange={(e) => setToHq(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {hqLevels
                  .filter((l) => l.level > fromHq)
                  .map((l) => (
                    <option key={l.level} value={l.level}>
                      HQ Lv. {l.level} ({l.unlock})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">🔩 Iron Required</p>
              <p className="mt-1 font-mono text-lg font-extrabold text-white">
                {fmt(totals.iron)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">🌽 Food Required</p>
              <p className="mt-1 font-mono text-lg font-extrabold text-white">
                {fmt(totals.food)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-amber-300">🪙 Gold Required</p>
              <p className="mt-1 font-mono text-lg font-extrabold text-amber-300">
                {fmt(totals.gold)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-emerald-300">🛢️ Oil (HQ 31–35)</p>
              <p className="mt-1 font-mono text-lg font-extrabold text-emerald-300">
                {totals.oil > 0 ? fmt(totals.oil) : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">⏱️ Base Build Time</p>
              <p className="mt-1 font-mono text-lg font-extrabold text-white">
                {fmtTime(totals.mins)}
              </p>
              <p className="text-[11px] text-purple-300">
                {Math.ceil(totals.mins / 60).toLocaleString()}h speed-ups
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 2. Tactical Drone Parts, Components & Skill Chips (shown on /drone and /calc) */}
      {(section === "calc" || showDrone) && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">
                🛸 Tactical Drone Parts &amp; Battle Data Calculator (Lv. 10–250)
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Levels 1–150 consume Drone Parts every 5 levels. From{" "}
                <strong>Level 151+</strong>, Drone Parts are required at every
                single level!
              </p>
            </div>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
              ⚡ Upgrade on Monday VS Radar &amp; Drone Day!
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] sm:flex-initial">
              <label
                htmlFor="lw-drone-from"
                className="block text-xs text-purple-300"
              >
                Current Drone Milestone
              </label>
              <select
                id="lw-drone-from"
                value={droneFrom}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setDroneFrom(v);
                  if (droneTo <= v) {
                    const nextMilestone =
                      droneMilestones.find((d) => d.level > v)?.level ?? 250;
                    setDroneTo(nextMilestone);
                  }
                }}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              >
                {droneMilestones.slice(0, -1).map((d) => (
                  <option key={d.level} value={d.level}>
                    Drone Lv. {d.level} ({d.unlock})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px] sm:flex-initial">
              <label
                htmlFor="lw-drone-to"
                className="block text-xs text-purple-300"
              >
                Target Drone Milestone
              </label>
              <select
                id="lw-drone-to"
                value={droneTo}
                onChange={(e) => setDroneTo(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
              >
                {droneMilestones
                  .filter((d) => d.level > droneFrom)
                  .map((d) => (
                    <option key={d.level} value={d.level}>
                      Drone Lv. {d.level} ({d.unlock})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">
                ⚙️ Drone Parts Needed (Lv.{droneFrom} → Lv.{droneTo})
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-amber-300">
                {dronePartsNeeded.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-purple-300">
                Step cost at Lv.{droneTo}:{" "}
                {droneEndObj.stepParts.toLocaleString()} parts
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">
                💾 Drone Battle Data Required
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                {fmt(droneDataNeeded)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">🎯 Milestone Unlock</p>
              <p className="mt-1 text-sm font-bold text-white">
                {droneEndObj.unlock}
              </p>
            </div>
          </div>

          {showDrone && (
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
                Drone Component Priority (Right Side vs. Left Side)
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {droneComponents.map((c) => (
                  <div
                    key={c.slot}
                    className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white">
                        {c.slot}
                      </h4>
                      <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                        {c.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-purple-300">
                      <strong>Modules:</strong> {c.names.join(" · ")}
                    </p>
                    <p className="mt-2 text-xs text-purple-200/90">
                      {c.effect}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. T10 Special Forces Gold & Valor Badge Calculator + Tech Trees (shown on /research and /calc) */}
      {(section === "calc" || showResearch) && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">
                🔬 T10 Special Forces Gold &amp; Valor Badge Calculator
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Unlocking T10 Troops only requires <strong>40% completion</strong>{" "}
                of the Special Forces tree (skipping the upper morale/hospital
                side branches), but the final 4 Lv.10 nodes are heavily
                back-loaded in Gold!
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              💡 Research on Wednesday VS Age of Science!
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="lw-sf-pct"
                className="block text-xs text-purple-300"
              >
                Current Special Forces Tree % (0% – 40% T10 Path)
              </label>
              <select
                id="lw-sf-pct"
                value={sfCurPct}
                onChange={(e) => setSfCurPct(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              >
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((p) => (
                  <option key={p} value={p}>
                    {p}% Completed{" "}
                    {p === 0
                      ? "(Fresh Start)"
                      : p === 25
                      ? "(Reached Bottom 4 Nodes)"
                      : p === 40
                      ? "(T10 Unlocked!)"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-amber-300">
                🪙 Estimated Gold Remaining to T10
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-amber-300">
                {sfGoldRemaining > 0 ? fmt(sfGoldRemaining) : "✅ Done!"}
              </p>
              <p className="text-[11px] text-purple-300">
                Out of 10.3B total Gold (minimum T10 path)
              </p>
            </div>

            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">
                🎖️ Estimated Valor Badges Remaining
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                {sfValorRemaining > 0
                  ? sfValorRemaining.toLocaleString()
                  : "✅ Done!"}
              </p>
              <p className="text-[11px] text-purple-300">
                Out of 152,000 total Valor Badges
              </p>
            </div>
          </div>

          {showResearch && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {researchTrees.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {t.name}
                        </h3>
                        <p className="text-xs text-purple-300">
                          Unlock: {t.unlock}
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-purple-800 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      {t.priority}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-purple-900/70 px-2.5 py-1 font-mono text-purple-200">
                      🎖️ {t.badgeCost}
                    </span>
                    <span className="rounded bg-amber-950/70 px-2.5 py-1 font-mono text-amber-300">
                      🪙 {t.goldCost}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-purple-200/90">{t.summary}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. UR Hero Shard, Exclusive Weapon & Skill Medal Calculator + 18-Hero Roster */}
      {(section === "calc" || showHeroes) && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🦸 Last War UR Hero Shard, Exclusive Weapon &amp; Skill Medal Calculator
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Plan your Thursday <strong>Train Heroes VS Duel</strong> burst for
            all 18 UR &amp; SSR-to-UR heroes across Tank, Aircraft, and Missile
            formations.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <label
                htmlFor="lw-hero-select"
                className="block text-xs text-purple-300"
              >
                UR Hero
              </label>
              <select
                id="lw-hero-select"
                value={selectedHero}
                onChange={(e) => setSelectedHero(e.target.value)}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              >
                {urHeroes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.tier})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lw-cur-stars"
                className="block text-xs text-purple-300"
              >
                Current Stars
              </label>
              <select
                id="lw-cur-stars"
                value={curStars}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setCurStars(v);
                  if (targetStars <= v) setTargetStars(Math.min(5, v + 1));
                }}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <option key={s} value={s}>
                    {s}★ ({UR_STAR_COSTS[s].shards} Shards)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lw-target-stars"
                className="block text-xs text-purple-300"
              >
                Target Stars
              </label>
              <select
                id="lw-target-stars"
                value={targetStars}
                onChange={(e) => setTargetStars(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
              >
                {[1, 2, 3, 4, 5]
                  .filter((s) => s > curStars)
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}★ ({UR_STAR_COSTS[s].shards} Total)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lw-owned-shards"
                className="block text-xs text-purple-300"
              >
                UR Shards Owned
              </label>
              <input
                id="lw-owned-shards"
                type="number"
                min={0}
                value={ownedShards}
                onChange={(e) => setOwnedShards(e.target.value)}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label
                htmlFor="lw-ew-from"
                className="block text-xs text-purple-300"
              >
                Exclusive Weapon Cur Lv.
              </label>
              <select
                id="lw-ew-from"
                value={ewFrom}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setEwFrom(v);
                  if (ewTo <= v) setEwTo(Math.min(30, v + 5));
                }}
                className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white"
              >
                {[0, 1, 5, 10, 15, 20, 25].map((lv) => (
                  <option key={lv} value={lv}>
                    {lv === 0 ? "Locked (0)" : `Weapon Lv. ${lv}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lw-ew-to"
                className="block text-xs text-purple-300"
              >
                Exclusive Weapon Target
              </label>
              <select
                id="lw-ew-to"
                value={ewTo}
                onChange={(e) => setEwTo(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white"
              >
                {[1, 5, 10, 15, 20, 25, 30]
                  .filter((lv) => lv > ewFrom)
                  .map((lv) => (
                    <option key={lv} value={lv}>
                      Weapon Lv. {lv}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">
                🧩 UR Hero Shards ({curStars}★ → {targetStars}★)
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                {shardsNeeded}
              </p>
              <p className="mt-0.5 text-xs text-amber-300">
                {shardDeficit === 0
                  ? "✅ Ready to upgrade on Thursday!"
                  : `Need ${shardDeficit} more UR shards`}
              </p>
            </div>

            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">🏅 Skill Medals Needed</p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                {fmt(medalsNeeded)}
              </p>
              <p className="mt-0.5 text-xs text-purple-300">
                Prioritize Top-Right &amp; Bottom-Left skills first
              </p>
            </div>

            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-amber-300">
                ⚔️ Exclusive Weapon Shards (Lv.{ewFrom} → Lv.{ewTo})
              </p>
              <p className="mt-1 font-mono text-2xl font-extrabold text-amber-300">
                {ewShardsNeeded.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-purple-300">
                50 specific shards to unlock; Universal Weapon Shards after Lv.1
              </p>
            </div>

            <div className="rounded-lg bg-purple-950/60 p-4">
              <p className="text-xs text-purple-300">💡 Hero Meta Note</p>
              <p className="mt-1 text-xs text-purple-100">
                {urHeroes.find((h) => h.id === selectedHero)?.note}
              </p>
            </div>
          </div>

          {showHeroes && (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
                  Complete UR &amp; SSR-to-UR Hero Roster ({filteredHeroes.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["all", "Tank", "Aircraft", "Missile"].map((sq) => (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => setSquadFilter(sq)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        squadFilter === sq
                          ? "bg-purple-600 text-white"
                          : "border border-purple-800 bg-purple-950/50 text-purple-300 hover:border-purple-600"
                      }`}
                    >
                      {sq === "all" ? "All Squads (18)" : `${sq} Squad`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredHeroes.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {h.name}
                        </h4>
                        <p className="text-xs text-purple-300">{h.type}</p>
                      </div>
                      <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-black">
                        {h.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-amber-300">
                      <strong>⚔️ Exclusive Weapon:</strong> {h.weaponSeason}
                    </p>
                    <p className="mt-1.5 text-xs text-purple-200/85">
                      {h.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. UR Legendary & Mythic Red Gear Guide (shown on /gear) */}
      {showGear && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            ⚔️ Last War UR Legendary &amp; Mythic Red Hero Gear Guide
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Never upgrade Purple SSR gear past Lv. 20 — smelt all SSR gear and
            funnel 100% of your Upgrade Ore, Dielectric Ceramics, and Gold into
            UR M5-A Gear!
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {urGearItems.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{g.name}</h3>
                  <span className="rounded bg-purple-800 px-2.5 py-0.5 text-xs font-semibold text-purple-200">
                    {g.slot}
                  </span>
                </div>
                <p className="mt-2 text-xs text-amber-300">
                  <strong>📈 Core Stats:</strong> {g.stats}
                </p>
                <p className="mt-1.5 text-xs text-purple-200">
                  <strong>🎯 Priority:</strong> {g.priority}
                </p>
                <p className="mt-1.5 text-xs text-purple-300">
                  <strong>📜 0★ → 4★ Cost:</strong> {g.blueprintCostTo4Star}
                </p>
                <p className="mt-2 rounded bg-rose-950/50 border border-rose-800/50 px-3 py-1.5 text-xs text-rose-200">
                  <strong>🔴 {g.mythicBonus}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. PvP Counter Triangle & Capitol War Guide (shown on /pvp) */}
      {showPvp && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🛡️ Last War PvP Counter Triangle, Squad Aura &amp; Capitol War Guide
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Master the Tank → Missile → Aircraft counter triangle, 5-same-type
            squad formation bonus, and zero-troop-loss Capitol War defense.
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

      {/* 7. Seasons 1–4 & Age of Oil Hub (shown on /seasons) */}
      {showSeasons && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            🧬 Last War Seasonal Expansions (Seasons 1–4 &amp; Age of Oil)
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Complete guide to Seasonal Resistance mechanics, SSR-to-UR Hero
            Promotions (Mason, Violet, Scarlett), Exclusive Weapon waves, and
            Age of Oil HQ 31–35.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {seasons.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-purple-800/50 bg-purple-950/60 p-5"
              >
                <h3 className="text-base font-bold text-white">{s.name}</h3>
                <p className="mt-2 text-xs text-amber-300">
                  <strong>⚙️ Core Mechanic:</strong> {s.mechanic}
                </p>
                <p className="mt-1 text-xs text-purple-300">
                  <strong>⚔️ Key Unlocks:</strong>{" "}
                  {s.exclusiveWeapons.join(", ")}
                </p>
                <p className="mt-2 text-xs text-purple-200/85">{s.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. VS Alliance Duel, 4h Arms Race & Major Events (shown on Overview and /events) */}
      {showEvents && (
        <section
          className={`rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 ${
            isOverview ? "cv-auto" : ""
          }`}
        >
          <h2 className="text-xl font-bold text-white">
            📅 VS Alliance Duel Weekly Rotation &amp; Arms Race Sync
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {vsSchedule.map((d) => (
              <div
                key={d.day}
                className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
              >
                <span className="text-xs font-bold uppercase text-purple-400">
                  {d.day}
                </span>
                <h3 className="mt-0.5 text-base font-bold text-white">
                  {d.name}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-purple-200/85">
                  {d.keyItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2.5 text-xs text-amber-300/90">
                  <strong>💡 Tip:</strong> {d.tip}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-purple-300">
            4-Hour Arms Race Cycle (Sync with VS Duel for 2× Chests)
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {armsRace.map((w) => (
              <div
                key={w.slot}
                className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-3"
              >
                <span className="font-mono text-xs font-bold text-purple-300">
                  {w.slot}
                </span>
                <p className="mt-0.5 text-sm font-bold text-white">{w.theme}</p>
                <p className="mt-0.5 text-xs text-purple-200/80">{w.action}</p>
              </div>
            ))}
          </div>

          {!isOverview && (
            <>
              <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-purple-300">
                Major Weekly &amp; Bi-Weekly Alliance Events
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {majorEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-purple-800/50 bg-purple-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white">
                        {ev.name}
                      </h4>
                      <span className="rounded bg-purple-800/70 px-2 py-0.5 text-[11px] text-purple-200">
                        {ev.cadence}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-amber-300">
                      <strong>🎁 Rewards:</strong> {ev.rewards}
                    </p>
                    <p className="mt-1.5 text-xs text-purple-200/85">
                      <strong>💡 Strategy:</strong> {ev.strategy}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* 9. Complete Last War HQ 1–35 Table */}
      {showHq && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
          <h2 className="text-xl font-bold text-white">
            📋 Last War HQ Levels 1–35 (Includes Age of Oil) Requirements Table
          </h2>
          <p className="mt-1 text-xs text-purple-300">
            Click any HQ level for its dedicated requirements, speed-up count,
            and cumulative cost breakdown.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-purple-700/60">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-purple-950">
                <tr className="border-b border-purple-700/60 text-purple-200">
                  <th className="px-3 py-3 text-left font-semibold">HQ</th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Required Buildings
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Iron / Food
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">Gold</th>
                  <th className="px-3 py-3 text-right font-semibold">
                    🛢️ Oil
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Build Time
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Key Unlock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {hqLevels.map((row) => (
                  <tr key={row.level} className="hover:bg-purple-900/20">
                    <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap">
                      <Link
                        href={`/last-war/hq/level-${row.level}-requirements`}
                        className="text-purple-200 underline decoration-purple-600/70 underline-offset-2 hover:text-white"
                      >
                        Lv. {row.level}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-purple-200">
                      {row.requiredBuildings.join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200">
                      {fmt(row.iron)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-300">
                      {fmt(row.gold)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-300">
                      {"oil" in row && row.oil ? fmt(row.oil) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-purple-200 whitespace-nowrap">
                      {fmtTime(row.buildTimeMinutes)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-purple-300">
                      {row.unlock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 10. Last War Gift Codes & Official CDKey Redemption Center */}
      {showCodes && (
        <section
          className={`rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 ${
            isOverview ? "cv-auto" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">
                🎁 Last War: Survival Game Gift Codes &amp; CDKey Portal
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Copy your 16-digit UID from Profile → Account Settings and
                redeem via the official web portal.
              </p>
            </div>
            <a
              href="https://lastwar-h5.lastwargame.com/platform/cdkey/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Official Last War CDKey Portal ↗
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
