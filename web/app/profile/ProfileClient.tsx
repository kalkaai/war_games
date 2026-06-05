"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import heroesData from "@/data/heroes.json";
import researchData from "@/data/research.json";
import tanksData from "@/data/tanks.json";
import type { Hero, HeroFaction, ResearchTree, TankModification } from "@/types";

const PROFILE_KEY = "wg_profile";
const OWNED_KEY = "wg_heroes_owned";
const TANK_KEY = "wg_tank_mods";

interface PlayerProfile {
  hqLevel: number;
  heroRanks: Record<string, number>;
}

const DEFAULT_PROFILE: PlayerProfile = { hqLevel: 1, heroRanks: {} };

const heroes = heroesData.heroes as Hero[];
const trees = researchData.trees as ResearchTree[];
const mods = tanksData.modifications as TankModification[];

const FACTION_LABELS: Record<HeroFaction, string> = {
  blood_rose: "Blood Rose",
  wings_of_dawn: "Wings of Dawn",
  guard_of_order: "Guard of Order",
};

const FACTION_COLORS: Record<HeroFaction, string> = {
  blood_rose: "border-red-700/60 bg-red-900/20 text-red-200",
  wings_of_dawn: "border-blue-700/60 bg-blue-900/20 text-blue-200",
  guard_of_order: "border-yellow-700/60 bg-yellow-900/20 text-yellow-200",
};

const FACTION_ORDER: HeroFaction[] = ["guard_of_order", "wings_of_dawn", "blood_rose"];

function fmtBadges(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getCurrentVehicle(completed: Set<number>): string {
  const vehicleMods = mods.filter((m) => m.vehicleUnlock);
  let current = "Conqueror";
  for (const mod of vehicleMods) {
    if (completed.has(mod.level)) current = mod.vehicleUnlock!;
  }
  return current;
}

function readLocalProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_PROFILE;
}

function writeLocalProfile(p: PlayerProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [ownedHeroes, setOwnedHeroes] = useState<Set<string>>(new Set());
  const [researchProgress, setResearchProgress] = useState<Record<string, Set<string>>>({});
  const [tankCompleted, setTankCompleted] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load research + tank from localStorage (these stay local for now)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(OWNED_KEY);
      if (raw) setOwnedHeroes(new Set(JSON.parse(raw) as string[]));
    } catch { /* ignore */ }

    const progress: Record<string, Set<string>> = {};
    for (const tree of trees) {
      try {
        const raw = localStorage.getItem(`wg_research_${tree.id}`);
        progress[tree.id] = raw ? new Set(JSON.parse(raw) as string[]) : new Set();
      } catch { progress[tree.id] = new Set(); }
    }
    setResearchProgress(progress);

    try {
      const raw = localStorage.getItem(TANK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTankCompleted(new Set(parsed as number[]));
      }
    } catch { /* ignore */ }
  }, []);

  // Load profile — from Firestore if logged in, localStorage otherwise
  useEffect(() => {
    if (isLoading) return;

    if (isLoggedIn) {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((serverProfile) => {
          // If server has default profile, migrate localStorage data
          const local = readLocalProfile();
          const hasLocalData = local.hqLevel > 1 || Object.keys(local.heroRanks).length > 0;
          const serverIsDefault = serverProfile.hqLevel === 1 && Object.keys(serverProfile.heroRanks ?? {}).length === 0;

          if (serverIsDefault && hasLocalData) {
            setProfile(local);
            fetch("/api/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(local),
            }).catch(() => null);
          } else {
            setProfile({ ...DEFAULT_PROFILE, ...serverProfile });
          }
        })
        .catch(() => setProfile(readLocalProfile()))
        .finally(() => setLoaded(true));
    } else {
      setProfile(readLocalProfile());
      setLoaded(true);
    }
  }, [isLoggedIn, isLoading]);

  const saveProfile = useCallback((next: PlayerProfile) => {
    setProfile(next);
    if (isLoggedIn) {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      }).catch(() => null);
    } else {
      writeLocalProfile(next);
    }
  }, [isLoggedIn]);

  const ownedHeroObjects = heroes.filter((h) => ownedHeroes.has(h.id));

  if (isLoading || !loaded) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl border border-purple-700/30 bg-purple-900/20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Auth banner */}
      {!isLoggedIn ? (
        <div className="rounded-xl border border-purple-600/40 bg-purple-900/20 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-purple-200/80">
            Sign in with Discord to sync your progress across devices.
          </p>
          <button
            onClick={() => signIn("discord")}
            className="shrink-0 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4752C4] transition-colors"
          >
            Sign in with Discord
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-purple-700/40 bg-purple-900/20 px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-purple-200/80">
            Signed in as <span className="text-white font-medium">{session.user?.name}</span> — progress syncs across devices.
          </p>
          <button
            onClick={() => signOut()}
            className="text-xs text-purple-400 hover:text-purple-200 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}

      {/* HQ Level */}
      <section aria-labelledby="hq-heading" className="rounded-xl border border-purple-700/60 bg-purple-800/50 p-6">
        <h2 id="hq-heading" className="text-lg font-semibold text-white mb-4">HQ Level</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={35}
            value={profile.hqLevel}
            onChange={(e) => {
              const v = Math.max(1, Math.min(35, parseInt(e.target.value) || 1));
              saveProfile({ ...profile, hqLevel: v });
            }}
            aria-label="HQ level"
            className="w-24 rounded-lg border border-purple-600/60 bg-purple-900/40 px-3 py-2 text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-purple-200/80 text-sm">/ 35</span>
        </div>
      </section>

      {/* Hero Roster */}
      <section aria-labelledby="heroes-heading" className="rounded-xl border border-purple-700/60 bg-purple-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="heroes-heading" className="text-lg font-semibold text-white">Hero Roster</h2>
          <Link href="/heroes" className="text-sm text-purple-300 hover:text-white transition-colors">
            Manage owned →
          </Link>
        </div>
        {ownedHeroObjects.length === 0 ? (
          <p className="text-purple-200/80 text-sm">
            No heroes marked as owned yet.{" "}
            <Link href="/heroes" className="text-purple-300 underline hover:text-white">
              Go to Heroes
            </Link>{" "}
            to mark which heroes you have, then set their ranks here.
          </p>
        ) : (
          <div className="space-y-6">
            {FACTION_ORDER.map((faction) => {
              const factionHeroes = ownedHeroObjects.filter((h) => h.faction === faction);
              if (factionHeroes.length === 0) return null;
              return (
                <div key={faction}>
                  <span className={`inline-block text-xs font-medium mb-3 px-2 py-0.5 rounded border ${FACTION_COLORS[faction]}`}>
                    {FACTION_LABELS[faction]}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {factionHeroes.map((hero) => (
                      <HeroRankCard
                        key={hero.id}
                        hero={hero}
                        rank={profile.heroRanks[hero.id] ?? 0}
                        onRankChange={(rank) =>
                          saveProfile({ ...profile, heroRanks: { ...profile.heroRanks, [hero.id]: rank } })
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Research */}
      <section aria-labelledby="research-heading" className="rounded-xl border border-purple-700/60 bg-purple-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="research-heading" className="text-lg font-semibold text-white">Research</h2>
          <Link href="/research" className="text-sm text-purple-300 hover:text-white transition-colors">
            View all trees →
          </Link>
        </div>
        <div className="space-y-3">
          {trees.map((tree) => {
            const completed = researchProgress[tree.id] ?? new Set<string>();
            const completedNodes = tree.nodes.filter((n) => completed.has(n.id));
            const spentBadges = completedNodes.reduce((s, n) => s + n.totalBadges, 0);
            const pct = tree.nodes.length > 0
              ? Math.min(100, (completedNodes.length / tree.nodes.length) * 100)
              : 0;
            return (
              <Link key={tree.id} href={`/research/${tree.id}`} className="block group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-purple-100/90 group-hover:text-white transition-colors">
                    {tree.icon} {tree.name}
                  </span>
                  <span className="text-xs text-purple-400">
                    {completedNodes.length}/{tree.nodes.length}
                    {spentBadges > 0 && <> · {fmtBadges(spentBadges)}</>}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${tree.name} progress`}
                  className="h-1.5 overflow-hidden rounded-full bg-purple-900/60"
                >
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${pct.toFixed(1)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Vehicle */}
      <section aria-labelledby="vehicle-heading" className="rounded-xl border border-purple-700/60 bg-purple-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="vehicle-heading" className="text-lg font-semibold text-white">Vehicle</h2>
          <Link href="/tank" className="text-sm text-purple-300 hover:text-white transition-colors">
            Track modifications →
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-purple-200/80 text-sm">Current:</span>
          <span className="font-semibold text-white">{getCurrentVehicle(tankCompleted)}</span>
        </div>
        {tankCompleted.size > 0 ? (
          <p className="mt-1 text-xs text-purple-400">
            {tankCompleted.size} of {mods.length} modifications complete
          </p>
        ) : (
          <p className="mt-2 text-xs text-purple-400">
            No modifications tracked yet.{" "}
            <Link href="/tank" className="text-purple-300 underline hover:text-white">
              Go to Vehicles
            </Link>{" "}
            to track your progress.
          </p>
        )}
      </section>
    </div>
  );
}

function HeroRankCard({ hero, rank, onRankChange }: {
  hero: Hero;
  rank: number;
  onRankChange: (rank: number) => void;
}) {
  return (
    <div className="rounded-lg border border-purple-700/40 bg-purple-900/30 p-2 flex flex-col items-center gap-1.5">
      {hero.portrait ? (
        <Image
          src={hero.portrait}
          alt={hero.name}
          width={48}
          height={48}
          unoptimized
          className="rounded-full object-cover w-12 h-12"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-purple-800/60 flex items-center justify-center text-purple-400 text-xs">
          ?
        </div>
      )}
      <span className="text-xs font-medium text-white text-center leading-tight line-clamp-1">
        {hero.name}
      </span>
      <div className="flex gap-0.5" role="group" aria-label={`${hero.name} star rank`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRankChange(star === rank ? 0 : star)}
            aria-label={`${star <= rank ? "Remove" : "Set"} ${hero.name} rank ${star}`}
            className={`text-sm leading-none transition-colors ${
              star <= rank ? "text-amber-400 hover:text-amber-300" : "text-purple-500/50 hover:text-purple-300"
            }`}
          >
            {star <= rank ? "★" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}
