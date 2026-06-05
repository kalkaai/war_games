import type { MetadataRoute } from "next";
import researchData from "@/data/research.json";
import heroesData from "@/data/heroes.json";

const BASE = "https://www.gamides.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                      priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/events`,                priority: 0.9, changeFrequency: "weekly" },
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
    { url: `${BASE}/profile`,              priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/changelog`,             priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE}/disclosure`,            priority: 0.3, changeFrequency: "yearly" },
  ];

  const treeRoutes: MetadataRoute.Sitemap = researchData.trees.map((t) => ({
    url: `${BASE}/research/${t.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const heroRoutes: MetadataRoute.Sitemap = heroesData.heroes.map((h) => ({
    url: `${BASE}/heroes/${h.id}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...treeRoutes, ...heroRoutes];
}
