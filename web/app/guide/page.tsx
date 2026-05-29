import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beginner Guide — GAMIDES | Last Z",
  description: "Last Z: Survival Shooter beginner guide — HQ priorities, hero investment, alliance tips, and resource management for new players.",
  openGraph: {
    title: "Beginner Guide — GAMIDES | Last Z",
    description: "Last Z beginner guide: HQ priorities, hero investment, alliance tips, and resource management for new players.",

  },
  alternates: {
    canonical: "https://www.gamides.com/guide",
  },
};

const SECTIONS = [
  {
    icon: "🏗️",
    title: "What Should You Do on Day 1?",
    body: "Complete the tutorial to unlock all systems and claim the reward bundle. Immediately join an active alliance — alliance bonuses, help requests, and technology boosts are critical from day one. Your first HQ upgrades should be as fast as possible; do not idle the build queue.",
  },
  {
    icon: "🏰",
    title: "HQ Upgrade Order",
    body: "HQ level is the single most important progression gate. It determines your hero level cap, building level caps, and which research trees you can unlock. Prioritise HQ over everything else. Key milestones: HQ 11 unlocks the Rider Camp (Guard of Order troop T4), HQ 25 accelerates research dramatically, HQ 30 is required to start the T10 troop research path (Unit Special Training tree).",
  },
  {
    icon: "🦸",
    title: "Hero Investment",
    body: "Focus only on your main 5 heroes — the ones whose faction matches your chosen troop type. Blood Rose → Assaulters, Wings of Dawn → Shooters, Guard of Order → Riders. Do not spread star upgrades across many heroes. S+ tier heroes (Yu Chan, Licia, Queenie, Liliana, Amber, Dodomeki) are the best long-term investment. For F2P players, Amelia (A+) is obtainable for free and provides key construction speed. Sophia (A) is also free and accelerates research.",
  },
  {
    icon: "⚔️",
    title: "Choose Your Faction",
    body: "Pick one troop type and stick with it: Assaulter (Blood Rose), Shooter (Wings of Dawn), or Rider (Guard of Order). Your research, heroes, and gear should all align with this choice. Wings of Dawn is recommended for beginners due to balanced stats. Guard of Order (Rider) is the strongest in late-game PvP due to the Amber/Dodomeki combo.",
  },
  {
    icon: "🔬",
    title: "Research Priority",
    body: "Research Military Strategies first — it provides the core ATK/DEF/HP bonuses all troop types benefit from. Then work on Fully Armed Alliance for the alliance bonuses. Alliance Recognition unlocks Event Expert nodes which multiply your event scores. Do not research Hero Training beyond the Cockpit node early — it has poor badge-to-power ratio compared to Military Strategies.",
  },
  {
    icon: "💰",
    title: "Resource Management",
    body: "Do not upgrade Food/Wood/Zent production buildings above level 20 — the return on investment takes over 4 months. Prioritise Military Center, Laboratory, Alliance Center, and the three Camp buildings (Assaulter, Shooter, Rider) for their combat and unlock effects. Save your speed-up items for VS events (Monday — construction, Thursday — research) to double-dip on event points and progress simultaneously.",
  },
  {
    icon: "📅",
    title: "VS Events (Weekly)",
    body: "VS events run Monday–Sunday with rotating themes. Each day rewards points for specific activities. The most impactful: Monday (Vehicle/Construction), Thursday (Research). Use your speed-ups and resources on these days to maximise VS event scores while also advancing your base. Check the Events page for the current VS rotation schedule.",
  },
  {
    icon: "🔧",
    title: "Vehicles (Tanks)",
    body: "Upgrade your tank on Monday (VS Vehicle Day) to earn double event points. Do not heavily invest in the Conqueror starter vehicle. Aim for Cheetah early (150 wrenches unlock) for the Magnetic Storm Shield upgrade which significantly boosts hero defence. Hercules Tank is the mid-game target for War Frenzy (hero attack boost). See the Vehicles page for the full upgrade path.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What should you do on Day 1 in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Complete the tutorial to unlock all systems and claim the reward bundle. Immediately join an active alliance — alliance bonuses, help requests, and technology boosts are critical from day one. Your first HQ upgrades should be as fast as possible; do not idle the build queue." }
    },
    {
      "@type": "Question",
      "name": "What is the HQ upgrade order in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "HQ level is the single most important progression gate. It determines your hero level cap, building level caps, and which research trees you can unlock. Key milestones: HQ 11 unlocks the Rider Camp, HQ 25 accelerates research dramatically, HQ 30 is required to start the T10 troop research path." }
    },
    {
      "@type": "Question",
      "name": "Which faction should I choose in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Pick one troop type and stick with it: Assaulter (Blood Rose), Shooter (Wings of Dawn), or Rider (Guard of Order). Wings of Dawn is recommended for beginners due to balanced stats. Guard of Order (Rider) is the strongest in late-game PvP due to the Amber/Dodomeki combo." }
    },
    {
      "@type": "Question",
      "name": "What is the research priority in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Research Military Strategies first — it provides core ATK/DEF/HP bonuses all troop types benefit from. Then work on Fully Armed Alliance for alliance bonuses. Do not research Hero Training beyond the Cockpit node early — it has poor badge-to-power ratio compared to Military Strategies." }
    }
  ]
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z Beginner Guide</h1>
      <p className="mt-2 text-purple-200/80">
        Essential tips for new Last Z players — from day 1 through mid-game.
      </p>

      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <span>{s.icon}</span>
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-purple-100/95">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-purple-300/70">
        Guide reflects Season 4 meta. Last updated May 2026.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
