"use client";

import { useState, useEffect, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export type AppThemeId =
  | "nebula"
  | "crimson"
  | "arctic"
  | "solaris"
  | "emerald"
  | "daylight"
  | "glacier"
  | "sandstorm"
  | "meadow";

// Map legacy theme IDs to generic multi-game IDs for seamless migration
const LEGACY_THEME_MAP: Record<string, AppThemeId> = {
  "blood-rose": "crimson",
  "wings-of-dawn": "arctic",
  "guard-of-order": "solaris",
  "biotech": "emerald",
};

export interface ThemeOption {
  id: AppThemeId;
  name: string;
  subtitle: string;
  swatch: string;
  scheme: "dark" | "light";
}

export const THEMES: ThemeOption[] = [
  {
    id: "nebula",
    name: "Nebula Purple",
    subtitle: "Cosmic Dark (Default)",
    swatch: "#9333ea",
    scheme: "dark",
  },
  {
    id: "crimson",
    name: "Crimson Command",
    subtitle: "Tactical Ruby & Obsidian",
    swatch: "#e11d48",
    scheme: "dark",
  },
  {
    id: "arctic",
    name: "Arctic Frost",
    subtitle: "Glacial Cyan & Deep Navy",
    swatch: "#0284c7",
    scheme: "dark",
  },
  {
    id: "solaris",
    name: "Solaris Gold",
    subtitle: "Imperial Amber & Bronze",
    swatch: "#d97706",
    scheme: "dark",
  },
  {
    id: "emerald",
    name: "Emerald Ops",
    subtitle: "Bio-Tactical Matrix",
    swatch: "#059669",
    scheme: "dark",
  },
  {
    id: "daylight",
    name: "Daylight Tactical",
    subtitle: "High-Contrast Indigo Light",
    swatch: "#4f46e5",
    scheme: "light",
  },
  {
    id: "glacier",
    name: "Glacier Day",
    subtitle: "Frost Cyan & Ice White Light",
    swatch: "#0284c7",
    scheme: "light",
  },
  {
    id: "sandstorm",
    name: "Sandstorm Light",
    subtitle: "Desert Amber & Ivory Light",
    swatch: "#d97706",
    scheme: "light",
  },
  {
    id: "meadow",
    name: "Bio-Meadow Light",
    subtitle: "Fresh Emerald & Mint Light",
    swatch: "#059669",
    scheme: "light",
  },
];

const STORAGE_KEY = "wg_theme";

function normalizeThemeId(raw: string | null): AppThemeId {
  if (!raw) return "nebula";
  if (raw in LEGACY_THEME_MAP) return LEGACY_THEME_MAP[raw];
  if (THEMES.some((t) => t.id === raw)) return raw as AppThemeId;
  return "nebula";
}

function applyThemeToDOM(themeId: AppThemeId) {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  document.documentElement.setAttribute("data-theme", theme.id);
  if (theme.scheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute("content", theme.scheme);
  }
  window.dispatchEvent(
    new CustomEvent("wg-theme-change", {
      detail: { themeId: theme.id, scheme: theme.scheme },
    })
  );
}

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<AppThemeId>("nebula");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const resolved = normalizeThemeId(saved);
      setActiveTheme(resolved);
      applyThemeToDOM(resolved);
      if (saved && saved !== resolved) {
        localStorage.setItem(STORAGE_KEY, resolved);
      }
    } catch {
      // ignore storage errors
    }

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        const next = normalizeThemeId(e.newValue);
        setActiveTheme(next);
        applyThemeToDOM(next);
      }
    }

    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("storage", onStorage);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  function selectTheme(themeId: AppThemeId) {
    setActiveTheme(themeId);
    applyThemeToDOM(themeId);
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
    sendGAEvent("event", "select_theme", { theme: themeId });
  }

  const current = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Theme: ${current.name}. Click to change theme`}
        className="flex items-center gap-2 rounded-lg border border-purple-700/70 bg-purple-900/50 px-3 py-1.5 text-xs font-medium text-purple-100 transition-colors hover:border-purple-500 hover:bg-purple-800/60"
      >
        <span
          className="h-3 w-3 rounded-full border border-white/30"
          style={{ backgroundColor: current.swatch }}
        />
        <span className="hidden sm:inline">{current.name}</span>
        <span className="text-[10px] text-purple-300">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Choose site theme"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-purple-700/80 bg-purple-950 p-1.5 shadow-xl"
        >
          <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
            Select UI Theme
          </p>
          {THEMES.map((t) => {
            const isSelected = t.id === activeTheme;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectTheme(t.id)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:bg-purple-900/70"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/30"
                    style={{ backgroundColor: t.swatch }}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        isSelected ? "text-white" : "text-purple-100"
                      }`}
                    >
                      {t.name}
                    </p>
                    <p
                      className={`text-[10px] ${
                        isSelected ? "text-white/80" : "text-purple-300/75"
                      }`}
                    >
                      {t.subtitle}
                    </p>
                  </div>
                </div>
                {isSelected && <span className="font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
