import React from "react";
import { HeroSearchConsole } from "@/components/home/HeroSearchConsole";
import { BrowseByExamSection } from "@/components/home/BrowseByExamSection";
import { LatestPapersSection } from "@/components/home/LatestPapersSection";
import { PopularTopicsSection } from "@/components/home/PopularTopicsSection";
import { CommunityCtaSection } from "@/components/home/CommunityCtaSection";
import { fetchExams, fetchSubjects, fetchRecentPapers } from "@/lib/api/curriculum";

export const metadata = {
  title: "OpenPapers | Academic Examination Archive Portal",
  description:
    "Search past examination papers, official marking rubrics, and community-verified solutions across secondary and university exams.",
};

export default async function Home() {
  // Fetch curriculum and recent activity data in parallel from backend
  const [exams, subjects, recentPapers] = await Promise.all([
    fetchExams(),
    fetchSubjects(),
    fetchRecentPapers(),
  ]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* 1. Hero & 4-Dropdown Search Console */}
      <HeroSearchConsole exams={exams} subjects={subjects} />

      {/* 2. Directory: Browse by Exam */}
      <BrowseByExamSection exams={exams} />

      {/* 3. Community Activity: Latest Papers & Answers */}
      <LatestPapersSection recentPapers={recentPapers} />

      {/* 4. Practice by Topic: Popular Topics & Practice Questions */}
      <PopularTopicsSection />

      {/* 5. Community Contribution CTA */}
      <CommunityCtaSection />
    </div>
  );
}
