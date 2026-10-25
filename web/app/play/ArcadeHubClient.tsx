"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { GameCategory, GameManifestItem, TemplateId } from "@gamides/minigames";

interface ArcadeHubClientProps {
  games: readonly GameManifestItem[];
}

const CATEGORIES: ("All" | GameCategory)[] = [
  "All",
  "Zombie Combat",
  "Base Building",
  "Survival",
  "Recon & Tech",
  "Resource Ops",
];

const TEMPLATES: { id: "all" | TemplateId; label: string }[] = [
  { id: "all", label: "All 10 Mechanics" },
  { id: "gravity-tap", label: "1. Gravity Tap" },
  { id: "lane-runner", label: "2. 3-Lane Runner" },
  { id: "physics-catcher", label: "3. Physics Catcher" },
  { id: "timing-precision", label: "4. Timing / Precision" },
  { id: "tower-stacker", label: "5. Tower Stacker" },
  { id: "defender-360", label: "6. 360 Defender" },
  { id: "grid-swipe", label: "7. Grid Merge (2048)" },
  { id: "reaction-whack", label: "8. Reaction / Whack" },
  { id: "endless-jumper", label: "9. Endless Jumper" },
  { id: "slingshot-physics", label: "10. Slingshot Physics" },
];

export default function ArcadeHubClient({ games }: ArcadeHubClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | GameCategory>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<"all" | TemplateId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scoresMap, setScoresMap] = useState<
    Record<string, { bestScore: number; cleared?: boolean }>
  >({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("gamides_arcade_scores_v1");
      if (raw) {
        setScoresMap(JSON.parse(raw));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return games.filter((g) => {
      if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
      if (selectedTemplate !== "all" && g.templateId !== selectedTemplate) return false;
      if (
        q &&
        !g.title.toLowerCase().includes(q) &&
        !g.shortDescription.toLowerCase().includes(q) &&
        !g.slug.includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [games, selectedCategory, selectedTemplate, searchQuery]);

  const totalCleared = useMemo(() => {
    return Object.values(scoresMap).filter((s) => s.cleared).length;
  }, [scoresMap]);

  return (
    <div className="space-y-8">
      {/* Player Progression Summary & Filter Bar */}
      <div className="rounded-2xl border border-purple-700/60 bg-purple-900/40 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              🕹️ Survival Mini-Game Catalog ({filteredGames.length} / {games.length})
            </h2>
            <p className="text-xs text-purple-200/80">
              Missions Cleared:{" "}
              <strong className="text-emerald-300">{totalCleared} / 100</strong> • High scores save
              automatically in your browser.
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100 games (e.g. sniper, 2048, hq)..."
              aria-label="Search 100 mini-games"
              className="w-full rounded-lg border border-purple-700/80 bg-purple-950/90 px-3.5 py-2 text-sm text-white placeholder-purple-300/60 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "border border-purple-800/60 bg-purple-950/60 text-purple-200 hover:bg-purple-800/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Template Mechanic Filter */}
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-purple-800/40 pt-3">
          {TEMPLATES.map((tmpl) => {
            const active = selectedTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-purple-950/50 text-purple-300/90 hover:bg-purple-800/50 hover:text-white"
                }`}
              >
                {tmpl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 100 Mini-Games Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => {
          const saved = scoresMap[game.slug];
          const best = saved?.bestScore ?? 0;
          const isCleared = Boolean(saved?.cleared || best >= game.targetScore);

          return (
            <Link
              key={game.slug}
              href={`/play/${game.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-purple-800/60 bg-purple-900/35 p-5 transition-all duration-200 hover:border-purple-500 hover:bg-purple-900/65"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-700/60 bg-purple-950/80 px-2 py-0.5 text-[11px] font-mono text-purple-300">
                    #{game.id} • {game.category}
                  </span>
                  {isCleared ? (
                    <span className="rounded-full bg-emerald-950/90 border border-emerald-500/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      ★ CLEARED ({best})
                    </span>
                  ) : best > 0 ? (
                    <span className="rounded-full bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                      BEST: {best}
                    </span>
                  ) : (
                    <span className="text-[11px] text-purple-300/70">
                      Goal: {game.targetScore}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <span className="text-2xl" aria-hidden="true">
                    {game.iconEmoji}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-200">
                    {game.title}
                  </h3>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-purple-200/80">
                  {game.shortDescription}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-purple-800/40 pt-3 text-xs">
                <span className="text-purple-300/75">{game.templateName}</span>
                <span className="font-semibold text-purple-300 group-hover:text-white">
                  Play Now →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
