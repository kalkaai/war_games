"use client";

import { useEffect, useRef, useState } from "react";
import type {
  GameManifestItem,
  MountedMiniGameInstance,
} from "@gamides/minigames";

interface MiniGamePlayerProps {
  game: GameManifestItem;
}

const SCORES_STORAGE_KEY = "gamides_arcade_scores_v1";

interface StoredScoreMap {
  [slug: string]: {
    bestScore: number;
    cleared?: boolean;
    plays?: number;
    updatedAt: number;
  };
}

export default function MiniGamePlayer({ game }: MiniGamePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<MountedMiniGameInstance | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cleared, setCleared] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [loadMetrics, setLoadMetrics] = useState<{
    loadTimeMs: number;
    payloadKb: string;
  } | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const challenge = params.get("challenge");
      if (challenge && !Number.isNaN(Number(challenge))) {
        setChallengeScore(Number(challenge));
      }

      const raw = window.localStorage.getItem(SCORES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredScoreMap;
        const saved = parsed[game.slug];
        if (saved) {
          setHighScore(saved.bestScore ?? 0);
          setCleared(Boolean(saved.cleared || (saved.bestScore ?? 0) >= game.targetScore));
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, [game.slug, game.targetScore]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) return;
      const { mountMiniGame } = await import("@gamides/minigames");
      if (cancelled || !containerRef.current) return;

      const instance = await mountMiniGame(containerRef.current, {
        slug: game.slug,
        soundEnabled: true,
        onScoreChange: (newScore, newBest) => {
          setScore(newScore);
          setHighScore(newBest);
          if (newBest >= game.targetScore) {
            setCleared(true);
          }
        },
        onGameOver: (result) => {
          setScore(result.score);
          setHighScore(result.highScore);
          if (result.cleared) {
            setCleared(true);
          }
          try {
            const raw = window.localStorage.getItem(SCORES_STORAGE_KEY);
            const parsed: StoredScoreMap = raw ? JSON.parse(raw) : {};
            const prev = parsed[game.slug];
            parsed[game.slug] = {
              bestScore: Math.max(prev?.bestScore ?? 0, result.highScore),
              cleared: Boolean(prev?.cleared || result.cleared),
              plays: (prev?.plays ?? 0) + 1,
              updatedAt: Date.now(),
            };
            window.localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(parsed));
          } catch {
            // Ignore storage errors
          }
        },
        onShareDiscord: () => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 3000);
        },
        onTelemetry: (evt) => {
          if (evt.type === "minigame_load") {
            setLoadMetrics({
              loadTimeMs: evt.loadTimeMs ?? 12,
              payloadKb: ((evt.payloadBytes ?? 1600) / 1024).toFixed(1),
            });
          }
        },
      });

      if (cancelled) {
        instance.destroy();
        return;
      }
      instanceRef.current = instance;
    }

    boot();

    return () => {
      cancelled = true;
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [game.slug, game.targetScore]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    instanceRef.current?.setSoundEnabled(next);
  };

  const handleRestart = () => {
    setScore(0);
    instanceRef.current?.restart();
  };

  const handleShareDiscord = async () => {
    const best = Math.max(score, highScore);
    const shareUrl = `https://www.gamides.com/play/${game.slug}/?challenge=${best}`;
    const badge = cleared ? "🏆 [CLEARED]" : "⚔️ [CHALLENGE]";
    const text = `${badge} I scored **${best}** in **${game.title}** (${game.iconEmoji}) on GAMIDES Arcade! Can anyone in our alliance beat this? Play free: ${shareUrl}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <div className="flex flex-col items-center">
      {challengeScore !== null && (
        <div className="mb-4 w-full max-w-[420px] rounded-xl border border-amber-500/60 bg-amber-950/40 px-4 py-2.5 text-center text-xs sm:text-sm text-amber-200">
          ⚔️ <strong>Alliance Challenge Active:</strong> Beat a score of{" "}
          <span className="font-bold text-white">{challengeScore}</span> in {game.title}!
        </div>
      )}

      {/* Top HUD Bar */}
      <div className="mb-3 flex w-full max-w-[420px] flex-wrap items-center justify-between gap-2 rounded-xl border border-purple-700/60 bg-purple-950/80 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-purple-300/80">SCORE</span>
            <p className="font-mono text-base font-bold text-white">{score}</p>
          </div>
          <div className="h-6 w-px bg-purple-800/60" />
          <div>
            <span className="text-purple-300/80">BEST</span>
            <p className="font-mono text-base font-bold text-amber-300">{highScore}</p>
          </div>
          <div className="h-6 w-px bg-purple-800/60" />
          <div>
            <span className="text-purple-300/80">GOAL</span>
            <p className="font-mono text-base font-bold text-emerald-300">
              {game.targetScore} {cleared ? "✓" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className="rounded-lg border border-purple-700/70 bg-purple-900/60 px-2.5 py-1.5 font-semibold text-purple-100 transition-colors hover:bg-purple-800"
          >
            {soundEnabled ? "🔊 SFX" : "🔇 Mute"}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg border border-purple-600/80 bg-purple-700/80 px-2.5 py-1.5 font-semibold text-white transition-colors hover:bg-purple-600"
          >
            ↻ Restart
          </button>
        </div>
      </div>

      {/* Phaser Canvas Mount Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[420px] aspect-[400/640] overflow-hidden rounded-2xl border-2 border-purple-700/70 bg-[#0a0014] shadow-2xl shadow-purple-950/70"
      />

      {/* Retention & Share Bar */}
      <div className="mt-4 flex w-full max-w-[420px] flex-col gap-2.5 rounded-xl border border-purple-800/60 bg-purple-900/40 p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-purple-200/90">
            🎮 Controls: <strong className="text-white">{game.controlsHint}</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleShareDiscord}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-500"
          >
            {shareCopied
              ? "✓ Copied Discord Challenge Snippet!"
              : "📢 Share High Score to Alliance Discord"}
          </button>
        </div>

        {loadMetrics && (
          <p className="text-center text-[11px] text-purple-300/70">
            ⚡ Pure Web-Native Phaser 3 Engine • Dynamic Config ({loadMetrics.payloadKb} KB) loaded in{" "}
            {loadMetrics.loadTimeMs}ms
          </p>
        )}
      </div>
    </div>
  );
}
