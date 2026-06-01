import type { Metadata } from "next";
import { FeedbackForm } from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback — GAMIDES | Last Z: Survival Shooter",
  description:
    "Send feedback, report a bug, request a feature, or correct game data on GAMIDES — the Last Z: Survival Shooter companion site.",
  alternates: {
    canonical: "https://www.gamides.com/feedback",
  },
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Feedback</h1>
      <p className="mt-2 text-purple-200/80">
        Found a data error, hit a bug, or have a feature idea? Let us know.
      </p>

      <div className="mt-2 rounded-xl border border-blue-800/40 bg-blue-900/10 p-4 text-sm text-blue-100/80">
        GAMIDES is a community fan site — not affiliated with Last Z: Survival Shooter or its
        developers. For in-game issues, contact official support.
      </div>

      <div className="mt-6">
        <FeedbackForm />
      </div>
    </div>
  );
}
