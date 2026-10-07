import ExpertProfileClient from "./ExpertProfileClient";
import { getExpertById, experts } from "@/data/experts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = getExpertById(id);
  if (!expert) notFound();

  return <ExpertProfileClient expertId={expert.id} />;
}
