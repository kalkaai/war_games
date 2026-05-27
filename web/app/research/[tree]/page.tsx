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
  const desc = `Last Z ${tree.name} research tree: ${tree.nodeCount} nodes, ${(tree.totalBadges / 1_000_000).toFixed(2)}M badges to max. Interactive progress tracker included.`;
  return {
    title: `${tree.name} — Research | WarGuard | Last Z`,
    description: desc,
    openGraph: {
      title: `${tree.name} — Research | WarGuard | Last Z`,
      description: desc,
  
    },
    alternates: {
      canonical: `https://warguard.app/research/${params.tree}`,
    },
  };
}

export default function ResearchTreePage({ params }: { params: { tree: string } }) {
  const tree = trees.find((t) => t.id === params.tree);
  if (!tree) notFound();

  return <ResearchTreeClient tree={tree} />;
}
