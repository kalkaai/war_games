import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import hqData from "@/data/hq.json";
import type { HQLevel } from "@/types";

const levels = hqData.levels as HQLevel[];

function parseLevelSlug(slug: string): number | null {
  const match = /^level-(\d+)-requirements$/.exec(slug);
  if (!match) return null;
  const lv = parseInt(match[1], 10);
  if (lv < 1 || lv > 35) return null;
  return lv;
}

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}G`;
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

function getMilestoneNote(level: number): string {
  if (level === 8)
    return "Unlocks the Laboratory requirement gate — every HQ upgrade from Level 8 to 35 requires upgrading your Laboratory first.";
  if (level === 11)
    return "Unlocks T4 Troops across Assaulter, Shooter, and Rider camps.";
  if (level === 15)
    return "Mid-game milestone unlocking higher-tier Alliance Recognition and secondary march flexibility.";
  if (level === 20)
    return "Major Season 1 milestone unlocking T7 troops and higher rally capacity.";
  if (level === 24)
    return "Unlocks T8 troops — a critical combat power spike for Season 1 Capitol Clash.";
  if (level === 25)
    return "Dramatically increases base research speed and hero level cap (125).";
  if (level === 27)
    return "Unlocks T9 Troops — the standard competitive baseline before pushing T10.";
  if (level === 30)
    return "The most important gate in Last Z: unlocks the T10 Troop Research path (1,488,100 Courage Badges) and level 150 hero cap.";
  if (level >= 31)
    return "Endgame Steel-tier HQ level. Requires Steel in addition to Wood, Food, and Zent, increasing hero level cap and march capacity for Season 4–5 warfare.";
  return `Increases your Hero Level Cap to ${level * 5} and raises all building level caps to ${level}.`;
}

export function generateStaticParams() {
  return levels.map((l) => ({
    slug: `level-${l.level}-requirements`,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lv = parseLevelSlug(params.slug);
  const hq = levels.find((l) => l.level === lv);
  if (!hq) return {};

  const reqText =
    hq.requiredBuildings.length > 0
      ? hq.requiredBuildings.map((b) => `${b} Lv.${hq.level - 1}`).join(", ")
      : "No prerequisite buildings";

  const title = `HQ Level ${hq.level} Requirements & Cost — GAMIDES | Last Z: Survival Shooter`;
  const description = `Last Z: Survival Shooter HQ Level ${hq.level} upgrade requirements: ${reqText}. Costs ${fmt(hq.cost.wood)} Wood, ${fmt(hq.cost.food)} Food, ${fmt(hq.cost.zent)} Zent${hq.cost.steel > 0 ? `, ${fmt(hq.cost.steel)} Steel` : ""}. Build time: ${fmtTime(hq.buildTimeMinutes)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "https://www.gamides.com/opengraph-image",
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `https://www.gamides.com/hq/level-${hq.level}-requirements`,
    },
  };
}

export default function HQLevelRequirementPage({
  params,
}: {
  params: { slug: string };
}) {
  const lv = parseLevelSlug(params.slug);
  const hq = levels.find((l) => l.level === lv);
  if (!hq) notFound();

  const prevLevel = levels.find((l) => l.level === hq.level - 1);
  const nextLevel = levels.find((l) => l.level === hq.level + 1);

  const cumulativeLevels = levels.filter((l) => l.level <= hq.level);
  const cumulativeCost = cumulativeLevels.reduce(
    (acc, l) => ({
      wood: acc.wood + l.cost.wood,
      food: acc.food + l.cost.food,
      zent: acc.zent + l.cost.zent,
      steel: acc.steel + l.cost.steel,
      mins: acc.mins + l.buildTimeMinutes,
    }),
    { wood: 0, food: 0, zent: 0, steel: 0, mins: 0 }
  );

  const speedups1h = Math.ceil(hq.buildTimeMinutes / 60);
  const speedups3h = Math.ceil(hq.buildTimeMinutes / 180);
  const speedups8h = Math.ceil(hq.buildTimeMinutes / 480);
  const speedups24h = Math.ceil(hq.buildTimeMinutes / 1440);

  const prereqBuildingsFormatted =
    hq.requiredBuildings.length > 0
      ? hq.requiredBuildings.map((b) => `${b} Lv. ${hq.level - 1}`).join(" + ")
      : "None (starter level)";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.gamides.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "HQ Upgrades",
        item: "https://www.gamides.com/hq",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `HQ Level ${hq.level} Requirements`,
        item: `https://www.gamides.com/hq/level-${hq.level}-requirements`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What buildings are required for HQ Level ${hq.level} in Last Z: Survival Shooter?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            hq.requiredBuildings.length > 0
              ? `To upgrade your Headquarters to Level ${hq.level} in Last Z: Survival Shooter, you must first upgrade ${prereqBuildingsFormatted}.`
              : `HQ Level ${hq.level} has no prerequisite building requirements in Last Z: Survival Shooter.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does HQ Level ${hq.level} cost in Last Z: Survival Shooter?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `HQ Level ${hq.level} costs ${fmt(hq.cost.wood)} Wood, ${fmt(hq.cost.food)} Food, ${fmt(hq.cost.zent)} Zent${hq.cost.steel > 0 ? `, and ${fmt(hq.cost.steel)} Steel` : ""}. The base construction time is ${fmtTime(hq.buildTimeMinutes)} (${speedups1h} hours of speed-ups) and unlocks a Hero Level Cap of ${hq.heroesCap}.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Top Breadcrumb & Prev/Next Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/hq"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← All HQ Levels (1–35)
        </Link>

        <div className="flex items-center gap-2">
          {prevLevel && (
            <Link
              href={`/hq/level-${prevLevel.level}-requirements`}
              className="rounded-md border border-purple-700/70 bg-purple-950/60 px-3 py-1.5 text-xs font-medium text-purple-200 transition-colors hover:border-purple-500 hover:text-white"
            >
              ← HQ {prevLevel.level}
            </Link>
          )}
          {nextLevel && (
            <Link
              href={`/hq/level-${nextLevel.level}-requirements`}
              className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-purple-500"
            >
              HQ {nextLevel.level} Requirements →
            </Link>
          )}
        </div>
      </div>

      {/* Main Title Card */}
      <div className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded bg-purple-800 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-200">
              Headquarters Progression Guide
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Last Z HQ Level {hq.level} Requirements &amp; Upgrade Cost
            </h1>
          </div>
          {hq.level === 30 && (
            <span className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-extrabold text-black">
              🔓 Unlocks T10 Troops
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-purple-200/90">
          {getMilestoneNote(hq.level)}
        </p>

        {/* Key KPI Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-purple-800/50 bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Prerequisite Buildings</p>
            <p className="mt-1 text-base font-bold text-white">
              {prereqBuildingsFormatted}
            </p>
          </div>

          <div className="rounded-lg border border-purple-800/50 bg-purple-950/70 p-4">
            <p className="text-xs text-purple-400">Base Build Time</p>
            <p className="mt-1 font-mono text-base font-bold text-white">
              {fmtTime(hq.buildTimeMinutes)}
            </p>
          </div>

          <div className="col-span-2 rounded-lg border border-purple-800/50 bg-purple-950/70 p-4 sm:col-span-1">
            <p className="text-xs text-purple-400">Heroes Level Cap</p>
            <p className="mt-1 font-mono text-base font-bold text-amber-300">
              Lv. {hq.heroesCap}
            </p>
          </div>
        </div>
      </div>

      {/* Resource Breakdown */}
      <section className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-xl font-bold text-white">
          💰 Resource Cost for HQ Level {hq.level}
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Exact resources required to start the HQ {hq.level - 1} → HQ{" "}
          {hq.level} upgrade.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "🪵 Wood", val: hq.cost.wood },
            { label: "🍖 Food", val: hq.cost.food },
            { label: "💰 Zent", val: hq.cost.zent },
            { label: "⚙️ Steel", val: hq.cost.steel },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-purple-800/50 bg-purple-950/60 p-4"
            >
              <p className="text-xs text-purple-300">{item.label}</p>
              <p className="mt-1 font-mono text-xl font-extrabold text-white">
                {fmt(item.val)}
              </p>
              {item.val > 0 && (
                <p className="mt-0.5 font-mono text-[11px] text-purple-400/80">
                  {item.val.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Speed-up Requirements & Calculator Hand-off */}
      <section className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              ⏱️ Speed-Ups Needed for HQ Level {hq.level}
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Save your construction speed-ups for{" "}
              <Link
                href="/events"
                className="font-semibold text-purple-200 underline hover:text-white"
              >
                Tuesday VS Building Day
              </Link>{" "}
              to maximize Alliance Duel points.
            </p>
          </div>
          <Link
            href={`/calc?from=${Math.max(1, hq.level - 1)}&to=${hq.level}&hours=${speedups1h}`}
            className="inline-flex items-center gap-1.5 self-start rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-500"
          >
            Open in Interactive Calculator →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "1-Hour Speed-ups", count: speedups1h },
            { label: "3-Hour Speed-ups", count: speedups3h },
            { label: "8-Hour Speed-ups", count: speedups8h },
            { label: "24-Hour Speed-ups", count: speedups24h },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-purple-950/60 p-3.5 text-center"
            >
              <p className="font-mono text-xl font-extrabold text-white">
                {s.count.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-purple-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cumulative Progression Context */}
      <section className="mt-6 rounded-xl border border-purple-700/60 bg-purple-900/20 p-6">
        <h2 className="text-lg font-bold text-white">
          📈 Cumulative Investment (HQ 1 → HQ {hq.level})
        </h2>
        <p className="mt-1 text-xs text-purple-300">
          Total cumulative Headquarters resources and build time from a fresh
          account up to Level {hq.level}:
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-lg bg-purple-950/50 p-3">
            <p className="text-[11px] text-purple-400">Total Wood</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {fmt(cumulativeCost.wood)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/50 p-3">
            <p className="text-[11px] text-purple-400">Total Food</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {fmt(cumulativeCost.food)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/50 p-3">
            <p className="text-[11px] text-purple-400">Total Zent</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {fmt(cumulativeCost.zent)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-950/50 p-3">
            <p className="text-[11px] text-purple-400">Total Steel</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {fmt(cumulativeCost.steel)}
            </p>
          </div>
          <div className="col-span-2 rounded-lg bg-purple-950/50 p-3 sm:col-span-1">
            <p className="text-[11px] text-purple-400">Total Build Time</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {fmtTime(cumulativeCost.mins)}
            </p>
          </div>
        </div>
      </section>

      {/* Internal Link Mesh: Jump to Any HQ Level */}
      <section className="mt-8 rounded-xl border border-purple-800/50 bg-purple-950/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-purple-300">
          Browse All HQ Level Requirements (1–35)
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {levels.map((l) => (
            <Link
              key={l.level}
              href={`/hq/level-${l.level}-requirements`}
              className={`rounded px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                l.level === hq.level
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-300 hover:bg-purple-800 hover:text-white"
              }`}
            >
              Lv.{l.level}
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
