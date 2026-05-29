"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/events",   label: "Events" },
  { href: "/hq",       label: "HQ" },
  { href: "/research", label: "Research" },
  { href: "/heroes",   label: "Heroes" },
  { href: "/tank",     label: "Vehicles" },
  { href: "/gear",     label: "Gear" },
  { href: "/pvp",      label: "PvP" },
  { href: "/guide",    label: "Guide" },
  { href: "/calc",     label: "Calc" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 mx-4">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded px-2.5 py-1.5 text-sm transition-colors ${
              active
                ? "bg-purple-700/60 text-white font-medium"
                : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
