"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Button, ChevronRight, ArrowLeft } from "../carbon";
import type { PaperSummary } from "@/lib/types/api";

interface LatestPapersSectionProps {
  recentPapers: PaperSummary[];
}

interface ActivityItem {
  id: string;
  votes: number;
  solutionsText: string;
  isOfficial?: boolean;
  views: string;
  title: string;
  description: string;
  examTag: string;
  subjectTag: string;
  typeTag: string;
  formatTag: string;
  timeAgo: string;
  authorInitials: string;
  authorName: string;
  reputation: string;
  href: string;
  category: "all" | "papers" | "schemes" | "solutions" | "review";
}

export function LatestPapersSection({ recentPapers }: LatestPapersSectionProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "papers" | "schemes" | "solutions" | "review"
  >("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Transform backend recent papers into rich activity items
  const backendItems: ActivityItem[] = recentPapers.map((p, idx) => {
    const langCodes = p.editions?.map((e) => e.language_code.toUpperCase()).join(" + ") || "EN";
    return {
      id: p.id,
      votes: 18 + ((idx * 7) % 25),
      solutionsText: "Verified Answers",
      isOfficial: true,
      views: `${(1.2 + idx * 0.4).toFixed(1)}k views`,
      title: `${p.year} G.C.E. A/L ${p.subject?.name || "Physics"} ${p.part} — Official Past Paper`,
      description: `Complete ${p.type} examination paper with official answer keys, question breakdowns, and multilingual translations.`,
      examTag: `A/L ${p.year}`,
      subjectTag: p.subject?.name || "Physics",
      typeTag: p.type === "MCQ" ? "Multiple Choice" : "Structured",
      formatTag: `${langCodes} Editions`,
      timeAgo: `${idx + 1} day${idx > 0 ? "s" : ""} ago`,
      authorInitials: "OP",
      authorName: "OpenPapers_Archive",
      reputation: "4,820",
      href: `/papers/${p.id}`,
      category: "papers",
    };
  });

  // Real backend activity items
  const itemsToDisplay = backendItems;

  const filteredItems = itemsToDisplay.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "papers") return item.category === "papers";
    if (activeFilter === "schemes") return item.category === "schemes" || item.isOfficial;
    if (activeFilter === "solutions") return item.category === "solutions";
    if (activeFilter === "review") return item.category === "review";
    return true;
  });

  const filterTabs = [
    { key: "all" as const, label: "All Recent" },
    { key: "papers" as const, label: "New Papers" },
    { key: "schemes" as const, label: "Marking Schemes" },
    { key: "solutions" as const, label: "Verified Solutions" },
    { key: "review" as const, label: "Needs Review" },
  ];

  return (
    <section
      id="latest"
      style={{
        width: "100%",
        backgroundColor: "var(--cds-background)",
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
          gap: "1.5rem",
        }}
      >
        {/* Section Header & Category Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            paddingBottom: "0.5rem",
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
              COMMUNITY ACTIVITY
            </span>
            <h2
              style={{
                fontFamily: "var(--op-font-sans)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--cds-text-primary)",
                letterSpacing: "-0.02em",
                margin: "0.25rem 0 0.25rem 0",
              }}
            >
              Latest Papers & Answers
            </h2>
            <p
              style={{
                fontFamily: "var(--op-font-serif)",
                fontSize: "0.875rem",
                color: "var(--cds-text-secondary)",
                margin: 0,
              }}
            >
              Recently uploaded papers, marking guides, and answers verified by students and
              teachers.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              flexWrap: "wrap",
            }}
          >
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: isActive
                      ? "1px solid var(--cds-interactive)"
                      : "1px solid var(--cds-border-subtle-01)",
                    backgroundColor: isActive ? "var(--cds-interactive)" : "var(--cds-layer-01)",
                    color: isActive ? "#ffffff" : "var(--cds-text-primary)",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Papers Stacked List */}
        <div
          style={{
            border: "1px solid var(--cds-border-subtle-01)",
            backgroundColor: "var(--cds-background)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: "1.5rem",
                  borderBottom:
                    index < filteredItems.length - 1
                      ? "1px solid var(--cds-border-subtle-01)"
                      : "none",
                  display: "grid",
                  gridTemplateColumns: "140px 1fr auto",
                  gap: "1.5rem",
                  alignItems: "start",
                  transition: "background-color 120ms ease",
                }}
                className="op-activity-row"
              >
                {/* Left Column: Metric Badges (Desktop) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.35rem",
                    fontFamily: "var(--op-font-sans)",
                    fontSize: "0.75rem",
                  }}
                  className="op-activity-metrics"
                >
                  <span
                    style={{
                      backgroundColor: "var(--cds-layer-01)",
                      border: "1px solid var(--cds-border-subtle-01)",
                      padding: "0.25rem 0.5rem",
                      fontWeight: 700,
                      color: "var(--cds-text-primary)",
                      width: "100%",
                      textAlign: "right",
                    }}
                  >
                    {item.votes} votes
                  </span>
                  <span
                    style={{
                      backgroundColor: item.isOfficial
                        ? "rgba(15, 98, 254, 0.1)"
                        : "var(--cds-layer-01)",
                      border: item.isOfficial
                        ? "1px solid var(--cds-interactive)"
                        : "1px solid var(--cds-border-subtle-01)",
                      color: item.isOfficial
                        ? "var(--cds-interactive)"
                        : "var(--cds-text-secondary)",
                      padding: "0.25rem 0.5rem",
                      fontWeight: 600,
                      width: "100%",
                      textAlign: "right",
                    }}
                  >
                    {item.solutionsText}
                  </span>
                  <span
                    style={{
                      color: "var(--cds-text-helper)",
                      fontSize: "0.6875rem",
                      paddingRight: "0.25rem",
                    }}
                  >
                    {item.views}
                  </span>
                </div>

                {/* Middle Column: Title, Description, Tags */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "var(--cds-interactive)",
                      textDecoration: "none",
                      lineHeight: 1.35,
                      fontFamily: "var(--op-font-sans)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    {item.title}
                  </Link>

                  <p
                    style={{
                      fontFamily: "var(--op-font-serif)",
                      fontSize: "0.875rem",
                      color: "var(--cds-text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Metadata Tags */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Tag type="blue" size="sm" style={{ margin: 0, fontWeight: 600 }}>
                      {item.examTag}
                    </Tag>
                    <Tag type="cool-gray" size="sm" style={{ margin: 0 }}>
                      {item.subjectTag}
                    </Tag>
                    <Tag type="outline" size="sm" style={{ margin: 0 }}>
                      {item.typeTag}
                    </Tag>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--op-font-sans)",
                        color: "var(--cds-text-helper)",
                      }}
                    >
                      {item.formatTag}
                    </span>
                  </div>
                </div>

                {/* Right Column: Author Info & Timestamp */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.35rem",
                    fontSize: "0.75rem",
                    minWidth: "140px",
                  }}
                  className="op-activity-author"
                >
                  <span style={{ color: "var(--cds-text-helper)", fontSize: "0.6875rem" }}>
                    {item.timeAgo}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: "var(--cds-layer-02)",
                        border: "1px solid var(--cds-border-subtle-01)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: "var(--cds-text-primary)",
                        fontFamily: "var(--op-font-sans)",
                      }}
                    >
                      {item.authorInitials}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--cds-text-primary)",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {item.authorName}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--op-font-sans)",
                      color: "var(--cds-text-helper)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Rep: {item.reputation}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "3.5rem 1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  margin: 0,
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                No Recent Activity Found
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--cds-text-secondary)",
                  margin: 0,
                  maxWidth: "460px",
                  fontFamily: "var(--op-font-serif)",
                }}
              >
                There are currently no papers matching this category in the archive. Check back soon
                or browse all examination papers above.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Pagination Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            fontSize: "0.75rem",
            color: "var(--cds-text-secondary)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <span>
            {filteredItems.length > 0
              ? `Showing 1–${filteredItems.length} of ${backendItems.length} recent items`
              : "0 items available"}
          </span>

          {filteredItems.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                renderIcon={ArrowLeft}
                iconDescription="Previous"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
              <button
                type="button"
                style={{
                  width: "28px",
                  height: "28px",
                  border: "1px solid var(--cds-interactive)",
                  backgroundColor: "var(--cds-interactive)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                1
              </button>
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                renderIcon={ChevronRight}
                iconDescription="Next"
                disabled
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.op-activity-row) {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          :global(.op-activity-metrics) {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            width: 100% !important;
          }
          :global(.op-activity-metrics span) {
            width: auto !important;
            text-align: left !important;
          }
          :global(.op-activity-author) {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            border-top: 1px dashed var(--cds-border-subtle-01);
            padding-top: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}

export default LatestPapersSection;
