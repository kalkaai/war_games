import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { GameIcon, type GameIconType } from "../components/GameIcon";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "When does each VS event run in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "VS events rotate daily Monday–Sunday: Monday is Vehicle Day (wrenches & blueprints), Tuesday is Building Day (construction speed-ups), Wednesday is Research Day (research speed-ups & badges), Thursday is Heroes Day (fragments & cores), Friday is Training Day (troop training), Saturday is Combat Day (kill enemies & complete orange wanted missions), Sunday is Rest Day (no VS event)." }
    },
    {
      "@type": "Question",
      "name": "What is Apocalypse Time (AT) in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Apocalypse Time (AT) is Last Z: Survival Shooter's server timezone used for all event schedules. AT = UTC − 2 hours. All game events, raids, and daily resets run on AT midnight (00:00 AT = 02:00 UTC)." }
    },
    {
      "@type": "Question",
      "name": "When does Radar Reset happen in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Radar Reset occurs every 8 hours at AT 00:00, 08:00, and 16:00 (equivalent to UTC 02:00, 10:00, 18:00). This resets the radar charges used for scouting enemy bases." }
    },
    {
      "@type": "Question",
      "name": "When is Arena Brawl in Last Z: Survival Shooter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Arena Brawl runs daily for 30 minutes starting at AT 23:30 (UTC 01:30), just before the daily server reset at AT midnight." }
    }
  ]
};

export const metadata: Metadata = {
  title: "Events — GAMIDES | Last Z: Survival Shooter",
  description: "Last Z: Survival Shooter event schedules: VS Weekly Rotation, Apocalypse Time cycle, Radar Reset, and Arena Brawl. Includes timezone converter for all events.",
  openGraph: {
    title: "Events — GAMIDES | Last Z: Survival Shooter",
    description: "Last Z: Survival Shooter event schedules: VS Weekly Rotation, Apocalypse Time cycle, Radar Reset, and Arena Brawl. Timezone converter included.",

  },
  alternates: {
    canonical: "https://www.gamides.com/events",
  },
};

const VS_SCHEDULE: { day: string; iconKey: GameIconType; label: string; tip: string }[] = [
  { day: "Monday",    iconKey: "vehicle",      label: "Vehicle Day",   tip: "Use wrenches & blueprints" },
  { day: "Tuesday",   iconKey: "construction", label: "Building Day",  tip: "Use construction speed-ups" },
  { day: "Wednesday", iconKey: "research",     label: "Research Day",  tip: "Use research speed-ups & badges" },
  { day: "Thursday",  iconKey: "heroes",       label: "Heroes Day",    tip: "Use hero fragments & cores" },
  { day: "Friday",    iconKey: "troops",       label: "Training Day",  tip: "Train troops & use speed-ups" },
  { day: "Saturday",  iconKey: "combat",       label: "Combat Day",    tip: "Kill enemies & orange wanted missions" },
  { day: "Sunday",    iconKey: "rest",         label: "Rest Day",      tip: "No VS event" },
];

const RECURRING: { name: string; iconKey: GameIconType; description: string; utcTimes: string[]; interval: string }[] = [
  {
    name: "Full Preparedness",
    iconKey: "prepare",
    description: "New 4-hour sub-event every 4h — AT 00:00, 04:00, 08:00, 12:00, 16:00, 20:00",
    utcTimes: ["02:00", "06:00", "10:00", "14:00", "18:00", "22:00"],
    interval: "Every 4h",
  },
  {
    name: "Radar Reset",
    iconKey: "radar",
    description: "Radar resets every 8 hours — AT 00:00, 08:00, 16:00",
    utcTimes: ["02:00", "10:00", "18:00"],
    interval: "Every 8h",
  },
  {
    name: "Arena Brawl",
    iconKey: "arena",
    description: "Daily 30 min before server reset — AT 23:30",
    utcTimes: ["01:30"],
    interval: "Daily",
  },
  {
    name: "Canyon Clash",
    iconKey: "canyon",
    description: "Friday — time voted by alliance leadership",
    utcTimes: [],
    interval: "Weekly (Fri)",
  },
];

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Last Z: Survival Shooter Events &amp; VS Schedule</h1>
      <p className="mt-2 text-purple-100/95">
        <strong>Apocalypse Time (AT)</strong> is Last Z: Survival Shooter&apos;s server timezone — AT = UTC − 2 hours. All game events, raids, and resets run on AT midnight. Times below are shown in UTC and your local timezone.
      </p>

      {/* VS Weekly Rotation */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-white">When Does Each VS Event Run?</h2>
        <div className="overflow-x-auto rounded-xl border border-purple-700/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-700/60 bg-purple-900/60">
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Day</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">VS Event</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {VS_SCHEDULE.map((row, i) => (
                <tr
                  key={row.day}
                  className={`border-b border-purple-900/40 ${i % 2 === 0 ? "bg-purple-900/20" : "bg-transparent"} ${row.day === "Sunday" ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-white">{row.day}</td>
                  <td className="px-4 py-3 text-purple-200">
                    <span className="inline-flex items-center gap-2">
                      <GameIcon type={row.iconKey} size={16} className="shrink-0 text-purple-400" />
                      {row.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-purple-200/80">{row.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recurring Events */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-white">Recurring Events</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {RECURRING.map((ev) => (
            <div key={ev.name} className="rounded-xl border border-purple-700/60 bg-purple-900/30 p-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-800/50 text-purple-300 shrink-0">
                  <GameIcon type={ev.iconKey} size={22} />
                </div>
                <div>
                  <p className="font-semibold text-white">{ev.name}</p>
                  <p className="text-xs text-purple-400">{ev.interval}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-purple-200/80">{ev.description}</p>
              {ev.utcTimes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ev.utcTimes.map((t) => (
                    <span key={t} className="rounded bg-purple-800/60 px-2 py-0.5 text-xs font-mono text-purple-200">
                      {t} UTC
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Timezone converter — client component */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-white">Timezone Converter</h2>
        <EventsClient recurring={RECURRING} />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
