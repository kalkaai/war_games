"use client";

import { useState } from "react";
import Link from "next/link";
import lastWarData from "@/data/lastWar.json";

const hqLevels = lastWarData.hqLevels;
const vsSchedule = lastWarData.vsDuelSchedule;
const armsRace = lastWarData.armsRaceWindows;
const urHeroes = lastWarData.urHeroes;

const UR_STAR_COSTS = [
  { star: 0, shards: 0, medals: 0 },
  { star: 1, shards: 25, medals: 3000 },
  { star: 2, shards: 75, medals: 11000 },
  { star: 3, shards: 225, medals: 33000 },
  { star: 4, shards: 525, medals: 78000 },
  { star: 5, shards: 975, medals: 163000 },
];

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

export default function LastWarClient() {
  const [fromHq, setFromHq] = useState<number>(24);
  const [toHq, setToHq] = useState<number>(30);
  const [selectedHero, setSelectedHero] = useState<string>("kimberly");
  const [curStars, setCurStars] = useState<number>(3);
  const [targetStars, setTargetStars] = useState<number>(5);
  const [ownedShards, setOwnedShards] = useState<string>("150");

  const slice = hqLevels.filter((l) => l.level > fromHq && l.level <= toHq);
  const totals = slice.reduce(
    (acc, l) => ({
      iron: acc.iron + l.iron,
      food: acc.food + l.food,
      gold: acc.gold + l.gold,
      mins: acc.mins + l.buildTimeMinutes,
    }),
    { iron: 0, food: 0, gold: 0, mins: 0 }
  );

  const startStarObj = UR_STAR_COSTS[curStars];
  const endStarObj = UR_STAR_COSTS[targetStars];
  const shardsNeeded = Math.max(0, endStarObj.shards - startStarObj.shards);
  const medalsNeeded = Math.max(0, endStarObj.medals - startStarObj.medals);
  const ownedShardNum = Math.max(0, parseInt(ownedShards || "0", 10) || 0);
  const shardDeficit = Math.max(0, shardsNeeded - ownedShardNum);

  return (
    <div className="space-y-10">
      {/* 1. HQ Resource & Speed-Up Calculator */}
      <section
        id="hq-calc"
        className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6"
      >
        <h2 className="text-xl font-bold text-white">
          🏰 Last War HQ 1–30 Resource &amp; Speed-Up Calculator
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Calculate total Iron, Food, Gold, and Construction Speed-ups required
          between any two Headquarters levels.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <div>
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
                if (toHq <= v) setToHq(Math.min(30, v + 1));
              }}
              className="mt-1 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {hqLevels.slice(0, -1).map((l) => (
                <option key={l.level} value={l.level}>
                  HQ Lv. {l.level} ({l.unlock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lw-to-hq" className="block text-xs text-purple-300">
              Target HQ Level
            </label>
            <select
              id="lw-to-hq"
              value={toHq}
              onChange={(e) => setToHq(Number(e.target.value))}
              className="mt-1 rounded-md border border-purple-500 bg-purple-900 px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">🔩 Iron Required</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-white">
              {fmt(totals.iron)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">🌽 Food Required</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-white">
              {fmt(totals.food)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/60 p-4">
            <p className="text-xs text-amber-300">🪙 Gold Required</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-amber-300">
              {fmt(totals.gold)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">⏱️ Base Build Time</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-white">
              {fmtTime(totals.mins)}
            </p>
            <p className="text-[11px] text-purple-300">
              {Math.ceil(totals.mins / 60).toLocaleString()}h speed-ups
            </p>
          </div>
        </div>
      </section>

      {/* 2. UR Hero Shard & Skill Medal Calculator */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          🦸 Last War UR Hero Shard &amp; Skill Medal Calculator
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Plan your Thursday <strong>Train Heroes VS Duel</strong> burst for
          Kimberly, Stetmann, DVA, Murphy, and Williams.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                  {h.name} ({h.tier} · {h.type})
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
                    {s}★ ({UR_STAR_COSTS[s].shards} Total Shards)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lw-owned-shards"
              className="block text-xs text-purple-300"
            >
              UR Universal Shards Owned
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
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-purple-950/60 p-4">
            <p className="text-xs text-purple-300">
              🧩 UR Shards ({curStars}★ → {targetStars}★)
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
            <p className="text-xs text-purple-300">💡 Hero Meta Note</p>
            <p className="mt-1 text-xs text-purple-100">
              {urHeroes.find((h) => h.id === selectedHero)?.note}
            </p>
          </div>
        </div>
      </section>

      {/* 3. VS Alliance Duel & 4h Arms Race Schedule */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
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
      </section>

      {/* 4. Complete Last War HQ 1–30 Table */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          📋 Last War HQ Levels 1–30 Requirements Table
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Click any HQ level for its dedicated requirements, speed-up count, and
          cumulative cost breakdown.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-purple-700/60">
          <table className="w-full text-sm">
            <thead className="bg-purple-950">
              <tr className="border-b border-purple-700/60 text-purple-200">
                <th className="px-4 py-3 text-left font-semibold">HQ</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Required Buildings
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Iron / Food
                </th>
                <th className="px-4 py-3 text-right font-semibold">Gold</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Build Time
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Key Unlock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30">
              {hqLevels.map((row) => (
                <tr key={row.level} className="hover:bg-purple-900/20">
                  <td className="px-4 py-2.5 font-bold text-white whitespace-nowrap">
                    <Link
                      href={`/last-war/hq/level-${row.level}-requirements`}
                      className="text-purple-200 underline decoration-purple-600/70 underline-offset-2 hover:text-white"
                    >
                      Lv. {row.level}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-purple-200">
                    {row.requiredBuildings.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200">
                    {fmt(row.iron)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-amber-300">
                    {fmt(row.gold)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200 whitespace-nowrap">
                    {fmtTime(row.buildTimeMinutes)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-purple-300">
                    {row.unlock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
