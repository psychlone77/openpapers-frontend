"use client";

import React from "react";
import Link from "next/link";
import { ClickableTile, Tag, ArrowRight } from "../carbon";
import type { ExamSummary } from "@/lib/types/api";

interface BrowseByExamSectionProps {
  exams: ExamSummary[];
}

export function BrowseByExamSection({ exams }: BrowseByExamSectionProps) {
  // If backend has sl_al, use live counts
  const slAl = exams.find((e) => e.id === "sl_al");
  const alPaperCount = slAl ? `${slAl.paper_count} Papers` : "520 Papers";

  const examCards = [
    {
      id: "sl_al",
      badge: "National A/L",
      badgeType: "blue" as const,
      count: alPaperCount,
      title: "G.C.E. Advanced Level (A/L)",
      description:
        "Secondary school final qualification. Physics, Combined Maths, Chemistry, Biology, Commerce, Arts & Technology.",
      meta: "12 Years (2012–2024)",
      href: "/papers?exam=sl_al",
    },
    {
      id: "sl_ol",
      badge: "National O/L",
      badgeType: "cool-gray" as const,
      count: "380 Papers",
      title: "G.C.E. Ordinary Level (O/L)",
      description:
        "General secondary qualification. Science, Mathematics, English, Sinhala/Tamil, History & Religion.",
      meta: "10 Years (2014–2024)",
      href: "/papers?exam=sl_ol",
    },
    {
      id: "uni",
      badge: "University",
      badgeType: "teal" as const,
      count: "190 Papers",
      title: "University Degree Exams",
      description:
        "Undergraduate examinations across Engineering, Computing, Medicine, Science, and Management faculties.",
      meta: "6 Faculties",
      href: "/papers?exam=uni",
    },
    {
      id: "ial",
      badge: "International",
      badgeType: "purple" as const,
      count: "420 Papers",
      title: "International A-Levels",
      description:
        "Cambridge International (CIE) and Edexcel International Advanced Level past papers and examiner rubrics.",
      meta: "Edexcel + CIE",
      href: "/papers?exam=ial",
    },
    {
      id: "olympiad",
      badge: "Entrance",
      badgeType: "high-contrast" as const,
      count: "85 Papers",
      title: "Competitive & Entrance",
      description:
        "National Olympiad competitions (Maths, Physics, Chemistry, Informatics), aptitude tests, and scholarships.",
      meta: "Olympiads + Tests",
      href: "/papers?exam=olympiad",
    },
  ];

  return (
    <section
      id="exams"
      style={{
        width: "100%",
        backgroundColor: "var(--cds-layer-01)",
        borderBottom: "1px solid var(--cds-border-subtle-01)",
        padding: "3.5rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--cds-interactive)",
              }}
            >
              DIRECTORY
            </span>
            <h2
              style={{
                fontFamily: "var(--op-font-sans)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--cds-text-primary)",
                letterSpacing: "-0.02em",
                margin: "0.25rem 0 0.5rem 0",
              }}
            >
              Browse by Exam
            </h2>
            <p
              style={{
                fontFamily: "var(--op-font-serif)",
                fontSize: "1rem",
                color: "var(--cds-text-secondary)",
                margin: 0,
              }}
            >
              Explore past papers and resources organized by examination board and level.
            </p>
          </div>

          <Link
            href="/papers"
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--cds-interactive)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              textDecoration: "none",
            }}
          >
            <span>View all examinations</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 5 Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {examCards.map((card) => (
            <ClickableTile
              key={card.id}
              href={card.href}
              className="op-clickable-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Tag type={card.badgeType} size="sm" style={{ margin: 0, fontWeight: 700 }}>
                    {card.badge}
                  </Tag>
                  <span
                    style={{
                      fontFamily: "var(--op-font-sans)",
                      fontSize: "0.75rem",
                      color: "var(--cds-text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {card.count}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--op-font-sans)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--cds-text-primary)",
                    lineHeight: 1.3,
                    marginBottom: "0.625rem",
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--op-font-serif)",
                    fontSize: "0.875rem",
                    color: "var(--cds-text-secondary)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--cds-border-subtle-01)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.75rem",
                }}
              >
                <span
                  style={{
                    color: "var(--cds-text-helper)",
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  {card.meta}
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
                  Browse Papers →
                </span>
              </div>
            </ClickableTile>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseByExamSection;
