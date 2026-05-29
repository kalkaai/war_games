import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — GAMIDES",
    description: "Terms of service for GAMIDES — conditions for using the website and Discord bot.",
    alternates: {
        canonical: "https://www.gamides.com/terms",
    },
};

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Terms of Service</h1>
            <p className="mt-2 text-purple-200/80">Effective date: May 29, 2026</p>

            <div className="mt-10 space-y-8 text-purple-100/90 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">About GAMIDES</h2>
                    <p className="text-sm">GAMIDES is a free, fan-made companion tool for players of Last Z: Survival Shooter. It provides a reference website and a Discord bot for tracking in-game timers and events. GAMIDES is not affiliated with, endorsed by, or connected to the developers or publishers of Last Z: Survival Shooter.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Acceptance of terms</h2>
                    <p className="text-sm">By using the GAMIDES website or Discord bot, you agree to these terms. If you do not agree, please discontinue use.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Use of the service</h2>
                    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5 space-y-3 text-sm">
                        <p>You agree to use GAMIDES only for its intended purpose as a game companion tool. You must not:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Abuse, spam, or attempt to disrupt the Discord bot</li>
                            <li>Scrape or systematically extract data from the website</li>
                            <li>Attempt to gain unauthorised access to any backend systems</li>
                            <li>Use GAMIDES in any way that violates Discord&apos;s Terms of Service</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Accuracy of information</h2>
                    <p className="text-sm">Game data on this site (HQ stats, research trees, hero stats, event timers, etc.) is compiled by the community and may be incomplete or out of date. We make no guarantees about accuracy. Always verify critical in-game decisions using official sources.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Disclaimer of warranties</h2>
                    <p className="text-sm">GAMIDES is provided &ldquo;as is&rdquo; without any warranty of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or always available. Use of GAMIDES is at your own risk.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Limitation of liability</h2>
                    <p className="text-sm">To the fullest extent permitted by law, GAMIDES and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including missed in-game events due to timer inaccuracies or service downtime.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Intellectual property</h2>
                    <p className="text-sm">All game names, images, and related content belong to their respective owners. GAMIDES does not claim ownership of any Last Z: Survival Shooter intellectual property. GAMIDES&apos;s own code, design, and original content are the property of its operators.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Changes to these terms</h2>
                    <p className="text-sm">We reserve the right to update these terms at any time. The effective date above reflects the latest revision. Continued use of GAMIDES after changes constitutes acceptance of the updated terms.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                    <p className="text-sm">Questions about these terms? Reach us through our Discord community.</p>
                </section>

            </div>
        </div>
    );
}
