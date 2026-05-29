import type { MetadataRoute } from "next";
import researchData from "@/data/research.json";
import heroesData from "@/data/heroes.json";

const BASE = "https://www.gamides.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,          priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/events`,    priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/hq`,        priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/research`,  priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/heroes`,    priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/tank`,      priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/gear`,      priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/pvp`,       priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/guide`,     priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/calc`,      priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/changelog`, priority: 0.5, changeFrequency: "weekly" },
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
