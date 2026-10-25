import type { MetadataRoute } from "next";
import researchData from "@/data/research.json";
import heroesData from "@/data/heroes.json";
import hqData from "@/data/hq.json";
import seasonsData from "@/data/seasons.json";
import whiteoutData from "@/data/whiteoutSurvival.json";
import lastWarData from "@/data/lastWar.json";

const BASE = "https://www.gamides.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                      priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/events`,                priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/seasons`,               priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/hq`,                    priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/research`,              priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/heroes`,                priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/tank`,                  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/gear`,                  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/pvp`,                   priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/alliance`,              priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/codes`,                 priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/guide`,                 priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/guide/f2p`,             priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/guide/badges`,          priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/guide/canyon-clash`,    priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/guide/server-war`,      priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/guide/zombie-siege`,    priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/guide/troop-formation`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/guide/city-capture`,    priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/guide/migration`,       priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/calc`,                  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/calc/t10`,              priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/whiteout-survival`,         priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/whiteout-survival/events`,  priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/whiteout-survival/furnace`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/whiteout-survival/heroes`,  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/whiteout-survival/calc`,    priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/last-war`,                  priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/last-war/events`,           priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/last-war/hq`,               priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/last-war/heroes`,           priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/last-war/calc`,             priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/profile`,               priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/changelog`,             priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE}/disclosure`,            priority: 0.3, changeFrequency: "yearly" },
  ];

  const seasonRoutes: MetadataRoute.Sitemap = seasonsData.seasons.map((s) => ({
    url: `${BASE}/seasons/${s.id}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const treeRoutes: MetadataRoute.Sitemap = researchData.trees.map((t) => ({
    url: `${BASE}/research/${t.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const hqLevelRoutes: MetadataRoute.Sitemap = hqData.levels.map((l) => ({
    url: `${BASE}/hq/level-${l.level}-requirements`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const whiteoutFurnaceRoutes: MetadataRoute.Sitemap = whiteoutData.furnaceLevels.map((l) => ({
    url: `${BASE}/whiteout-survival/furnace/level-${l.level}-requirements`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const lastWarHqRoutes: MetadataRoute.Sitemap = lastWarData.hqLevels.map((l) => ({
    url: `${BASE}/last-war/hq/level-${l.level}-requirements`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const heroRoutes: MetadataRoute.Sitemap = heroesData.heroes.map((h) => ({
    url: `${BASE}/heroes/${h.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const heroCompareRoutes: MetadataRoute.Sitemap = [];
  const heroes = heroesData.heroes;
  for (let i = 0; i < heroes.length; i++) {
    for (let j = i + 1; j < heroes.length; j++) {
      const id1 = heroes[i].id;
      const id2 = heroes[j].id;
      const canonical = id1 < id2 ? `${id1}-vs-${id2}` : `${id2}-vs-${id1}`;
      heroCompareRoutes.push({
        url: `${BASE}/heroes/${canonical}`,
        priority: 0.6,
        changeFrequency: "monthly" as const,
      });
    }
  }

  return [
    ...staticRoutes,
    ...seasonRoutes,
    ...treeRoutes,
    ...hqLevelRoutes,
    ...whiteoutFurnaceRoutes,
    ...lastWarHqRoutes,
    ...heroRoutes,
    ...heroCompareRoutes,
  ];
}
