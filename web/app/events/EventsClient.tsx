"use client";

import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { GameIcon, type GameIconType } from "../components/GameIcon";

type RecurringEvent = {
  name: string;
  iconKey: GameIconType;
  description: string;
  utcTimes: readonly string[];
  interval: string;
};

function utcToLocal(utcTime: string, offsetMinutes: number): string {
  const [h, m] = utcTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + offsetMinutes;
  const localH = ((totalMinutes / 60) % 24 + 24) % 24;
  const localM = ((totalMinutes % 60) + 60) % 60;
  return `${String(Math.floor(localH)).padStart(2, "0")}:${String(localM).padStart(2, "0")}`;
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function EventsClient({ recurring }: { recurring: readonly RecurringEvent[] }) {
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const browserOffset = -new Date().getTimezoneOffset();
    setOffsetMinutes(browserOffset);
    setDetected(true);
  }, []);

  const filteredRecurring = recurring.filter((ev) => ev.utcTimes.length > 0);

  return (
    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="timezone-select" className="text-sm font-medium text-purple-200">Your timezone offset:</label>
        <select
          id="timezone-select"
          value={offsetMinutes}
          onChange={(e) => { sendGAEvent("event", "select_timezone", { offset: e.target.value }); setOffsetMinutes(Number(e.target.value)); }}
          className="rounded-md border border-purple-700 bg-purple-950 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {Array.from({ length: 57 }, (_, i) => (i - 12) * 60).map((mins) => (
            <option key={mins} value={mins}>
              {formatOffset(mins)}
            </option>
          ))}
        </select>
        {detected && (
          <span className="text-xs text-purple-400">
            Auto-detected: {formatOffset(offsetMinutes)}
          </span>
        )}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-purple-800/40">
        <table aria-label="Event schedule" className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-800/40 bg-purple-900/40">
              <th scope="col" className="px-4 py-2 text-left font-semibold text-purple-200">Event</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold text-purple-200">UTC</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold text-purple-200">
                Local ({formatOffset(offsetMinutes)})
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecurring.flatMap((ev) =>
              ev.utcTimes.map((utcTime, j) => (
                <tr
                  key={`${ev.name}-${j}`}
                  className="border-b border-purple-900/30 even:bg-purple-900/10"
                >
                  <td className="px-4 py-2 text-white">
                    {j === 0 ? (
                      <span className="inline-flex items-center gap-1.5">
                        <GameIcon type={ev.iconKey} size={14} className="shrink-0 text-purple-400" />
                        {ev.name}
                      </span>
                    ) : ""}
                  </td>
                  <td className="px-4 py-2 font-mono text-purple-300">{utcTime}</td>
                  <td className="px-4 py-2 font-mono font-semibold text-purple-100">
                    {utcToLocal(utcTime, offsetMinutes)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-purple-400/70">
        AT (Apocalypse Time) = UTC−02:00. Server reset = 02:00 UTC = 00:00 AT.
      </p>
    </div>
  );
}
