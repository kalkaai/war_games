import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Last Z Survival Shooter Redeem Codes June 2026 — GAMIDES",
  description:
    "All active Last Z: Survival Shooter redeem codes for June 2026. Free diamonds, speed-ups, badges, and resources. Updated regularly. Includes how-to-redeem steps.",
  openGraph: {
    title: "Last Z Survival Shooter Redeem Codes June 2026 — GAMIDES",
    description:
      "All active Last Z: Survival Shooter redeem codes for June 2026. Free diamonds, speed-ups, badges, and resources.",
  },
  alternates: {
    canonical: "https://www.gamides.com/codes",
  },
};

const ACTIVE_CODES = [
  {
    code: "WELCOMELZNF",
    rewards: "Misc. free rewards",
    notes: "Official community welcome code — released May 2026",
    status: "active" as const,
  },
  {
    code: "WELCOMELZFB",
    rewards: "Misc. free rewards",
    notes: "Official Facebook channel welcome code",
    status: "active" as const,
  },
  {
    code: "WELCOMELZDC",
    rewards: "Misc. free rewards",
    notes: "Official Discord channel welcome code",
    status: "active" as const,
  },
  {
    code: "WELCOMELZX",
    rewards: "Misc. free rewards",
    notes: "Official X / Twitter channel welcome code",
    status: "active" as const,
  },
  {
    code: "ZOMBIESIEGETIME",
    rewards: "Misc. free rewards",
    notes: "Active — added May 2026",
    status: "active" as const,
  },
  {
    code: "FIRSTHUSTLE1L5",
    rewards: "Misc. free rewards",
    notes: "Active — added May 2026",
    status: "active" as const,
  },
  {
    code: "WEEKLYMOTIV8Y3",
    rewards: "Misc. free rewards",
    notes: "Active — added May 2026",
    status: "active" as const,
  },
  {
    code: "MAYWEMARCHON",
    rewards: "Misc. free rewards",
    notes: "Active — added May 2026",
    status: "active" as const,
  },
  {
    code: "FLOWER2026JOY",
    rewards: "Misc. free rewards",
    notes: "Active — added May 2026",
    status: "active" as const,
  },
  {
    code: "CHIHUYFC",
    rewards: "Misc. free rewards",
    notes: "Active across multiple sources",
    status: "active" as const,
  },
  {
    code: "THANU250KCOM",
    rewards: "Golden Wrench ×1, Modification Blueprint ×500, Blue Zent Chest ×1, 1h Speed-Up ×1, Diamonds ×100",
    notes: "Community 250K milestone — try it",
    status: "try" as const,
  },
  {
    code: "VICTORY280K4UT",
    rewards: "Prime Recruitment Ticket ×3, 5m Speed-Up ×10, Electricity 10k ×10, Food 10k ×10, Wood 4k ×10",
    notes: "Community 280K milestone — try it",
    status: "try" as const,
  },
  {
    code: "LZHAPPY2026",
    rewards: "Misc. free rewards",
    notes: "New Year 2026 code — may still be active",
    status: "try" as const,
  },
  {
    code: "2026ISCOMING",
    rewards: "Misc. free rewards",
    notes: "New Year 2026 code — may still be active",
    status: "try" as const,
  },
  {
    code: "LASTZXMAS2425",
    rewards: "Badge ×300, 1h Research Speed-Up ×1, Blue Zent Chest ×2, Blue Electricity Chest ×2, Diamonds ×100",
    notes: "Christmas 2024/25 — likely expired but worth trying",
    status: "try" as const,
  },
];

const REDEEM_STEPS = [
  "Open Last Z and tap your avatar icon in the top-left corner.",
  "Tap the gear ⚙️ icon to open Settings and copy your UID (14–16 digit Player ID).",
  "In a browser, go to the official gift centre: last-z.com/giftCenter",
  "Log in with your UID and complete the captcha.",
  "Enter or paste the code exactly (codes are case-sensitive).",
  "Tap Confirm, then open your in-game Mailbox to collect rewards.",
];

const STATUS_STYLES = {
  active: {
    row: "border-green-800/30",
    badge: "bg-green-900/40 text-green-300 border border-green-700/50",
    label: "Active",
  },
  try: {
    row: "border-purple-800/30",
    badge: "bg-purple-900/40 text-purple-300 border border-purple-700/50",
    label: "Try it",
  },
};

export default function CodesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
        Last Z Redeem Codes — June 2026
      </h1>
      <p className="mt-2 text-purple-200/80">
        All known active and recent codes. Updated regularly. Codes are case-sensitive — paste, do not type.
      </p>

      {/* Last updated + official link */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-purple-800/40 bg-purple-900/20 px-4 py-3 text-sm">
        <span className="text-purple-400">
          Last updated: <span className="font-semibold text-white">June 1, 2026</span>
        </span>
        <a
          href="https://last-z.com/giftCenter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 underline hover:text-white transition-colors"
        >
          Official Gift Centre →
        </a>
      </div>

      {/* Code table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-purple-800/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-800/40 bg-purple-900/40">
              <th className="px-4 py-3 text-left font-semibold text-purple-300">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-purple-300">Rewards</th>
              <th className="hidden px-4 py-3 text-left font-semibold text-purple-300 sm:table-cell">Notes</th>
              <th className="px-4 py-3 text-left font-semibold text-purple-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVE_CODES.map((c, i) => {
              const s = STATUS_STYLES[c.status];
              return (
                <tr
                  key={c.code}
                  className={`border-b ${s.row} ${i % 2 === 0 ? "bg-purple-950/20" : "bg-purple-900/10"}`}
                >
                  <td className="px-4 py-3">
                    <code className="select-all rounded bg-purple-900/60 px-2 py-0.5 font-mono text-xs text-amber-300">
                      {c.code}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-purple-200/90">{c.rewards}</td>
                  <td className="hidden px-4 py-3 text-purple-400/80 sm:table-cell">{c.notes}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-purple-400/70">
        &ldquo;Active&rdquo; = confirmed across multiple sources as of this update. &ldquo;Try it&rdquo; = may still work — codes without a published expiry date can remain active for months.
      </p>

      {/* How to redeem */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">How to Redeem a Code</h2>
        <p className="mt-1 text-sm text-purple-200/80">
          Most codes require HQ Level 10+ and must be redeemed via the official web portal.
        </p>
        <ol className="mt-4 space-y-2">
          {REDEEM_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/60 text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm text-purple-100/90">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-purple-400/70">
          Some versions of the game also have a Redeem Code button directly inside Settings. If you see it, use that instead of the browser portal.
        </p>
      </div>

      {/* When codes drop */}
      <div className="mt-8 rounded-xl border border-amber-700/40 bg-amber-900/10 p-5">
        <h3 className="font-semibold text-amber-200">When do new codes drop?</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-100/80">
          <li><span className="font-semibold text-white">Weekly (Monday):</span> The devs drop weekly codes most Mondays — watch official Discord and X/Twitter.</li>
          <li><span className="font-semibold text-white">Social milestones:</span> Codes release when the Facebook, Discord, or X pages hit follower count milestones (150K, 180K, 250K, 280K…).</li>
          <li><span className="font-semibold text-white">Major patches:</span> A batch of codes is shared as compensation or celebration when a significant update launches.</li>
          <li><span className="font-semibold text-white">Seasonal events:</span> Christmas, New Year, Valentine&apos;s, and Spring reliably produce new codes.</li>
        </ul>
        <p className="mt-3 text-xs text-amber-200/60">
          Follow the official Last Z Discord and X/Twitter to catch new codes immediately — most have a 200,000-redemption cap and expire fast.
        </p>
      </div>

      <p className="mt-6 text-xs text-purple-300/60">
        GAMIDES is not affiliated with the Last Z developers. Codes sourced from community sources and official channels. Last updated June 2026.
      </p>
    </div>
  );
}
