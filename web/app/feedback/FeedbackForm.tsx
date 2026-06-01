"use client";

import { useState } from "react";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_FEEDBACK_WEBHOOK_URL ?? "";

const CATEGORIES = [
  { value: "general",  label: "General",          color: 0x7c3aed },
  { value: "bug",      label: "Bug Report",        color: 0xdc2626 },
  { value: "feature",  label: "Feature Request",   color: 0x2563eb },
  { value: "data",     label: "Data Correction",   color: 0xd97706 },
];

export function FeedbackForm() {
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    setErrorMsg("");

    const cat = CATEGORIES.find((c) => c.value === category)!;

    const payload = {
      embeds: [
        {
          title: `🗣️ Feedback: ${cat.label}`,
          color: cat.color,
          fields: [
            { name: "Category", value: cat.label, inline: true },
            { name: "Reply-to", value: email.trim() || "Not provided", inline: true },
            { name: "Message", value: message.trim(), inline: false },
          ],
          footer: { text: "gamides.com feedback form" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      if (!WEBHOOK_URL) throw new Error("Feedback is not yet configured — please try again later.");
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed (HTTP ${res.status}). Please try again.`);
      setStatus("success");
      setMessage("");
      setEmail("");
      setCategory("general");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-700/50 bg-green-900/20 p-6 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 font-semibold text-green-200">Feedback received — thank you!</p>
        <p className="mt-1 text-sm text-green-100/70">
          We read every submission. If you included an email we&apos;ll reply when relevant.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-lg border border-purple-700/60 bg-purple-800/40 px-4 py-2 text-sm text-purple-100 transition-colors hover:border-purple-500 hover:text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-white">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-purple-700/60 bg-purple-900/40 px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#180030]">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-white">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your feedback, the data that needs correcting, or the bug you found…"
          className="mt-1.5 w-full rounded-lg border border-purple-700/60 bg-purple-900/40 px-3 py-2.5 text-sm text-white placeholder-purple-400/60 focus:border-purple-500 focus:outline-none resize-none"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white">
          Email <span className="text-purple-400/70 font-normal">(optional — include if you&apos;d like a reply)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-lg border border-purple-700/60 bg-purple-900/40 px-3 py-2.5 text-sm text-white placeholder-purple-400/60 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !message.trim()}
        className="w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Feedback"}
      </button>
    </form>
  );
}
