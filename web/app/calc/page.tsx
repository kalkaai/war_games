import type { Metadata } from "next";
import CalcClient from "./CalcClient";

export const metadata: Metadata = {
  title: "Calculators — GAMIDES | Last Z",
  description: "Last Z calculators: speed-up timer converter, badge budget planner, HQ resource totals, and CP gain estimator. All calculations run client-side.",
  openGraph: {
    title: "Calculators — GAMIDES | Last Z",
    description: "Last Z calculators: speed-up timer, badge budget planner, HQ resource totals, and CP gain estimator. All client-side.",

  },
  alternates: {
    canonical: "https://www.gamides.com/calc",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many speed-ups do I need for an upgrade in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Use the Speed-Up Calculator: enter your upgrade timer in hours and minutes, and it calculates exactly how many 1-hour, 3-hour, 8-hour, or 24-hour speed-up items are required to complete it instantly." }
    },
    {
      "@type": "Question",
      "name": "How do I plan my badge budget in Last Z?",
      "acceptedAnswer": { "@type": "Answer", "text": "Use the Badge Budget Calculator to set a target badge count and see how many days of daily tasks you need. Badges are the primary currency for all research trees in Last Z and must be planned carefully across 9 research trees." }
    }
  ]
};

export default function CalcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalcClient />
    </>
  );
}
