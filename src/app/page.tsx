"use client";

import React from "react";
import { PaperSearchBox } from "@/components/PaperSearchBox";
import { Tag } from "@/components/carbon";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "4rem 1.5rem 6rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Tag type="blue" size="md">
          Open Access Examination Archive
        </Tag>
        <Tag type="teal" size="md">
          Sri Lankan A-Levels & Beyond
        </Tag>
      </div>

      <h1
        style={{
          fontSize: "2.75rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          color: "var(--cds-text-primary)",
          marginBottom: "1rem",
        }}
      >
        Practice Past Papers with Precision
      </h1>

      <p
        style={{
          fontSize: "1.25rem",
          color: "var(--cds-text-secondary)",
          maxWidth: "680px",
          margin: "0 auto 3rem auto",
          lineHeight: 1.6,
        }}
      >
        Browse comprehensive past examination papers, step through questions with full LaTeX
        equations, and practice with immediate solution verification.
      </p>

      <PaperSearchBox />
    </div>
  );
}
