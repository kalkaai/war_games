"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import seasonsData from "@/data/seasons.json";
import heroesData from "@/data/heroes.json";
import type {
  SeasonData,
  SeasonId,
  HeroPivotCost,
  Hero,
  HeroFaction,
} from "@/types";

const seasons = seasonsData.seasons as SeasonData[];
const pivotCosts = seasonsData.pivotCosts as HeroPivotCost[];
const heroes = heroesData.heroes as Hero[];

const PREP_CHECKED_KEY = "wg_season_prep_checked";
const NODE_LEVELS_KEY = "wg_season_node_levels";

const FACTION_LABELS: Record<HeroFaction, string> = {
  blood_rose: "Blood Rose (Assaulters)",
  wings_of_dawn: "Wings of Dawn (Shooters)",
  guard_of_order: "Guard of Order (Riders)",
};

const PRIORITY_STYLES: Record<"critical" | "high" | "medium", string> = {
  critical: "bg-red-900/50 text-red-200 border-red-700/60",
  high: "bg-amber-900/50 text-amber-200 border-amber-700/60",
  medium: "bg-blue-900/50 text-blue-200 border-blue-700/60",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default function SeasonsClient({
  initialSeasonId = "s3",
}: {
  initialSeasonId?: SeasonId;
}) {
  const [selectedSeasonId, setSelectedSeasonId] =
    useState<SeasonId>(initialSeasonId);
  const [currentSeasonId, setCurrentSeasonId] = useState<SeasonId>(
    initialSeasonId === "s1"
      ? "s1"
      : (seasons[
          Math.max(
            0,
            seasons.findIndex((s) => s.id === initialSeasonId) - 1
          )
        ]?.id ?? "s2")
  );

  // Hoarding checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Seasonal mechanic node levels state
  const [nodeLevels, setNodeLevels] = useState<Record<string, number>>({});
  const [customDailyFarm, setCustomDailyFarm] = useState<
    Record<string, number>
  >({});
  const [daysRemainingInSeason, setDaysRemainingInSeason] =
    useState<number>(42);

  // Pivot calculator state
  const [fromHeroId, setFromHeroId] = useState<string>("selena");
  const [toHeroId, setToHeroId] = useState<string>("yu_chan");
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [targetStars, setTargetStars] = useState<number>(4);
  const [ownedFragments, setOwnedFragments] = useState<string>("120");
  const [ownedSkillMedals, setOwnedSkillMedals] = useState<string>("15000");

  useEffect(() => {
    try {
      const savedChecked = localStorage.getItem(PREP_CHECKED_KEY);
      if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
      const savedNodes = localStorage.getItem(NODE_LEVELS_KEY);
      if (savedNodes) setNodeLevels(JSON.parse(savedNodes));
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const activeSeason =
    seasons.find((s) => s.id === selectedSeasonId) ?? seasons[2];

  function toggleCheck(itemId: string) {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem(PREP_CHECKED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      sendGAEvent("event", "season_prep_toggle", {
        season: selectedSeasonId,
        item_id: itemId,
        checked: next[itemId],
      });
      return next;
    });
  }

  function updateNodeLevel(nodeId: string, maxLevel: number, val: number) {
    const clamped = Math.max(0, Math.min(maxLevel, val));
    setNodeLevels((prev) => {
      const next = { ...prev, [nodeId]: clamped };
      try {
        localStorage.setItem(NODE_LEVELS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Hoarding checklist metrics
  const totalChecklist = activeSeason.hoardingChecklist.length;
  const completedChecklist = activeSeason.hoardingChecklist.filter(
    (item) => checkedItems[item.id]
  ).length;
  const prepPct =
    totalChecklist > 0
      ? Math.round((completedChecklist / totalChecklist) * 100)
      : 0;

  // Mechanic calculator metrics
  const dailyRate =
    customDailyFarm[activeSeason.id] ?? activeSeason.dailyFreeCurrency;

  const mechanicBreakdown = activeSeason.mechanicNodes.map((node) => {
    const curLv = nodeLevels[node.id] ?? 0;
    const pctDone = curLv / node.maxLevel;
    const costRemaining = Math.round(node.totalCost * (1 - pctDone));
    return {
      ...node,
      curLv,
      costRemaining,
    };
  });

  const totalCurrencyMax = activeSeason.mechanicNodes.reduce(
    (sum, n) => sum + n.totalCost,
    0
  );
  const totalCurrencyRemaining = mechanicBreakdown.reduce(
    (sum, n) => sum + n.costRemaining,
    0
  );
  const estDaysToMax =
    dailyRate > 0 ? Math.ceil(totalCurrencyRemaining / dailyRate) : 0;
  const requiredDailyForWindow =
    daysRemainingInSeason > 0
      ? Math.ceil(totalCurrencyRemaining / daysRemainingInSeason)
      : totalCurrencyRemaining;

  // Hero Pivot calculations
  const startCostObj = pivotCosts.find((p) => p.starLevel === currentStars);
  const targetCostObj =
    pivotCosts.find((p) => p.starLevel === targetStars) ?? pivotCosts[3];

  const baseFragments = startCostObj ? startCostObj.cumulativeFragments : 0;
  const baseMedals = startCostObj ? startCostObj.cumulativeSkillBadges : 0;
  const baseVsPoints = startCostObj ? startCostObj.vsPointsEarned : 0;

  const fragmentsNeeded = Math.max(
    0,
    targetCostObj.cumulativeFragments - baseFragments
  );
  const medalsNeeded = Math.max(
    0,
    targetCostObj.cumulativeSkillBadges - baseMedals
  );
  const vsPointsGain = Math.max(
    0,
    targetCostObj.vsPointsEarned - baseVsPoints
  );

  const ownedFragNum = Math.max(0, parseInt(ownedFragments || "0", 10) || 0);
  const ownedMedalNum = Math.max(0, parseInt(ownedSkillMedals || "0", 10) || 0);

  const fragmentDeficit = Math.max(0, fragmentsNeeded - ownedFragNum);
  const medalDeficit = Math.max(0, medalsNeeded - ownedMedalNum);

  const fromHero = heroes.find((h) => h.id === fromHeroId) ?? heroes[0];
  const toHero = heroes.find((h) => h.id === toHeroId) ?? heroes[1];
  const canonicalCompareSlug =
    fromHero.id === toHero.id
      ? null
      : fromHero.id < toHero.id
      ? `${fromHero.id}-vs-${toHero.id}`
      : `${toHero.id}-vs-${fromHero.id}`;

  const featuredHeroObjs = activeSeason.metaShift.featuredHeroes
    .map((id) => heroes.find((h) => h.id === id))
    .filter((h): h is Hero => Boolean(h));

  return (
    <div className="space-y-10">
      {/* Season Selector Bar */}
      <div className="rounded-xl border border-purple-700/60 bg-purple-900/30 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Select Target Server Season
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-white">
              {activeSeason.name} — {activeSeason.subtitle}
            </h2>
          </div>
          <Link
            href={`/seasons/${activeSeason.id}`}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-purple-600 bg-purple-800/60 px-3.5 py-2 text-xs font-semibold text-purple-100 transition-colors hover:bg-purple-700"
          >
            Open {activeSeason.id.toUpperCase()} Dedicated Page →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {seasons.map((s) => {
            const isSelected = s.id === selectedSeasonId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedSeasonId(s.id);
                  sendGAEvent("event", "season_select", { season: s.id });
                }}
                className={`rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-purple-400 bg-purple-600/40 text-white shadow-md shadow-purple-950"
                    : "border-purple-800/50 bg-purple-950/60 text-purple-200/80 hover:border-purple-700 hover:bg-purple-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-purple-300">
                    Season {s.number}
                  </span>
                  <span className="rounded bg-purple-900/80 px-1.5 py-0.5 text-[10px] text-purple-200">
                    {s.durationWeeks}w
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-bold text-white">
                  {s.name.replace(/^Season \d+:\s*/, "")}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-purple-300/70">
                  {s.mechanicName}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-purple-200/90">{activeSeason.summary}</p>
      </div>

      {/* 1. Interactive Season Transition Prep Checklist */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              📦 Interactive Season Prep &amp; Hoarding Checklist
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Select your current season and check off stockpiled resources before{" "}
              <strong className="text-white">{activeSeason.name}</strong> starts.
              Progress saves automatically in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label
                htmlFor="current-season-select"
                className="block text-[11px] text-purple-300"
              >
                Current Server Season
              </label>
              <select
                id="current-season-select"
                value={currentSeasonId}
                onChange={(e) => setCurrentSeasonId(e.target.value as SeasonId)}
                className="mt-1 rounded-md border border-purple-700 bg-purple-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    Season {s.number}: {s.name.replace(/^Season \d+:\s*/, "")}
                  </option>
                ))}
              </select>
            </div>
            <span className="mt-4 text-purple-400">→</span>
            <div>
              <label
                htmlFor="target-season-select"
                className="block text-[11px] text-purple-300"
              >
                Preparing For
              </label>
              <select
                id="target-season-select"
                value={selectedSeasonId}
                onChange={(e) =>
                  setSelectedSeasonId(e.target.value as SeasonId)
                }
                className="mt-1 rounded-md border border-purple-500 bg-purple-900 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    Season {s.number}: {s.name.replace(/^Season \d+:\s*/, "")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="mt-5 rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-200">
              {activeSeason.name} Hoarding Readiness
            </span>
            <span className="font-mono font-bold text-white">
              {completedChecklist}/{totalChecklist} targets met ({prepPct}%)
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-purple-900/70">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{ width: `${prepPct}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="mt-4 space-y-3">
          {activeSeason.hoardingChecklist.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCheck(item.id);
                  }
                }}
                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                  isChecked
                    ? "border-green-700/60 bg-green-950/20"
                    : "border-purple-800/50 bg-purple-950/40 hover:border-purple-700"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                    isChecked
                      ? "border-green-500 bg-green-600 text-white"
                      : "border-purple-600 bg-purple-950 text-transparent"
                  }`}
                >
                  ✓
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <h3
                      className={`text-sm font-bold ${
                        isChecked ? "line-through text-purple-300" : "text-white"
                      }`}
                    >
                      {item.resource}
                    </h3>
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        PRIORITY_STYLES[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-purple-200/80">
                    {item.reason}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-mono text-base font-extrabold text-white">
                    {fmt(item.targetAmount)}
                  </p>
                  <p className="text-[11px] text-purple-300/70">{item.unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Seasonal Mechanic Progression Calculator */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              🧬 {activeSeason.mechanicName} Progression Calculator
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Plan your daily{" "}
              <strong className="text-white">
                {activeSeason.mechanicCurrency}
              </strong>{" "}
              farming targets to max out {activeSeason.name} seasonal progression
              before the {activeSeason.durationWeeks}-week season ends.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <label
                htmlFor="daily-currency-input"
                className="block text-[11px] text-purple-300"
              >
                Your Daily {activeSeason.mechanicCurrency}
              </label>
              <input
                id="daily-currency-input"
                type="number"
                min={1000}
                step={1000}
                value={dailyRate}
                onChange={(e) =>
                  setCustomDailyFarm((prev) => ({
                    ...prev,
                    [activeSeason.id]: Math.max(
                      0,
                      parseInt(e.target.value || "0", 10)
                    ),
                  }))
                }
                className="mt-1 w-36 rounded-md border border-purple-700 bg-purple-950 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="days-remaining-input"
                className="block text-[11px] text-purple-300"
              >
                Days Left in Season
              </label>
              <input
                id="days-remaining-input"
                type="number"
                min={1}
                max={60}
                value={daysRemainingInSeason}
                onChange={(e) =>
                  setDaysRemainingInSeason(
                    Math.max(1, Math.min(60, parseInt(e.target.value || "1", 10)))
                  )
                }
                className="mt-1 w-28 rounded-md border border-purple-700 bg-purple-950 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              Remaining {activeSeason.mechanicCurrency} Needed
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-white">
              {fmt(totalCurrencyRemaining)}{" "}
              <span className="text-xs font-normal text-purple-300/70">
                / {fmt(totalCurrencyMax)}
              </span>
            </p>
          </div>

          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              Estimated Days at Current Rate
            </p>
            <p
              className={`mt-1 font-mono text-2xl font-extrabold ${
                estDaysToMax > daysRemainingInSeason
                  ? "text-amber-400"
                  : "text-green-400"
              }`}
            >
              {estDaysToMax} days
            </p>
            <p className="mt-0.5 text-[11px] text-purple-300/70">
              {estDaysToMax <= daysRemainingInSeason
                ? "✅ On track to finish before season ends"
                : `⚠️ ${estDaysToMax - daysRemainingInSeason} days behind schedule`}
            </p>
          </div>

          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              Daily Farming Target ({daysRemainingInSeason}d window)
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-purple-200">
              {fmt(requiredDailyForWindow)} / day
            </p>
            <p className="mt-0.5 text-[11px] text-purple-300/70">
              Free baseline: {fmt(activeSeason.dailyFreeCurrency)}/day
            </p>
          </div>
        </div>

        {/* Mechanic Node Sliders */}
        <div className="mt-5 space-y-3">
          {mechanicBreakdown.map((node) => (
            <div
              key={node.id}
              className="rounded-xl border border-purple-800/50 bg-purple-950/40 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{node.name}</h3>
                  <p className="text-xs text-purple-200/80">
                    {node.buffDescription}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-purple-300">
                    Lv. {node.curLv} / {node.maxLevel}
                  </span>
                  <span className="rounded bg-purple-900/70 px-2 py-1 font-mono text-xs font-bold text-white">
                    {node.costRemaining === 0
                      ? "MAXED"
                      : `${fmt(node.costRemaining)} left`}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  aria-label={`${node.name} level`}
                  min={0}
                  max={node.maxLevel}
                  value={node.curLv}
                  onChange={(e) =>
                    updateNodeLevel(
                      node.id,
                      node.maxLevel,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500"
                />
                <button
                  type="button"
                  onClick={() => updateNodeLevel(node.id, node.maxLevel, node.maxLevel)}
                  className="rounded border border-purple-700 px-2 py-1 text-[11px] text-purple-200 hover:bg-purple-800"
                >
                  Max
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dynamic Seasonal Meta Hub */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              🏆 {activeSeason.name} Meta Hub &amp; Faction Synergy
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Dominant Faction:{" "}
              <strong className="text-white">
                {FACTION_LABELS[activeSeason.metaShift.topFaction]}
              </strong>
            </p>
          </div>
          <Link
            href="/heroes"
            className="text-xs font-semibold text-purple-300 hover:text-white"
          >
            View Full 30-Hero Tier List →
          </Link>
        </div>

        <p className="mt-3 text-sm text-purple-100/90">
          {activeSeason.metaShift.metaSummary}
        </p>

        <div className="mt-3 rounded-lg border border-amber-700/50 bg-amber-950/20 p-3 text-xs text-amber-200">
          <strong>💡 Counter Strategy:</strong>{" "}
          {activeSeason.metaShift.counterTip}
        </div>

        <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-purple-300">
          Featured {activeSeason.id.toUpperCase()} Meta Carries
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {featuredHeroObjs.map((hero) => (
            <Link
              key={hero.id}
              href={`/heroes/${hero.id}`}
              className="group rounded-xl border border-purple-700/60 bg-purple-950/60 p-4 transition-all hover:border-purple-500 hover:bg-purple-900/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-white group-hover:text-purple-200">
                  {hero.name}
                </span>
                <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-black">
                  {hero.tier}
                </span>
              </div>
              <p className="mt-1 text-xs text-purple-300">
                {FACTION_LABELS[hero.faction]} · {hero.role}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-purple-200/80">
                <span>PvP: {hero.pvpRating}</span>
                <span>PvE: {hero.pveRating}</span>
                <span className="text-purple-400 group-hover:text-white">
                  Build Guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Hero Pivot Calculator */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          🔄 Seasonal Meta Pivot Calculator
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Calculate the exact Universal Gold Fragments, Skill Medals, and
          Thursday VS Heroes Day score required to pivot into a new seasonal S+
          carry.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="pivot-from-hero"
              className="block text-xs text-purple-300"
            >
              Pivoting From Hero
            </label>
            <select
              id="pivot-from-hero"
              value={fromHeroId}
              onChange={(e) => setFromHeroId(e.target.value)}
              className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {heroes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.tier} · {h.season ?? "Base"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pivot-to-hero"
              className="block text-xs text-purple-300"
            >
              Target Meta Hero
            </label>
            <select
              id="pivot-to-hero"
              value={toHeroId}
              onChange={(e) => setToHeroId(e.target.value)}
              className="mt-1 w-full rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {heroes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.tier} · {h.season ?? "Base"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pivot-current-stars"
              className="block text-xs text-purple-300"
            >
              Target Hero Current Stars
            </label>
            <select
              id="pivot-current-stars"
              value={currentStars}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setCurrentStars(v);
                if (targetStars <= v) setTargetStars(Math.min(5, v + 1));
              }}
              className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={0}>0★ (Unowned / Just Unlocked)</option>
              <option value={1}>1★ (25 Fragments Invested)</option>
              <option value={2}>2★ (75 Fragments Invested)</option>
              <option value={3}>3★ (225 Fragments Invested)</option>
              <option value={4}>4★ (525 Fragments Invested)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pivot-target-stars"
              className="block text-xs text-purple-300"
            >
              Target Star Milestone
            </label>
            <select
              id="pivot-target-stars"
              value={targetStars}
              onChange={(e) => setTargetStars(parseInt(e.target.value, 10))}
              className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[1, 2, 3, 4, 5]
                .filter((star) => star > currentStars)
                .map((star) => (
                  <option key={star} value={star}>
                    {star}★ ({pivotCosts[star - 1].cumulativeFragments} Total
                    Fragments)
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Stockpile Inputs */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="owned-fragments-input"
              className="block text-xs text-purple-300"
            >
              Universal Gold Fragments Currently Hoarded
            </label>
            <input
              id="owned-fragments-input"
              type="number"
              min={0}
              value={ownedFragments}
              onChange={(e) => setOwnedFragments(e.target.value)}
              className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="owned-medals-input"
              className="block text-xs text-purple-300"
            >
              Skill Medals Currently Hoarded
            </label>
            <input
              id="owned-medals-input"
              type="number"
              min={0}
              value={ownedSkillMedals}
              onChange={(e) => setOwnedSkillMedals(e.target.value)}
              className="mt-1 w-full rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Output Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              🧩 Gold Fragments ({currentStars}★ → {targetStars}★)
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-white">
              {fragmentsNeeded}
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                fragmentDeficit === 0 ? "text-green-400" : "text-amber-300"
              }`}
            >
              {fragmentDeficit === 0
                ? "✅ Ready to upgrade immediately!"
                : `Need ${fragmentDeficit} more fragments`}
            </p>
          </div>

          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              🏅 Skill Medals Required
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-white">
              {fmt(medalsNeeded)}
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                medalDeficit === 0 ? "text-green-400" : "text-amber-300"
              }`}
            >
              {medalDeficit === 0
                ? "✅ Enough medals to max skills!"
                : `Short by ${fmt(medalDeficit)} medals`}
            </p>
          </div>

          <div className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              🎯 Thursday VS Heroes Day Score
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-purple-200">
              +{fmt(vsPointsGain)} pts
            </p>
            <p className="mt-1 text-xs text-purple-300/70">
              Save fragments for Thursday VS Heroes Day!
            </p>
          </div>
        </div>

        {canonicalCompareSlug && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-purple-700/50 bg-purple-900/40 px-4 py-3">
            <span className="text-xs text-purple-200">
              Unsure if pivoting from <strong>{fromHero.name}</strong> to{" "}
              <strong>{toHero.name}</strong> is worth the cost?
            </span>
            <Link
              href={`/heroes/${canonicalCompareSlug}`}
              className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-purple-500"
            >
              Compare {fromHero.name} vs {toHero.name} →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
