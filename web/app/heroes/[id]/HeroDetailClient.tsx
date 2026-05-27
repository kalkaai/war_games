"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import type { Hero, HeroFaction, TroopType } from "@/types";

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
  blood_rose:    "border-red-700/60 bg-red-900/20",
  wings_of_dawn: "border-blue-700/60 bg-blue-900/20",
  guard_of_order:"border-yellow-700/60 bg-yellow-900/20",
};

const TIER_COLORS: Record<string, string> = {
  "S+": "bg-amber-500 text-black",
  "S":  "bg-purple-500 text-white",
  "A+": "bg-blue-600 text-white",
  "A":  "bg-blue-800 text-white",
  "B+": "bg-slate-600 text-white",
  "B":  "bg-slate-700 text-white",
  "C":  "bg-slate-800 text-slate-300",
};

const SKILL_TYPE_LABELS: Record<string, string> = {
  normal_attack: "Normal Attack",
  active: "Active",
  passive: "Passive",
  exclusive: "Exclusive",
};

const SKILL_TYPE_COLORS: Record<string, string> = {
  normal_attack: "bg-slate-700 text-slate-200",
  active:        "bg-blue-800 text-blue-200",
  passive:       "bg-purple-800 text-purple-200",
  exclusive:     "bg-amber-700/70 text-amber-200",
};

export default function HeroDetailClient({ hero }: { hero: Hero }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    sendGAEvent("event", "view_hero", { hero_id: hero.id, hero_name: hero.name });
  }, [hero.id, hero.name]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      <Link href="/heroes" className="text-sm text-purple-400 hover:text-purple-300">
        ← All heroes
      </Link>

      {/* Header card */}
      <div className={`mt-6 rounded-xl border p-6 ${FACTION_COLORS[hero.faction]}`}>
        <div className="flex gap-5">
          {/* Portrait */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-purple-900/50">
            {hero.portrait && !imgError ? (
              <Image
                src={hero.portrait}
                alt={hero.name}
                fill
                unoptimized
                className="object-cover object-top"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-purple-300/40">
                {hero.name[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{hero.name}</h1>
              <p className="mt-0.5 text-sm text-purple-300/70">{hero.role}</p>
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${TIER_COLORS[hero.tier] ?? "bg-slate-700 text-white"}`}>
                {hero.tier}
              </span>
              <span className="rounded bg-purple-900/60 px-2 py-0.5 text-xs text-purple-200">
                {FACTION_LABELS[hero.faction]}
              </span>
              <span className="rounded bg-purple-900/60 px-2 py-0.5 text-xs text-purple-200">
                {TROOP_LABELS[hero.troopType]}
              </span>
              {hero.season && (
                <span className="rounded bg-amber-900/40 px-2 py-0.5 text-xs text-amber-300">
                  {hero.season}
                </span>
              )}
              {hero.f2p && (
                <span className="rounded bg-green-800/60 px-2 py-0.5 text-xs font-medium text-green-400">F2P</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Priority */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-purple-800/50 bg-purple-900/20 p-4 text-center">
          <p className="text-xs text-purple-400">PvP</p>
          <p className={`mt-1 rounded px-2 py-0.5 text-lg font-extrabold inline-block ${TIER_COLORS[hero.pvpRating] ?? "text-white"}`}>
            {hero.pvpRating || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-purple-800/50 bg-purple-900/20 p-4 text-center">
          <p className="text-xs text-purple-400">PvE</p>
          <p className={`mt-1 rounded px-2 py-0.5 text-lg font-extrabold inline-block ${TIER_COLORS[hero.pveRating] ?? "text-white"}`}>
            {hero.pveRating || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-purple-800/50 bg-purple-900/20 p-4 text-center">
          <p className="text-xs text-purple-400">Priority</p>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${i < hero.priority ? "bg-purple-400" : "bg-purple-900"}`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-purple-400">{hero.priority}/5</p>
        </div>
      </div>

      {/* Skills */}
      {hero.skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-white">What Skills Does {hero.name} Have?</h2>
          <div className="mt-3 space-y-2">
            {hero.skills.map((sk) => (
              <div
                key={sk.name}
                className="rounded-lg border border-purple-800/40 bg-purple-900/20 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${SKILL_TYPE_COLORS[sk.type] ?? "bg-slate-700 text-slate-200"}`}>
                    {SKILL_TYPE_LABELS[sk.type] ?? sk.type}
                  </span>
                  <span className="text-sm font-semibold text-white">{sk.name}</span>
                </div>
                {sk.description && (
                  <p className="mt-1.5 text-xs text-purple-300/80">{sk.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
