import { notFound } from "next/navigation";
import { Suspense } from "react";
import PaperClient from "./[year]/[type]/PaperClient";
import { getPaperById } from "@/lib/actions/paperActions";
import CarbonLoader from "@/components/carbon/CarbonLoader";

export default async function PaperSubjectOrIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { subject } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvedSearchParams?.lang;

  const paper = await getPaperById(subject, lang);

  if (!paper) {
    notFound();
  }

  return (
    <Suspense fallback={<CarbonLoader description="Loading Paper Content..." />}>
      <PaperClient paper={paper} />
    </Suspense>
  );
}
