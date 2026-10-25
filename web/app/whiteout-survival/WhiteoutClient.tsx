"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import wosData from "@/data/whiteoutSurvival.json";

export type WhiteoutSection = "all" | "events" | "furnace" | "heroes" | "calc";

const furnaceLevels = wosData.furnaceLevels;
const allianceEvents = wosData.allianceEvents;
const svsRotation = wosData.svsPrepRotation;
const ssrHeroes = wosData.ssrHeroes;
const charmLevels = wosData.chiefCharmLevels;
const gearTiers = wosData.chiefGearTiers;
const redeemCodes = wosData.redeemCodes;

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

  // Chief Charm Calculator state (Lv. 1–16 across 1–18 slots)
  const [charmFrom, setCharmFrom] = useState<number>(3);
  const [charmTo, setCharmTo] = useState<number>(11);
  const [charmSlots, setCharmSlots] = useState<number>(18);

  // Chief Gear Calculator state (Green T1 to Red T3 across 1–6 pieces)
  const [gearFrom, setGearFrom] = useState<number>(3);
  const [gearTo, setGearTo] = useState<number>(8);
  const [gearPieces, setGearPieces] = useState<number>(6);

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

  // Chief Charm delta calculation (cumulative table)
  const charmStartObj = charmLevels.find((c) => c.level === charmFrom) ?? charmLevels[0];
  const charmEndObj = charmLevels.find((c) => c.level === charmTo) ?? charmLevels[charmLevels.length - 1];
  const charmDesignsNeeded = Math.max(0, charmEndObj.designs - charmStartObj.designs) * charmSlots;
  const charmGuidesNeeded = Math.max(0, charmEndObj.guides - charmStartObj.guides) * charmSlots;
  const charmSecretsNeeded = Math.max(0, charmEndObj.secrets - charmStartObj.secrets) * charmSlots;
  const charmPowerGain = Math.max(0, charmEndObj.power - charmStartObj.power) * charmSlots;

  // Chief Gear delta calculation (cumulative table)
  const gearStartObj = gearTiers.find((g) => g.tier === gearFrom) ?? gearTiers[0];
  const gearEndObj = gearTiers.find((g) => g.tier === gearTo) ?? gearTiers[gearTiers.length - 1];
  const gearAlloyNeeded = Math.max(0, gearEndObj.alloy - gearStartObj.alloy) * gearPieces;
  const gearSolutionNeeded = Math.max(0, gearEndObj.solution - gearStartObj.solution) * gearPieces;
  const gearPlansNeeded = Math.max(0, gearEndObj.plans - gearStartObj.plans) * gearPieces;
  const gearAmberNeeded = Math.max(0, gearEndObj.amber - gearStartObj.amber) * gearPieces;

  const filteredHeroes =
    genFilter === "all"
      ? ssrHeroes
      : ssrHeroes.filter((h) => h.gen.startsWith(genFilter));

  const showEvents = section === "all" || section === "events";
  const showCalc = section === "all" || section === "calc";
  const showHeroes = section === "all" || section === "heroes";
  const showFurnace = section === "all" || section === "furnace";

  return (
    <div className="space-y-8">
      {/* 1. Alliance Event Scheduler & Bear Hunt / Sunfire Tracker */}
      {showEvents && (
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
      )}

      {/* 2. Furnace & Fire Crystal Resource Calculator */}
      {showCalc && (
        <>
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

          {/* 2B. Chief Charms Calculator (Lv. 1–16 across 18 Charm Slots) */}
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
                      {n} {n === 1 ? "Charm" : n === 3 ? "Charms (1 Gear Piece)" : n === 6 ? "Charms (1 Troop Type)" : n === 18 ? "Charms (Full 6-Gear Set)" : "Charms"}
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

          {/* 2C. Chief Gear Calculator (Green → Red T3 across 6 Gear Pieces) */}
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
                      {n} {n === 1 ? "Piece" : n === 2 ? "Pieces (1 Troop Type)" : n === 3 ? "Pieces (3-Piece Set Bonus)" : "Pieces (Full 6-Piece Set)"}
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

      {/* 3. SSR Heroes Tier List & Bear Trap Rally Joiners (Gen 1–7) */}
      {showHeroes && (
        <section
          className={`rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 ${
            section === "all" ? "cv-auto" : ""
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                🦸 Whiteout Survival SSR Heroes &amp; Bear Trap Rally Guide (Gen 1–7)
              </h2>
              <p className="mt-1 text-xs text-purple-300">
                Best Rally Leaders, mandatory Slot 1 Rally Joiners (Jessie,
                Reina, Bradley), and F2P Lucky Wheel priorities.
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

      {/* 4. Full Furnace 1–30 + FC1–FC5 Reference Table */}
      {showFurnace && (
        <section
          className={`rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 ${
            section === "all" ? "cv-auto" : ""
          }`}
        >
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
      )}

      {/* 5. Whiteout Survival Redeem Codes & Official Gift Center */}
      {section === "all" && (
        <section className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-6 cv-auto">
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

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
