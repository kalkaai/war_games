"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import wosData from "@/data/whiteoutSurvival.json";

const furnaceLevels = wosData.furnaceLevels;
const allianceEvents = wosData.allianceEvents;
const svsRotation = wosData.svsPrepRotation;

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

export default function WhiteoutClient() {
  const [offsetHours, setOffsetHours] = useState<number>(0);
  const [fromLevel, setFromLevel] = useState<number>(25);
  const [toLevel, setToLevel] = useState<number>(30);
  const [ownedFireCrystals, setOwnedFireCrystals] = useState<string>("0");

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

  return (
    <div className="space-y-10">
      {/* 1. Alliance Event Scheduler & Bear Hunt / Sunfire Tracker */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              ❄️ Whiteout Survival Event Scheduler &amp; Timezone Converter
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Convert Bear Hunt, Sunfire Castle, Crazy Joe, and Foundry Battle
              UTC windows into your local timezone.
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
          {allianceEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl border border-purple-800/50 bg-purple-950/50 p-4"
            >
              <div className="flex items-center justify-between">
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

      {/* 2. Furnace & Fire Crystal Resource Calculator */}
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

      {/* 3. Full Furnace 1–30 + FC1–FC5 Reference Table */}
      <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          🏰 Complete Whiteout Survival Furnace Upgrade Table
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Click any Furnace level to open its dedicated requirements &amp;
          speed-up breakdown page.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-purple-700/60">
          <table className="w-full text-sm">
            <thead className="bg-purple-950">
              <tr className="border-b border-purple-700/60 text-purple-200">
                <th className="px-4 py-3 text-left font-semibold">Furnace</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Prerequisite Buildings
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Meat / Wood
                </th>
                <th className="px-4 py-3 text-right font-semibold">Coal</th>
                <th className="px-4 py-3 text-right font-semibold">Iron</th>
                <th className="px-4 py-3 text-right font-semibold">🔥 FC</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Build Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30">
              {furnaceLevels.map((row) => (
                <tr key={row.level} className="hover:bg-purple-900/20">
                  <td className="px-4 py-2.5 font-bold text-white whitespace-nowrap">
                    <Link
                      href={`/whiteout-survival/furnace/level-${row.level}-requirements`}
                      className="text-purple-200 underline decoration-purple-600/70 underline-offset-2 hover:text-white"
                    >
                      {row.label}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-purple-200">
                    {row.requiredBuildings.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200">
                    {fmt(row.meat)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200">
                    {fmt(row.coal)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200">
                    {fmt(row.iron)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-amber-300">
                    {row.fireCrystals > 0
                      ? row.fireCrystals.toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-purple-200 whitespace-nowrap">
                    {fmtTime(row.buildTimeMinutes)}
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
