"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/carbon";
import { Home } from "@/components/carbon";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--op-font-mono)",
          fontSize: "4rem",
          fontWeight: 700,
          color: "var(--cds-interactive)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </span>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          color: "var(--cds-text-primary)",
          marginBottom: "0.75rem",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--cds-text-secondary)",
          maxWidth: "480px",
          marginBottom: "2rem",
          lineHeight: 1.5,
        }}
      >
        The requested examination paper or page does not exist or has been relocated.
      </p>
      <Button as={Link} href="/" kind="primary" renderIcon={Home} size="md">
        Return to Home
      </Button>
    </div>
  );
}
