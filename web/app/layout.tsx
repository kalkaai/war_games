import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { GameidesLogo } from "./components/GameidesLogo";
import { GameSwitcher } from "./components/GameSwitcher";
import { PrimaryNav } from "./components/PrimaryNav";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gamides.com"),
  title: "GAMIDES — The Last Z: Survival Shooter Game Guide",
  description:
    "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z: Survival Shooter players. The complete game guide.",
  openGraph: {
    title: "GAMIDES — The Last Z: Survival Shooter Game Guide",
    description:
      "Event schedules, HQ upgrade tables, research trees, hero guides, and calculators for Last Z: Survival Shooter players. The complete game guide.",
    type: "website",
    url: "https://www.gamides.com",
    images: [{ url: "https://www.gamides.com/opengraph-image", width: 1200, height: 630 }],
  },
  other: {
    "google-adsense-account": "ca-pub-2170985466863364",
  },
};

// 28-star starfield: deterministic values, low DOM count & strict CSS containment for fast LCP/INP.
const STARS = [
  {"top":"3.2%","left":"6.1%","size":2,"twinkleDur":"2.8s","twinkleDelay":"0.0s"},
  {"top":"18.6%","left":"14.4%","size":1,"twinkleDur":"3.4s","twinkleDelay":"0.7s"},
  {"top":"42.0%","left":"61.7%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.4s"},
  {"top":"71.3%","left":"21.9%","size":2,"twinkleDur":"3.8s","twinkleDelay":"2.1s"},
  {"top":"91.7%","left":"19.2%","size":1,"twinkleDur":"4.4s","twinkleDelay":"2.8s"},
  {"top":"15.1%","left":"79.5%","size":1,"twinkleDur":"2.6s","twinkleDelay":"1.5s"},
  {"top":"22.4%","left":"39.7%","size":2,"twinkleDur":"3.0s","twinkleDelay":"0.2s"},
  {"top":"65.2%","left":"92.3%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.6s"},
  {"top":"88.6%","left":"57.5%","size":2,"twinkleDur":"4.2s","twinkleDelay":"2.3s"},
  {"top":"11.9%","left":"27.8%","size":1,"twinkleDur":"2.9s","twinkleDelay":"1.0s"},
  {"top":"35.7%","left":"75.4%","size":2,"twinkleDur":"3.2s","twinkleDelay":"0.4s"},
  {"top":"59.0%","left":"35.6%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.1s"},
  {"top":"82.4%","left":"32.9%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.8s"},
  {"top":"6.2%","left":"53.4%","size":1,"twinkleDur":"2.6s","twinkleDelay":"1.2s"},
  {"top":"29.5%","left":"13.7%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.9s"},
  {"top":"52.9%","left":"11.0%","size":2,"twinkleDur":"3.8s","twinkleDelay":"0.6s"},
  {"top":"76.3%","left":"71.2%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.3s"},
  {"top":"23.4%","left":"89.1%","size":1,"twinkleDur":"3.2s","twinkleDelay":"1.4s"},
  {"top":"46.7%","left":"49.3%","size":1,"twinkleDur":"3.8s","twinkleDelay":"0.1s"},
  {"top":"70.1%","left":"9.6%","size":2,"twinkleDur":"4.4s","twinkleDelay":"0.8s"},
  {"top":"16.8%","left":"67.1%","size":1,"twinkleDur":"2.6s","twinkleDelay":"2.2s"},
  {"top":"40.6%","left":"24.7%","size":1,"twinkleDur":"3.8s","twinkleDelay":"1.6s"},
  {"top":"64.0%","left":"84.9%","size":1,"twinkleDur":"4.4s","twinkleDelay":"0.3s"},
  {"top":"87.3%","left":"45.2%","size":2,"twinkleDur":"2.8s","twinkleDelay":"1.0s"},
  {"top":"34.4%","left":"63.0%","size":2,"twinkleDur":"3.8s","twinkleDelay":"1.1s"},
  {"top":"57.8%","left":"23.3%","size":1,"twinkleDur":"4.4s","twinkleDelay":"1.8s"},
  {"top":"8.6%","left":"78.1%","size":1,"twinkleDur":"4.0s","twinkleDelay":"0.8s"},
  {"top":"51.7%","left":"94.6%","size":2,"twinkleDur":"4.4s","twinkleDelay":"1.3s"},
];

const discordInviteUrl =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GAMIDES",
  "url": "https://www.gamides.com",
  "description": "Community game guide for Last Z: Survival Shooter players — event schedules, HQ upgrade tables, research trees, hero guides, and calculators.",
  "about": {
    "@type": "VideoGame",
    "name": "Last Z: Survival Shooter",
    "description": "Competitive strategy and survival game with base building, research, hero collection, and alliance PvP.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitScript = `try{var t=localStorage.getItem("wg_theme")||"nebula";document.documentElement.setAttribute("data-theme",t);if(t==="daylight"){document.documentElement.classList.remove("dark");document.querySelector('meta[name="color-scheme"]')?.setAttribute("content","light");}}catch(e){}`;

  return (
    <html lang="en" className="dark" data-theme="nebula" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:rounded focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        {/* Starfield — fixed, behind all content, strict CSS containment */}
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ contain: "strict" }}
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
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Two-tier responsive sticky header */}
        <header className="sticky top-0 z-50 w-full border-b border-purple-900/40 bg-purple-950/90 backdrop-blur-md transition-colors">
          {/* Row 1: Brand Logo + Top-Level Game Switcher + Theme Switcher */}
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <div className="flex items-center">
              <GameidesLogo />
            </div>

            <div className="order-3 w-full sm:order-2 sm:w-auto">
              <GameSwitcher />
            </div>

            <div className="order-2 flex items-center gap-2 sm:order-3">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Row 2: Active Game Navigation Bar (Events, Seasons, HQ, etc.) */}
          <PrimaryNav />
        </header>

        {/* Page content */}
        <main id="main-content" className="relative z-10 flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-purple-900/40 mt-20 py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-purple-200/75">
            <a
              href={discordInviteUrl}
              className="inline-block rounded-md bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add GAMIDES to Discord
            </a>
            <p className="mt-2">GAMIDES — Personal companion for Last Z: Survival Shooter players.</p>
            <p className="mt-2 text-purple-200/80">Copyright &copy; {new Date().getFullYear()} GAMIDES. Not affiliated with Last Z: Survival Shooter or its developers.</p>
            <p className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href="/feedback" className="text-purple-400 hover:text-purple-300 transition-colors">Feedback</Link>
              <Link href="/credits" className="text-purple-400 hover:text-purple-300 transition-colors">Credits</Link>
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">Terms</Link>
              <Link href="/disclosure" className="text-purple-400 hover:text-purple-300 transition-colors">Disclosure</Link>
            </p>
          </div>
        </footer>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        </Providers>
      </body>
    </html>
  );
}
