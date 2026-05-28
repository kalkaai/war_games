import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WarGuardLogo } from "./components/WarGuardLogo";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WarGuard — The Last Z Reference",
  description:
    "Event schedules, HQ upgrade tables, research trees, and calculators for Last Z players. Never miss a timer.",
  openGraph: {
    title: "WarGuard — The Last Z Reference",
    description:
      "Event schedules, HQ upgrade tables, research trees, and calculators for Last Z players.",
    type: "website",
  },
};

// 80-star starfield: deterministic values, no Math.random() at runtime.
// Generated once with a seeded algorithm — safe for server rendering (no hydration mismatch).
const STARS = [
  {"top":"1.2%","left":"4.1%","size":2,"twinkleDur":"2.0s","twinkleDelay":"0.0s","driftDur":"7.0s","driftDelay":"0.0s"},
  {"top":"24.6%","left":"1.4%","size":1,"twinkleDur":"2.6s","twinkleDelay":"0.7s","driftDur":"8.5s","driftDelay":"1.1s"},
  {"top":"48.0%","left":"61.7%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.4s","driftDur":"10.0s","driftDelay":"2.2s"},
  {"top":"71.3%","left":"21.9%","size":2,"twinkleDur":"3.8s","twinkleDelay":"2.1s","driftDur":"11.5s","driftDelay":"3.3s"},
  {"top":"94.7%","left":"19.2%","size":1,"twinkleDur":"4.4s","twinkleDelay":"2.8s","driftDur":"7.0s","driftDelay":"4.4s"},
  {"top":"18.1%","left":"79.5%","size":1,"twinkleDur":"2.0s","twinkleDelay":"3.5s","driftDur":"8.5s","driftDelay":"5.5s"},
  {"top":"18.4%","left":"39.7%","size":2,"twinkleDur":"2.6s","twinkleDelay":"0.2s","driftDur":"10.0s","driftDelay":"0.6s"},
  {"top":"41.8%","left":"0.0%","size":1,"twinkleDur":"3.2s","twinkleDelay":"0.9s","driftDur":"11.5s","driftDelay":"1.7s"},
  {"top":"65.2%","left":"97.3%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.6s","driftDur":"7.0s","driftDelay":"2.8s"},
  {"top":"88.6%","left":"57.5%","size":2,"twinkleDur":"4.4s","twinkleDelay":"2.3s","driftDur":"8.5s","driftDelay":"3.9s"},
  {"top":"11.9%","left":"17.8%","size":1,"twinkleDur":"2.0s","twinkleDelay":"3.0s","driftDur":"10.0s","driftDelay":"5.0s"},
  {"top":"12.3%","left":"15.1%","size":1,"twinkleDur":"2.6s","twinkleDelay":"3.7s","driftDur":"11.5s","driftDelay":"0.1s"},
  {"top":"35.7%","left":"75.4%","size":2,"twinkleDur":"3.2s","twinkleDelay":"0.4s","driftDur":"7.0s","driftDelay":"1.2s"},
  {"top":"59.0%","left":"35.6%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.1s","driftDur":"8.5s","driftDelay":"2.3s"},
  {"top":"82.4%","left":"32.9%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.8s","driftDur":"10.0s","driftDelay":"3.4s"},
  {"top":"5.8%","left":"93.2%","size":2,"twinkleDur":"2.0s","twinkleDelay":"2.5s","driftDur":"11.5s","driftDelay":"4.5s"},
  {"top":"6.2%","left":"53.4%","size":1,"twinkleDur":"2.6s","twinkleDelay":"3.2s","driftDur":"7.0s","driftDelay":"5.6s"},
  {"top":"29.5%","left":"13.7%","size":1,"twinkleDur":"3.2s","twinkleDelay":"3.9s","driftDur":"8.5s","driftDelay":"0.7s"},
  {"top":"52.9%","left":"11.0%","size":2,"twinkleDur":"3.8s","twinkleDelay":"0.6s","driftDur":"10.0s","driftDelay":"1.8s"},
  {"top":"76.3%","left":"71.2%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.3s","driftDur":"11.5s","driftDelay":"2.9s"},
  {"top":"99.6%","left":"31.5%","size":1,"twinkleDur":"2.0s","twinkleDelay":"2.0s","driftDur":"7.0s","driftDelay":"4.0s"},
  {"top":"0.0%","left":"28.8%","size":2,"twinkleDur":"2.6s","twinkleDelay":"2.7s","driftDur":"8.5s","driftDelay":"5.1s"},
  {"top":"23.4%","left":"89.1%","size":1,"twinkleDur":"3.2s","twinkleDelay":"3.4s","driftDur":"10.0s","driftDelay":"0.2s"},
  {"top":"46.7%","left":"49.3%","size":1,"twinkleDur":"3.8s","twinkleDelay":"0.1s","driftDur":"11.5s","driftDelay":"1.3s"},
  {"top":"70.1%","left":"9.6%","size":2,"twinkleDur":"4.4s","twinkleDelay":"0.8s","driftDur":"7.0s","driftDelay":"2.4s"},
  {"top":"93.5%","left":"6.9%","size":1,"twinkleDur":"2.0s","twinkleDelay":"1.5s","driftDur":"8.5s","driftDelay":"3.5s"},
  {"top":"16.8%","left":"67.1%","size":1,"twinkleDur":"2.6s","twinkleDelay":"2.2s","driftDur":"10.0s","driftDelay":"4.6s"},
  {"top":"17.2%","left":"27.4%","size":2,"twinkleDur":"3.2s","twinkleDelay":"2.9s","driftDur":"11.5s","driftDelay":"5.7s"},
  {"top":"40.6%","left":"24.7%","size":1,"twinkleDur":"3.8s","twinkleDelay":"3.6s","driftDur":"7.0s","driftDelay":"0.8s"},
  {"top":"64.0%","left":"84.9%","size":1,"twinkleDur":"4.4s","twinkleDelay":"0.3s","driftDur":"8.5s","driftDelay":"1.9s"},
  {"top":"87.3%","left":"45.2%","size":2,"twinkleDur":"2.0s","twinkleDelay":"1.0s","driftDur":"10.0s","driftDelay":"3.0s"},
  {"top":"10.7%","left":"5.5%","size":1,"twinkleDur":"2.6s","twinkleDelay":"1.7s","driftDur":"11.5s","driftDelay":"4.1s"},
  {"top":"11.1%","left":"2.8%","size":1,"twinkleDur":"3.2s","twinkleDelay":"2.4s","driftDur":"7.0s","driftDelay":"5.2s"},
  {"top":"34.4%","left":"63.0%","size":2,"twinkleDur":"3.8s","twinkleDelay":"3.1s","driftDur":"8.5s","driftDelay":"0.3s"},
  {"top":"57.8%","left":"23.3%","size":1,"twinkleDur":"4.4s","twinkleDelay":"3.8s","driftDur":"10.0s","driftDelay":"1.4s"},
  {"top":"81.2%","left":"20.6%","size":1,"twinkleDur":"2.0s","twinkleDelay":"0.5s","driftDur":"11.5s","driftDelay":"2.5s"},
  {"top":"4.5%","left":"80.8%","size":2,"twinkleDur":"2.6s","twinkleDelay":"1.2s","driftDur":"7.0s","driftDelay":"3.6s"},
  {"top":"4.9%","left":"41.1%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.9s","driftDur":"8.5s","driftDelay":"4.7s"},
  {"top":"28.3%","left":"1.4%","size":1,"twinkleDur":"3.8s","twinkleDelay":"2.6s","driftDur":"10.0s","driftDelay":"5.8s"},
  {"top":"51.7%","left":"98.6%","size":2,"twinkleDur":"4.4s","twinkleDelay":"3.3s","driftDur":"11.5s","driftDelay":"0.9s"},
  {"top":"75.0%","left":"58.9%","size":1,"twinkleDur":"2.0s","twinkleDelay":"0.0s","driftDur":"7.0s","driftDelay":"2.0s"},
  {"top":"98.4%","left":"19.2%","size":1,"twinkleDur":"2.6s","twinkleDelay":"0.7s","driftDur":"8.5s","driftDelay":"3.1s"},
  {"top":"21.8%","left":"16.5%","size":2,"twinkleDur":"3.2s","twinkleDelay":"1.4s","driftDur":"10.0s","driftDelay":"4.2s"},
  {"top":"22.1%","left":"76.7%","size":1,"twinkleDur":"3.8s","twinkleDelay":"2.1s","driftDur":"11.5s","driftDelay":"5.3s"},
  {"top":"45.5%","left":"37.0%","size":1,"twinkleDur":"4.4s","twinkleDelay":"2.8s","driftDur":"7.0s","driftDelay":"0.4s"},
  {"top":"68.9%","left":"34.3%","size":2,"twinkleDur":"2.0s","twinkleDelay":"3.5s","driftDur":"8.5s","driftDelay":"1.5s"},
  {"top":"92.3%","left":"94.5%","size":1,"twinkleDur":"2.6s","twinkleDelay":"0.2s","driftDur":"10.0s","driftDelay":"2.6s"},
  {"top":"15.6%","left":"54.8%","size":1,"twinkleDur":"3.2s","twinkleDelay":"0.9s","driftDur":"11.5s","driftDelay":"3.7s"},
  {"top":"16.0%","left":"15.1%","size":2,"twinkleDur":"3.8s","twinkleDelay":"1.6s","driftDur":"7.0s","driftDelay":"4.8s"},
  {"top":"39.4%","left":"12.3%","size":1,"twinkleDur":"4.4s","twinkleDelay":"2.3s","driftDur":"8.5s","driftDelay":"5.9s"},
  {"top":"62.7%","left":"72.6%","size":1,"twinkleDur":"2.0s","twinkleDelay":"3.0s","driftDur":"10.0s","driftDelay":"1.0s"},
  {"top":"86.1%","left":"32.9%","size":2,"twinkleDur":"2.6s","twinkleDelay":"3.7s","driftDur":"11.5s","driftDelay":"2.1s"},
  {"top":"9.5%","left":"30.2%","size":1,"twinkleDur":"3.2s","twinkleDelay":"0.4s","driftDur":"7.0s","driftDelay":"3.2s"},
  {"top":"9.8%","left":"90.4%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.1s","driftDur":"8.5s","driftDelay":"4.3s"},
  {"top":"33.2%","left":"50.7%","size":2,"twinkleDur":"4.4s","twinkleDelay":"1.8s","driftDur":"10.0s","driftDelay":"5.4s"},
  {"top":"56.6%","left":"11.0%","size":1,"twinkleDur":"2.0s","twinkleDelay":"2.5s","driftDur":"11.5s","driftDelay":"0.5s"},
  {"top":"80.0%","left":"8.2%","size":1,"twinkleDur":"2.6s","twinkleDelay":"3.2s","driftDur":"7.0s","driftDelay":"1.6s"},
  {"top":"3.3%","left":"68.5%","size":2,"twinkleDur":"3.2s","twinkleDelay":"3.9s","driftDur":"8.5s","driftDelay":"2.7s"},
  {"top":"3.7%","left":"28.8%","size":1,"twinkleDur":"3.8s","twinkleDelay":"0.6s","driftDur":"10.0s","driftDelay":"3.8s"},
  {"top":"27.1%","left":"26.0%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.3s","driftDur":"11.5s","driftDelay":"4.9s"},
  {"top":"50.4%","left":"86.3%","size":2,"twinkleDur":"2.0s","twinkleDelay":"2.0s","driftDur":"7.0s","driftDelay":"0.0s"},
  {"top":"73.8%","left":"46.6%","size":1,"twinkleDur":"2.6s","twinkleDelay":"2.7s","driftDur":"8.5s","driftDelay":"1.1s"},
  {"top":"97.2%","left":"6.9%","size":1,"twinkleDur":"3.2s","twinkleDelay":"3.4s","driftDur":"10.0s","driftDelay":"2.2s"},
  {"top":"20.5%","left":"4.1%","size":2,"twinkleDur":"3.8s","twinkleDelay":"0.1s","driftDur":"11.5s","driftDelay":"3.3s"},
  {"top":"20.9%","left":"64.4%","size":1,"twinkleDur":"4.4s","twinkleDelay":"0.8s","driftDur":"7.0s","driftDelay":"4.4s"},
  {"top":"44.3%","left":"24.7%","size":1,"twinkleDur":"2.0s","twinkleDelay":"1.5s","driftDur":"8.5s","driftDelay":"5.5s"},
  {"top":"67.7%","left":"21.9%","size":2,"twinkleDur":"2.6s","twinkleDelay":"2.2s","driftDur":"10.0s","driftDelay":"0.6s"},
  {"top":"91.0%","left":"82.2%","size":1,"twinkleDur":"3.2s","twinkleDelay":"2.9s","driftDur":"11.5s","driftDelay":"1.7s"},
  {"top":"14.4%","left":"42.5%","size":1,"twinkleDur":"3.8s","twinkleDelay":"3.6s","driftDur":"7.0s","driftDelay":"2.8s"},
  {"top":"14.8%","left":"2.7%","size":2,"twinkleDur":"4.4s","twinkleDelay":"0.3s","driftDur":"8.5s","driftDelay":"3.9s"},
  {"top":"38.1%","left":"0.0%","size":1,"twinkleDur":"2.0s","twinkleDelay":"1.0s","driftDur":"10.0s","driftDelay":"5.0s"},
  {"top":"61.5%","left":"60.3%","size":1,"twinkleDur":"2.6s","twinkleDelay":"1.7s","driftDur":"11.5s","driftDelay":"0.1s"},
  {"top":"84.9%","left":"20.6%","size":2,"twinkleDur":"3.2s","twinkleDelay":"2.4s","driftDur":"7.0s","driftDelay":"1.2s"},
  {"top":"8.2%","left":"17.8%","size":1,"twinkleDur":"3.8s","twinkleDelay":"3.1s","driftDur":"8.5s","driftDelay":"2.3s"},
  {"top":"8.6%","left":"78.1%","size":1,"twinkleDur":"4.4s","twinkleDelay":"3.8s","driftDur":"10.0s","driftDelay":"3.4s"},
  {"top":"32.0%","left":"38.4%","size":2,"twinkleDur":"2.0s","twinkleDelay":"0.5s","driftDur":"11.5s","driftDelay":"4.5s"},
  {"top":"55.4%","left":"35.6%","size":1,"twinkleDur":"2.6s","twinkleDelay":"1.2s","driftDur":"7.0s","driftDelay":"5.6s"},
  {"top":"78.7%","left":"95.9%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.9s","driftDur":"8.5s","driftDelay":"0.7s"},
  {"top":"2.1%","left":"56.2%","size":2,"twinkleDur":"3.8s","twinkleDelay":"2.6s","driftDur":"10.0s","driftDelay":"1.8s"},
  {"top":"2.5%","left":"16.4%","size":1,"twinkleDur":"4.4s","twinkleDelay":"3.3s","driftDur":"11.5s","driftDelay":"2.9s"},
];

const discordInviteUrl =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:rounded focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        {/* Starfield — fixed, behind all content, CSS-animated only */}
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {STARS.map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                "--twinkle-dur": star.twinkleDur,
                "--twinkle-delay": star.twinkleDelay,
                "--drift-dur": star.driftDur,
                "--drift-delay": star.driftDelay,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Sticky header */}
        <header className="sticky top-0 z-50 w-full border-b border-purple-900/40 bg-[#0a0014]/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <WarGuardLogo />
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 mx-4">
              {[
                { href: "/events",    label: "Events" },
                { href: "/hq",        label: "HQ" },
                { href: "/research",  label: "Research" },
                { href: "/heroes",    label: "Heroes" },
                { href: "/tank",      label: "Vehicles" },
                { href: "/gear",      label: "Gear" },
                { href: "/pvp",       label: "PvP" },
                { href: "/guide",     label: "Guide" },
                { href: "/calc",      label: "Calc" },
                { href: "/changelog", label: "Changelog" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="rounded px-2.5 py-1.5 text-sm text-purple-300/80 transition-colors hover:bg-purple-900/50 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a
              href={discordInviteUrl}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500 shrink-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add Discord Bot →
            </a>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="relative z-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-purple-900/40 mt-20 py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-purple-300/60">
            <a
              href={discordInviteUrl}
              className="text-purple-400 hover:text-purple-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add WarGuard to Discord
            </a>
            <p className="mt-2">WarGuard — Personal companion for Last Z players.</p>
            <p className="mt-2 text-purple-300/40">&copy; {new Date().getFullYear()} WarGuard. Not affiliated with Last Z or its developers.</p>
          </div>
        </footer>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
