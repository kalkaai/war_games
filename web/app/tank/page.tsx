import type { Metadata } from "next";
import tanksData from "@/data/tanks.json";
import type { Vehicle } from "@/types";

export const metadata: Metadata = {
  title: "Tank & Vehicles — WarGuard | Last Z",
  description: "Last Z vehicle modification guide: Conqueror, Cheetah, Hercules, Destroyer, and Destroyer EX upgrade paths with wrench costs and key upgrades.",
  openGraph: {
    title: "Tank & Vehicles — WarGuard | Last Z",
    description: "Last Z vehicle modification guide: Conqueror, Cheetah, Hercules, Destroyer, and Destroyer EX upgrade paths with wrench costs.",

  },
  alternates: {
    canonical: "https://warguard.app/tank",
  },
};

const vehicles = tanksData.vehicles as Vehicle[];

function fmtWrenches(n: number): string {
  if (n === 0) return "Starter";
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K+ wrenches`;
  return `${n}+ wrenches`;
}

const STAGE_COLORS = [
  "border-slate-700/60 bg-slate-900/30",
  "border-green-800/60 bg-green-900/20",
  "border-blue-800/60 bg-blue-900/20",
  "border-purple-700/60 bg-purple-900/30",
  "border-amber-700/60 bg-amber-900/20",
];

export default function TankPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">

      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z Tank & Vehicles</h1>
      <p className="mt-2 text-purple-300/70">
        Vehicle modification progression · Currency: Golden Wrenches + Blueprints
      </p>

      {/* Timeline */}
      <h2 className="mt-10 text-xl font-bold text-white">How Does Vehicle Progression Work?</h2>
      <div className="mt-4 space-y-4">
        {vehicles.map((vehicle, i) => (
          <div key={vehicle.id} className={`rounded-xl border p-5 ${STAGE_COLORS[i] ?? STAGE_COLORS[0]}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-purple-800/60 px-2 py-0.5 text-xs font-mono text-purple-300">
                    Stage {i + 1}
                  </span>
                  {vehicle.unlockLevel && (
                    <span className="text-xs text-purple-400/70">Lv {vehicle.unlockLevel}+</span>
                  )}
                  {i === vehicles.length - 1 && (
                    <span className="rounded bg-amber-600/70 px-2 py-0.5 text-xs font-semibold text-amber-100">
                      Endgame
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-lg font-bold text-white">{vehicle.name}</h2>
                <p className="text-sm text-purple-300/70">{vehicle.description}</p>
              </div>
              <div className="rounded-lg border border-purple-800/40 bg-purple-900/30 px-4 py-2 text-center">
                <p className="text-xs text-purple-400">Unlock cost</p>
                <p className="text-base font-bold text-white">{fmtWrenches(vehicle.unlockWrenches)}</p>
                {vehicle.totalWrenches && (
                  <p className="mt-0.5 text-xs text-purple-500">{fmtWrenches(vehicle.totalWrenches)} total</p>
                )}
              </div>
            </div>

            {vehicle.keyUpgrades.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-400">
                  Key upgrades
                </p>
                <div className="space-y-2">
                  {vehicle.keyUpgrades.map((upg) => (
                    <div
                      key={upg.name}
                      className="flex items-start gap-3 rounded-lg bg-purple-950/40 px-3 py-2"
                    >
                      <span className="mt-0.5 text-purple-500">▸</span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {upg.name}
                          {upg.level && <span className="ml-2 text-xs text-purple-400">Lv {upg.level}</span>}
                        </p>
                        <p className="text-xs text-purple-300/70">{upg.effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VS Vehicle Day tip */}
      <div className="mt-8 rounded-xl border border-yellow-700/40 bg-yellow-900/10 p-5">
        <h3 className="font-semibold text-yellow-200">🔧 VS Vehicle Day (Monday)</h3>
        <p className="mt-1 text-sm text-yellow-100/70">
          Use Golden Wrenches and Blueprints on Monday for VS event points.
          Save your modifications for Monday to maximise double-dipping on resources and VS score.
        </p>
      </div>

      <p className="mt-6 text-xs text-purple-400/50">
        Unlock costs verified against lastz.stresswar.com. Key upgrade levels are named milestones — individual level costs vary by tier. Last updated May 2026.
      </p>
    </div>
  );
}
