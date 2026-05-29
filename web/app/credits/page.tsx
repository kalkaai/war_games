import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Credits — GAMIDES | Last Z: Survival Shooter",
    description:
        "Thank you to the Last Z: Survival Shooter communities and alliances who contributed data, testing, and feedback to GAMIDES.",
    openGraph: {
        title: "Credits — GAMIDES | Last Z: Survival Shooter",
        description:
            "Thank you to the Last Z: Survival Shooter communities and alliances who contributed data, testing, and feedback to GAMIDES.",
    },
    alternates: {
        canonical: "https://www.gamides.com/credits",
    },
};

const ALLIANCES = [
    "SUPR / SUPR VLNZ",
    "SOUL / STDH / DOA",
    "PHX / EWS",
    "OMERTA / SEGA",
    "EA69",
    "NEWBEES",
];

export default function CreditsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Credits
            </h1>
            <p className="mt-2 text-purple-200/80">
                GAMIDES is built with data, feedback, and testing from the Last
                Z community. Thank you to everyone who contributed.
            </p>

            <div className="mt-10 space-y-8">
                <section>
                    <div className="rounded-xl border border-purple-700/60 bg-purple-900/20 p-5">
                        <p className="font-semibold text-purple-300 text-sm">
                            Server 694
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {ALLIANCES.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-md border border-purple-700/60 bg-purple-800/40 px-3 py-1 text-sm font-medium text-purple-100"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <p className="text-sm text-purple-100/90 leading-relaxed">
                        A big thank you to all the members of Server 694 for
                        their support, feedback, and contributions that helped
                        shape GAMIDES into what it is today.
                    </p>
                </section>
            </div>
        </div>
    );
}
