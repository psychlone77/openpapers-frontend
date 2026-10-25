import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  ClickableTile,
  ArrowRight,
  Time,
  Document,
} from "@/components/carbon";
import { HeroSearchConsole } from "@/components/home/HeroSearchConsole";
import {
  fetchExams,
  fetchSubjects,
  fetchSubjectPapers,
  fetchRecentPapers,
  resolveSubjectName,
} from "@/lib/api/curriculum";
import type { PaperSummary } from "@/lib/types/api";

export const metadata = {
  title: "Examination Papers Archive | OpenPapers",
  description:
    "Browse, filter, and practice official past examination papers with verified solutions.",
};

interface PapersPageProps {
  searchParams?: Promise<{
    exam?: string;
    subject?: string;
    year?: string;
    type?: string;
  }>;
}

export default async function PapersPage({ searchParams }: PapersPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { exam, subject, year, type } = resolvedParams;

  // 1. Fetch available exams and subjects in parallel
  const [exams, subjects] = await Promise.all([fetchExams(), fetchSubjects()]);

  // 2. Determine which subject to query for papers
  // If a subject is specified in query params, query that subject;
  // otherwise, default to the first subject from backend
  const activeSubjectId = subject || (subjects.length > 0 ? subjects[0].id : undefined);

  let papers: PaperSummary[] = [];

  if (activeSubjectId) {
    papers = await fetchSubjectPapers(activeSubjectId, year, subjects);
  } else {
    papers = await fetchRecentPapers();
  }

  // 3. Filter by paper type if specified (e.g., mcq vs essay)
  if (type && type !== "all") {
    papers = papers.filter((p) => {
      const pType = (p.type || "").toLowerCase();
      const pPart = (p.part || "").toLowerCase();
      const queryType = type.toLowerCase();
      return pType.includes(queryType) || pPart.includes(queryType);
    });
  }

  const currentSubject = subjects.find(
    (s) => s.id === activeSubjectId || s.name.toLowerCase() === activeSubjectId?.toLowerCase()
  );
  const activeSubjectName =
    currentSubject?.name ||
    papers[0]?.subject?.name ||
    papers[0]?.subject_name ||
    (activeSubjectId ? resolveSubjectName(activeSubjectId, subjects) : "All Subjects");
  const activeYearLabel = year && year !== "all" ? year : "All Years";

  return (
    <div
      style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem 1.5rem",
      }}
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: "1.5rem" }}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Examination Papers</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--op-font-sans)",
            fontSize: "2.25rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--cds-text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Examination Papers Archive
        </h1>
        <p
          style={{
            fontFamily: "var(--op-font-serif)",
            fontSize: "1.0625rem",
            color: "var(--cds-text-secondary)",
            margin: 0,
          }}
        >
          Filter and practice official examination papers with full LaTeX equations and immediate
          solution verification.
        </p>
      </div>

      {/* Unified 4-Dropdown Search Bar (Reused from Home Page with selected parameters) */}
      <HeroSearchConsole
        exams={exams}
        subjects={subjects}
        initialExam={exam}
        initialSubject={activeSubjectId}
        initialYear={year}
        initialType={type}
        compact={true}
      />

      {/* Search Results Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem 0",
          borderBottom: "1px solid var(--cds-border-subtle-01)",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--op-font-sans)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--cds-text-primary)",
              margin: 0,
            }}
          >
            {activeSubjectName} — {activeYearLabel}
          </h2>
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--cds-text-secondary)",
            }}
          >
            Official examination papers retrieved from OpenPapers database
          </span>
        </div>

        <Tag type="blue" size="md" style={{ margin: 0, fontWeight: 700 }}>
          {papers.length} {papers.length === 1 ? "Paper Found" : "Papers Found"}
        </Tag>
      </div>

      {/* Search Results List / Grid */}
      {papers.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {papers.map((paper) => {
            const subjectLabel = paper.subject?.name || paper.subject_name || activeSubjectName;
            const editionLangs =
              paper.editions?.map((e) => e.language_code.toUpperCase()).join(" • ") || "EN";

            return (
              <ClickableTile
                key={paper.id}
                href={`/papers/${paper.id}`}
                className="op-clickable-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px",
                }}
              >
                <div>
                  {/* Top Tags Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <Tag type="blue" size="sm" style={{ margin: 0, fontWeight: 700 }}>
                      {paper.year}
                    </Tag>
                    <span
                      style={{
                        fontFamily: "var(--op-font-sans)",
                        fontSize: "0.75rem",
                        color: "var(--cds-text-secondary)",
                        fontWeight: 600,
                      }}
                    >
                      {paper.part || "Part 1"}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <h3
                    style={{
                      fontFamily: "var(--op-font-sans)",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "var(--cds-text-primary)",
                      lineHeight: 1.35,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {subjectLabel} — {paper.year} {paper.type}
                  </h3>

                  {/* Metadata Indicators */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      fontSize: "0.75rem",
                      color: "var(--cds-text-secondary)",
                      fontFamily: "var(--op-font-sans)",
                      marginBottom: "1rem",
                    }}
                  >
                    {paper.question_count && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Document size={14} />
                        {paper.question_count} Questions
                      </span>
                    )}

                    {paper.time_limit_minutes && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Time size={14} />
                        {paper.time_limit_minutes} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Language Editions & Action */}
                <div
                  style={{
                    paddingTop: "0.875rem",
                    borderTop: "1px solid var(--cds-border-subtle-01)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--cds-text-helper)",
                      fontFamily: "var(--op-font-sans)",
                    }}
                  >
                    Editions: {editionLangs}
                  </span>

                  <span
                    className="op-tile-action"
                    style={{
                      color: "var(--cds-interactive)",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    Start Paper
                    <ArrowRight size={14} />
                  </span>
                </div>
              </ClickableTile>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            backgroundColor: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            padding: "3rem 2rem",
            textAlign: "center",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--cds-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            No examination papers found
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--cds-text-secondary)",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
            }}
          >
            There are currently no papers matching the selected examination, subject, and year. Try
            selecting a different subject or choosing &quot;All Available Years&quot;.
          </p>
          <Link
            href="/papers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--cds-interactive)",
              color: "#ffffff",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Reset All Filters
          </Link>
        </div>
      )}
    </div>
  );
}
