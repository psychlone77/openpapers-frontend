"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Button, Tag, ArrowRight } from "../carbon";
import type { ExamSummary, SubjectSummary } from "@/lib/types/api";
import { getSubjectYearsAction } from "@/lib/actions/curriculumActions";

interface HeroSearchConsoleProps {
  exams: ExamSummary[];
  subjects: SubjectSummary[];
  initialExam?: string;
  initialSubject?: string;
  initialYear?: string;
  initialType?: string;
  compact?: boolean;
}

export function HeroSearchConsole({
  exams,
  subjects,
  initialExam,
  initialSubject,
  initialYear,
  initialType,
  compact = false,
}: HeroSearchConsoleProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Find initial subject: match by ID or Name or default to first subject
  const defaultSubject =
    subjects.find(
      (s) =>
        s.id === initialSubject || s.name.toLowerCase() === (initialSubject || "").toLowerCase()
    )?.id ||
    subjects[0]?.id ||
    "";

  const defaultExam = initialExam || exams[0]?.id || "sl_al";
  const defaultYear = initialYear || "all";
  const defaultType = initialType || "all";

  // State
  const [selectedExam, setSelectedExam] = useState<string>(defaultExam);
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [selectedType, setSelectedType] = useState<string>(defaultType);
  const [availableYears, setAvailableYears] = useState<number[]>([
    2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
  ]);
  const [loadingYears, setLoadingYears] = useState<boolean>(false);

  // Sync state if initial props change
  useEffect(() => {
    if (initialExam) setSelectedExam(initialExam);
    if (initialSubject) {
      const match = subjects.find(
        (s) => s.id === initialSubject || s.name.toLowerCase() === initialSubject.toLowerCase()
      );
      if (match) setSelectedSubject(match.id);
    }
    if (initialYear) setSelectedYear(initialYear);
    if (initialType) setSelectedType(initialType);
  }, [initialExam, initialSubject, initialYear, initialType, subjects]);

  // Dynamically fetch available years whenever the selected subject changes
  useEffect(() => {
    if (!selectedSubject || selectedSubject === "all") return;

    setLoadingYears(true);
    startTransition(async () => {
      try {
        const years = await getSubjectYearsAction(selectedSubject);
        if (Array.isArray(years) && years.length > 0) {
          setAvailableYears(years);
        }
      } catch (err) {
        console.warn("Failed to fetch subject years dynamically:", err);
      } finally {
        setLoadingYears(false);
      }
    });
  }, [selectedSubject]);

  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Paper 1 (MCQ)", value: "mcq" },
    { label: "Paper 2 (Essay / Structured)", value: "essay" },
    { label: "Official Marking Scheme", value: "scheme" },
    { label: "Community Worked Answers", value: "solutions" },
  ];

  const handleClear = () => {
    setSelectedExam(exams[0]?.id || "sl_al");
    setSelectedSubject("all");
    setSelectedYear("all");
    setSelectedType("all");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedExam && selectedExam !== "all") params.set("exam", selectedExam);
    if (selectedSubject && selectedSubject !== "all") params.set("subject", selectedSubject);
    if (selectedYear && selectedYear !== "all") params.set("year", selectedYear);
    if (selectedType && selectedType !== "all") params.set("type", selectedType);

    const queryString = params.toString();
    router.push(`/papers${queryString ? `?${queryString}` : ""}`);
  };

  // Human-readable labels for the active search pill
  const activeExamName =
    selectedExam === "all"
      ? "All Exams"
      : exams.find((e) => e.id === selectedExam)?.name || "G.C.E. A/L";
  const activeSubjectName =
    selectedSubject === "all"
      ? "All Subjects"
      : subjects.find((s) => s.id === selectedSubject)?.name || "Subject";
  const activeYearLabel = selectedYear === "all" ? "All Years" : selectedYear;
  const activeTypeLabel = typeOptions.find((t) => t.value === selectedType)?.label || "All Types";
  const activeSummary = `${activeExamName} • ${activeSubjectName} • ${activeYearLabel} • ${activeTypeLabel}`;

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: compact ? "transparent" : "var(--cds-background)",
        borderBottom: compact ? "none" : "1px solid var(--cds-border-subtle-01)",
        padding: compact ? "0 0 2rem 0" : "3.5rem 1.5rem 2.5rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: compact ? "1rem" : "2rem",
        }}
      >
        {/* Full Hero Banner - Only rendered when not compact */}
        {!compact && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div style={{ maxWidth: "800px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <Tag type="blue" size="sm" style={{ margin: 0, fontWeight: 600 }}>
                  OPEN COMMUNITY LEARNING
                </Tag>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--cds-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  100% Free & Ad-Free
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--op-font-sans)",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  marginBottom: "0.75rem",
                }}
              >
                Find Past Papers & Marking Schemes
              </h1>

              <p
                style={{
                  fontFamily: "var(--op-font-serif)",
                  fontSize: "1.125rem",
                  color: "var(--cds-text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Search past examination papers, official marking rubrics, and community-verified
                solutions across secondary and university exams.
              </p>
            </div>

            {/* Stat Badge */}
            <div
              style={{
                backgroundColor: "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                padding: "0.875rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                minWidth: "220px",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--cds-text-secondary)",
                }}
              >
                COMMUNITY ARCHIVE
              </span>
              <span
                style={{
                  fontFamily: "var(--op-font-sans)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--cds-interactive)",
                }}
              >
                2,800+ Verified Papers
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--cds-text-helper)",
                }}
              >
                Free for all students & teachers
              </span>
            </div>
          </div>
        )}

        {/* 4-Dropdown Search Console */}
        <div
          style={{
            backgroundColor: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                alignItems: "end",
              }}
            >
              {/* Dropdown 1: Examination */}
              <Select
                id="exam-select"
                labelText="Examination"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <SelectItem value="all" text="All Examinations" />
                {exams.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id} text={ex.name} />
                ))}
              </Select>

              {/* Dropdown 2: Subject */}
              <Select
                id="subject-select"
                labelText="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <SelectItem value="all" text="All Subjects" />
                {subjects.map((s) => (
                  <SelectItem
                    key={s.id}
                    value={s.id}
                    text={`${s.name} (${s.paper_count} papers)`}
                  />
                ))}
              </Select>

              {/* Dropdown 3: Year (Dynamically populated from backend) */}
              <Select
                id="year-select"
                labelText={loadingYears ? "Year (Loading...)" : "Examination Year"}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={loadingYears}
              >
                <SelectItem value="all" text="All Available Years" />
                {availableYears.map((y) => (
                  <SelectItem key={y} value={String(y)} text={String(y)} />
                ))}
              </Select>

              {/* Dropdown 4: Type */}
              <Select
                id="type-select"
                labelText="Paper / Resource Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {typeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value} text={t.label} />
                ))}
              </Select>
            </div>

            {/* Active Search & Search Button Bar */}
            <div
              style={{
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--cds-border-subtle-01)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  fontSize: "0.8125rem",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.75rem",
                    color: "var(--cds-text-secondary)",
                  }}
                >
                  Active Search:
                </span>
                <span
                  style={{
                    backgroundColor: "var(--cds-background)",
                    border: "1px solid var(--cds-border-subtle-01)",
                    padding: "0.25rem 0.625rem",
                    color: "var(--cds-interactive)",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  {activeSummary}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--cds-support-error, #da1e28)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  Clear all
                </button>
              </div>

              <Button
                type="submit"
                renderIcon={ArrowRight}
                size="md"
                style={{ minWidth: "180px", height: "40px" }}
              >
                Search Papers
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default HeroSearchConsole;
