"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

const LAST_Z_NAV: NavItem[] = [
  { href: "/events",   label: "Events" },
  { href: "/seasons",  label: "Seasons" },
  { href: "/hq",       label: "HQ" },
  { href: "/research", label: "Research" },
  { href: "/heroes",   label: "Heroes" },
  { href: "/tank",     label: "Vehicles" },
  { href: "/gear",     label: "Gear" },
  { href: "/pvp",      label: "PvP" },
  { href: "/alliance", label: "Alliance" },
  { href: "/guide",    label: "Guide" },
  { href: "/codes",    label: "Codes" },
  { href: "/calc",     label: "Calc" },
  { href: "/profile",  label: "Profile" },
];

const WHITEOUT_NAV: NavItem[] = [
  { href: "/whiteout-survival",         label: "Overview",              exact: true },
  { href: "/whiteout-survival/events",  label: "Events & SvS" },
  { href: "/whiteout-survival/furnace", label: "Furnace & FC Table" },
  { href: "/whiteout-survival/heroes",  label: "SSR Heroes (Gen 1–7)" },
  { href: "/whiteout-survival/calc",    label: "FC, Gear & Charm Calcs" },
];

const LAST_WAR_NAV: NavItem[] = [
  { href: "/last-war",        label: "Overview",                  exact: true },
  { href: "/last-war/events", label: "VS, Arms Race & Seasons" },
  { href: "/last-war/hq",     label: "HQ 1–35 (Age of Oil)" },
  { href: "/last-war/heroes", label: "UR Heroes & Weapons" },
  { href: "/last-war/calc",   label: "HQ, Drone & Weapon Calcs" },
];

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function PrimaryNav() {
  const pathname = usePathname();

  const isWhiteout = pathname.startsWith("/whiteout-survival");
  const isLastWar = pathname.startsWith("/last-war");

  const items = isWhiteout
    ? WHITEOUT_NAV
    : isLastWar
    ? LAST_WAR_NAV
    : LAST_Z_NAV;

  return (
    <div className="w-full border-t border-purple-900/40 bg-purple-950/60">
      <nav
        aria-label="Game Sections"
        className="mx-auto max-w-6xl overflow-x-auto px-4"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-1 py-2">
          {items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-purple-700/75 text-white font-semibold shadow-sm"
                    : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
