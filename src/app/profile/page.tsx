"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  TextArea,
  Modal,
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
  Share,
  Building,
  Location,
  Calendar,
  Certificate,
  Badge,
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

// Helper to format date safely
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

// SVG Activity Heatmap Component (Pure SVG, 26 weeks / ~6 months, 0px sharp rects)
function ActivityHeatmap({ explanations }: { explanations: ExplanationResponse[] }) {
  const { weeks, monthLabels, totalContributions } = useMemo(() => {
    // Map dates to counts
    const countsMap = new Map<string, number>();
    for (const exp of explanations) {
      if (exp.created_at) {
        const d = new Date(exp.created_at).toISOString().split("T")[0];
        countsMap.set(d, (countsMap.get(d) || 0) + 1);
      }
    }

    const today = new Date();
    // 26 weeks = 182 days
    const totalDays = 26 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    const weeksData: { date: string; dateStr: string; count: number; dayOfWeek: number }[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let currentWeek: { date: string; dateStr: string; count: number; dayOfWeek: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const count = countsMap.get(iso) || 0;
      const dayOfWeek = d.getDay(); // 0 is Sun

      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        months.push({
          label: d.toLocaleDateString(undefined, { month: "short" }),
          weekIndex: weeksData.length,
        });
      }

      currentWeek.push({
        date: iso,
        dateStr: d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        count,
        dayOfWeek,
      });

      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return {
      weeks: weeksData,
      monthLabels: months,
      totalContributions: explanations.length,
    };
  }, [explanations]);

  const cellSize = 13;
  const cellGap = 3;
  const leftPadding = 28;
  const topPadding = 20;

  function getColor(count: number): string {
    if (count === 0) return "var(--cds-layer-02, #393939)";
    if (count === 1) return "rgba(15, 98, 254, 0.4)";
    if (count === 2) return "rgba(15, 98, 254, 0.7)";
    return "var(--cds-interactive, #0f62fe)";
  }

  return (
    <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: "var(--cds-text-secondary)" }}>
          <strong style={{ color: "var(--cds-text-primary)" }}>{totalContributions}</strong>{" "}
          contributions recorded across the archive
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.6875rem",
            color: "var(--cds-text-helper)",
          }}
        >
          <span>Less</span>
          <div style={{ width: 10, height: 10, backgroundColor: "var(--cds-layer-02)" }} />
          <div style={{ width: 10, height: 10, backgroundColor: "rgba(15, 98, 254, 0.4)" }} />
          <div style={{ width: 10, height: 10, backgroundColor: "rgba(15, 98, 254, 0.7)" }} />
          <div
            style={{ width: 10, height: 10, backgroundColor: "var(--cds-interactive, #0f62fe)" }}
          />
          <span>More</span>
        </div>
      </div>

      <svg
        width={leftPadding + weeks.length * (cellSize + cellGap)}
        height={topPadding + 7 * (cellSize + cellGap)}
        style={{ display: "block", fontFamily: "var(--op-font-sans)" }}
      >
        {/* Month labels */}
        {monthLabels.map((m, idx) => (
          <text
            key={idx}
            x={leftPadding + m.weekIndex * (cellSize + cellGap)}
            y={12}
            fill="var(--cds-text-helper)"
            fontSize="10"
            fontWeight="500"
          >
            {m.label}
          </text>
        ))}

        {/* Day labels (Mon, Wed, Fri) */}
        <text
          x={0}
          y={topPadding + 1 * (cellSize + cellGap) + 10}
          fill="var(--cds-text-helper)"
          fontSize="9"
        >
          Mon
        </text>
        <text
          x={0}
          y={topPadding + 3 * (cellSize + cellGap) + 10}
          fill="var(--cds-text-helper)"
          fontSize="9"
        >
          Wed
        </text>
        <text
          x={0}
          y={topPadding + 5 * (cellSize + cellGap) + 10}
          fill="var(--cds-text-helper)"
          fontSize="9"
        >
          Fri
        </text>

        {/* Grid cells */}
        {weeks.map((week, wIdx) =>
          week.map((day, dIdx) => (
            <rect
              key={`${wIdx}-${dIdx}`}
              x={leftPadding + wIdx * (cellSize + cellGap)}
              y={topPadding + dIdx * (cellSize + cellGap)}
              width={cellSize}
              height={cellSize}
              fill={getColor(day.count)}
              style={{ transition: "fill 0.15s ease" }}
            >
              <title>{`${day.count} contributions on ${day.dateStr}`}</title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
}

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

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editInstitution, setEditInstitution] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCurrentPassword, setEditCurrentPassword] = useState("");
  const [editNewPassword, setEditNewPassword] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Link copied toast state
  const [copyFeedback, setCopyFeedback] = useState(false);

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
      setEditUsername(data.username);
      setEditInstitution(data.institution || "");
      setEditLocation(data.location || "");
      setEditBio(data.bio || "");
      updateUserState({
        username: data.username,
        email: data.email,
        role: data.role,
        reputation: data.reputation,
        bio: data.bio,
        institution: data.institution,
        location: data.location,
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

  // Handle Edit Profile Save (PATCH /api/v1/users/me)
  const handleSaveProfile = async () => {
    if (!accessToken) return;
    setIsSavingEdit(true);
    setEditError(null);
    setEditSuccess(null);

    const trimmedUsername = editUsername.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      setEditError("Username must be between 3 and 50 characters.");
      setIsSavingEdit(false);
      return;
    }

    if (editNewPassword && (!editCurrentPassword || editNewPassword.length < 8)) {
      setEditError(
        "To change password, provide your current password and a new password with at least 8 characters."
      );
      setIsSavingEdit(false);
      return;
    }

    try {
      const updated = await updateMyProfile(accessToken, {
        username: trimmedUsername !== profile?.username ? trimmedUsername : undefined,
        institution: editInstitution.trim() || undefined,
        location: editLocation.trim() || undefined,
        bio: editBio.trim() || undefined,
        current_password: editCurrentPassword || undefined,
        new_password: editNewPassword || undefined,
      });

      setProfile(updated);
      updateUserState({
        username: updated.username,
        reputation: updated.reputation,
        role: updated.role,
        bio: updated.bio,
        institution: updated.institution,
        location: updated.location,
      });

      setEditCurrentPassword("");
      setEditNewPassword("");
      setEditSuccess("Profile updated successfully.");
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccess(null);
      }, 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setEditError(msg);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Share Profile (Copy public link)
  const handleShareProfile = async () => {
    if (!profile?.id || typeof window === "undefined") return;
    const publicUrl = `${window.location.origin}/users/${profile.id}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Dynamic Badges calculation based on real user achievements
  const rep = profile?.reputation ?? 0;
  const approvedCount = profile?.stats?.approved_explanations ?? 0;
  const hasBronze = rep >= 0; // All active contributors start with bronze
  const hasSilver = rep >= 25 || approvedCount >= 5;
  const hasGold = rep >= 100 || approvedCount >= 15;

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
            <Tile
              style={{
                padding: "2rem",
                border: "1px solid var(--cds-border-subtle-01)",
                borderRadius: 0,
              }}
            >
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
        {/* ============================================================ */}
        {/* HEADER BANNER: User identity, Avatar, Bio, and Action Strip   */}
        {/* ============================================================ */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: "1.5rem" }}>
          {loadError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                title="Profile Load Notice"
                subtitle={loadError}
                lowContrast
                hideCloseButton
                style={{ borderRadius: 0 }}
              />
            </div>
          )}

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
                {/* Academic Avatar */}
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
                  {getInitials(profile?.username)}
                </div>

                <div style={{ flex: 1 }}>
                  {/* Name, Tag, Handle */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      flexWrap: "wrap",
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
                      {profile?.username || "Contributor"}
                    </h1>
                    <Tag type="blue" size="sm" style={{ borderRadius: 0, fontWeight: 600 }}>
                      {(profile?.role || "USER").toUpperCase()}
                    </Tag>
                    {hasGold && (
                      <Tag type="magenta" size="sm" style={{ borderRadius: 0 }}>
                        ★ SENIOR SCHOLAR
                      </Tag>
                    )}
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
                    {profile?.institution ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                      >
                        <Building size={14} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                        <span>{profile.institution}</span>
                      </span>
                    ) : (
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                      >
                        <Building size={14} style={{ color: "var(--cds-text-helper)" }} />
                        <span style={{ color: "var(--cds-text-helper)" }}>
                          Academic Contributor
                        </span>
                      </span>
                    )}

                    {profile?.location && (
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                      >
                        <Location size={14} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                        <span>{profile.location}</span>
                      </span>
                    )}

                    {profile?.created_at && (
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                      >
                        <Calendar size={14} style={{ color: "var(--cds-text-helper)" }} />
                        <span>Joined {formatDate(profile.created_at)}</span>
                      </span>
                    )}
                  </div>

                  {/* Bio snippet in Plex Serif */}
                  {profile?.bio ? (
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
                  ) : (
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--cds-text-helper)",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      No academic biography provided yet. Click &ldquo;Edit Profile&rdquo; to add
                      your focus areas.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <Button
                  kind="secondary"
                  size="md"
                  renderIcon={Edit}
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ borderRadius: 0 }}
                >
                  Edit Profile
                </Button>

                <Button
                  kind="ghost"
                  size="md"
                  renderIcon={copyFeedback ? CheckmarkFilled : Share}
                  onClick={handleShareProfile}
                  style={{ borderRadius: 0 }}
                >
                  {copyFeedback ? "Link Copied!" : "Share Profile"}
                </Button>

                {isModeratorOrAdmin && (
                  <Button
                    as={Link}
                    href="/moderation"
                    kind="primary"
                    size="md"
                    renderIcon={ArrowRight}
                    style={{ borderRadius: 0 }}
                  >
                    Moderation Queue
                  </Button>
                )}
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
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
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

                {/* Bronze Badge */}
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

                {/* Silver Badge */}
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

                {/* Gold Badge */}
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

              {profile?.id && (
                <Link
                  href={`/users/${profile.id}`}
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--cds-link-primary, #0f62fe)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  View Public Profile →
                </Link>
              )}
            </div>
          </Tile>
        </Column>

        {/* ============================================================ */}
        {/* 4 METRIC TILES: Verified Solutions, Upvotes, Pending, Rep    */}
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
                Verified Solutions
              </span>
              <CheckmarkFilled size={18} style={{ color: "var(--cds-support-success, #24a148)" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>
              {isLoadingProfile ? "—" : (profile?.stats?.approved_explanations ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Peer-reviewed solutions active in archive
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
                Upvotes Received
              </span>
              <ThumbsUp size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>
              {isLoadingProfile ? "—" : (profile?.stats?.total_votes_received ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Community endorsements on explanations
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
                Under Review
              </span>
              <Pending size={18} style={{ color: "var(--cds-support-warning, #b28600)" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>
              {isLoadingProfile ? "—" : (profile?.stats?.pending_explanations ?? 0)}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Awaiting moderator inspection
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
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>
              {isLoadingProfile ? "—" : (profile?.reputation ?? 0)} ★
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--cds-text-helper)", marginTop: "0.25rem" }}
            >
              Cumulative community standing score
            </div>
          </Tile>
        </Column>

        {/* ============================================================ */}
        {/* CONTRIBUTION ACTIVITY HEATMAP (6 Months / 26 Weeks)          */}
        {/* ============================================================ */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: "2rem" }}>
          <Tile
            style={{
              padding: "1.5rem 1.75rem",
              border: "1px solid var(--cds-border-subtle-01)",
              backgroundColor: "var(--cds-layer-01)",
              borderRadius: 0,
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--cds-text-primary)",
                  margin: 0,
                  fontFamily: "var(--op-font-sans)",
                }}
              >
                Contribution Activity (Past 6 Months)
              </h2>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                }}
              >
                Frequency of verified explanations and annotations submitted to the OpenPapers
                archive.
              </p>
            </div>

            <ActivityHeatmap explanations={explanations} />
          </Tile>
        </Column>

        {/* ============================================================ */}
        {/* MAIN SECTION: Solutions List (Left) + Academic Standing (Right) */}
        {/* ============================================================ */}
        <Column lg={11} md={8} sm={4} style={{ marginBottom: "2rem" }}>
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
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--cds-text-primary)",
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Authored Explanations & Solutions
                </h2>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    fontSize: "0.8125rem",
                    color: "var(--cds-text-secondary)",
                  }}
                >
                  Filter by review status to check community endorsements and reviewer notes.
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
                style={{ borderRadius: 0 }}
              >
                Refresh
              </Button>
            </div>

            {/* Filter ContentSwitcher */}
            <div style={{ marginBottom: "1.5rem" }}>
              <ContentSwitcher
                selectedIndex={statusFilterIndex}
                onChange={(data: { index?: number }) => {
                  if (typeof data.index === "number") {
                    setStatusFilterIndex(data.index);
                  }
                }}
                size="sm"
              >
                <Switch name="all" text="All Submissions" style={{ borderRadius: 0 }} />
                <Switch name="approved" text="Approved" style={{ borderRadius: 0 }} />
                <Switch name="pending" text="Pending" style={{ borderRadius: 0 }} />
                <Switch name="rejected" text="Rejected" style={{ borderRadius: 0 }} />
              </ContentSwitcher>
            </div>

            {/* Solutions List */}
            {isLoadingExplanations ? (
              <div
                style={{
                  padding: "2.5rem",
                  textAlign: "center",
                  color: "var(--cds-text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                Loading submitted solutions...
              </div>
            ) : explanations.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem",
                  backgroundColor: "var(--cds-layer-02)",
                  border: "1px solid var(--cds-border-subtle-01)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--cds-text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  No explanations found for &ldquo;{selectedStatusFilter}&rdquo;
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--cds-text-secondary)",
                    marginBottom: "1.25rem",
                    maxWidth: "480px",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  Browse exam questions in the archive and contribute step-by-step solutions to
                  build your reputation.
                </p>
                <Button
                  as={Link}
                  href="/papers"
                  kind="primary"
                  size="sm"
                  renderIcon={ArrowRight}
                  style={{ borderRadius: 0 }}
                >
                  Explore Past Papers
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                        borderLeftWidth: "4px",
                        borderLeftColor:
                          statusUpper === "APPROVED"
                            ? "var(--cds-support-success, #24a148)"
                            : statusUpper === "REJECTED"
                              ? "var(--cds-support-error, #da1e28)"
                              : "var(--cds-support-warning, #f1c21b)",
                      }}
                    >
                      {/* Card Header: Badges & Timestamp */}
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {statusUpper === "APPROVED" && (
                            <Tag type="green" size="sm" style={{ borderRadius: 0 }}>
                              APPROVED
                            </Tag>
                          )}
                          {statusUpper === "PENDING" && (
                            <Tag type="warm-gray" size="sm" style={{ borderRadius: 0 }}>
                              PENDING REVIEW
                            </Tag>
                          )}
                          {statusUpper === "REJECTED" && (
                            <Tag type="red" size="sm" style={{ borderRadius: 0 }}>
                              REJECTED
                            </Tag>
                          )}
                          {exp.is_verified && (
                            <Tag type="blue" size="sm" style={{ borderRadius: 0 }}>
                              VERIFIED SOLUTION
                            </Tag>
                          )}
                          <Tag type="gray" size="sm" style={{ borderRadius: 0 }}>
                            {exp.language_code.toUpperCase()}
                          </Tag>
                        </div>

                        <span style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>
                          Submitted {formatDate(exp.created_at)}
                        </span>
                      </div>

                      {/* Rejection Feedback Banner */}
                      {statusUpper === "REJECTED" && exp.rejection_reason && (
                        <div
                          style={{
                            padding: "0.75rem 1rem",
                            marginBottom: "1rem",
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
                              Moderator Revision Notes:
                            </strong>
                            <span>{exp.rejection_reason}</span>
                          </div>
                        </div>
                      )}

                      {/* Solution Body in Plex Serif via MarkdownRenderer */}
                      <div
                        className="solution-content"
                        style={{ fontFamily: "var(--op-font-serif)", lineHeight: 1.65 }}
                      >
                        <MarkdownRenderer content={exp.content_text} />
                      </div>

                      {/* Card Footer: Net Votes and Question Identifier */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          marginTop: "1rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid var(--cds-border-subtle-01)",
                          fontSize: "0.75rem",
                          color: "var(--cds-text-secondary)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ fontWeight: 700, color: "var(--cds-text-primary)" }}>
                            {netVotes >= 0 ? `+${netVotes}` : netVotes} Net Votes
                          </span>
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                          >
                            <ThumbsUp size={14} />
                            <span>{exp.upvotes}</span>
                          </span>
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                          >
                            <ThumbsDown size={14} />
                            <span>{exp.downvotes}</span>
                          </span>
                        </div>

                        <span>Question UUID: {exp.question_id.slice(0, 13)}...</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Tile>
        </Column>

        {/* ============================================================ */}
        {/* SIDEBAR: Standing & Subject Expertise                        */}
        {/* ============================================================ */}
        <Column lg={5} md={8} sm={4} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Academic Standing Tile */}
            <Tile
              style={{
                padding: "1.5rem",
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
                  marginBottom: "0.75rem",
                }}
              >
                <Certificate size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Academic Standing
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                }}
              >
                Standing progresses based on peer approval, upvotes, and verified accuracy of
                submitted explanations.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Scholar Progress</span>
                    <span style={{ color: "var(--cds-text-secondary)" }}>
                      {Math.min(rep, 100)} / 100 ★
                    </span>
                  </div>
                  <div
                    style={{ width: "100%", height: "6px", backgroundColor: "var(--cds-layer-02)" }}
                  >
                    <div
                      style={{
                        width: `${Math.min(rep, 100)}%`,
                        height: "100%",
                        backgroundColor: "var(--cds-interactive, #0f62fe)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "var(--cds-layer-02)",
                    fontSize: "0.75rem",
                    color: "var(--cds-text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Next Tier Perk:</strong> Reach 100 reputation points to earn Senior
                  Scholar privileges and fast-track review status.
                </div>
              </div>
            </Tile>

            {/* Quick Account Security Summary */}
            <Tile
              style={{
                padding: "1.5rem",
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
                  marginBottom: "0.75rem",
                }}
              >
                <Security size={18} style={{ color: "var(--cds-interactive, #0f62fe)" }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Account Security
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--cds-text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                }}
              >
                Your account is protected with Argon2id cryptographic hashing and stateless JWT
                bearer authentication.
              </p>
              <Button
                kind="tertiary"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                style={{ width: "100%", borderRadius: 0 }}
              >
                Manage Credentials
              </Button>
            </Tile>
          </div>
        </Column>
      </Grid>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL (Carbon Modal: 0px sharp edges)           */}
      {/* ============================================================ */}
      <Modal
        open={isEditModalOpen}
        modalHeading="Edit Contributor Profile"
        primaryButtonText={isSavingEdit ? "Saving..." : "Save Changes"}
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSaveProfile}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          setEditError(null);
          setEditSuccess(null);
        }}
        onSecondarySubmit={() => {
          setIsEditModalOpen(false);
          setEditError(null);
          setEditSuccess(null);
        }}
        primaryButtonDisabled={isSavingEdit}
        style={{ borderRadius: 0 }}
      >
        <div
          style={{
            padding: "0.5rem 0 1rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {editError && (
            <InlineNotification
              kind="error"
              title="Save Error"
              subtitle={editError}
              lowContrast
              hideCloseButton
              style={{ borderRadius: 0 }}
            />
          )}

          {editSuccess && (
            <InlineNotification
              kind="success"
              title="Saved"
              subtitle={editSuccess}
              lowContrast
              hideCloseButton
              style={{ borderRadius: 0 }}
            />
          )}

          <TextInput
            id="edit-username-input"
            labelText="Contributor Handle / Username"
            value={editUsername}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUsername(e.target.value)}
            disabled={isSavingEdit}
            minLength={3}
            maxLength={50}
            required
            helperText="3 to 50 characters. Used for solution attribution."
            style={{ borderRadius: 0 }}
          />

          <TextInput
            id="edit-institution-input"
            labelText="Academic Institution / School / University"
            placeholder="e.g. Royal College Colombo, University of Cambridge"
            value={editInstitution}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditInstitution(e.target.value)
            }
            disabled={isSavingEdit}
            style={{ borderRadius: 0 }}
          />

          <TextInput
            id="edit-location-input"
            labelText="Location / Country"
            placeholder="e.g. Colombo, Sri Lanka or London, UK"
            value={editLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLocation(e.target.value)}
            disabled={isSavingEdit}
            style={{ borderRadius: 0 }}
          />

          <TextArea
            id="edit-bio-input"
            labelText="Academic Biography"
            placeholder="Describe your academic focus areas, teaching experience, or interests..."
            rows={3}
            value={editBio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditBio(e.target.value)}
            disabled={isSavingEdit}
            style={{ borderRadius: 0 }}
          />

          {/* Optional Password Update Subsection */}
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--cds-border-subtle-01)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <span
              style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--cds-text-primary)" }}
            >
              Change Password (Optional)
            </span>

            <PasswordInput
              id="edit-current-pw"
              labelText="Current Password"
              placeholder="Leave blank if not changing"
              value={editCurrentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditCurrentPassword(e.target.value)
              }
              disabled={isSavingEdit}
              autoComplete="current-password"
              style={{ borderRadius: 0 }}
            />

            <PasswordInput
              id="edit-new-pw"
              labelText="New Password"
              placeholder="Minimum 8 characters"
              value={editNewPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditNewPassword(e.target.value)
              }
              disabled={isSavingEdit}
              autoComplete="new-password"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>
      </Modal>
    </main>
  );
}
