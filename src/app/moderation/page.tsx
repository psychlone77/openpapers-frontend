"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPendingExplanations, reviewExplanation } from "@/lib/api/explanations";
import type { ExplanationResponse } from "@/lib/types/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  TextInput,
  Pagination,
  InlineNotification,
  Checkmark,
  Close,
  Renew,
  Locked,
  Pending,
  ArrowLeft,
} from "@/components/carbon";

export default function ModerationQueuePage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isModeratorOrAdmin, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<ExplanationResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Per-item review notes & loading state
  const [reviewReasons, setReviewReasons] = useState<Record<string, string>>({});
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});
  const [showRawIds, setShowRawIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/moderation");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadPendingQueue = useCallback(
    async (targetPage: number, targetLimit: number) => {
      if (!accessToken || !isModeratorOrAdmin) return;
      setIsLoadingQueue(true);
      setQueueError(null);
      try {
        const res = await fetchPendingExplanations(accessToken, targetPage, targetLimit);
        setItems(res.items || []);
        setTotal(res.total || 0);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load pending review queue.";
        setQueueError(msg);
      } finally {
        setIsLoadingQueue(false);
      }
    },
    [accessToken, isModeratorOrAdmin]
  );

  useEffect(() => {
    if (accessToken && isModeratorOrAdmin) {
      loadPendingQueue(page, pageSize);
    } else if (!authLoading && isAuthenticated && !isModeratorOrAdmin) {
      setIsLoadingQueue(false);
    }
  }, [
    accessToken,
    isModeratorOrAdmin,
    authLoading,
    isAuthenticated,
    page,
    pageSize,
    loadPendingQueue,
  ]);

  const handleDecision = async (
    explanation: ExplanationResponse,
    decision: "APPROVE" | "REJECT"
  ) => {
    if (!accessToken) return;

    const reasonText = (reviewReasons[explanation.id] || "").trim();
    if (decision === "REJECT" && !reasonText) {
      setQueueError("Please provide a brief feedback reason when rejecting an explanation.");
      return;
    }

    setProcessingIds((prev) => ({ ...prev, [explanation.id]: true }));
    setQueueError(null);
    setActionSuccess(null);

    try {
      await reviewExplanation(
        explanation.id,
        {
          decision,
          ...(reasonText ? { reason: reasonText } : {}),
        },
        accessToken
      );

      setItems((prev) => prev.filter((item) => item.id !== explanation.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setActionSuccess(
        decision === "APPROVE"
          ? `Approved explanation by ${explanation.author.username}. Reputation points have been awarded to the author.`
          : `Rejected explanation by ${explanation.author.username}.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to process review decision.";
      setQueueError(msg);
    } finally {
      setProcessingIds((prev) => ({ ...prev, [explanation.id]: false }));
    }
  };

  if (authLoading || (!isAuthenticated && !queueError)) {
    return (
      <main
        id="main-content"
        style={{
          minHeight: "calc(100vh - 48px)",
          backgroundColor: "var(--cds-background)",
          padding: "3rem 1rem",
          fontFamily: "var(--op-font-sans)",
        }}
      >
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: "2rem", border: "1px solid var(--cds-border-subtle-01)" }}>
              Verifying moderator credentials...
            </Tile>
          </Column>
        </Grid>
      </main>
    );
  }

  // 403 Forbidden view if logged in as a regular USER
  if (!isModeratorOrAdmin) {
    return (
      <main
        id="main-content"
        style={{
          minHeight: "calc(100vh - 48px)",
          backgroundColor: "var(--cds-background)",
          padding: "3rem 1rem",
          fontFamily: "var(--op-font-sans)",
        }}
      >
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Tile
              style={{
                padding: "2.5rem",
                border: "1px solid var(--cds-border-subtle-01)",
                borderLeft: "3px solid var(--cds-support-error, #da1e28)",
                backgroundColor: "var(--cds-layer-01)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  color: "var(--cds-support-error, #da1e28)",
                }}
              >
                <Locked size={20} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                  403 Forbidden • Elevated Role Required
                </span>
              </div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--cds-text-primary)",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                Moderator or Administrator Access Only
              </h1>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                The explanation moderation queue is restricted to accounts with the{" "}
                <strong>MODERATOR</strong> or <strong>ADMIN</strong> role.
              </p>
              <Button as={Link} href="/profile" kind="primary" size="sm" renderIcon={ArrowLeft}>
                Return to My Profile
              </Button>
            </Tile>
          </Column>
        </Grid>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      style={{
        minHeight: "calc(100vh - 48px)",
        backgroundColor: "var(--cds-background)",
        padding: "2rem 0 4rem",
        fontFamily: "var(--op-font-sans)",
      }}
    >
      <Grid>
        {/* Header Bar */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
          <Tile
            style={{
              padding: "1.75rem",
              border: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-01)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                }}
              >
                <Tag type="purple" size="sm">
                  MODERATION &amp; CURATION
                </Tag>
                <Tag type="warm-gray" size="sm">
                  {total} PENDING
                </Tag>
              </div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--cds-text-primary)",
                  margin: 0,
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                Pending Explanations Review Queue
              </h1>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.875rem",
                  color: "var(--cds-text-secondary)",
                }}
              >
                Verify mathematical derivations and solution accuracy. Approving an explanation
                publishes it and automatically awards reputation points to the author.
              </p>
            </div>

            <Button
              kind="tertiary"
              size="sm"
              renderIcon={Renew}
              onClick={() => loadPendingQueue(page, pageSize)}
              disabled={isLoadingQueue}
            >
              Refresh Queue
            </Button>
          </Tile>
        </Column>

        {/* Notifications */}
        <Column lg={16} md={8} sm={4}>
          {queueError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                title="Moderation Queue Error"
                subtitle={queueError}
                lowContrast
                onCloseButtonClick={() => setQueueError(null)}
              />
            </div>
          )}

          {actionSuccess && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="success"
                title="Review Recorded"
                subtitle={actionSuccess}
                lowContrast
                onCloseButtonClick={() => setActionSuccess(null)}
              />
            </div>
          )}
        </Column>

        {/* Pending Queue Items */}
        <Column lg={16} md={8} sm={4}>
          {isLoadingQueue ? (
            <Tile
              style={{
                padding: "2.5rem",
                textAlign: "center",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                color: "var(--cds-text-secondary)",
              }}
            >
              Loading pending explanations...
            </Tile>
          ) : items.length === 0 ? (
            <Tile
              style={{
                padding: "3rem 2rem",
                textAlign: "center",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
              }}
            >
              <Checkmark
                size={32}
                style={{ color: "var(--cds-support-success, #24a148)", marginBottom: "0.75rem" }}
              />
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--cds-text-primary)",
                  marginBottom: "0.375rem",
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                All Caught Up — Zero Pending Explanations
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--cds-text-secondary)",
                  margin: 0,
                }}
              >
                There are currently no pending community explanations waiting for review.
              </p>
            </Tile>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {items.map((exp) => {
                const isProcessing = !!processingIds[exp.id];
                const isShowingRaw = !!showRawIds[exp.id];

                return (
                  <Tile
                    key={exp.id}
                    style={{
                      padding: "1.5rem",
                      border: "1px solid var(--cds-border-subtle-01)",
                      borderLeft: "3px solid var(--cds-support-warning, #f1c21b)",
                      backgroundColor: "var(--cds-layer-01)",
                    }}
                  >
                    {/* Item Header */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        paddingBottom: "0.875rem",
                        marginBottom: "1rem",
                        borderBottom: "1px solid var(--cds-border-subtle-01)",
                      }}
                    >
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
                            fontSize: "0.875rem",
                          }}
                        >
                          <span
                            style={{
                              width: "24px",
                              height: "24px",
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

                        <Tag type="blue" size="sm">
                          {exp.author.role.toUpperCase()}
                        </Tag>

                        <Tag type="gray" size="sm">
                          LANG: {exp.language_code.toUpperCase()}
                        </Tag>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0.75rem",
                          fontSize: "0.75rem",
                          color: "var(--cds-text-secondary)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Pending size={14} />
                          <span>Question ID: {exp.question_id}</span>
                        </span>
                        <span>
                          Submitted{" "}
                          {new Date(exp.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowRawIds((prev) => ({
                              ...prev,
                              [exp.id]: !prev[exp.id],
                            }))
                          }
                          style={{
                            padding: "0.125rem 0.5rem",
                            backgroundColor: "var(--cds-layer-02)",
                            border: "1px solid var(--cds-border-subtle-01)",
                            color: "var(--cds-text-primary)",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            fontFamily: "var(--op-font-sans)",
                            cursor: "pointer",
                          }}
                        >
                          {isShowingRaw ? "Show Rendered View" : "Inspect Raw Source"}
                        </button>
                      </div>
                    </div>

                    {/* Rendered Markdown / LaTeX or Raw Source */}
                    <div
                      style={{
                        padding: "1.25rem",
                        backgroundColor: "var(--cds-layer-02)",
                        border: "1px solid var(--cds-border-subtle-01)",
                        marginBottom: "1.25rem",
                      }}
                    >
                      {isShowingRaw ? (
                        <pre
                          style={{
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontFamily: "var(--op-font-sans)",
                            fontSize: "0.8125rem",
                            color: "var(--cds-text-primary)",
                          }}
                        >
                          {exp.content_text}
                        </pre>
                      ) : (
                        <div className="solution-content">
                          <MarkdownRenderer content={exp.content_text} />
                        </div>
                      )}
                    </div>

                    {/* Review Controls Row (POST /api/v1/admin/explanations/{id}/review) */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ flex: "1 1 280px" }}>
                        <TextInput
                          id={`review-reason-${exp.id}`}
                          labelText="Review Note / Rejection Reason (Required if rejecting)"
                          placeholder="Optional note or reason for rejection..."
                          value={reviewReasons[exp.id] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setReviewReasons((prev) => ({
                              ...prev,
                              [exp.id]: e.target.value,
                            }))
                          }
                          disabled={isProcessing}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Button
                          kind="danger"
                          size="md"
                          renderIcon={Close}
                          disabled={isProcessing}
                          onClick={() => handleDecision(exp, "REJECT")}
                        >
                          {isProcessing ? "Processing..." : "Reject"}
                        </Button>

                        <Button
                          kind="primary"
                          size="md"
                          renderIcon={Checkmark}
                          disabled={isProcessing}
                          onClick={() => handleDecision(exp, "APPROVE")}
                        >
                          {isProcessing ? "Processing..." : "Approve & Award Reputation"}
                        </Button>
                      </div>
                    </div>
                  </Tile>
                );
              })}

              {/* Pagination Bar */}
              <div style={{ border: "1px solid var(--cds-border-subtle-01)" }}>
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  pageSizes={[10, 20, 50]}
                  totalItems={total}
                  onChange={({
                    page: nextPage,
                    pageSize: nextSize,
                  }: {
                    page: number;
                    pageSize: number;
                  }) => {
                    setPage(nextPage);
                    setPageSize(nextSize);
                  }}
                />
              </div>
            </div>
          )}
        </Column>
      </Grid>
    </main>
  );
}
