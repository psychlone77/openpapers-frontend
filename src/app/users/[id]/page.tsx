import React from "react";
import Link from "next/link";
import { fetchPublicUserProfile } from "@/lib/api/users";
import type { PublicUserProfileResponse } from "@/lib/types/api";
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  CheckmarkFilled,
  Pending,
  ThumbsUp,
  ArrowLeft,
  Building,
  Location,
  Calendar,
  Certificate,
  Badge,
} from "@/components/carbon";
import { ShareButton } from "./ShareButton";

function getInitials(username?: string): string {
  if (!username) return "OP";
  const parts = username.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function PublicUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile: PublicUserProfileResponse | null = null;
  let errorDetail: string | null = null;

  try {
    profile = await fetchPublicUserProfile(id);
  } catch (err) {
    errorDetail = err instanceof Error ? err.message : "Public user profile could not be found.";
  }

  // Dynamic Badges calculation based on real user achievements
  const rep = profile?.reputation ?? 0;
  const approvedCount = profile?.stats?.approved_explanations ?? 0;
  const hasBronze = rep >= 0;
  const hasSilver = rep >= 25 || approvedCount >= 5;
  const hasGold = rep >= 100 || approvedCount >= 15;

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
        <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem>
              <Link href="/" className="cds--link">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/papers" className="cds--link">
                Papers
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              Contributor {profile ? profile.username : id.slice(0, 8)}
            </BreadcrumbItem>
          </Breadcrumb>
        </Column>

        {!profile ? (
          <Column lg={16} md={8} sm={4}>
            <Tile
              style={{
                padding: "2.5rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: 0,
              }}
            >
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--cds-text-primary)",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                Contributor Profile Not Found
              </h1>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                {errorDetail ||
                  "The requested contributor profile does not exist or may have been removed."}
              </p>
              <Button
                as={Link}
                href="/papers"
                kind="primary"
                size="sm"
                renderIcon={ArrowLeft}
                style={{ borderRadius: 0 }}
              >
                Back to Papers Archive
              </Button>
            </Tile>
          </Column>
        ) : (
          <>
            {/* ============================================================ */}
            {/* PUBLIC CONTRIBUTOR HEADER BANNER                             */}
            {/* ============================================================ */}
            <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  padding: "2rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1.5rem",
                  }}
                >
                  {/* Left Identity Group */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                      flex: 1,
                      minWidth: "300px",
                    }}
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        backgroundColor: "var(--cds-interactive, #0f62fe)",
                        color: "var(--cds-text-on-color, #ffffff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        borderRadius: 0,
                        fontFamily: "var(--op-font-sans)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(profile.username)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "1.625rem",
                            fontWeight: 700,
                            color: "var(--cds-text-primary)",
                            margin: 0,
                            fontFamily: "var(--op-font-sans)",
                          }}
                        >
                          {profile.username}
                        </h1>
                        <Tag type="blue" size="sm" style={{ borderRadius: 0, fontWeight: 600 }}>
                          {profile.role.toUpperCase()}
                        </Tag>
                        {hasGold && (
                          <Tag type="magenta" size="sm" style={{ borderRadius: 0 }}>
                            ★ SENIOR SCHOLAR
                          </Tag>
                        )}
                        <Tag type="green" size="sm" style={{ borderRadius: 0 }}>
                          PUBLIC CONTRIBUTOR
                        </Tag>
                      </div>

                      {/* Metadata Row: Affiliation, Location, Date */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1.25rem",
                          fontSize: "0.8125rem",
                          color: "var(--cds-text-secondary)",
                          marginTop: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {profile.institution ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            <Building
                              size={14}
                              style={{ color: "var(--cds-interactive, #0f62fe)" }}
                            />
                            <span>{profile.institution}</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            <Building size={14} style={{ color: "var(--cds-text-helper)" }} />
                            <span style={{ color: "var(--cds-text-helper)" }}>
                              Academic Contributor
                            </span>
                          </span>
                        )}

                        {profile.location && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            <Location
                              size={14}
                              style={{ color: "var(--cds-interactive, #0f62fe)" }}
                            />
                            <span>{profile.location}</span>
                          </span>
                        )}

                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                        >
                          <Calendar size={14} style={{ color: "var(--cds-text-helper)" }} />
                          <span>Joined {formatDate(profile.created_at)}</span>
                        </span>
                      </div>

                      {/* Bio in Plex Serif */}
                      {profile.bio && (
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--cds-text-primary)",
                            lineHeight: 1.5,
                            margin: "0.5rem 0 0 0",
                            fontFamily: "var(--op-font-serif)",
                            fontStyle: "italic",
                            maxWidth: "680px",
                          }}
                        >
                          &ldquo;{profile.bio}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Share Profile */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ShareButton />
                  </div>
                </div>

                {/* Badges & Recognition Ribbon */}
                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--cds-border-subtle-01)",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--cds-text-helper)",
                    }}
                  >
                    Contributor Recognition:
                  </span>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.25rem 0.625rem",
                      backgroundColor: hasBronze ? "var(--cds-layer-02)" : "transparent",
                      border: "1px solid var(--cds-border-subtle-01)",
                      opacity: hasBronze ? 1 : 0.4,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <Badge size={14} style={{ color: "#cd7f32" }} />
                    <span>Bronze Contributor</span>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.25rem 0.625rem",
                      backgroundColor: hasSilver ? "var(--cds-layer-02)" : "transparent",
                      border: "1px solid var(--cds-border-subtle-01)",
                      opacity: hasSilver ? 1 : 0.4,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <Certificate size={14} style={{ color: "#c0c0c0" }} />
                    <span>Silver Reviewer (25+ Rep)</span>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.25rem 0.625rem",
                      backgroundColor: hasGold ? "var(--cds-layer-02)" : "transparent",
                      border: "1px solid var(--cds-border-subtle-01)",
                      opacity: hasGold ? 1 : 0.4,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <Certificate size={14} style={{ color: "#ffd700" }} />
                    <span>Gold Scholar (100+ Rep)</span>
                  </div>
                </div>
              </Tile>
            </Column>

            {/* ============================================================ */}
            {/* 4 METRIC TILES: Approved Solutions, Upvotes, Queue, Rep      */}
            {/* ============================================================ */}
            <Column lg={4} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-support-success, #24a148)",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Approved Explanations
                  </span>
                  <CheckmarkFilled
                    size={18}
                    style={{ color: "var(--cds-support-success, #24a148)" }}
                  />
                </div>
                <div
                  style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}
                >
                  {profile.stats.approved_explanations}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--cds-text-helper)",
                    marginTop: "0.25rem",
                  }}
                >
                  Peer-reviewed explanations published to the archive
                </div>
              </Tile>
            </Column>

            <Column lg={4} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-interactive, #0f62fe)",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Net Upvotes
                  </span>
                  <ThumbsUp size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                </div>
                <div
                  style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}
                >
                  {profile.stats.total_votes_received}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--cds-text-helper)",
                    marginTop: "0.25rem",
                  }}
                >
                  Total net upvotes from students and educators
                </div>
              </Tile>
            </Column>

            <Column lg={4} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-support-warning, #f1c21b)",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    In Moderation
                  </span>
                  <Pending size={18} style={{ color: "var(--cds-support-warning, #b28600)" }} />
                </div>
                <div
                  style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}
                >
                  {profile.stats.pending_explanations}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--cds-text-helper)",
                    marginTop: "0.25rem",
                  }}
                >
                  Solutions currently in review queue
                </div>
              </Tile>
            </Column>

            <Column lg={4} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid #8a3ffc",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Reputation Score
                  </span>
                  <Certificate size={18} style={{ color: "#8a3ffc" }} />
                </div>
                <div
                  style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}
                >
                  {profile.reputation} ★
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--cds-text-helper)",
                    marginTop: "0.25rem",
                  }}
                >
                  Cumulative community standing score
                </div>
              </Tile>
            </Column>

            {/* Academic Standing & OpenPapers Impact */}
            <Column lg={16} md={8} sm={4} style={{ marginBottom: "2rem" }}>
              <Tile
                style={{
                  padding: "1.75rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  backgroundColor: "var(--cds-layer-01)",
                  borderRadius: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Certificate size={20} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                  <h2
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      margin: 0,
                      fontFamily: "var(--op-font-sans)",
                    }}
                  >
                    About {profile.username}&apos;s Academic Contributions
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--cds-text-secondary)",
                    lineHeight: 1.6,
                    maxWidth: "800px",
                  }}
                >
                  All explanations and worked solutions contributed by this scholar are
                  peer-reviewed under OpenPapers academic verification standards and released freely
                  under open-access educational commons.
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <Button
                    as={Link}
                    href="/papers"
                    kind="tertiary"
                    size="sm"
                    renderIcon={ArrowLeft}
                    style={{ borderRadius: 0 }}
                  >
                    Browse Examination Archive
                  </Button>
                </div>
              </Tile>
            </Column>
          </>
        )}
      </Grid>
    </main>
  );
}
