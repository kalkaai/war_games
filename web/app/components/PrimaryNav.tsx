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
  { href: "/alliance", label: "Alliance" },
  { href: "/guide",    label: "Guide" },
  { href: "/codes",    label: "Codes" },
  { href: "/calc",     label: "Calc" },
  { href: "/profile",  label: "Profile" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  const links = NAV_ITEMS.map(({ href, label }) => ({
    href,
    label,
    active: pathname === href || pathname.startsWith(href + "/"),
  }));

  return (
    <>
      {/* Desktop nav — lg+ only; py-3 matches the logo row height */}
      <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 mx-4 py-3">
        {links.map(({ href, label, active }) => (
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
        ))}
      </nav>

      {/* Mobile nav — wraps to its own row via basis-full, hidden on lg+ */}
      <nav
        aria-label="Navigation"
        className="lg:hidden basis-full border-t border-purple-900/40 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-0.5 px-4 py-1.5">
          {links.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
                active
                  ? "bg-purple-700/60 text-white font-medium"
                  : "text-purple-200/90 hover:bg-purple-800/50 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
