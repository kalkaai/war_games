"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import heroesData from "@/data/heroes.json";
import type { Hero, HeroFaction, TroopType } from "@/types";

const allHeroes = heroesData.heroes as Hero[];

const TIER_SCORE: Record<string, number> = {
  "S+": 6,
  S: 5,
  "A+": 4,
  A: 3,
  "B+": 2,
  B: 1,
  C: 0,
};

const FACTION_LABELS: Record<HeroFaction, string> = {
  blood_rose: "Blood Rose",
  wings_of_dawn: "Wings of Dawn",
  guard_of_order: "Guard of Order",
};

const TROOP_LABELS: Record<TroopType, string> = {
  assaulter: "⚔️ Assaulter",
  shooter: "🎯 Shooter",
  rider: "🏇 Rider",
};

const FACTION_COLORS: Record<HeroFaction, string> = {
  blood_rose: "border-red-700/60 bg-red-900/20",
  wings_of_dawn: "border-blue-700/60 bg-blue-900/20",
  guard_of_order: "border-yellow-700/60 bg-yellow-900/20",
};

const TIER_COLORS: Record<string, string> = {
  "S+": "bg-amber-500 text-black",
  S: "bg-purple-500 text-white",
  "A+": "bg-blue-600 text-white",
  A: "bg-blue-800 text-white",
  "B+": "bg-slate-600 text-white",
  B: "bg-slate-700 text-white",
  C: "bg-slate-800 text-slate-300",
};

const SKILL_TYPES = [
  { key: "normal_attack", label: "Normal Attack" },
  { key: "active", label: "Active Skill" },
  { key: "passive", label: "Passive Skill" },
  { key: "exclusive", label: "Exclusive Weapon" },
] as const;

function getCounterAdvantage(a: TroopType, b: TroopType): "a" | "b" | "tie" {
  if (a === b) return "tie";
  if (
    (a === "assaulter" && b === "rider") ||
    (a === "rider" && b === "shooter") ||
    (a === "shooter" && b === "assaulter")
  ) {
    return "a";
  }
  return "b";
}

function getCanonicalPairSlug(id1: string, id2: string): string {
  return id1 < id2 ? `${id1}-vs-${id2}` : `${id2}-vs-${id1}`;
}

export default function HeroCompareClient({
  heroA,
  heroB,
}: {
  heroA: Hero;
  heroB: Hero;
}) {
  const [imgErrorA, setImgErrorA] = useState(false);
  const [imgErrorB, setImgErrorB] = useState(false);

  useEffect(() => {
    sendGAEvent("event", "view_hero_comparison", {
      hero_a: heroA.id,
      hero_b: heroB.id,
    });
  }, [heroA.id, heroB.id]);

  const scoreA =
    (TIER_SCORE[heroA.tier] ?? 0) * 10 +
    (TIER_SCORE[heroA.pvpRating] ?? 0) * 3 +
    (TIER_SCORE[heroA.pveRating] ?? 0) * 2 +
    heroA.priority * 2;
  const scoreB =
    (TIER_SCORE[heroB.tier] ?? 0) * 10 +
    (TIER_SCORE[heroB.pvpRating] ?? 0) * 3 +
    (TIER_SCORE[heroB.pveRating] ?? 0) * 2 +
    heroB.priority * 2;

  const counterWinner = getCounterAdvantage(heroA.troopType, heroB.troopType);
  const sameFaction = heroA.faction === heroB.faction;
  const overallWinner =
    scoreA > scoreB ? heroA : scoreB > scoreA ? heroB : null;

  const relatedHeroes = allHeroes
    .filter((h) => h.id !== heroA.id && h.id !== heroB.id)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/heroes"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← All Heroes &amp; Tier List
        </Link>
        <Link
          href="/seasons"
          className="text-xs font-semibold text-purple-300 hover:text-white"
        >
          Calculate Fragment Pivot Cost in Seasons Hub →
        </Link>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
        {heroA.name} vs {heroB.name} — Last Z Hero Comparison
      </h1>
      <p className="mt-2 text-purple-200/85">
        Side-by-side comparison of <strong>{heroA.name}</strong> ({heroA.tier}{" "}
        {FACTION_LABELS[heroA.faction]}) and <strong>{heroB.name}</strong> (
        {heroB.tier} {FACTION_LABELS[heroB.faction]}) in Last Z: Survival
        Shooter.
      </p>

      {/* Head-to-Head Hero Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { hero: heroA, imgErr: imgErrorA, setImgErr: setImgErrorA },
          { hero: heroB, imgErr: imgErrorB, setImgErr: setImgErrorB },
        ].map(({ hero, imgErr, setImgErr }) => (
          <div
            key={hero.id}
            className={`rounded-xl border p-6 ${FACTION_COLORS[hero.faction]}`}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-purple-800/50">
                {hero.portrait && !imgErr ? (
                  <Image
                    src={hero.portrait}
                    alt={hero.name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-purple-300/40">
                    {hero.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/heroes/${hero.id}`}
                    className="text-2xl font-extrabold text-white hover:text-purple-200"
                  >
                    {hero.name}
                  </Link>
                  <span
                    className={`rounded px-2.5 py-0.5 text-xs font-extrabold ${
                      TIER_COLORS[hero.tier] ?? "bg-slate-700 text-white"
                    }`}
                  >
                    {hero.tier} Tier
                  </span>
                </div>
                <p className="mt-1 text-sm text-purple-200/80">{hero.role}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded bg-purple-900/70 px-2 py-0.5 text-xs text-purple-200">
                    {FACTION_LABELS[hero.faction]}
                  </span>
                  <span className="rounded bg-purple-900/70 px-2 py-0.5 text-xs text-purple-200">
                    {TROOP_LABELS[hero.troopType]}
                  </span>
                  <span className="rounded bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300">
                    {hero.season ?? "Base Roster"}
                  </span>
                  {hero.f2p && (
                    <span className="rounded bg-green-800/60 px-2 py-0.5 text-xs font-semibold text-green-300">
                      F2P Friendly
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-purple-700/40 pt-4 text-center">
              <div className="rounded-lg bg-purple-950/60 p-2.5">
                <p className="text-[11px] text-purple-400">PvP Rating</p>
                <p className="mt-0.5 text-base font-extrabold text-white">
                  {hero.pvpRating}
                </p>
              </div>
              <div className="rounded-lg bg-purple-950/60 p-2.5">
                <p className="text-[11px] text-purple-400">PvE Rating</p>
                <p className="mt-0.5 text-base font-extrabold text-white">
                  {hero.pveRating}
                </p>
              </div>
              <div className="rounded-lg bg-purple-950/60 p-2.5">
                <p className="text-[11px] text-purple-400">Priority</p>
                <p className="mt-0.5 text-base font-extrabold text-purple-200">
                  {hero.priority} / 5
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automated Verdict & Synergy Box */}
      <section className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/30 p-6">
        <h2 className="text-xl font-bold text-white">
          🏆 Investment Verdict: Should You Build {heroA.name} or {heroB.name}?
        </h2>

        <div className="mt-4 space-y-3 text-sm text-purple-100/90">
          <p>
            <strong>Overall Meta Priority:</strong>{" "}
            {overallWinner ? (
              <>
                <strong className="text-amber-300">{overallWinner.name}</strong>{" "}
                ranks higher overall ({overallWinner.tier} tier,{" "}
                {overallWinner.priority}/5 investment priority, PvP{" "}
                {overallWinner.pvpRating} / PvE {overallWinner.pveRating}) and
                should receive your Universal Gold Hero Fragments first.
              </>
            ) : (
              <>
                Both <strong>{heroA.name}</strong> and{" "}
                <strong>{heroB.name}</strong> sit in the exact same{" "}
                <strong className="text-amber-300">{heroA.tier}</strong> meta
                bracket ({heroA.priority}/5 priority). Your choice depends on
                your primary troop faction.
              </>
            )}
          </p>

          <p>
            <strong>Faction &amp; Troop Matchup:</strong>{" "}
            {sameFaction ? (
              <>
                Both heroes belong to{" "}
                <strong>{FACTION_LABELS[heroA.faction]}</strong> and command{" "}
                <strong>{TROOP_LABELS[heroA.troopType]}</strong> troops. Rather
                than choosing only one, they can be paired together in the same
                5-hero formation to activate full faction aura buffs!
              </>
            ) : counterWinner === "a" ? (
              <>
                <strong>{heroA.name}</strong> ({TROOP_LABELS[heroA.troopType]})
                holds the natural troop counter advantage over{" "}
                <strong>{heroB.name}</strong> ({TROOP_LABELS[heroB.troopType]}),
                dealing bonus counter damage in direct head-to-head PvP clashes.
              </>
            ) : (
              <>
                <strong>{heroB.name}</strong> ({TROOP_LABELS[heroB.troopType]})
                holds the natural troop counter advantage over{" "}
                <strong>{heroA.name}</strong> ({TROOP_LABELS[heroA.troopType]}),
                dealing bonus counter damage in direct head-to-head PvP clashes.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Side-by-Side Skill Breakdown Table */}
      <section className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          ⚡ Skill-by-Skill Comparison
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-purple-700/60 text-purple-200">
                <th className="py-3 pr-4 font-semibold">Skill Slot</th>
                <th className="px-4 py-3 font-semibold">{heroA.name}</th>
                <th className="pl-4 py-3 font-semibold">{heroB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800/40">
              {SKILL_TYPES.map((slot) => {
                const skillA = heroA.skills.find((s) => s.type === slot.key);
                const skillB = heroB.skills.find((s) => s.type === slot.key);
                return (
                  <tr key={slot.key}>
                    <td className="py-3.5 pr-4 align-top font-semibold text-purple-300 whitespace-nowrap">
                      {slot.label}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      {skillA ? (
                        <div>
                          <p className="font-bold text-white">{skillA.name}</p>
                          {skillA.description && (
                            <p className="mt-1 text-xs text-purple-200/80">
                              {skillA.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-purple-400/60">—</span>
                      )}
                    </td>
                    <td className="pl-4 py-3.5 align-top">
                      {skillB ? (
                        <div>
                          <p className="font-bold text-white">{skillB.name}</p>
                          {skillB.description && (
                            <p className="mt-1 text-xs text-purple-200/80">
                              {skillB.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-purple-400/60">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Matchups Mesh */}
      <section className="mt-8 rounded-xl border border-purple-800/50 bg-purple-950/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-purple-300">
          More Hero Matchups Involving {heroA.name} &amp; {heroB.name}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {relatedHeroes.map((other) => (
            <Link
              key={`a-${other.id}`}
              href={`/heroes/${getCanonicalPairSlug(heroA.id, other.id)}`}
              className="rounded-lg border border-purple-800/50 bg-purple-900/30 px-3 py-2 text-xs font-medium text-purple-200 transition-colors hover:border-purple-600 hover:text-white"
            >
              {heroA.name} vs {other.name} →
            </Link>
          ))}
          {relatedHeroes.map((other) => (
            <Link
              key={`b-${other.id}`}
              href={`/heroes/${getCanonicalPairSlug(heroB.id, other.id)}`}
              className="rounded-lg border border-purple-800/50 bg-purple-900/30 px-3 py-2 text-xs font-medium text-purple-200 transition-colors hover:border-purple-600 hover:text-white"
            >
              {heroB.name} vs {other.name} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
