import type { Metadata } from "next";
import LastWarClient from "../LastWarClient";

export const metadata: Metadata = {
  title: "Last War: Survival Game Gift Codes & Official CDKey Portal | GAMIDES",
  description:
    "Active Last War: Survival Game gift codes and step-by-step instructions to redeem via the official Last War CDKey web portal using your 16-digit UID.",
  alternates: {
    canonical: "https://www.gamides.com/last-war/codes",
  },
};

export default function LastWarCodesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          Last War: Survival · Gift Codes
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Last War Active Gift Codes &amp; Official CDKey Portal
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Copy active Last War gift codes and redeem them with your 16-digit UID on the official Last War CDKey redemption center.
        </p>
      </div>
      <LastWarClient section="codes" />
    </div>
  );
}
