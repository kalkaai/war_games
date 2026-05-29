"use client";

import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import researchData from "@/data/research.json";
import hqData from "@/data/hq.json";
import type { ResearchTree, HQLevel } from "@/types";

const trees = researchData.trees as ResearchTree[];
const hqLevels = hqData.levels as HQLevel[];

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}G`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

// ── Speed-up Calculator ───────────────────────────────────────────────────────

function SpeedupCalc() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const totalMins = (parseInt(hours || "0", 10) * 60) + parseInt(minutes || "0", 10);
  const oneHour = Math.ceil(totalMins / 60);

  useEffect(() => {
    if (totalMins > 0) sendGAEvent("event", "calc_speedup_run", { total_mins: totalMins });
  }, [totalMins]);
  const threeHour = Math.ceil(totalMins / 180);
  const eightHour = Math.ceil(totalMins / 480);
  const oneDay = Math.ceil(totalMins / 1440);

  return (
    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
      <h2 className="text-lg font-bold text-white">⏱️ How Many Speed-Ups Do You Need?</h2>
      <p className="mt-1 text-xs text-purple-400">How many speed-ups do you need?</p>

      <div className="mt-4 flex gap-3">
        <div>
          <label htmlFor="speedup-hours" className="text-xs text-purple-300">Hours</label>
          <input
            id="speedup-hours"
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="0"
            className="mt-1 block w-24 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="speedup-minutes" className="text-xs text-purple-300">Minutes</label>
          <input
            id="speedup-minutes"
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="0"
            className="mt-1 block w-24 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {totalMins > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "1h speed-ups", count: oneHour },
            { label: "3h speed-ups", count: threeHour },
            { label: "8h speed-ups", count: eightHour },
            { label: "24h speed-ups", count: oneDay },
          ].map((row) => (
            <div key={row.label} className="rounded-lg bg-purple-800/30 p-3 text-center">
              <p className="text-xl font-bold text-white">{row.count}</p>
              <p className="text-xs text-purple-400">{row.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Badge Budget Calculator ───────────────────────────────────────────────────

function BadgeBudgetCalc() {
  const [budget, setBudget] = useState("");

  const available = parseInt(budget, 10) || 0;

  useEffect(() => {
    if (available > 0) sendGAEvent("event", "calc_budget_run", { badges: available });
  }, [available]);

  const canMax = trees.filter((t) => t.totalBadges <= available);
  const canPartial = trees.filter((t) => t.totalBadges > available && available > 0);

  return (
    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
      <h2 className="text-lg font-bold text-white">🎖️ Badge Budget</h2>
      <p className="mt-1 text-xs text-purple-400">Which trees can you max with your badge count?</p>

      <div className="mt-4">
        <label htmlFor="badge-budget" className="text-xs text-purple-300">Available badges</label>
        <input
          id="badge-budget"
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. 100000"
          className="mt-1 block w-full max-w-xs rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {available > 0 && (
        <div className="mt-4 space-y-4">
          {canMax.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">
                ✅ Can fully max ({canMax.length} trees)
              </p>
              <div className="space-y-1.5">
                {[...canMax].sort((a, b) => b.totalBadges - a.totalBadges).map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-green-900/20 px-3 py-2 text-sm">
                    <span className="text-green-200">{t.icon} {t.name}</span>
                    <span className="font-mono text-green-400">{fmt(t.totalBadges)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canPartial.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-2">
                ⚠️ Partial only
              </p>
              <div className="space-y-1.5">
                {[...canPartial].sort((a, b) => a.totalBadges - b.totalBadges).map((t) => {
                  const pct = ((available / t.totalBadges) * 100).toFixed(1);
                  return (
                    <div key={t.id} className="rounded-lg bg-yellow-900/10 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-200">{t.icon} {t.name}</span>
                        <span className="font-mono text-yellow-400">{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-purple-900/60">
                        <div className="h-full rounded-full bg-yellow-500/60" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {canMax.length === 0 && canPartial.length === 0 && (
            <p className="text-sm text-purple-400">No trees match. Enter more badges.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Resource Planner ──────────────────────────────────────────────────────────

function ResourcePlanner() {
  const [startLevel, setStartLevel] = useState("1");
  const [endLevel, setEndLevel] = useState("10");

  const start = Math.max(1, Math.min(34, parseInt(startLevel, 10) || 1));
  const end   = Math.max(start + 1, Math.min(35, parseInt(endLevel, 10) || 10));

  useEffect(() => {
    sendGAEvent("event", "calc_resource_plan_run", { from: start, to: end });
  }, [start, end]);

  const slice = hqLevels.filter((l) => l.level > start && l.level <= end);

  const totals = slice.reduce(
    (acc, l) => ({
      wood:  acc.wood  + l.cost.wood,
      food:  acc.food  + l.cost.food,
      zent:  acc.zent  + l.cost.zent,
      steel: acc.steel + l.cost.steel,
    }),
    { wood: 0, food: 0, zent: 0, steel: 0 }
  );

  return (
    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
      <h2 className="text-lg font-bold text-white">🏰 HQ Resource Planner</h2>
      <p className="mt-1 text-xs text-purple-400">Total resources needed to upgrade between two levels.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <div>
          <label htmlFor="resource-from" className="text-xs text-purple-300">From HQ</label>
          <input
            id="resource-from"
            type="number"
            min={1}
            max={34}
            value={startLevel}
            onChange={(e) => setStartLevel(e.target.value)}
            className="mt-1 block w-20 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="resource-to" className="text-xs text-purple-300">To HQ</label>
          <input
            id="resource-to"
            type="number"
            min={2}
            max={35}
            value={endLevel}
            onChange={(e) => setEndLevel(e.target.value)}
            className="mt-1 block w-20 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {slice.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "🪵 Wood",  val: totals.wood },
            { label: "🍖 Food",  val: totals.food },
            { label: "💰 Zent",  val: totals.zent },
            { label: "⚙️ Steel", val: totals.steel },
          ].map((r) => (
            <div key={r.label} className="rounded-lg bg-purple-800/30 p-3">
              <p className="text-xs text-purple-400">{r.label}</p>
              <p className="mt-1 text-base font-bold text-white">{fmt(r.val)}</p>
            </div>
          ))}
        </div>
      )}

      {slice.length > 0 && (
        <p className="mt-3 text-xs text-purple-400/70">
          {slice.length} level{slice.length > 1 ? "s" : ""} · HQ {start} → {end}
        </p>
      )}
    </div>
  );
}

// ── CP Calculator ─────────────────────────────────────────────────────────────

function CPCalc() {
  const [startLevel, setStartLevel] = useState("1");
  const [endLevel, setEndLevel] = useState("10");

  const start = Math.max(1, Math.min(34, parseInt(startLevel, 10) || 1));
  const end   = Math.max(start + 1, Math.min(35, parseInt(endLevel, 10) || 10));

  useEffect(() => {
    sendGAEvent("event", "calc_cp_run", { from: start, to: end });
  }, [start, end]);

  const slice = hqLevels.filter((l) => l.level > start && l.level <= end);
  const totalCP = slice.reduce((s, l) => s + l.cp, 0);
  const hasData = slice.some((l) => l.cp > 0);

  return (
    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
      <h2 className="text-lg font-bold text-white">⭐ CP Calculator</h2>
      <p className="mt-1 text-xs text-purple-400">Combat Power gained from HQ upgrades.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <div>
          <label htmlFor="cp-from" className="text-xs text-purple-300">From HQ</label>
          <input
            id="cp-from"
            type="number"
            min={1}
            max={34}
            value={startLevel}
            onChange={(e) => setStartLevel(e.target.value)}
            className="mt-1 block w-20 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="cp-to" className="text-xs text-purple-300">To HQ</label>
          <input
            id="cp-to"
            type="number"
            min={2}
            max={35}
            value={endLevel}
            onChange={(e) => setEndLevel(e.target.value)}
            className="mt-1 block w-20 rounded-md border border-purple-700 bg-purple-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-purple-800/30 p-4 text-center">
        <p className="text-xs text-purple-400">Total CP Gained</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {hasData ? fmt(totalCP) : "—"}
        </p>
        {!hasData && (
          <p className="mt-1 text-xs text-purple-500">CP data not yet available</p>
        )}
      </div>

      {slice.length > 0 && (
        <p className="mt-2 text-xs text-purple-400/70">
          {slice.length} level{slice.length > 1 ? "s" : ""} · HQ {start} → {end}
        </p>
      )}
    </div>
  );
}

export default function CalcClient() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Calculators</h1>
      <p className="mt-2 text-purple-200/80">All calculations are client-side — nothing is sent to a server.</p>

      <div className="mt-8 space-y-6">
        <SpeedupCalc />
        <BadgeBudgetCalc />
        <ResourcePlanner />
        <CPCalc />
      </div>
    </div>
  );
}
