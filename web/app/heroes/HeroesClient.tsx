"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import heroesData from "@/data/heroes.json";
import type { Hero, HeroFaction, TroopType } from "@/types";

const heroes = heroesData.heroes as Hero[];
const OWNED_KEY = "wg_heroes_owned";

const TIER_ORDER: Record<string, number> = {
  "S+": 0, "S": 1, "A+": 2, "A": 3, "B+": 4, "B": 5, "C": 6,
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

type Filter = HeroFaction | "all" | "owned";
type SortMode = "tier" | "priority";

function RatingBadge({ label, rating }: { label: string; rating: string }) {
  const color = TIER_COLORS[rating] ?? "bg-slate-800 text-slate-300";
  return (
    <span className="flex items-center gap-1">
      <span className="text-purple-400/60">{label}</span>
      <span className={`rounded px-1 py-0.5 text-xs font-bold ${color}`}>{rating || "—"}</span>
    </span>
  );
}

function PriorityDots({ priority }: { priority: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < priority ? "bg-purple-400" : "bg-purple-900"}`}
        />
      ))}
    </div>
  );
}

function HeroCard({ hero, owned, onToggleOwned }: { hero: Hero; owned: boolean; onToggleOwned: (id: string) => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative rounded-xl border transition-all hover:scale-[1.02] hover:brightness-110 ${FACTION_COLORS[hero.faction]}`}>
      {/* Owned toggle — sibling of Link, not nested inside it */}
      <button
        onClick={() => onToggleOwned(hero.id)}
        aria-label={owned ? `${hero.name} owned — click to unmark` : `Mark ${hero.name} as owned`}
        className={`absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          owned
            ? "bg-green-500 text-white"
            : "bg-black/40 text-white/50 hover:bg-black/60 hover:text-white"
        }`}
      >
        {owned ? "✓" : "+"}
      </button>

      <Link href={`/heroes/${hero.id}`} className="block p-4">
        {/* Portrait */}
        <div className="relative mx-auto mb-3 h-24 w-24 overflow-hidden rounded-lg bg-purple-800/50">
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
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-purple-300/40">
              {hero.name[0]}
            </div>
          )}
          {/* Tier badge */}
          <span className={`absolute right-1 top-1 rounded px-1.5 py-0.5 text-xs font-bold ${TIER_COLORS[hero.tier] ?? "bg-slate-700 text-white"}`}>
            {hero.tier}
          </span>
        </div>

        <p className="text-center text-sm font-bold text-white">{hero.name}</p>
        <p className="mt-0.5 text-center text-xs text-purple-400/70">{TROOP_LABELS[hero.troopType]}</p>
        <p className="mt-0.5 text-center text-xs text-purple-300/60">{hero.role}</p>

        {/* PvP / PvE ratings */}
        <div className="mt-2 flex justify-center gap-2 text-xs">
          <RatingBadge label="PvP" rating={hero.pvpRating} />
          <RatingBadge label="PvE" rating={hero.pveRating} />
        </div>

        {/* Priority + F2P */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <PriorityDots priority={hero.priority} />
          {hero.f2p && (
            <span className="rounded bg-green-800/60 px-1.5 py-0.5 text-xs font-medium text-green-400">F2P</span>
          )}
        </div>

        {hero.season && (
          <p className="mt-1.5 text-center text-xs text-amber-400/70">{hero.season}</p>
        )}
      </Link>
    </div>
  );
}

export default function HeroesClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortMode>("tier");
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [ownedLoaded, setOwnedLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(OWNED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setOwned(new Set(parsed as string[]));
      }
    } catch {
      // ignore
    }
    setOwnedLoaded(true);
  }, []);

  function toggleOwned(heroId: string) {
    setOwned((prev) => {
      const next = new Set(prev);
      const nowOwned = !prev.has(heroId);
      if (nowOwned) next.add(heroId); else next.delete(heroId);
      sendGAEvent("event", "hero_owned_toggle", { hero: heroId, owned: nowOwned });
      try {
        localStorage.setItem(OWNED_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const factions: HeroFaction[] = ["blood_rose", "wings_of_dawn", "guard_of_order"];

  const filtered = heroes
    .filter((h) => {
      if (filter === "owned") return ownedLoaded && owned.has(h.id);
      if (filter === "all") return true;
      return h.faction === filter;
    })
    .sort((a, b) =>
      sort === "priority"
        ? b.priority - a.priority || (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99)
        : (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99)
    );

  const ownedCount = ownedLoaded ? owned.size : 0;

  return (
    <div>
      {ownedLoaded && ownedCount > 0 && (
        <p className="mt-1 text-sm text-purple-300">
          <span className="font-semibold text-white">{ownedCount}</span> / {heroes.length} owned
        </p>
      )}

      {/* Filter + Sort */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => { sendGAEvent("event", "filter_faction", { faction: "all" }); setFilter("all"); }}
          aria-pressed={filter === "all"}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === "all" ? "bg-purple-600 text-white" : "border border-purple-700 text-purple-300 hover:border-purple-500"}`}
        >
          All ({heroes.length})
        </button>
        {factions.map((f) => {
          const count = heroes.filter((h) => h.faction === f).length;
          return (
            <button
              key={f}
              onClick={() => { sendGAEvent("event", "filter_faction", { faction: f }); setFilter(f); }}
              aria-pressed={filter === f}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === f ? "bg-purple-600 text-white" : "border border-purple-700 text-purple-300 hover:border-purple-500"}`}
            >
              {FACTION_LABELS[f]} ({count})
            </button>
          );
        })}
        {ownedLoaded && ownedCount > 0 && (
          <button
            onClick={() => { sendGAEvent("event", "filter_faction", { faction: "owned" }); setFilter("owned"); }}
            aria-pressed={filter === "owned"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === "owned" ? "bg-green-600 text-white" : "border border-green-800 text-green-400 hover:border-green-600"}`}
          >
            Owned ({ownedCount})
          </button>
        )}

        <div className="ml-auto flex gap-1">
          <button
            onClick={() => { sendGAEvent("event", "sort_heroes", { sort: "tier" }); setSort("tier"); }}
            aria-pressed={sort === "tier"}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${sort === "tier" ? "bg-purple-700 text-white" : "border border-purple-800 text-purple-400 hover:border-purple-600"}`}
          >
            Sort: Tier
          </button>
          <button
            onClick={() => { sendGAEvent("event", "sort_heroes", { sort: "priority" }); setSort("priority"); }}
            aria-pressed={sort === "priority"}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${sort === "priority" ? "bg-purple-700 text-white" : "border border-purple-800 text-purple-400 hover:border-purple-600"}`}
          >
            Sort: Priority
          </button>
        </div>
      </div>

      {/* Faction label */}
      {filter !== "all" && filter !== "owned" && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-purple-300">
            {FACTION_LABELS[filter as HeroFaction]} — troops:{" "}
            <strong className="text-white">
              {filter === "blood_rose" ? "Assaulters" : filter === "wings_of_dawn" ? "Shooters" : "Riders"}
            </strong>
          </span>
        </div>
      )}

      {/* Hero grid */}
      <h2 className="mt-6 text-xl font-bold text-white">Which Heroes Should You Prioritize?</h2>
      <p className="mt-1 text-xs text-purple-400">
        Tap <span className="font-bold text-white">+</span> on a hero card to mark them as owned.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((hero) => (
          <HeroCard
            key={hero.id}
            hero={hero}
            owned={ownedLoaded && owned.has(hero.id)}
            onToggleOwned={toggleOwned}
          />
        ))}
      </div>

      {filter === "owned" && filtered.length === 0 && (
        <div className="mt-8 rounded-xl border border-purple-800/40 bg-purple-900/20 p-8 text-center">
          <p className="text-purple-400">No heroes marked as owned yet.</p>
          <p className="mt-1 text-sm text-purple-500">Tap the + button on any hero card to add them.</p>
        </div>
      )}

      <p className="mt-8 text-xs text-purple-300/70">
        Tier list based on Season 4 community rankings.
      </p>
    </div>
  );
}