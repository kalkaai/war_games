import type { Metadata } from "next";
import WhiteoutClient from "../WhiteoutClient";

export const metadata: Metadata = {
  title: "Whiteout Survival Gift Codes & Official Redemption Portal | GAMIDES",
  description:
    "Active Whiteout Survival gift codes and step-by-step instructions to redeem on iOS & Android via the official Century Games Gift Code Center.",
  alternates: {
    canonical: "https://www.gamides.com/whiteout-survival/codes",
  },
};

export default function WhiteoutCodesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block rounded bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
          Whiteout Survival · Gift Codes
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Whiteout Survival Active Gift Codes &amp; Redemption Center
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-purple-200/85">
          Copy active Whiteout Survival gift codes and redeem them using your 9-digit Chief ID on the official Century Games portal.
        </p>
      </div>
      <WhiteoutClient section="codes" />
    </div>
  );
}
