"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyProfile, updateMyProfile, fetchMyExplanations } from "@/lib/api/users";
import type { UserProfileResponse, ExplanationResponse } from "@/lib/types/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  TextInput,
  PasswordInput,
  InlineNotification,
  ContentSwitcher,
  Switch,
  CheckmarkFilled,
  Pending,
  WarningFilled,
  ThumbsUp,
  ThumbsDown,
  Security,
  Edit,
  Renew,
  ArrowRight,
} from "@/components/carbon";

function getInitials(username?: string): string {
  if (!username) return "OP";
  const parts = username.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

const STATUS_FILTERS = ["ALL", "APPROVED", "PENDING", "REJECTED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function ProfilePage() {
  const router = useRouter();
  const {
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
    isModeratorOrAdmin,
    updateUserState,
  } = useAuth();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [explanations, setExplanations] = useState<ExplanationResponse[]>([]);
  const [statusFilterIndex, setStatusFilterIndex] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingExplanations, setIsLoadingExplanations] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Username update state (PATCH /api/v1/users/me)
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Password update state (PATCH /api/v1/users/me)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const selectedStatusFilter: StatusFilter = STATUS_FILTERS[statusFilterIndex] || "ALL";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadProfileData = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingProfile(true);
    setLoadError(null);
    try {
      const data = await fetchMyProfile(accessToken);
      setProfile(data);
      setNewUsername(data.username);
      updateUserState({
        username: data.username,
        email: data.email,
        role: data.role,
        reputation: data.reputation,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to load profile.";
      setLoadError(msg);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [accessToken, updateUserState]);

  const loadExplanations = useCallback(
    async (status: StatusFilter) => {
      if (!accessToken) return;
      setIsLoadingExplanations(true);
      try {
        const list = await fetchMyExplanations(accessToken, status === "ALL" ? undefined : status);
        setExplanations(list);
      } catch {
        setExplanations([]);
      } finally {
        setIsLoadingExplanations(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      loadProfileData();
    }
  }, [accessToken, loadProfileData]);

  useEffect(() => {
    if (accessToken) {
      loadExplanations(selectedStatusFilter);
    }
  }, [accessToken, selectedStatusFilter, loadExplanations]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setUsernameError(null);
    setUsernameSuccess(null);

    const trimmed = newUsername.trim();
    if (trimmed.length < 3 || trimmed.length > 50) {
      setUsernameError("Username must be between 3 and 50 characters.");
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const updated = await updateMyProfile(accessToken, { username: trimmed });
      setProfile(updated);
      setNewUsername(updated.username);
      updateUserState({
        username: updated.username,
        reputation: updated.reputation,
        role: updated.role,
      });
      setUsernameSuccess("Username updated successfully.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update username (collision or invalid).";
      setUsernameError(msg);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 72) {
      setPasswordError("New password must be between 8 and 72 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateMyProfile(accessToken, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordSuccess("Password updated successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (authLoading || (!isAuthenticated && !loadError)) {
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
              Loading contributor profile...
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
        {/* Top Profile Banner */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
          {loadError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                title="Profile Error"
                subtitle={loadError}
                lowContrast
                hideCloseButton
              />
            </div>
          )}

          <Tile
            style={{
              padding: "1.75rem",
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
              style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}
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
                {getInitials(profile?.username)}
              </div>

              <div>
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
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--cds-text-primary)",
                      margin: 0,
                      fontFamily: "var(--op-font-sans)",
                    }}
                  >
                    {profile?.username || "Contributor"}
                  </h1>
                  <Tag type="blue" size="sm">
                    {(profile?.role || "USER").toUpperCase()}
                  </Tag>
                  {profile?.id && (
                    <Link
                      href={`/users/${profile.id}`}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--cds-link-primary, #0f62fe)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      View Public Profile →
                    </Link>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--cds-text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {profile?.email}
                </div>

                {profile?.created_at && (
                  <div style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)" }}>
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reputation Score & Moderation Queue Shortcut */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "0.75rem 1.25rem",
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
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--cds-interactive, #0f62fe)",
                    marginTop: "0.125rem",
                  }}
                >
                  {profile?.reputation ?? 0} ★
                </div>
              </div>

              {isModeratorOrAdmin && (
                <Button
                  as={Link}
                  href="/moderation"
                  kind="primary"
                  size="md"
                  renderIcon={ArrowRight}
                >
                  Moderation Queue
                </Button>
              )}
            </div>
          </Tile>
        </Column>

        {/* Contribution Statistics Cards (GET /api/v1/users/me -> stats) */}
        <Column lg={5} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
          <Tile
            style={{
              height: "100%",
              padding: "1.25rem",
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
              <CheckmarkFilled size={18} style={{ color: "var(--cds-support-success, #24a148)" }} />
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--cds-text-primary)",
              }}
            >
              {isLoadingProfile ? "—" : (profile?.stats?.approved_explanations ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Published solutions live on examination papers
            </div>
          </Tile>
        </Column>

        <Column lg={5} md={4} sm={4} style={{ marginBottom: "1.5rem" }}>
          <Tile
            style={{
              height: "100%",
              padding: "1.25rem",
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
              {isLoadingProfile ? "—" : (profile?.stats?.pending_explanations ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Awaiting moderator verification
            </div>
          </Tile>
        </Column>

        <Column lg={6} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
          <Tile
            style={{
              height: "100%",
              padding: "1.25rem",
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
              {isLoadingProfile ? "—" : (profile?.stats?.total_votes_received ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Cumulative peer endorsements across authored explanations
            </div>
          </Tile>
        </Column>

        {/* Left Main Area: My Submitted Explanations (GET /api/v1/users/me/explanations) */}
        <Column lg={10} md={8} sm={4} style={{ marginBottom: "2rem" }}>
          <Tile
            style={{
              padding: "1.5rem",
              border: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-01)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1.25rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--cds-border-subtle-01)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  My Submitted Explanations
                </h2>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    fontSize: "0.8125rem",
                    color: "var(--cds-text-secondary)",
                  }}
                >
                  Track moderation status, community votes, and reviewer feedback.
                </p>
              </div>

              <Button
                kind="ghost"
                size="sm"
                renderIcon={Renew}
                onClick={() => {
                  loadProfileData();
                  loadExplanations(selectedStatusFilter);
                }}
              >
                Refresh
              </Button>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <ContentSwitcher
                selectedIndex={statusFilterIndex}
                onChange={(data: { index?: number }) => {
                  if (typeof data.index === "number") {
                    setStatusFilterIndex(data.index);
                  }
                }}
                size="sm"
              >
                <Switch name="all" text="All Submissions" />
                <Switch name="approved" text="Approved" />
                <Switch name="pending" text="Pending" />
                <Switch name="rejected" text="Rejected" />
              </ContentSwitcher>
            </div>

            {isLoadingExplanations ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--cds-text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                Loading your submitted explanations...
              </div>
            ) : explanations.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "var(--cds-layer-02)",
                  border: "1px solid var(--cds-border-subtle-01)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--cds-text-primary)",
                    marginBottom: "0.375rem",
                  }}
                >
                  No explanations found for filter: {selectedStatusFilter}
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--cds-text-secondary)",
                    marginBottom: "1rem",
                  }}
                >
                  Open any examination paper and click &quot;Contribute&quot; to submit a worked
                  solution.
                </p>
                <Button as={Link} href="/papers" kind="primary" size="sm" renderIcon={ArrowRight}>
                  Browse Examination Papers
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {explanations.map((exp) => {
                  const statusUpper = exp.status.toUpperCase();
                  const netVotes = (exp.upvotes || 0) - (exp.downvotes || 0);

                  return (
                    <div
                      key={exp.id}
                      style={{
                        padding: "1.25rem",
                        backgroundColor: "var(--cds-layer-02)",
                        border: "1px solid var(--cds-border-subtle-01)",
                        borderLeftWidth: "3px",
                        borderLeftColor:
                          statusUpper === "APPROVED"
                            ? "var(--cds-support-success, #24a148)"
                            : statusUpper === "REJECTED"
                              ? "var(--cds-support-error, #da1e28)"
                              : "var(--cds-support-warning, #f1c21b)",
                      }}
                    >
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
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {statusUpper === "APPROVED" && (
                            <Tag type="green" size="sm">
                              APPROVED
                            </Tag>
                          )}
                          {statusUpper === "PENDING" && (
                            <Tag type="warm-gray" size="sm">
                              PENDING REVIEW
                            </Tag>
                          )}
                          {statusUpper === "REJECTED" && (
                            <Tag type="red" size="sm">
                              REJECTED
                            </Tag>
                          )}
                          {exp.is_verified && (
                            <Tag type="blue" size="sm">
                              VERIFIED
                            </Tag>
                          )}
                          <Tag type="gray" size="sm">
                            {exp.language_code.toUpperCase()}
                          </Tag>
                        </div>

                        <span style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>
                          Submitted{" "}
                          {new Date(exp.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {statusUpper === "REJECTED" && exp.rejection_reason && (
                        <div
                          style={{
                            padding: "0.75rem 1rem",
                            marginBottom: "0.875rem",
                            backgroundColor: "rgba(218, 30, 40, 0.08)",
                            border: "1px solid var(--cds-support-error, #da1e28)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            fontSize: "0.8125rem",
                            color: "var(--cds-text-primary)",
                          }}
                        >
                          <WarningFilled
                            size={16}
                            style={{
                              color: "var(--cds-support-error, #da1e28)",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <div>
                            <strong style={{ display: "block", marginBottom: "0.125rem" }}>
                              Moderator Feedback:
                            </strong>
                            <span>{exp.rejection_reason}</span>
                          </div>
                        </div>
                      )}

                      <div className="solution-content">
                        <MarkdownRenderer content={exp.content_text} />
                      </div>

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
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontWeight: 700, color: "var(--cds-text-primary)" }}>
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

                        <span>Question Ref: {exp.question_id.slice(0, 8)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Tile>
        </Column>

        {/* Right Column: Account & Security Settings (PATCH /api/v1/users/me) */}
        <Column lg={6} md={8} sm={4} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Update Username Card */}
            <Tile
              style={{
                padding: "1.5rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
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
                <Edit size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Update Username
                </h2>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "1rem",
                }}
              >
                Choose a unique public contributor handle (3–50 characters).
              </p>

              {usernameError && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="error"
                    title="Update Failed"
                    subtitle={usernameError}
                    lowContrast
                    hideCloseButton
                  />
                </div>
              )}

              {usernameSuccess && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="success"
                    title="Saved"
                    subtitle={usernameSuccess}
                    lowContrast
                    onCloseButtonClick={() => setUsernameSuccess(null)}
                  />
                </div>
              )}

              <form
                onSubmit={handleUsernameSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <TextInput
                  id="profile-username-input"
                  labelText="Username"
                  value={newUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUsername(e.target.value)
                  }
                  disabled={isUpdatingUsername}
                  minLength={3}
                  maxLength={50}
                  required
                />

                <Button
                  type="submit"
                  kind="primary"
                  size="sm"
                  disabled={
                    isUpdatingUsername ||
                    !newUsername.trim() ||
                    newUsername.trim() === profile?.username
                  }
                >
                  {isUpdatingUsername ? "Updating..." : "Save Username"}
                </Button>
              </form>
            </Tile>

            {/* Change Password Card */}
            <Tile
              style={{
                padding: "1.5rem",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-01)",
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
                <Security size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Change Password
                </h2>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "1rem",
                }}
              >
                Requires your current password. Minimum 8 characters.
              </p>

              {passwordError && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="error"
                    title="Password Error"
                    subtitle={passwordError}
                    lowContrast
                    hideCloseButton
                  />
                </div>
              )}

              {passwordSuccess && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="success"
                    title="Password Updated"
                    subtitle={passwordSuccess}
                    lowContrast
                    onCloseButtonClick={() => setPasswordSuccess(null)}
                  />
                </div>
              )}

              <form
                onSubmit={handlePasswordSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <PasswordInput
                  id="profile-current-password"
                  labelText="Current Password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentPassword(e.target.value)
                  }
                  disabled={isUpdatingPassword}
                  autoComplete="current-password"
                  required
                />

                <PasswordInput
                  id="profile-new-password"
                  labelText="New Password (8–72 characters)"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                  disabled={isUpdatingPassword}
                  autoComplete="new-password"
                  required
                />

                <Button
                  type="submit"
                  kind="secondary"
                  size="sm"
                  disabled={isUpdatingPassword || !currentPassword || newPassword.length < 8}
                >
                  {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </Tile>
          </div>
        </Column>
      </Grid>
    </main>
  );
}
