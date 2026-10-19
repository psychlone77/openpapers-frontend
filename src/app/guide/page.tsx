"use client";

import React from "react";
import Link from "next/link";
import { Tile, Button, Breadcrumb, BreadcrumbItem } from "@/components/carbon";
import { ArrowRight, Book, Document, Checkmark, Home } from "@/components/carbon";

export default function GuidePage() {
  const guideSteps = [
    {
      number: "01",
      title: "Select Examination Subject",
      description:
        "Choose your target subject from the dropdown menu (Physics, Biology, Chemistry, Mathematics).",
      icon: Book,
    },
    {
      number: "02",
      title: "Choose Year & Paper Format",
      description:
        "Filter by past examination years (2015 to 2025) and select between MCQ, Structured Essay, or Practical formats.",
      icon: Document,
    },
    {
      number: "03",
      title: "Practice & Work Through Questions",
      description:
        "Navigate questions using the structured sidebar. Read formulas rendered in crisp LaTeX, review figures, and select your choice.",
      icon: ArrowRight,
    },
    {
      number: "04",
      title: "Reveal Solutions & Instant Feedback",
      description:
        "Verify your answers with official marking schemes and detailed step-by-step LaTeX solutions.",
      icon: Checkmark,
    },
  ];

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3.5rem 1.5rem 6rem 1.5rem",
      }}
    >
      <Breadcrumb noTrailingSlash style={{ marginBottom: "2rem" }}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Guide</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--cds-text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          How to Use OpenPapers
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--cds-text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          An open, structured platform designed for effective practice and deep conceptual review.
        </p>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}
      >
        {guideSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Tile
              key={idx}
              style={{
                padding: "2rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                display: "flex",
                alignItems: "flex-start",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--op-font-sans)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--cds-interactive)",
                  padding: "0.5rem 1rem",
                  backgroundColor: "var(--cds-layer-02)",
                  border: "1px solid var(--cds-border-subtle-01)",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                {step.number}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Icon size={20} style={{ color: "var(--cds-interactive)" }} />
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      margin: 0,
                      color: "var(--cds-text-primary)",
                    }}
                  >
                    {step.title}
                  </h2>
                </div>
                <p style={{ margin: 0, color: "var(--cds-text-secondary)", lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            </Tile>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <Button as={Link} href="/" kind="primary" renderIcon={Home} size="lg">
          Start Practicing Now
        </Button>
      </div>
    </div>
  );
}
