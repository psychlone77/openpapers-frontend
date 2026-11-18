"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Upload } from "../carbon";

export function CommunityCtaSection() {
  const router = useRouter();

  return (
    <section
      id="upload"
      style={{
        width: "100%",
        backgroundColor: "var(--cds-background)",
        padding: "3.5rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "var(--cds-layer-01)",
          border: "1px solid var(--cds-border-subtle-01)",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--cds-interactive)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            JOIN THE COMMUNITY
          </span>

          <h3
            style={{
              fontFamily: "var(--op-font-sans)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--cds-text-primary)",
              lineHeight: 1.3,
              marginBottom: "0.75rem",
            }}
          >
            Help students succeed — Contribute papers or write solutions
          </h3>

          <p
            style={{
              fontFamily: "var(--op-font-serif)",
              fontSize: "1rem",
              color: "var(--cds-text-secondary)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            OpenPapers is built by a community of students and educators. Upload unindexed exam
            papers, transcribe solutions, or verify existing marking schemes to earn community
            reputation and badges.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            kind="primary"
            size="lg"
            renderIcon={Upload}
            onClick={() => router.push("/guide")}
            style={{ minWidth: "170px" }}
          >
            Upload a Paper
          </Button>

          <Button
            kind="tertiary"
            size="lg"
            onClick={() => router.push("/about")}
            style={{ minWidth: "210px" }}
          >
            Learn How Reputation Works
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CommunityCtaSection;
