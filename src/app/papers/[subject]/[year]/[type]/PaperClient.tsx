"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PaperSchema } from "@/lib/types/paperSchema";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Button,
  Tile,
  Tag,
  ArrowRight,
  ArrowLeft,
  Help,
  ContainedList,
  ContainedListItem,
  SelectableTile,
  Breadcrumb,
  BreadcrumbItem,
  CheckmarkFilled,
} from "@/components/carbon";

export interface PaperClientProps {
  paper: PaperSchema;
}

function resolveImageSrc(src: string): string {
  if (!src) return "";
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  return `data:image/jpeg;base64,${src}`;
}

export default function PaperClient({ paper }: PaperClientProps) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const selectedQuestion = paper.questions[selectedQuestionIndex];

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    setSelectedOptionIndex(null);
    setShowAnswer(false);
  };

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < paper.questions.length - 1) {
      handleSelectQuestion(selectedQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      handleSelectQuestion(selectedQuestionIndex - 1);
    }
  };

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1.5rem 5rem 1.5rem" }}>
      {/* Paper Header */}
      <div
        style={{
          borderBottom: "1px solid var(--cds-border-subtle-01)",
          paddingBottom: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/papers">Papers</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            {paper.subject} {paper.year} ({paper.type})
          </BreadcrumbItem>
        </Breadcrumb>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Tag type="blue" size="md">
            {paper.subject}
          </Tag>
          <Tag type="cool-gray" size="md">
            {paper.year}
          </Tag>
          <Tag type="purple" size="md">
            {paper.type}
          </Tag>
          <Tag type="outline" size="md">
            {paper.questions.length} Questions
          </Tag>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--cds-text-primary)",
            margin: "0 0 0.5rem 0",
          }}
        >
          {paper.subject} Examination — {paper.year}
        </h1>
        {paper.description && (
          <p
            style={{
              fontSize: "1rem",
              color: "var(--cds-text-secondary)",
              margin: 0,
            }}
          >
            {paper.description}
          </p>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 340px) 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
        className="paper-workspace"
      >
        {/* Left Side: Question List Navigation using Carbon ContainedList */}
        <aside
          style={{
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
            position: "sticky",
            top: "4rem",
          }}
          className="paper-sidebar"
        >
          <ContainedList
            label="Questions"
            kind="on-page"
            size="md"
            action={
              <Tag size="sm" type="cool-gray">
                {selectedQuestionIndex + 1} / {paper.questions.length}
              </Tag>
            }
          >
            {paper.questions.map((q, idx) => {
              const isActive = idx === selectedQuestionIndex;
              return (
                <ContainedListItem
                  key={q.question_number || idx}
                  onClick={() => handleSelectQuestion(idx)}
                  className={isActive ? "op-contained-list-item--active" : ""}
                  action={
                    q.marks ? (
                      <Tag size="sm" type={isActive ? "blue" : "cool-gray"}>
                        {q.marks}m
                      </Tag>
                    ) : undefined
                  }
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontFamily: "var(--op-font-mono)",
                        color: isActive ? "var(--cds-interactive)" : "var(--cds-text-primary)",
                      }}
                    >
                      Q{q.question_number}
                    </span>
                    {q.subject_unit && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--cds-text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "130px",
                        }}
                      >
                        {q.subject_unit}
                      </span>
                    )}
                  </div>
                </ContainedListItem>
              );
            })}
          </ContainedList>
        </aside>

        {/* Right Side: Active Question & Solution Area */}
        <main>
          {selectedQuestion && (
            <Tile
              style={{
                padding: "2.5rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                marginBottom: "1.5rem",
              }}
            >
              {/* Question Metadata Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--cds-border-subtle-01)",
                  paddingBottom: "1rem",
                  marginBottom: "1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      fontFamily: "var(--op-font-mono)",
                      color: "var(--cds-text-primary)",
                    }}
                  >
                    Question {selectedQuestion.question_number}
                  </span>
                  {selectedQuestion.difficulty && (
                    <Tag
                      type={
                        selectedQuestion.difficulty === "Easy"
                          ? "green"
                          : selectedQuestion.difficulty === "Medium"
                            ? "warm-gray"
                            : "red"
                      }
                      size="sm"
                    >
                      {selectedQuestion.difficulty}
                    </Tag>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {selectedQuestion.marks && (
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontFamily: "var(--op-font-mono)",
                        color: "var(--cds-text-secondary)",
                      }}
                    >
                      {selectedQuestion.marks} {selectedQuestion.marks > 1 ? "Marks" : "Mark"}
                    </span>
                  )}
                  <Button
                    kind={showAnswer ? "secondary" : "ghost"}
                    size="sm"
                    renderIcon={Help}
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? "Hide Solution" : "Show Solution"}
                  </Button>
                </div>
              </div>

              {/* Question Body */}
              <div style={{ marginBottom: "2rem" }}>
                <MarkdownRenderer content={selectedQuestion.question_text} />

                {/* Question Images */}
                {selectedQuestion.question_images &&
                  selectedQuestion.question_images.length > 0 && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      {selectedQuestion.question_images.map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid var(--cds-border-subtle-01)",
                            backgroundColor: "var(--cds-layer-02)",
                            padding: "0.5rem",
                            maxWidth: "100%",
                          }}
                        >
                          <Image
                            src={resolveImageSrc(img)}
                            alt={`Question Figure ${idx + 1}`}
                            width={650}
                            height={350}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              objectFit: "contain",
                            }}
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Options Section */}
              {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--cds-text-secondary)",
                      marginBottom: "1rem",
                    }}
                  >
                    Select an Answer
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedOptionIndex === optIdx;
                      const isCorrect = opt.is_correct;
                      const isTileSelected = isSelected || (showAnswer && isCorrect);
                      const optionLabel = optionLetters[optIdx] || `${optIdx + 1}`;

                      let tileClass = "op-option-tile";
                      if (isSelected) tileClass += " selected";
                      if (showAnswer && isCorrect) tileClass += " correct";
                      if (showAnswer && isSelected && !isCorrect) tileClass += " incorrect";

                      return (
                        <SelectableTile
                          key={optIdx}
                          id={`option-${selectedQuestion.question_number}-${optIdx}`}
                          selected={isTileSelected}
                          className={tileClass}
                          onClick={() => setSelectedOptionIndex(optIdx)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                              flex: 1,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--op-font-mono)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                color:
                                  showAnswer && isCorrect
                                    ? "var(--cds-support-success)"
                                    : "var(--cds-text-primary)",
                                minWidth: "24px",
                              }}
                            >
                              ({optionLabel})
                            </span>
                            <div style={{ flex: 1 }}>
                              <MarkdownRenderer content={opt.option_text} />
                              {opt.option_image && (
                                <div style={{ marginTop: "0.5rem" }}>
                                  <Image
                                    src={resolveImageSrc(opt.option_image)}
                                    alt={`Option ${optionLabel}`}
                                    width={400}
                                    height={200}
                                    style={{
                                      maxWidth: "100%",
                                      height: "auto",
                                      objectFit: "contain",
                                    }}
                                    unoptimized
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </SelectableTile>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Solution Section when Revealed */}
              {showAnswer && selectedQuestion.answer && (
                <div
                  style={{
                    marginTop: "2.5rem",
                    borderTop: "1px solid var(--cds-border-subtle-01)",
                    paddingTop: "2rem",
                  }}
                >
                  <Tile
                    style={{
                      padding: "1.75rem 2rem",
                      backgroundColor: "var(--cds-layer-02)",
                      border: "1px solid var(--cds-border-subtle-01)",
                      borderLeft: "4px solid var(--cds-support-success, #24a148)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid var(--cds-border-subtle-01)",
                        paddingBottom: "1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <CheckmarkFilled
                          size={20}
                          style={{ color: "var(--cds-support-success, #24a148)" }}
                        />
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            color: "var(--cds-text-primary)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Verified Answer & Marking Scheme
                        </span>
                      </div>
                      <Tag type="green" size="sm">
                        Official Scheme
                      </Tag>
                    </div>

                    <div className="solution-content">
                      <MarkdownRenderer content={selectedQuestion.answer} />
                    </div>
                  </Tile>
                </div>
              )}
            </Tile>
          )}

          {/* Navigation Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
          >
            <Button
              kind="secondary"
              renderIcon={ArrowLeft}
              disabled={selectedQuestionIndex === 0}
              onClick={handlePrevQuestion}
            >
              Previous Question
            </Button>

            <span
              style={{
                fontFamily: "var(--op-font-mono)",
                fontSize: "0.9rem",
                color: "var(--cds-text-secondary)",
              }}
            >
              Question {selectedQuestionIndex + 1} of {paper.questions.length}
            </span>

            <Button
              kind="primary"
              renderIcon={ArrowRight}
              disabled={selectedQuestionIndex === paper.questions.length - 1}
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
