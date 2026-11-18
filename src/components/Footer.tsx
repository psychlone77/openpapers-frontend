"use client";

import React from "react";
import Link from "next/link";
import { Tag, Book, CheckmarkFilled, CheckmarkOutline } from "./carbon";

export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "var(--cds-layer-01)",
        borderTop: "1px solid var(--cds-border-subtle-01)",
        color: "var(--cds-text-primary)",
        marginTop: "auto",
      }}
    >
      {/* Top 5-column navigation area */}
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "3.5rem 1.5rem 2.5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
          borderBottom: "1px solid var(--cds-border-subtle-01)",
        }}
      >
        {/* Brand column (Spans wider on larger viewports) */}
        <div style={{ gridColumn: "span 2", minWidth: "260px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 700,
                fontSize: "1.125rem",
                letterSpacing: "-0.02em",
                color: "var(--cds-text-primary)",
              }}
            >
              <Book size={20} style={{ color: "var(--cds-interactive)" }} />
              <span>OpenPapers</span>
            </div>
            <Tag type="cool-gray" size="sm" style={{ margin: 0 }}>
              Free & Open Access
            </Tag>
          </div>

          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--cds-text-secondary)",
              maxWidth: "460px",
              marginBottom: "1.25rem",
            }}
          >
            An open-access examination repository and collaborative learning platform. Community
            members share past papers, verify worked solutions, and support fellow learners
            worldwide.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              fontSize: "0.8125rem",
              color: "var(--cds-text-secondary)",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <CheckmarkFilled size={16} style={{ color: "var(--cds-interactive)" }} />
              Community Verified
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <CheckmarkOutline size={16} style={{ color: "var(--cds-support-success)" }} />
              Open Access
            </span>
          </div>
        </div>

        {/* Exams column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--cds-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Exams
          </span>
          {[
            { label: "G.C.E. Advanced Level", href: "/papers?exam=sl_al" },
            { label: "G.C.E. Ordinary Level", href: "/papers?exam=sl_ol" },
            { label: "University Midterms & Finals", href: "/papers?exam=uni" },
            { label: "Cambridge & Edexcel IAL", href: "/papers?exam=ial" },
            { label: "Olympiads & Competitions", href: "/papers?exam=olympiad" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontSize: "0.8125rem",
                color: "var(--cds-text-secondary)",
                textDecoration: "none",
                padding: "0.2rem 0",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--cds-interactive, #0f62fe)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cds-text-secondary)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Subjects column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--cds-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Subjects
          </span>
          {[
            { label: "Combined Mathematics", href: "/papers/mathematics" },
            { label: "Physics", href: "/papers/physics" },
            { label: "Chemistry", href: "/papers/chemistry" },
            { label: "Biology & Agriculture", href: "/papers/biology" },
            { label: "Computer Science & ICT", href: "/papers/ict" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontSize: "0.8125rem",
                color: "var(--cds-text-secondary)",
                textDecoration: "none",
                padding: "0.2rem 0",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--cds-interactive, #0f62fe)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cds-text-secondary)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Community & Help column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--cds-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Community & Help
          </span>
          {[
            { label: "Contributor Leaderboard", href: "/guide" },
            { label: "Reputation & Badges", href: "/guide" },
            { label: "Upload Guidelines", href: "/guide" },
            { label: "Writing Solutions Guide", href: "/guide" },
            { label: "About OpenPapers", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontSize: "0.8125rem",
                color: "var(--cds-text-secondary)",
                textDecoration: "none",
                padding: "0.2rem 0",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--cds-interactive, #0f62fe)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cds-text-secondary)")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom copyright & GitHub attribution */}
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.75rem",
          color: "var(--cds-text-secondary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span>© {new Date().getFullYear()} OpenPapers Community</span>
        </div>

        <div>
          <a
            href="https://github.com/psychlone77/openpapers-data-collecting"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--cds-text-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cds-interactive, #0f62fe)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cds-text-secondary)")}
          >
            Open Source Community on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
