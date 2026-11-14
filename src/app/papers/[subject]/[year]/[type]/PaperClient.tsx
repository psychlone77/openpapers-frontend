"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaperSchema, Question } from "@/lib/types/paperSchema";
import type { ExplanationResponse } from "@/lib/types/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getLocalizedQuestionContent } from "@/lib/adapters/paperAdapter";
import { resolveImageSrc } from "@/lib/utils/imageUtils";
import { fetchQuestionExplanations, submitQuestionExplanation } from "@/lib/api/explanations";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tag,
  Button,
  Modal,
  TextArea,
  Select,
  SelectItem,
  ContentSwitcher,
  Switch,
  InlineNotification,
  ArrowRight,
  ArrowLeft,
  Checkmark,
  CheckmarkFilled,
  Catalog,
  Share,
  Bookmark,
  Printer,
  Flag,
  FlagFilled,
  Edit,
  ChevronDown,
  ChevronUp,
  Search,
  List,
  Close,
  DocumentDownload,
  ThumbsUp,
  ThumbsDown,
  Pending,
  Add,
} from "@/components/carbon";

export interface PaperClientProps {
  paper: PaperSchema;
}

type ViewMode = "split" | "question" | "scheme";

export default function PaperClient({ paper }: PaperClientProps) {
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAuth();

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isSolutionExpanded, setIsSolutionExpanded] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [jumpInput, setJumpInput] = useState("1");
  const [activeLang, setActiveLang] = useState<string>(paper.active_language || "en");
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Live question explanations state
  const [liveExplanations, setLiveExplanations] = useState<ExplanationResponse[]>([]);
  const [isLoadingExplanations, setIsLoadingExplanations] = useState(false);

  // Contribute explanation modal state
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [contributeLang, setContributeLang] = useState<"en" | "si" | "ta">("en");
  const [contributeContent, setContributeContent] = useState("");
  const [contributeTabIndex, setContributeTabIndex] = useState(0);
  const [isSubmittingExplanation, setIsSubmittingExplanation] = useState(false);
  const [contributeError, setContributeError] = useState<string | null>(null);
  const [contributeSuccessMsg, setContributeSuccessMsg] = useState<string | null>(null);

  const quickScrollerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    setActiveLang(langCode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", langCode);
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Keep jump input in sync with current question index
  useEffect(() => {
    setJumpInput(String(selectedQuestionIndex + 1));
  }, [selectedQuestionIndex]);

  // Center active item in mobile quick scroller when index changes
  useEffect(() => {
    if (quickScrollerRef.current) {
      const activeBtn = quickScrollerRef.current.querySelector(
        `[data-qidx="${selectedQuestionIndex}"]`
      ) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedQuestionIndex]);

  // Resolve localized questions across the entire paper dynamically based on active language
  const localizedQuestions = useMemo(() => {
    return paper.questions.map((q) => {
      let localizedUnit = q.subject_unit;
      if (q.raw_units && q.raw_units.length > 0) {
        const u = q.raw_units[0];
        if (activeLang === "si" && u.name_si) localizedUnit = u.name_si;
        else if (activeLang === "ta" && u.name_ta) localizedUnit = u.name_ta;
        else localizedUnit = u.name_en || localizedUnit;
      }

      if (q.raw_localizations && q.raw_localizations.length > 0) {
        const loc = getLocalizedQuestionContent(q, activeLang);
        return {
          ...q,
          question_text: loc.question_text || q.question_text,
          question_images:
            loc.question_images && loc.question_images.length > 0
              ? loc.question_images
              : q.question_images,
          options: loc.options || q.options,
          subject_unit: localizedUnit,
        };
      }
      return {
        ...q,
        subject_unit: localizedUnit,
      };
    });
  }, [paper.questions, activeLang]);

  const selectedQuestion: Question | undefined = localizedQuestions[selectedQuestionIndex];

  const loadQuestionExplanations = useCallback(
    async (questionId?: string) => {
      if (!questionId) {
        setLiveExplanations([]);
        return;
      }
      setIsLoadingExplanations(true);
      try {
        const list = await fetchQuestionExplanations(questionId, accessToken);
        setLiveExplanations(list);
      } catch {
        setLiveExplanations([]);
      } finally {
        setIsLoadingExplanations(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    setContributeSuccessMsg(null);
    loadQuestionExplanations(selectedQuestion?.id);
  }, [selectedQuestion?.id, loadQuestionExplanations]);

  const handleOpenContribute = () => {
    if (!isAuthenticated || !accessToken) {
      const currentPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/papers";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const defaultLang =
      activeLang === "si" || activeLang === "ta" ? (activeLang as "si" | "ta") : "en";
    setContributeLang(defaultLang);
    setContributeError(null);
    setContributeTabIndex(0);
    setIsContributeOpen(true);
  };

  const handleSubmitExplanation = async () => {
    if (!selectedQuestion?.id || !accessToken) {
      setContributeError(
        "This question does not have a live backend identifier for explanation submission."
      );
      return;
    }

    const trimmed = contributeContent.trim();
    if (trimmed.length < 10) {
      setContributeError("Explanation content must be at least 10 characters long.");
      return;
    }

    setIsSubmittingExplanation(true);
    setContributeError(null);

    try {
      await submitQuestionExplanation(
        selectedQuestion.id,
        {
          language_code: contributeLang,
          content_text: trimmed,
        },
        accessToken
      );

      setIsContributeOpen(false);
      setContributeContent("");
      setIsSolutionExpanded(true);
      setContributeSuccessMsg(
        "Your explanation has been submitted to the moderation queue (PENDING) and is pinned below."
      );
      await loadQuestionExplanations(selectedQuestion.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit explanation.";
      setContributeError(msg);
    } finally {
      setIsSubmittingExplanation(false);
    }
  };

  // Filtered question list for Question Navigator
  const filteredQuestions = useMemo(() => {
    const qLower = searchQuery.toLowerCase().trim();
    if (!qLower) return localizedQuestions;

    return localizedQuestions.filter((q) => {
      const qNumStr = `q${q.question_number} ${q.question_number}`;
      const unit = (q.subject_unit || "").toLowerCase();
      const text = (q.question_text || "").toLowerCase();
      const diff = (q.difficulty || "").toLowerCase();
      return (
        qNumStr.includes(qLower) ||
        unit.includes(qLower) ||
        text.includes(qLower) ||
        diff.includes(qLower)
      );
    });
  }, [localizedQuestions, searchQuery]);

  const totalMarks = useMemo(() => {
    const sum = paper.questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    return sum > 0 ? sum : 100;
  }, [paper.questions]);

  const handleSelectQuestion = (index: number) => {
    if (index >= 0 && index < paper.questions.length) {
      setSelectedQuestionIndex(index);
      setIsSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  const handleOptionSelect = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [selectedQuestionIndex]: optionIndex,
    }));
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= paper.questions.length) {
      handleSelectQuestion(target - 1);
    } else {
      setJumpInput(String(selectedQuestionIndex + 1));
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?q=${selectedQuestionIndex + 1}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.min(140, Math.max(80, prev + delta)));
  };

  const optionLetters = ["A", "B", "C", "D", "E", "F"];
  const currentAnsweredOption = userAnswers[selectedQuestionIndex];
  const isCurrentFlagged = !!flaggedQuestions[selectedQuestionIndex];

  // Determine if solutions should be displayed
  const isSolutionVisible =
    viewMode === "split" ||
    viewMode === "scheme" ||
    (viewMode === "question" && currentAnsweredOption !== undefined);

  // Subject abbreviation for exam reference
  const subjectAbbr =
    paper.subject
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 4)
      .toUpperCase() || "SUBJ";
  const paperTypeLabel = paper.part || (paper.type === "MCQ" ? "Paper I (MCQ)" : paper.type);

  return (
    <div className="op-workspace">
      {/* ============================================================== */}
      {/* WORKSPACE TOP SUB-HEADER & METADATA BAR                       */}
      {/* ============================================================== */}
      <header className="op-workspace-subheader">
        {/* Tier 1: Archive Breadcrumb & Exam Meta */}
        <div className="op-subheader-top">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem 0.75rem",
              fontSize: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                color: "var(--cds-text-primary)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              <Catalog size={16} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
              <span>
                {paper.subject} {paper.subject_code ? `(Code ${paper.subject_code})` : ""} •{" "}
                {paper.year} Examination
              </span>
            </div>

            <span className="hidden sm:inline" style={{ color: "var(--cds-border-subtle-01)" }}>
              |
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                textTransform: "uppercase",
                color: "var(--cds-text-secondary)",
              }}
            >
              <Link
                href="/papers"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Archive
              </Link>
              <span style={{ color: "var(--cds-text-helper)" }}>/</span>
              <Link
                href={`/papers?subject=${encodeURIComponent(paper.subject)}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {paper.subject}
              </Link>
              <span style={{ color: "var(--cds-text-helper)" }}>/</span>
              <span
                style={{
                  color: "var(--cds-text-primary)",
                  fontWeight: 600,
                  backgroundColor: "var(--cds-layer-01)",
                  padding: "0.125rem 0.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                }}
              >
                {paperTypeLabel}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <Tag type="blue" size="sm">
              Study & Review Mode
            </Tag>
            <Tag type="green" size="sm" renderIcon={Checkmark}>
              Complete Solutions
            </Tag>
            <Tag type="cool-gray" size="sm">
              {paper.questions.length} Questions
            </Tag>
            <Tag type="cool-gray" size="sm" className="hidden sm:inline-flex">
              G.C.E. A/L New Syllabus
            </Tag>
            <Tag type="high-contrast" size="sm">
              {totalMarks} Marks
            </Tag>
          </div>
        </div>

        {/* Tier 2: View Mode Switcher, Zoom & Workspace Controls (Touch-scrollable on mobile) */}
        <div className="op-subheader-bottom">
          {/* View Mode Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <span
              className="hidden sm:inline"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--cds-text-secondary)",
              }}
            >
              Mode:
            </span>
            <div
              style={{
                display: "inline-flex",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("split")}
                style={{
                  height: "32px",
                  padding: "0 0.625rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: "var(--op-font-sans)",
                  backgroundColor:
                    viewMode === "split"
                      ? "var(--cds-interactive, #0f62fe)"
                      : "var(--cds-layer-01)",
                  color:
                    viewMode === "split"
                      ? "var(--cds-text-on-color, #ffffff)"
                      : "var(--cds-text-primary)",
                  border: "none",
                  borderRight: "1px solid var(--cds-border-subtle-01)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "background-color 110ms ease",
                }}
              >
                Question + Solution
              </button>
              <button
                type="button"
                onClick={() => setViewMode("question")}
                style={{
                  height: "32px",
                  padding: "0 0.625rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: "var(--op-font-sans)",
                  backgroundColor:
                    viewMode === "question"
                      ? "var(--cds-interactive, #0f62fe)"
                      : "var(--cds-layer-01)",
                  color:
                    viewMode === "question"
                      ? "var(--cds-text-on-color, #ffffff)"
                      : "var(--cds-text-primary)",
                  border: "none",
                  borderRight: "1px solid var(--cds-border-subtle-01)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "background-color 110ms ease",
                }}
              >
                Questions Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode("scheme")}
                style={{
                  height: "32px",
                  padding: "0 0.625rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: "var(--op-font-sans)",
                  backgroundColor:
                    viewMode === "scheme"
                      ? "var(--cds-interactive, #0f62fe)"
                      : "var(--cds-layer-01)",
                  color:
                    viewMode === "scheme"
                      ? "var(--cds-text-on-color, #ffffff)"
                      : "var(--cds-text-primary)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "background-color 110ms ease",
                }}
              >
                Scheme Only
              </button>
            </div>
          </div>

          {/* Right Action Tools: Zoom, Share, PDF, Print, Lang */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              flexShrink: 0,
            }}
          >
            {/* Font Size Zoom Controller */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                height: "32px",
              }}
            >
              <button
                type="button"
                onClick={() => handleZoomChange(-10)}
                disabled={zoom <= 80}
                title="Decrease reading font size"
                style={{
                  height: "100%",
                  padding: "0 0.5rem",
                  border: "none",
                  borderRight: "1px solid var(--cds-border-subtle-01)",
                  background: "transparent",
                  color: "var(--cds-text-secondary)",
                  cursor: zoom <= 80 ? "not-allowed" : "pointer",
                  fontFamily: "var(--op-font-sans)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                A-
              </button>
              <span
                style={{
                  padding: "0 0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: "var(--op-font-sans)",
                  color: "var(--cds-text-secondary)",
                  borderRight: "1px solid var(--cds-border-subtle-01)",
                }}
              >
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => handleZoomChange(10)}
                disabled={zoom >= 140}
                title="Increase reading font size"
                style={{
                  height: "100%",
                  padding: "0 0.5rem",
                  border: "none",
                  background: "transparent",
                  color: "var(--cds-text-secondary)",
                  cursor: zoom >= 140 ? "not-allowed" : "pointer",
                  fontFamily: "var(--op-font-sans)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                A+
              </button>
            </div>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              style={{
                height: "32px",
                padding: "0 0.625rem",
                backgroundColor: "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                color: "var(--cds-text-primary)",
                fontFamily: "var(--op-font-sans)",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                cursor: "pointer",
                transition: "background-color 110ms ease",
              }}
            >
              <Share size={14} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={() => alert("Downloading official examination PDF...")}
              style={{
                height: "32px",
                padding: "0 0.625rem",
                backgroundColor: "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                color: "var(--cds-text-primary)",
                fontFamily: "var(--op-font-sans)",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                cursor: "pointer",
                transition: "background-color 110ms ease",
              }}
            >
              <DocumentDownload size={14} />
              <span>PDF</span>
            </button>

            {/* Bookmark / Save */}
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              style={{
                height: "32px",
                padding: "0 0.625rem",
                backgroundColor: isSaved ? "var(--cds-layer-selected-01)" : "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                color: isSaved ? "var(--cds-interactive, #0f62fe)" : "var(--cds-text-primary)",
                fontFamily: "var(--op-font-sans)",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                cursor: "pointer",
              }}
            >
              <Bookmark size={14} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Print Sheet */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex"
              style={{
                height: "32px",
                padding: "0 0.625rem",
                backgroundColor: "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                color: "var(--cds-text-primary)",
                fontFamily: "var(--op-font-sans)",
                fontSize: "0.75rem",
                fontWeight: 600,
                alignItems: "center",
                gap: "0.25rem",
                cursor: "pointer",
              }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            {/* Language Selector if multiple languages available */}
            {paper.available_languages && paper.available_languages.length > 1 && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid var(--cds-border-subtle-01)",
                  backgroundColor: "var(--cds-layer-01)",
                  height: "32px",
                }}
              >
                {paper.available_languages.map((l, lIdx) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLanguageChange(l)}
                    style={{
                      height: "100%",
                      padding: "0 0.5rem",
                      border: "none",
                      borderRight:
                        lIdx < paper.available_languages!.length - 1
                          ? "1px solid var(--cds-border-subtle-01)"
                          : "none",
                      backgroundColor:
                        activeLang === l ? "var(--cds-interactive, #0f62fe)" : "transparent",
                      color:
                        activeLang === l
                          ? "var(--cds-text-on-color, #ffffff)"
                          : "var(--cds-text-secondary)",
                      fontFamily: "var(--op-font-sans)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE QUICK QUESTION SELECTOR CAROUSEL (Touch friendly swipe bar) */}
        <div
          className="lg:hidden"
          style={{
            width: "100%",
            backgroundColor: "var(--cds-layer-02)",
            borderBottom: "1px solid var(--cds-border-subtle-01)",
            padding: "0.375rem 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            style={{
              height: "28px",
              padding: "0 0.5rem",
              backgroundColor: "var(--cds-layer-01)",
              border: "1px solid var(--cds-border-subtle-01)",
              color: "var(--cds-text-primary)",
              fontFamily: "var(--op-font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <List size={14} />
            <span>All ({paper.questions.length})</span>
          </button>

          <div
            ref={quickScrollerRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              flex: "1 1 0%",
            }}
          >
            {paper.questions.map((q, idx) => {
              const isActive = idx === selectedQuestionIndex;
              const isAnswered = userAnswers[idx] !== undefined;
              const isFlagged = flaggedQuestions[idx];

              return (
                <button
                  key={q.question_number}
                  data-qidx={idx}
                  type="button"
                  onClick={() => handleSelectQuestion(idx)}
                  style={{
                    height: "28px",
                    minWidth: "36px",
                    padding: "0 0.375rem",
                    backgroundColor: isActive
                      ? "var(--cds-interactive, #0f62fe)"
                      : isAnswered
                        ? "rgba(36, 161, 72, 0.12)"
                        : "var(--cds-layer-01)",
                    border: isActive
                      ? "1px solid var(--cds-interactive, #0f62fe)"
                      : isFlagged
                        ? "1px solid var(--cds-support-warning, #f1c21b)"
                        : "1px solid var(--cds-border-subtle-01)",
                    color: isActive
                      ? "var(--cds-text-on-color, #ffffff)"
                      : isAnswered
                        ? "var(--cds-support-success, #24a148)"
                        : "var(--cds-text-primary)",
                    fontFamily: "var(--op-font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Q{q.question_number}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* SPLIT VIEW WORKSPACE BODY: NAVIGATOR & QUESTION PANE           */}
      {/* ============================================================== */}
      <div className="op-workspace-body">
        {/* LEFT RAIL: QUESTION NAVIGATOR MATRIX (~320px) */}
        <aside
          className={`op-workspace-sidebar ${isSidebarOpen ? "mobile-drawer-open" : "hidden lg:flex"}`}
        >
          {/* Navigator Header & Search Filter */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-01)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <List size={16} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                <h2
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                    color: "var(--cds-text-primary)",
                  }}
                >
                  Question Navigator
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    fontFamily: "var(--op-font-sans)",
                    backgroundColor: "var(--cds-layer-02)",
                    color: "var(--cds-text-secondary)",
                    padding: "0.125rem 0.375rem",
                    border: "1px solid var(--cds-border-subtle-01)",
                    textTransform: "uppercase",
                  }}
                >
                  {filteredQuestions.length} Items
                </span>

                {/* Mobile Drawer Close Button */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                  style={{
                    padding: "0.25rem",
                    background: "none",
                    border: "none",
                    color: "var(--cds-text-primary)",
                    cursor: "pointer",
                  }}
                  aria-label="Close Navigator"
                >
                  <Close size={18} />
                </button>
              </div>
            </div>

            {/* Keyword / Topic Search Filter */}
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--cds-text-helper)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by topic or keyword..."
                style={{
                  width: "100%",
                  height: "32px",
                  paddingLeft: "1.75rem",
                  paddingRight: "0.5rem",
                  fontSize: "0.75rem",
                  fontFamily: "var(--op-font-sans)",
                  backgroundColor: "var(--cds-background)",
                  border: "1px solid var(--cds-border-subtle-01)",
                  color: "var(--cds-text-primary)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Question List Items */}
          <div
            style={{
              flex: "1 1 0%",
              overflowY: "auto",
            }}
          >
            {filteredQuestions.length === 0 ? (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                }}
              >
                No questions match &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const originalIndex = paper.questions.findIndex(
                  (item) => item.question_number === q.question_number
                );
                const isActive = originalIndex === selectedQuestionIndex;
                const isFlagged = !!flaggedQuestions[originalIndex];
                const hasAnswer = Boolean(
                  q.answer || (q.explanations && q.explanations.length > 0)
                );

                return (
                  <div
                    key={q.question_number}
                    onClick={() => handleSelectQuestion(originalIndex)}
                    className={`op-nav-item ${isActive ? "active" : ""} ${isFlagged ? "flagged" : ""}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        {isFlagged && (
                          <FlagFilled
                            size={12}
                            style={{ color: "var(--cds-support-warning, #f1c21b)" }}
                          />
                        )}
                        <span
                          className="op-nav-title"
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: isActive ? 700 : 600,
                            color: isActive
                              ? "var(--cds-interactive, #0f62fe)"
                              : "var(--cds-text-primary)",
                          }}
                        >
                          Question{" "}
                          {q.question_number < 10 ? `0${q.question_number}` : q.question_number}
                          {isActive ? " (Selected)" : ""}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <span
                          style={{
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            fontFamily: "var(--op-font-sans)",
                            padding: "0.0625rem 0.3125rem",
                            backgroundColor: "var(--cds-layer-02)",
                            color: "var(--cds-text-secondary)",
                            border: "1px solid var(--cds-border-subtle-01)",
                            textTransform: "uppercase",
                          }}
                        >
                          {q.options && q.options.length > 0 ? "MCQ" : paper.type}
                        </span>
                        {isActive ? (
                          <span
                            style={{
                              fontSize: "0.625rem",
                              fontWeight: 700,
                              fontFamily: "var(--op-font-sans)",
                              padding: "0.0625rem 0.3125rem",
                              backgroundColor: "var(--cds-interactive, #0f62fe)",
                              color: "var(--cds-text-on-color, #ffffff)",
                            }}
                          >
                            ACTIVE
                          </span>
                        ) : hasAnswer ? (
                          <span
                            style={{
                              fontSize: "0.625rem",
                              fontWeight: 700,
                              fontFamily: "var(--op-font-sans)",
                              padding: "0.0625rem 0.3125rem",
                              backgroundColor: "rgba(36, 161, 72, 0.12)",
                              color: "var(--cds-support-success, #24a148)",
                            }}
                          >
                            SOLVED
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "var(--cds-text-secondary)",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "200px",
                          fontFamily: "var(--op-font-sans)",
                        }}
                        title={q.question_text || q.subject_unit || ""}
                      >
                        {q.question_text
                          ? q.question_text
                              .replace(/[#*`$\\]/g, "")
                              .trim()
                              .slice(0, 48)
                          : q.subject_unit || "Examination Item"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: "var(--cds-text-helper)",
                        }}
                      >
                        [{q.marks < 10 ? `0${q.marks}` : q.marks} M]
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer with Subject Info */}
          <div
            style={{
              padding: "0.625rem 1rem",
              borderTop: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-02)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              color: "var(--cds-text-secondary)",
            }}
          >
            <span style={{ fontWeight: 600, textTransform: "uppercase" }}>
              {selectedQuestion?.subject_unit
                ? selectedQuestion.subject_unit
                : `${paper.subject} Curriculum`}
            </span>
            <span
              style={{
                color: "var(--cds-interactive, #0f62fe)",
                fontWeight: 600,
              }}
            >
              {Object.keys(userAnswers).length} / {paper.questions.length} Attempted
            </span>
          </div>
        </aside>

        {/* RIGHT MAIN PANE: OFFICIAL PRINTED QUESTION PAPER */}
        <main className="op-question-main">
          {selectedQuestion && (
            <div className="op-question-sheet">
              {/* Question Script Header */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem 0.75rem",
                  paddingBottom: "0.875rem",
                  borderBottom: "1px solid var(--cds-text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem 0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                      margin: 0,
                      color: "var(--cds-text-primary)",
                    }}
                  >
                    QUESTION {selectedQuestion.question_number}
                  </h1>
                  <span
                    style={{
                      padding: "0.125rem 0.375rem",
                      backgroundColor: "var(--cds-layer-02)",
                      border: "1px solid var(--cds-border-subtle-01)",
                      color: "var(--cds-text-primary)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      fontFamily: "var(--op-font-sans)",
                    }}
                  >
                    [
                    {selectedQuestion.marks < 10
                      ? `0${selectedQuestion.marks}`
                      : selectedQuestion.marks}{" "}
                    {selectedQuestion.marks === 1 ? "MARK" : "MARKS"}]
                  </span>
                  {selectedQuestion.difficulty && (
                    <span
                      style={{
                        padding: "0.125rem 0.375rem",
                        backgroundColor: "var(--cds-layer-02)",
                        border: "1px solid var(--cds-border-subtle-01)",
                        color: "var(--cds-text-primary)",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontFamily: "var(--op-font-sans)",
                      }}
                    >
                      {selectedQuestion.difficulty === "Very Hard"
                        ? "ADVANCED"
                        : selectedQuestion.difficulty}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "var(--cds-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    backgroundColor: "var(--cds-layer-02)",
                    padding: "0.125rem 0.5rem",
                    border: "1px solid var(--cds-border-subtle-01)",
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  EXAM-REF: {paper.year}-{subjectAbbr}-{paper.type}-Q
                  {selectedQuestion.question_number}
                </div>
              </div>

              {/* Question Stem Article (Rendered in IBM Plex Serif) */}
              <article
                className="question-typography"
                style={{
                  fontSize: `${1.0625 * (zoom / 100)}rem`,
                  lineHeight: 1.75,
                  marginBottom: "1.75rem",
                }}
              >
                <MarkdownRenderer content={selectedQuestion.question_text} />
              </article>

              {/* Scientific Vector Diagram / Attached Images Container */}
              {selectedQuestion.question_images && selectedQuestion.question_images.length > 0 && (
                <div
                  style={{
                    border: "1px solid var(--cds-border-subtle-01)",
                    backgroundColor: "var(--cds-layer-02)",
                    padding: "0.75rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--cds-background)",
                      border: "1px solid var(--cds-border-subtle-01)",
                      padding: "0.75rem",
                    }}
                  >
                    {selectedQuestion.question_images.map((img, idx) => (
                      <div key={idx} style={{ maxWidth: "100%", margin: "0 auto" }}>
                        <Image
                          src={resolveImageSrc(img)}
                          alt={`Figure ${selectedQuestion.question_number}.${idx + 1}`}
                          width={680}
                          height={320}
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
                  <div
                    style={{
                      marginTop: "0.5rem",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      color: "var(--cds-text-secondary)",
                      fontFamily: "var(--op-font-sans)",
                    }}
                  >
                    Figure {selectedQuestion.question_number}.1 — Schematic illustration & reference
                    parameters.
                  </div>
                </div>
              )}

              {/* MCQ Options Selector (Strict 0px borders, No-Monospace, Mobile-adaptive) */}
              {selectedQuestion.options &&
                selectedQuestion.options.length > 0 &&
                viewMode !== "scheme" && (
                  <fieldset
                    style={{
                      border: "none",
                      padding: 0,
                      margin: "0 0 2rem 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    <legend
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--cds-text-primary)",
                        marginBottom: "0.75rem",
                        fontFamily: "var(--op-font-sans)",
                      }}
                    >
                      Multiple Choice Options:
                    </legend>

                    {selectedQuestion.options.map((opt, optIdx) => {
                      const isSelected = currentAnsweredOption === optIdx;
                      const isCorrect = opt.is_correct;
                      const letter = opt.key || optionLetters[optIdx] || `${optIdx + 1}`;

                      let stateClass = "";
                      if (isSelected) stateClass += " selected";
                      if (isSolutionVisible && isCorrect) stateClass += " correct";
                      if (isSolutionVisible && isSelected && !isCorrect) stateClass += " incorrect";

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleOptionSelect(optIdx)}
                          className={`op-mcq-option ${stateClass}`}
                        >
                          <div className="op-option-letter">{letter}</div>

                          <div
                            className="op-option-content"
                            style={{
                              fontSize: `${1 * (zoom / 100)}rem`,
                            }}
                          >
                            <MarkdownRenderer content={opt.option_text} />
                            {opt.option_image && (
                              <div style={{ marginTop: "0.5rem" }}>
                                <Image
                                  src={resolveImageSrc(opt.option_image)}
                                  alt={`Option ${letter}`}
                                  width={400}
                                  height={200}
                                  style={{ maxWidth: "100%", height: "auto" }}
                                  unoptimized
                                />
                              </div>
                            )}
                          </div>

                          {isSolutionVisible && isCorrect && (
                            <div className="op-option-badge">
                              <Checkmark size={14} />
                              <span>CORRECT ANSWER</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </fieldset>
                )}

              {/* ========================================================== */}
              {/* PRACTICE MODE: VERIFIED SOLUTION & LIVE EXPLANATIONS       */}
              {/* ========================================================== */}
              {isSolutionVisible && (
                <section
                  id="solution-container"
                  style={{
                    border: "1px solid var(--cds-border-subtle-01)",
                    backgroundColor: "var(--cds-layer-02)",
                    marginTop: "2rem",
                  }}
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setIsSolutionExpanded(!isSolutionExpanded)}
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "var(--cds-layer-01)",
                      borderBottom: isSolutionExpanded
                        ? "1px solid var(--cds-border-subtle-01)"
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      userSelect: "none",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckmarkFilled
                        size={18}
                        style={{ color: "var(--cds-interactive, #0f62fe)", flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: "var(--cds-text-primary)",
                          fontFamily: "var(--op-font-sans)",
                        }}
                      >
                        Official Answer & Community Explanations ({liveExplanations.length})
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--cds-text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      <span className="hidden sm:inline">
                        {isSolutionExpanded ? "EXPANDED" : "COLLAPSED"}
                      </span>
                      {isSolutionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Accordion Body Content */}
                  {isSolutionExpanded && (
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {contributeSuccessMsg && (
                        <InlineNotification
                          kind="success"
                          title="Explanation Submitted"
                          subtitle={contributeSuccessMsg}
                          lowContrast
                          onCloseButtonClick={() => setContributeSuccessMsg(null)}
                        />
                      )}

                      {/* Official Answer Summary Header */}
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: "var(--cds-layer-01)",
                          borderLeft: "3px solid var(--cds-support-success, #24a148)",
                          border: "1px solid var(--cds-border-subtle-01)",
                          borderLeftWidth: "3px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "var(--cds-support-success, #24a148)",
                              fontFamily: "var(--op-font-sans)",
                            }}
                          >
                            Official Marking Key
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                fontFamily: "var(--op-font-sans)",
                                backgroundColor: "var(--cds-layer-02)",
                                border: "1px solid var(--cds-border-subtle-01)",
                                color: "var(--cds-text-primary)",
                                padding: "0.125rem 0.5rem",
                              }}
                            >
                              [{selectedQuestion.marks} Mark
                              {selectedQuestion.marks > 1 ? "s" : ""}]
                            </span>
                            {selectedQuestion.id && (
                              <Button
                                size="sm"
                                kind="tertiary"
                                renderIcon={Add}
                                onClick={handleOpenContribute}
                              >
                                Contribute Explanation
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="solution-content">
                          {selectedQuestion.correct_answer_keys &&
                          selectedQuestion.correct_answer_keys.length > 0 ? (
                            <p style={{ margin: 0, fontFamily: "var(--op-font-sans)" }}>
                              <strong>Correct Option:</strong>{" "}
                              {selectedQuestion.correct_answer_keys.join(", ")}
                            </p>
                          ) : selectedQuestion.answer ? (
                            <MarkdownRenderer content={selectedQuestion.answer} />
                          ) : (
                            <p style={{ margin: 0 }}>
                              Review the community-verified derivations and explanations below.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Live Explanations from GET /api/v1/questions/{id}/explanations */}
                      {isLoadingExplanations ? (
                        <div
                          style={{
                            padding: "1.5rem",
                            textAlign: "center",
                            backgroundColor: "var(--cds-layer-01)",
                            border: "1px solid var(--cds-border-subtle-01)",
                            fontSize: "0.875rem",
                            color: "var(--cds-text-secondary)",
                            fontFamily: "var(--op-font-sans)",
                          }}
                        >
                          Loading explanations for Question {selectedQuestion.question_number}...
                        </div>
                      ) : liveExplanations.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                          {liveExplanations.map((exp) => {
                            const isPending = exp.status === "PENDING";
                            const netVotes = (exp.upvotes || 0) - (exp.downvotes || 0);

                            return (
                              <div
                                key={exp.id}
                                style={{
                                  padding: "1rem",
                                  backgroundColor: "var(--cds-layer-01)",
                                  border: "1px solid var(--cds-border-subtle-01)",
                                  borderLeftWidth: "3px",
                                  borderLeftColor: isPending
                                    ? "var(--cds-support-warning, #f1c21b)"
                                    : exp.is_verified
                                      ? "var(--cds-support-success, #24a148)"
                                      : "var(--cds-interactive, #0f62fe)",
                                }}
                              >
                                {/* Top Metadata Bar */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "0.5rem",
                                    paddingBottom: "0.75rem",
                                    marginBottom: "0.75rem",
                                    borderBottom: "1px solid var(--cds-border-subtle-01)",
                                    fontFamily: "var(--op-font-sans)",
                                  }}
                                >
                                  {/* Author Info */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <Link
                                      href={`/users/${exp.author.id}`}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        textDecoration: "none",
                                        color: "var(--cds-text-primary)",
                                        fontWeight: 700,
                                        fontSize: "0.8125rem",
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: "22px",
                                          height: "22px",
                                          backgroundColor: "var(--cds-interactive, #0f62fe)",
                                          color: "var(--cds-text-on-color, #ffffff)",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "0.6875rem",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {exp.author.username.slice(0, 2).toUpperCase()}
                                      </span>
                                      <span>{exp.author.username}</span>
                                    </Link>

                                    <span
                                      style={{
                                        padding: "0.125rem 0.375rem",
                                        backgroundColor: "rgba(15, 98, 254, 0.12)",
                                        border: "1px solid var(--cds-interactive, #0f62fe)",
                                        color: "var(--cds-interactive, #0f62fe)",
                                        fontSize: "0.6875rem",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {exp.author.reputation} ★
                                    </span>

                                    {exp.author.role &&
                                      exp.author.role.toUpperCase() !== "USER" && (
                                        <Tag type="purple" size="sm">
                                          {exp.author.role.toUpperCase()}
                                        </Tag>
                                      )}
                                  </div>

                                  {/* Status & Language Badges */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      gap: "0.375rem",
                                    }}
                                  >
                                    {isPending && (
                                      <Tag type="warm-gray" size="sm">
                                        <span
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.25rem",
                                            fontWeight: 700,
                                          }}
                                        >
                                          <Pending size={12} />
                                          <span>PENDING REVIEW (PINNED)</span>
                                        </span>
                                      </Tag>
                                    )}
                                    {exp.is_verified && (
                                      <Tag type="green" size="sm">
                                        VERIFIED
                                      </Tag>
                                    )}
                                    <Tag type="gray" size="sm">
                                      {exp.language_code.toUpperCase()}
                                    </Tag>
                                  </div>
                                </div>

                                {/* Explanation Markdown & LaTeX Content */}
                                <div className="solution-content">
                                  <MarkdownRenderer content={exp.content_text} />
                                </div>

                                {/* Footer: Net Votes & Timestamp */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "0.5rem",
                                    marginTop: "0.875rem",
                                    paddingTop: "0.625rem",
                                    borderTop: "1px solid var(--cds-border-subtle-01)",
                                    fontSize: "0.75rem",
                                    color: "var(--cds-text-secondary)",
                                    fontFamily: "var(--op-font-sans)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.75rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: 700,
                                        color:
                                          netVotes > 0
                                            ? "var(--cds-support-success, #24a148)"
                                            : "var(--cds-text-primary)",
                                      }}
                                    >
                                      {netVotes >= 0 ? `+${netVotes}` : netVotes} Net Votes
                                    </span>
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                    >
                                      <ThumbsUp size={14} />
                                      <span>{exp.upvotes}</span>
                                    </span>
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                    >
                                      <ThumbsDown size={14} />
                                      <span>{exp.downvotes}</span>
                                    </span>
                                  </div>

                                  <span>
                                    Submitted{" "}
                                    {new Date(exp.created_at).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: "1.5rem",
                            backgroundColor: "var(--cds-layer-01)",
                            border: "1px solid var(--cds-border-subtle-01)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            fontFamily: "var(--op-font-sans)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "var(--cds-text-primary)",
                            }}
                          >
                            No community explanations have been approved for Question{" "}
                            {selectedQuestion.question_number} yet.
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.8125rem",
                              color: "var(--cds-text-secondary)",
                            }}
                          >
                            Help fellow students by writing a clear step-by-step derivation or
                            explanation using Markdown and LaTeX. Approved explanations earn
                            community reputation points.
                          </p>
                          {selectedQuestion.id && (
                            <Button
                              size="sm"
                              kind="primary"
                              renderIcon={Edit}
                              onClick={handleOpenContribute}
                            >
                              Write First Explanation
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* PERSISTENT BOTTOM WORKSPACE DOCK                               */}
      {/* ============================================================== */}
      <footer className="op-workspace-dock">
        {/* Left: Previous & Next Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <button
            type="button"
            disabled={selectedQuestionIndex === 0}
            onClick={handlePrevQuestion}
            aria-label="Previous Question"
            style={{
              height: "34px",
              padding: "0 0.625rem",
              backgroundColor: "var(--cds-layer-01)",
              border: "1px solid var(--cds-border-subtle-01)",
              color:
                selectedQuestionIndex === 0 ? "var(--cds-text-helper)" : "var(--cds-text-primary)",
              cursor: selectedQuestionIndex === 0 ? "not-allowed" : "pointer",
              fontFamily: "var(--op-font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              textTransform: "uppercase",
            }}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">
              Q{selectedQuestionIndex > 0 ? selectedQuestionIndex : 1}
            </span>
          </button>

          <button
            type="button"
            disabled={selectedQuestionIndex === paper.questions.length - 1}
            onClick={handleNextQuestion}
            aria-label="Next Question"
            style={{
              height: "34px",
              padding: "0 0.625rem",
              backgroundColor:
                selectedQuestionIndex === paper.questions.length - 1
                  ? "var(--cds-layer-01)"
                  : "var(--cds-interactive, #0f62fe)",
              border: "1px solid var(--cds-border-subtle-01)",
              color:
                selectedQuestionIndex === paper.questions.length - 1
                  ? "var(--cds-text-helper)"
                  : "var(--cds-text-on-color, #ffffff)",
              cursor:
                selectedQuestionIndex === paper.questions.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "var(--op-font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              textTransform: "uppercase",
            }}
          >
            <span className="hidden sm:inline">
              Q
              {selectedQuestionIndex < paper.questions.length - 1
                ? selectedQuestionIndex + 2
                : paper.questions.length}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Center: Viewing Status & Jump to Question */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            className="hidden md:flex"
            style={{
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              color: "var(--cds-text-secondary)",
              fontWeight: 600,
              fontFamily: "var(--op-font-sans)",
            }}
          >
            <CheckmarkFilled size={14} style={{ color: "var(--cds-support-success, #24a148)" }} />
            <span>
              Question {selectedQuestionIndex + 1} of {paper.questions.length}
            </span>
          </div>

          <form
            onSubmit={handleJumpSubmit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-01)",
              height: "30px",
            }}
          >
            <span
              style={{
                padding: "0 0.375rem",
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                backgroundColor: "var(--cds-layer-02)",
                color: "var(--cds-text-secondary)",
                fontFamily: "var(--op-font-sans)",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderRight: "1px solid var(--cds-border-subtle-01)",
              }}
            >
              JUMP
            </span>
            <input
              type="text"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onBlur={handleJumpSubmit}
              style={{
                width: "36px",
                height: "100%",
                textAlign: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "var(--op-font-sans)",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "var(--cds-text-primary)",
              }}
            />
          </form>
        </div>

        {/* Right: Flag for Review & Contribute Solution */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <button
            type="button"
            onClick={() => toggleFlag(selectedQuestionIndex)}
            aria-label="Flag Question for Review"
            style={{
              height: "34px",
              padding: "0 0.625rem",
              backgroundColor: isCurrentFlagged
                ? "rgba(241, 194, 27, 0.15)"
                : "var(--cds-layer-01)",
              border: isCurrentFlagged
                ? "1px solid var(--cds-support-warning, #f1c21b)"
                : "1px solid var(--cds-border-subtle-01)",
              color: isCurrentFlagged
                ? "var(--cds-support-warning, #b28600)"
                : "var(--cds-text-primary)",
              fontFamily: "var(--op-font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
            }}
          >
            {isCurrentFlagged ? (
              <FlagFilled size={14} style={{ color: "#b28600" }} />
            ) : (
              <Flag size={14} />
            )}
            <span className="hidden lg:inline">{isCurrentFlagged ? "Flagged" : "Flag"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenContribute}
            aria-label="Contribute Solution"
            style={{
              height: "34px",
              padding: "0 0.625rem",
              backgroundColor: "var(--cds-interactive, #0f62fe)",
              color: "var(--cds-text-on-color, #ffffff)",
              border: "1px solid var(--cds-interactive, #0f62fe)",
              fontFamily: "var(--op-font-sans)",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            <Edit size={14} />
            <span className="hidden sm:inline">Contribute</span>
          </button>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* CONTRIBUTE EXPLANATION MODAL (POST /questions/{id}/explanations) */}
      {/* ============================================================== */}
      <Modal
        open={isContributeOpen}
        onRequestClose={() => setIsContributeOpen(false)}
        onRequestSubmit={handleSubmitExplanation}
        modalHeading={`Contribute Explanation — Question ${selectedQuestion ? selectedQuestion.question_number : ""}`}
        modalLabel={`${paper.subject} • ${paper.year} Examination`}
        primaryButtonText={
          isSubmittingExplanation ? "Submitting..." : "Submit for Moderation Review"
        }
        secondaryButtonText="Cancel"
        primaryButtonDisabled={isSubmittingExplanation || contributeContent.trim().length < 10}
        size="lg"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            fontFamily: "var(--op-font-sans)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              color: "var(--cds-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Write a clear, step-by-step worked solution or derivation. You can use Markdown, inline
            LaTeX math (<code>$E = mc^2$</code>), block equations (<code>$$...$$</code>), and
            chemical equations (<code>$\ce&#123;H2O&#125;$</code>). Submissions enter the moderation
            queue with <strong>PENDING</strong> status and earn reputation points upon approval.
          </p>

          {contributeError && (
            <InlineNotification
              kind="error"
              title="Submission Error"
              subtitle={contributeError}
              lowContrast
              hideCloseButton
            />
          )}

          <div style={{ maxWidth: "240px" }}>
            <Select
              id="contribute-language-select"
              labelText="Explanation Language"
              value={contributeLang}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setContributeLang(e.target.value as "en" | "si" | "ta")
              }
            >
              <SelectItem value="en" text="English (EN)" />
              <SelectItem value="si" text="Sinhala (SI)" />
              <SelectItem value="ta" text="Tamil (TA)" />
            </Select>
          </div>

          <div>
            <ContentSwitcher
              selectedIndex={contributeTabIndex}
              onChange={(data: { index?: number }) => {
                if (typeof data.index === "number") {
                  setContributeTabIndex(data.index);
                }
              }}
              size="sm"
            >
              <Switch name="write" text="Write Markdown / LaTeX" />
              <Switch name="preview" text="Live Scientific Preview" />
            </ContentSwitcher>

            <div style={{ marginTop: "0.75rem" }}>
              {contributeTabIndex === 0 ? (
                <TextArea
                  id="contribute-explanation-textarea"
                  labelText="Worked Derivation & Solution (Minimum 10 characters)"
                  helperText={`${contributeContent.trim().length} characters entered`}
                  placeholder="Step 1: State the governing principle or equation..."
                  rows={8}
                  value={contributeContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContributeContent(e.target.value)
                  }
                />
              ) : (
                <div
                  style={{
                    minHeight: "180px",
                    padding: "1rem",
                    backgroundColor: "var(--cds-layer-01)",
                    border: "1px solid var(--cds-border-subtle-01)",
                  }}
                >
                  {contributeContent.trim() ? (
                    <div className="solution-content">
                      <MarkdownRenderer content={contributeContent} />
                    </div>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8125rem",
                        color: "var(--cds-text-helper)",
                      }}
                    >
                      Nothing to preview yet. Switch to &quot;Write Markdown / LaTeX&quot; to
                      compose your explanation.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
