"use client";

import React, { useState } from "react";
import { ClickableTile, Tag } from "../carbon";

interface TopicCard {
  id: string;
  subject: string;
  unit: string;
  questionCount: number;
  title: string;
  description: string;
  difficulty: "Moderate" | "Advanced" | "Foundational";
  subtopics: string;
  href: string;
}

export function PopularTopicsSection() {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const topics: TopicCard[] = [
    {
      id: "physics-1",
      subject: "Physics",
      unit: "Physics • Unit 02",
      questionCount: 54,
      title: "Linear Motion & Projectiles",
      description:
        "Constant acceleration, kinematic equations, 2D projectile trajectories, and velocity-time graph analysis.",
      difficulty: "Moderate",
      subtopics: "Displacement • Trajectories • Terminal Velocity",
      href: "/papers?subject=physics",
    },
    {
      id: "physics-2",
      subject: "Physics",
      unit: "Physics • Unit 03",
      questionCount: 42,
      title: "Rotational Dynamics & Torque",
      description:
        "Angular momentum, moment of inertia, rolling motion without slipping, and centrifugal acceleration.",
      difficulty: "Advanced",
      subtopics: "Inertia Tensors • Conservation of Momentum",
      href: "/papers?subject=physics",
    },
    {
      id: "physics-3",
      subject: "Physics",
      unit: "Physics • Unit 04",
      questionCount: 38,
      title: "Fluids & Bernoulli's Principle",
      description:
        "Hydrostatic pressure, streamline flow, equation of continuity, surface tension, and Poiseuille flow.",
      difficulty: "Moderate",
      subtopics: "Venturi Tube • Viscosity • Capillary Rise",
      href: "/papers?subject=physics",
    },
    {
      id: "chemistry-1",
      subject: "Chemistry",
      unit: "Chemistry • Unit 05",
      questionCount: 61,
      title: "Chemical Equilibrium & Le Chatelier",
      description:
        "Equilibrium constant expressions, reaction quotients, partial pressure equilibria, and temperature shifts.",
      difficulty: "Moderate",
      subtopics: "Kc/Kp Ratios • Common Ion Effect • Buffers",
      href: "/papers?subject=chemistry",
    },
    {
      id: "math-1",
      subject: "Mathematics",
      unit: "Mathematics • Unit 01",
      questionCount: 48,
      title: "Complex Numbers & Argand Diagrams",
      description:
        "Modulus-argument forms, De Moivre's theorem, roots of unity, and geometric loci in the complex plane.",
      difficulty: "Advanced",
      subtopics: "Loci Transformations • Euler's Identity",
      href: "/papers?subject=mathematics",
    },
    {
      id: "cs-1",
      subject: "Computer Science",
      unit: "Computer Science • Unit 06",
      questionCount: 35,
      title: "Graph Traversal & Shortest Paths",
      description:
        "Breadth-first and depth-first exploration, Dijkstra's algorithm, topological ordering, and cycle detection.",
      difficulty: "Moderate",
      subtopics: "Adjacency Matrices • Priority Queues",
      href: "/papers?subject=ict",
    },
  ];

  const subjectsList = ["All", "Physics", "Chemistry", "Mathematics", "Computer Science"];

  const filteredTopics =
    selectedSubject === "All" ? topics : topics.filter((t) => t.subject === selectedSubject);

  return (
    <section
      id="topics"
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
            gap: "1.25rem",
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
              PRACTICE BY TOPIC
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
              Popular Topics & Practice Questions
            </h2>
            <p
              style={{
                fontFamily: "var(--op-font-serif)",
                fontSize: "1rem",
                color: "var(--cds-text-secondary)",
                margin: 0,
                maxWidth: "680px",
              }}
            >
              Jump straight into specific topics across Mathematics, Physics, Chemistry, and
              Computer Science to test your understanding.
            </p>
          </div>

          {/* Subject Filter Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--cds-text-secondary)",
                marginRight: "0.25rem",
              }}
            >
              Subject Filter:
            </span>
            {subjectsList.map((subj) => {
              const isActive = selectedSubject === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSelectedSubject(subj)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: isActive
                      ? "1px solid var(--cds-interactive)"
                      : "1px solid var(--cds-border-subtle-01)",
                    backgroundColor: isActive ? "var(--cds-interactive)" : "var(--cds-background)",
                    color: isActive ? "#ffffff" : "var(--cds-text-primary)",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                >
                  {subj}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Topic Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredTopics.map((topic) => (
            <ClickableTile
              key={topic.id}
              href={topic.href}
              className="op-clickable-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "240px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--op-font-sans)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--cds-text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    {topic.unit}
                  </span>
                  <Tag type="green" size="sm" style={{ margin: 0, fontWeight: 700 }}>
                    {topic.questionCount} Questions
                  </Tag>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--op-font-sans)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--cds-text-primary)",
                    lineHeight: 1.3,
                    marginBottom: "0.5rem",
                  }}
                >
                  {topic.title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--op-font-serif)",
                    fontSize: "0.875rem",
                    color: "var(--cds-text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: "1rem",
                  }}
                >
                  {topic.description}
                </p>

                {/* Difficulty & Subtopics Box */}
                <div
                  style={{
                    backgroundColor: "var(--cds-layer-01)",
                    border: "1px solid var(--cds-border-subtle-01)",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "var(--cds-text-helper)" }}>Difficulty:</span>
                  <span
                    style={{
                      fontFamily: "var(--op-font-sans)",
                      fontWeight: 600,
                      color:
                        topic.difficulty === "Advanced"
                          ? "var(--cds-support-error, #da1e28)"
                          : "var(--cds-interactive, #0f62fe)",
                    }}
                  >
                    {topic.difficulty}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  paddingTop: "0.75rem",
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
                    fontSize: "0.6875rem",
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  {topic.subtopics}
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
                  Practice Questions →
                </span>
              </div>
            </ClickableTile>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTopicsSection;
