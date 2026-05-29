import type { Metadata } from "next";
import { notFound } from "next/navigation";
import researchData from "@/data/research.json";
import type { ResearchTree } from "@/types";
import ResearchTreeClient from "./ResearchTreeClient";

const trees = researchData.trees as ResearchTree[];

export function generateStaticParams() {
  return trees.map((t) => ({ tree: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { tree: string };
}): Promise<Metadata> {
  const tree = trees.find((t) => t.id === params.tree);
  if (!tree) return {};
  const desc = `Last Z: Survival Shooter ${tree.name} research tree: ${tree.nodeCount} nodes, ${(tree.totalBadges / 1_000_000).toFixed(2)}M badges to max. Interactive progress tracker included.`;
  return {
    title: `${tree.name} — Research | GAMIDES | Last Z: Survival Shooter`,
    description: desc,
    openGraph: {
      title: `${tree.name} — Research | GAMIDES | Last Z: Survival Shooter`,
      description: desc,
    },
    alternates: {
      canonical: `https://www.gamides.com/research/${params.tree}`,
    },
  };
}

export default function ResearchTreePage({ params }: { params: { tree: string } }) {
  const tree = trees.find((t) => t.id === params.tree);
  if (!tree) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gamides.com" },
      { "@type": "ListItem", "position": 2, "name": "Research", "item": "https://www.gamides.com/research" },
      { "@type": "ListItem", "position": 3, "name": tree.name, "item": `https://www.gamides.com/research/${params.tree}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ResearchTreeClient tree={tree} />
    </>
  );
}
