import { notFound } from "next/navigation";
import { Suspense } from "react";
import PaperClient from "./PaperClient";
import getPaper from "@/lib/actions/paperActions";
import { Spin } from "antd";

// This component runs on the server
export default async function PaperPage({
  params,
}: {
  params: Promise<{ subject: string; year: string; type: string }>;
}) {
  const { subject, year, type } = await params;
  const paper = await getPaper(subject, year, type);

  // Show 404 if paper not found
  if (!paper) {
    notFound();
  }

  return (
    <Suspense fallback={<Spin fullscreen size="large" tip="Loading Paper Content..." />}>
      <PaperClient paper={paper} />
    </Suspense>
  );
}
