import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Event Schedule — Bear Hunt, Sunfire Castle & SvS Prep | GAMIDES",
  description:
    "Convert Whiteout Survival Bear Hunt, Sunfire Castle, Crazy Joe, and Foundry Battle UTC windows to your local timezone, plus the 5-day State of Power (SvS) prep schedule.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/events",
  },
};

export default function WhiteoutEventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Events &amp; SvS
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Event Scheduler &amp; SvS Prep Guide
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Track Bear Hunt (Alliance Trap), Sunfire Castle Battle, Crazy Joe, Foundry Battle, and the 5-Day State of Power (SvS) preparation rotation in your local timezone.
        </p>
      </div>
      <WhiteoutClient section="events" />
    </div>
  );
}
