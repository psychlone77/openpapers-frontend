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
} from "@/components/carbon";

function getInitials(username?: string): string {
  if (!username) return "OP";
  const parts = username.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
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
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/papers">Papers</BreadcrumbItem>
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
                {errorDetail || "The requested contributor profile does not exist."}
              </p>
              <Button as={Link} href="/papers" kind="primary" size="sm" renderIcon={ArrowLeft}>
                Back to Papers Archive
              </Button>
            </Tile>
          </Column>
        ) : (
          <>
            {/* Public Contributor Header (Private Email Omitted per API) */}
            <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  padding: "2rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  backgroundColor: "var(--cds-layer-01)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "var(--cds-interactive, #0f62fe)",
                      color: "var(--cds-text-on-color, #ffffff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      fontFamily: "var(--op-font-sans)",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(profile.username)}
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.375rem",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "var(--cds-text-primary)",
                          margin: 0,
                          fontFamily: "var(--op-font-sans)",
                        }}
                      >
                        {profile.username}
                      </h1>
                      <Tag type="blue" size="sm">
                        {profile.role.toUpperCase()}
                      </Tag>
                      <Tag type="green" size="sm">
                        PUBLIC CONTRIBUTOR PROFILE
                      </Tag>
                    </div>

                    <div style={{ fontSize: "0.8125rem", color: "var(--cds-text-secondary)" }}>
                      Joined OpenPapers on{" "}
                      {new Date(profile.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Reputation Score Card */}
                <div
                  style={{
                    padding: "0.875rem 1.5rem",
                    backgroundColor: "var(--cds-layer-02)",
                    border: "1px solid var(--cds-border-subtle-01)",
                    borderLeft: "3px solid var(--cds-interactive, #0f62fe)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Community Reputation
                  </div>
                  <div
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--cds-interactive, #0f62fe)",
                      marginTop: "0.125rem",
                    }}
                  >
                    {profile.reputation} ★
                  </div>
                </div>
              </Tile>
            </Column>

            {/* Public Contribution Stats */}
            <Column lg={5} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-support-success, #24a148)",
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
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                  }}
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

            <Column lg={5} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-support-warning, #f1c21b)",
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Pending Reviews
                  </span>
                  <Pending size={18} style={{ color: "var(--cds-support-warning, #b28600)" }} />
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                  }}
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
                  Currently in the moderation queue
                </div>
              </Tile>
            </Column>

            <Column lg={6} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
              <Tile
                style={{
                  height: "100%",
                  padding: "1.5rem",
                  border: "1px solid var(--cds-border-subtle-01)",
                  borderTop: "3px solid var(--cds-interactive, #0f62fe)",
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Net Votes Received
                  </span>
                  <ThumbsUp size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                  }}
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
          </>
        )}
      </Grid>
    </main>
  );
}
