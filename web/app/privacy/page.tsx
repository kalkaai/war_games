import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — GAMIDES",
    description: "Privacy policy for GAMIDES — what data we collect, how we use it, and your rights.",
    alternates: {
        canonical: "https://www.gamides.com/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-2 text-purple-200/80">Effective date: May 29, 2026</p>

            <div className="mt-10 space-y-8 text-purple-100/90 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">What we collect</h2>
                    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5 space-y-4">
                        <div>
                            <p className="font-semibold text-purple-300 text-sm mb-1">Website analytics</p>
                            <p className="text-sm">We use Google Analytics to collect anonymous usage data including pages visited, time on site, browser type, device type, and approximate location (country/region). Your IP address is anonymised by Google before storage. This data helps us understand how the site is used and improve it.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-purple-300 text-sm mb-1">Discord bot</p>
                            <p className="text-sm">When you use the GAMIDES Discord bot, we store your Discord user ID, the in-game account names you register, and the timers you create. This data is stored in Google Firebase (Firestore) and is used solely to deliver timer notifications back to you.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-purple-300 text-sm mb-1">What we do not collect</p>
                            <p className="text-sm">We do not collect passwords, payment information, or any sensitive personal data. We do not create accounts on this website.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">How we use your data</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>To send you timer alert DMs via Discord</li>
                        <li>To remember your in-game accounts and presets between sessions</li>
                        <li>To analyse site traffic and improve the web app</li>
                        <li>We do not sell, share, or rent your data to third parties</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Third-party services</h2>
                    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5 space-y-3 text-sm">
                        <p><span className="text-purple-300 font-semibold">Google Analytics</span> — collects anonymised usage data. Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google&apos;s Privacy Policy</a>.</p>
                        <p><span className="text-purple-300 font-semibold">Google Firebase / Firestore</span> — stores Discord bot user data. Governed by <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Firebase&apos;s Privacy Policy</a>.</p>
                        <p><span className="text-purple-300 font-semibold">Discord</span> — we access your Discord user ID when you interact with the bot. Governed by <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Discord&apos;s Privacy Policy</a>.</p>
                        <p><span className="text-purple-300 font-semibold">Google Ads</span> — this site may display ads served by Google. Google may use cookies to serve ads based on your prior visits. You can opt out via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google&apos;s Ad Settings</a>.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Cookies</h2>
                    <p className="text-sm">This site uses cookies set by Google Analytics and Google Ads. These cookies are used for analytics and ad personalisation. You can disable cookies in your browser settings or use a browser extension to opt out of tracking.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Data retention and deletion</h2>
                    <p className="text-sm">Bot timer data is kept until you delete it using <code className="bg-purple-900/40 px-1 rounded text-purple-200">/timer delete</code> or <code className="bg-purple-900/40 px-1 rounded text-purple-200">/timer clear</code>. To request complete removal of your data from our systems, contact us via the Discord server.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Changes to this policy</h2>
                    <p className="text-sm">We may update this policy from time to time. The effective date at the top of this page will reflect the latest revision. Continued use of GAMIDES after changes constitutes acceptance.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                    <p className="text-sm">For privacy-related questions or data deletion requests, reach us through our Discord community.</p>
                </section>

            </div>
        </div>
    );
}
