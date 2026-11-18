"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tile, Tag, Breadcrumb, BreadcrumbItem } from "@/components/carbon";

const team = [
  {
    name: "Nithika Dias",
    role: "Cyber Security Engineering",
    contribution:
      "Implemented the frontend architecture, Carbon Design System integration, and user interface.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQHOZwpJyuJU0g/profile-displayphoto-shrink_400_400/B56ZdZwlbFHoAo-/0/1749557598486?e=1755734400&v=beta&t=FxxOiV8Y8xjOJ1tguaqT2qQYfwliRLHP-WzVRz0on74",
  },
  {
    name: "Nisith Dissanayake",
    role: "Data Science and Engineering",
    contribution:
      "Developed the image extraction pipeline and segmentation model from past examination papers.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQFU3UJDFOoCLw/profile-displayphoto-shrink_400_400/B56ZUHwpV5GsAg-/0/1739591949339?e=1755734400&v=beta&t=A3YwXpyGTE_lMN8Z4CSO5YWbvull-r2CDnJ0uS6JpsE",
  },
  {
    name: "Pavitha Dissanayake",
    role: "Data Science and Engineering",
    contribution:
      "Built the OCR parsing and text extraction pipeline for mathematical equations and formatting.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQHH2sFTYzO8hw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724753059247?e=1755734400&v=beta&t=WJo0Etg5gSCmEBzSIqWdEy9_qXL1Ud2lLZ2-dSn-zAo",
  },
  {
    name: "Pasindu Dulmith",
    role: "Data Science and Engineering",
    contribution:
      "Developed the backend services, cloud database schema, and paper ingestion scripts.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQEBXVVjbhl9gA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1702455481539?e=1755734400&v=beta&t=FSTPbZ2shHxvTY7SjY1R3WSwe3MunkD30bWFwTVwF-o",
  },
];

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "3.5rem 1.5rem 6rem 1.5rem",
      }}
    >
      <Breadcrumb noTrailingSlash style={{ marginBottom: "2rem" }}>
        <BreadcrumbItem>
          <Link href="/" className="cds--link">
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>About</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
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
          About OpenPapers
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--cds-text-secondary)",
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Developed by undergraduate engineers from the Department of Computer Science and
          Engineering at the University of Moratuwa.
        </p>
      </div>

      {/* Mission Overview Tile */}
      <Tile
        style={{
          padding: "2.5rem",
          border: "1px solid var(--cds-border-subtle-01)",
          backgroundColor: "var(--cds-layer-01)",
          marginBottom: "3.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "var(--cds-text-primary)",
            marginBottom: "1rem",
          }}
        >
          Our Mission
        </h2>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--cds-text-secondary)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          OpenPapers was created as part of our Professional Portfolio module to provide free,
          accessible, and high-fidelity past paper practice for students preparing for competitive
          examinations. By digitizing examination questions with exact mathematical and chemical
          formatting, we aim to eliminate barriers to high-quality academic revision.
        </p>
      </Tile>

      {/* Team Section */}
      <div>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "var(--cds-text-primary)",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Engineering Team
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {team.map((member, index) => (
            <Tile
              key={index}
              style={{
                padding: "2rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    position: "relative",
                    width: "56px",
                    height: "56px",
                    overflow: "hidden",
                    border: "1px solid var(--cds-border-subtle-01)",
                    backgroundColor: "var(--cds-layer-02)",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={member.src}
                    alt={member.name}
                    width={56}
                    height={56}
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      margin: "0 0 0.25rem 0",
                      color: "var(--cds-text-primary)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <Tag type="blue" size="sm">
                    {member.role}
                  </Tag>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--cds-text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {member.contribution}
              </p>
            </Tile>
          ))}
        </div>
      </div>
    </div>
  );
}
