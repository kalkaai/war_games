import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | GAMIDES — Last Z Survival Shooter",
  description:
    "Track your Last Z progress — HQ level, hero ranks, research completion, and vehicle tier. Saved locally in your browser.",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
      <p className="text-purple-200/80 text-sm mb-8">
        Your progress is saved in this browser. No account needed.
      </p>
      <ProfileClient />
    </main>
  );
}
