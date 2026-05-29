import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Disclosure — GAMIDES",
    description: "Advertising and affiliation disclosures for GAMIDES.",
    alternates: {
        canonical: "https://www.gamides.com/disclosure",
    },
};

export default function DisclosurePage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Disclosure</h1>
            <p className="mt-2 text-purple-200/80">Effective date: May 29, 2026</p>

            <div className="mt-10 space-y-8 text-purple-100/90 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Fan-made tool</h2>
                    <p className="text-sm">GAMIDES is an independently created, fan-made companion tool for Last Z: Survival Shooter. It is not affiliated with, sponsored by, endorsed by, or otherwise connected to the developers or publishers of Last Z: Survival Shooter. All game names, trademarks, and related assets are the property of their respective owners.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Advertising</h2>
                    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5 text-sm space-y-3">
                        <p>This website may display advertisements served by Google Ads (Google AdSense / Google Ad Manager). These ads are clearly distinguishable from editorial content.</p>
                        <p>Google may use cookies and similar technologies to serve ads based on your interests and prior visits to this or other websites. You can manage your ad preferences or opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">adssettings.google.com</a>.</p>
                        <p>Ad revenue helps cover hosting and development costs. Advertising relationships do not influence editorial content, game data accuracy, or tool recommendations on this site.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Affiliate links</h2>
                    <p className="text-sm">GAMIDES does not currently use affiliate links. If this changes in the future, any affiliate relationships will be clearly disclosed on the relevant pages in accordance with FTC guidelines.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Community data</h2>
                    <p className="text-sm">Game data published on this site (stats, timers, research trees, etc.) is sourced from the Last Z player community. GAMIDES does not receive compensation from any party for featuring or presenting this data. See the <a href="/credits" className="text-purple-400 hover:text-purple-300 underline">Credits</a> page for contributors.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                    <p className="text-sm">Questions about our disclosures? Reach us through our Discord community.</p>
                </section>

            </div>
        </div>
    );
}
