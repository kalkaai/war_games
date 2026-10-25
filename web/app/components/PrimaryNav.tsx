"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const LAST_Z_NAV: NavItem[] = [
  { href: "/",         label: "Overview", icon: "🏠", exact: true },
  { href: "/events",   label: "Events",   icon: "📅" },
  { href: "/seasons",  label: "Seasons",  icon: "🧬" },
  { href: "/hq",       label: "HQ",       icon: "🏰" },
  { href: "/research", label: "Research", icon: "🔬" },
  { href: "/heroes",   label: "Heroes",   icon: "🦸" },
  { href: "/tank",     label: "Vehicles", icon: "🔧" },
  { href: "/gear",     label: "Gear",     icon: "⚔️" },
  { href: "/pvp",      label: "PvP",      icon: "🛡️" },
  { href: "/alliance", label: "Alliance", icon: "🤝" },
  { href: "/guide",    label: "Guide",    icon: "📖" },
  { href: "/codes",    label: "Codes",    icon: "🎁" },
  { href: "/calc",     label: "Calc",     icon: "📊" },
  { href: "/play",     label: "Arcade",   icon: "🕹️" },
  { href: "/profile",  label: "Profile",  icon: "👤" },
];

const WHITEOUT_NAV: NavItem[] = [
  { href: "/whiteout-survival",          label: "Overview", icon: "🏠", exact: true },
  { href: "/whiteout-survival/events",   label: "Events",   icon: "📅" },
  { href: "/whiteout-survival/seasons",  label: "Seasons",  icon: "🧬" },
  { href: "/whiteout-survival/furnace",  label: "Furnace",  icon: "🔥" },
  { href: "/whiteout-survival/research", label: "Research", icon: "🔬" },
  { href: "/whiteout-survival/heroes",   label: "Heroes",   icon: "🦸" },
  { href: "/whiteout-survival/pets",     label: "Pets",     icon: "🐾" },
  { href: "/whiteout-survival/gear",     label: "Gear",     icon: "⚔️" },
  { href: "/whiteout-survival/pvp",      label: "PvP",      icon: "🛡️" },
  { href: "/whiteout-survival/codes",    label: "Codes",    icon: "🎁" },
  { href: "/whiteout-survival/calc",     label: "Calc",     icon: "📊" },
  { href: "/play",                       label: "Arcade",   icon: "🕹️" },
];

const LAST_WAR_NAV: NavItem[] = [
  { href: "/last-war",          label: "Overview", icon: "🏠", exact: true },
  { href: "/last-war/events",   label: "Events",   icon: "📅" },
  { href: "/last-war/seasons",  label: "Seasons",  icon: "🧬" },
  { href: "/last-war/hq",       label: "HQ",       icon: "🏰" },
  { href: "/last-war/research", label: "Research", icon: "🔬" },
  { href: "/last-war/heroes",   label: "Heroes",   icon: "🦸" },
  { href: "/last-war/drone",    label: "Drone",    icon: "🛸" },
  { href: "/last-war/gear",     label: "Gear",     icon: "⚔️" },
  { href: "/last-war/pvp",      label: "PvP",      icon: "🛡️" },
  { href: "/last-war/codes",    label: "Codes",    icon: "🎁" },
  { href: "/last-war/calc",     label: "Calc",     icon: "📊" },
  { href: "/play",              label: "Arcade",   icon: "🕹️" },
];

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function PrimaryNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer automatically when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isWhiteout = pathname.startsWith("/whiteout-survival");
  const isLastWar = pathname.startsWith("/last-war");

  const items = isWhiteout
    ? WHITEOUT_NAV
    : isLastWar
    ? LAST_WAR_NAV
    : LAST_Z_NAV;

  const gameName = isWhiteout
    ? "Whiteout Survival"
    : isLastWar
    ? "Last War: Survival"
    : "Last Z: Survival";

  const activeItem = items.find((item) => isItemActive(pathname, item));

  return (
    <div className="w-full border-t border-purple-900/40 bg-purple-950/75">
      <nav aria-label={`${gameName} Sections`} className="mx-auto max-w-6xl px-3 sm:px-4">
        {/* Desktop & Tablet (md+): Wrapping flex row so no links ever clip off-screen */}
        <div className="hidden md:flex md:flex-wrap md:items-center md:gap-1 md:py-2">
          {items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs lg:text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-purple-700/80 text-white font-semibold shadow-sm"
                    : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
                }`}
              >
                <span aria-hidden="true" className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile (< md): Quick horizontal scroll strip + Pinned "Menu" Drawer Toggle */}
        <div className="flex items-center justify-between gap-2 py-1.5 md:hidden">
          <div
            className="flex flex-1 items-center gap-1 overflow-x-auto pr-2"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((item) => {
              const active = isItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs whitespace-nowrap transition-colors ${
                    active
                      ? "bg-purple-700 text-white font-semibold shadow-sm"
                      : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-game-nav-drawer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open all pages menu"}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-purple-600/80 bg-purple-900/90 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-purple-800"
          >
            <span aria-hidden="true">{mobileMenuOpen ? "✕" : "☰"}</span>
            <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        {/* Mobile Expandable Grid Drawer (< md) */}
        {mobileMenuOpen && (
          <div
            id="mobile-game-nav-drawer"
            className="border-t border-purple-800/60 py-3 md:hidden"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                {gameName} Pages ({items.length})
              </span>
              {activeItem && (
                <span className="text-[11px] text-purple-300/80">
                  Current: <strong className="text-white">{activeItem.label}</strong>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {items.map((item) => {
                const active = isItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      active
                        ? "border-purple-500 bg-purple-700/80 text-white font-bold shadow-sm"
                        : "border-purple-800/50 bg-purple-900/40 text-purple-200 hover:border-purple-600 hover:bg-purple-800/60 hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true" className="text-sm">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
