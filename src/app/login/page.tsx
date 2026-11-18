"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { updateMyProfile } from "@/lib/api/users";
import {
  Tile,
  TextInput,
  PasswordInput,
  TextArea,
  Button,
  InlineNotification,
  Tag,
  Modal,
  ArrowRight,
  Information,
} from "@/components/carbon";

function sanitizeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return "/profile";
  const trimmed = rawRedirect.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/login")) {
    return trimmed;
  }
  return "/profile";
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    login,
    register,
    updateUserState,
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const redirectTarget = sanitizeRedirect(searchParams.get("redirect"));

  // Active Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login credentials
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register credentials
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Onboarding Step 2 Modal state (institution, location, bio)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [onboardInstitution, setOnboardInstitution] = useState("");
  const [onboardLocation, setOnboardLocation] = useState("");
  const [onboardBio, setOnboardBio] = useState("");
  const [isOnboardingSaving, setIsOnboardingSaving] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Google SSO Notice
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);

  // Status & Error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If authenticated and not currently filling out the optional onboarding modal, redirect
    if (!authLoading && isAuthenticated && !isProfileModalOpen) {
      router.replace(redirectTarget);
    }
  }, [authLoading, isAuthenticated, redirectTarget, router, isProfileModalOpen]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedIdentifier = loginIdentifier.trim();
    if (!trimmedIdentifier || !loginPassword) {
      setErrorMsg("Please enter both your username/email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        identifier: trimmedIdentifier,
        password: loginPassword,
      });
      router.push(redirectTarget);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your credentials.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register submission (Step 1)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUsername = regUsername.trim();
    const trimmedEmail = regEmail.trim();

    if (!trimmedUsername || !trimmedEmail || !regPassword) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (trimmedUsername.length < 3) {
      setErrorMsg("Username must be at least 3 characters long.");
      return;
    }

    if (regPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: trimmedUsername,
        email: trimmedEmail,
        password: regPassword,
      });
      // Registration successful: open Step 2 optional onboarding modal
      setIsProfileModalOpen(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Username or email may already be registered.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 2 Onboarding Save
  const handleSaveOnboardingProfile = async () => {
    setIsOnboardingSaving(true);
    try {
      const token =
        accessToken ||
        (typeof window !== "undefined" ? localStorage.getItem("op_access_token") : null);
      if (token && (onboardInstitution.trim() || onboardLocation.trim() || onboardBio.trim())) {
        const updated = await updateMyProfile(token, {
          institution: onboardInstitution.trim() || undefined,
          location: onboardLocation.trim() || undefined,
          bio: onboardBio.trim() || undefined,
        });
        updateUserState({
          institution: updated.institution,
          location: updated.location,
          bio: updated.bio,
        });
      }
    } catch {
      // Non-blocking: profile update can be completed later
    } finally {
      setIsOnboardingSaving(false);
      setIsProfileModalOpen(false);
      router.push(redirectTarget);
    }
  };

  // Handle Step 2 Onboarding Skip
  const handleSkipOnboardingProfile = () => {
    setIsProfileModalOpen(false);
    router.push(redirectTarget);
  };

  return (
    <main
      id="main-content"
      style={{
        minHeight: "calc(100vh - 48px)",
        backgroundColor: "var(--cds-background)",
        color: "var(--cds-text-primary)",
        fontFamily: "var(--op-font-sans)",
        padding: "2.5rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <Tile
          style={{
            borderRadius: 0,
            backgroundColor: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            padding: "2.25rem 2rem",
          }}
        >
          {/* Card Brand Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--cds-text-primary)",
                margin: 0,
                fontFamily: "var(--op-font-sans)",
              }}
            >
              OpenPapers
            </h1>
          </div>

          {/* Tab Switcher: Sign In / Create Account */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "2px solid var(--cds-border-subtle-01)",
              marginBottom: "1.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
              }}
              style={{
                padding: "0.625rem 1rem",
                fontSize: "0.875rem",
                fontWeight: activeTab === "login" ? 700 : 500,
                color:
                  activeTab === "login" ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
                backgroundColor: activeTab === "login" ? "var(--cds-layer-02)" : "transparent",
                border: "none",
                borderBottom:
                  activeTab === "login"
                    ? "2px solid var(--cds-interactive, #0f62fe)"
                    : "2px solid transparent",
                cursor: "pointer",
                borderRadius: 0,
                fontFamily: "var(--op-font-sans)",
                textAlign: "center",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
              }}
              style={{
                padding: "0.625rem 1rem",
                fontSize: "0.875rem",
                fontWeight: activeTab === "register" ? 700 : 500,
                color:
                  activeTab === "register"
                    ? "var(--cds-text-primary)"
                    : "var(--cds-text-secondary)",
                backgroundColor: activeTab === "register" ? "var(--cds-layer-02)" : "transparent",
                border: "none",
                borderBottom:
                  activeTab === "register"
                    ? "2px solid var(--cds-interactive, #0f62fe)"
                    : "2px solid transparent",
                cursor: "pointer",
                borderRadius: 0,
                fontFamily: "var(--op-font-sans)",
                textAlign: "center",
              }}
            >
              Create Account
            </button>
          </div>

          {/* Google SSO Button */}
          <div style={{ marginBottom: "1.25rem" }}>
            <button
              type="button"
              onClick={() => setShowGoogleNotice(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                padding: "0.6875rem 1rem",
                backgroundColor: "var(--cds-layer-02)",
                border: "1px solid var(--cds-border-subtle-01)",
                borderRadius: 0,
                cursor: "pointer",
                color: "var(--cds-text-primary)",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: "var(--op-font-sans)",
              }}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
              <Tag type="purple" size="sm" style={{ borderRadius: 0, margin: 0 }}>
                Coming Soon
              </Tag>
            </button>

            {showGoogleNotice && (
              <div style={{ marginTop: "0.75rem" }}>
                <InlineNotification
                  kind="info"
                  title="Google Sign-In"
                  subtitle="Google authentication is in development. Please sign in with your email and password."
                  onCloseButtonClick={() => setShowGoogleNotice(false)}
                  lowContrast
                  style={{ borderRadius: 0 }}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.25rem 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "var(--cds-border-subtle-01)" }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--cds-text-helper)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              or
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "var(--cds-border-subtle-01)" }}
            />
          </div>

          {/* Error Notification */}
          {errorMsg && (
            <div style={{ marginBottom: "1.25rem" }}>
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={errorMsg}
                lowContrast
                hideCloseButton
                style={{ borderRadius: 0 }}
              />
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === "login" && (
            <form
              onSubmit={handleLoginSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextInput
                id="login-identifier"
                labelText="Username or Email Address"
                placeholder="e.g. contributor or student@openpapers.org"
                value={loginIdentifier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLoginIdentifier(e.target.value)
                }
                disabled={isSubmitting}
                autoComplete="username"
                required
                style={{ borderRadius: 0 }}
              />

              <PasswordInput
                id="login-password"
                labelText="Password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLoginPassword(e.target.value)
                }
                disabled={isSubmitting}
                autoComplete="current-password"
                required
                style={{ borderRadius: 0 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.25rem" }}>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--cds-link-primary, #0f62fe)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <Button
                  type="submit"
                  kind="primary"
                  renderIcon={ArrowRight}
                  disabled={isSubmitting}
                  style={{ width: "100%", maxWidth: "none", borderRadius: 0 }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT FORM */}
          {activeTab === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextInput
                id="register-username"
                labelText="Username"
                placeholder="e.g. contributor123"
                helperText="Minimum 3 characters"
                value={regUsername}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegUsername(e.target.value)
                }
                disabled={isSubmitting}
                autoComplete="username"
                required
                style={{ borderRadius: 0 }}
              />

              <TextInput
                id="register-email"
                labelText="Email Address"
                type="email"
                placeholder="e.g. student@openpapers.org"
                value={regEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                required
                style={{ borderRadius: 0 }}
              />

              <PasswordInput
                id="register-password"
                labelText="Password"
                placeholder="Minimum 8 characters"
                value={regPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegPassword(e.target.value)
                }
                disabled={isSubmitting}
                autoComplete="new-password"
                required
                style={{ borderRadius: 0 }}
              />

              <PasswordInput
                id="register-confirm-password"
                labelText="Confirm Password"
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegConfirmPassword(e.target.value)
                }
                disabled={isSubmitting}
                autoComplete="new-password"
                required
                style={{ borderRadius: 0 }}
              />

              <div style={{ marginTop: "0.5rem" }}>
                <Button
                  type="submit"
                  kind="primary"
                  renderIcon={ArrowRight}
                  disabled={isSubmitting}
                  style={{ width: "100%", maxWidth: "none", borderRadius: 0 }}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          {/* Terms of Service & Privacy Policy */}
          <div
            style={{
              marginTop: "1.75rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--cds-border-subtle-01)",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--cds-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            By continuing, you agree to OpenPapers{" "}
            <Link
              href="/about"
              style={{ color: "var(--cds-link-primary, #0f62fe)", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/guide"
              style={{ color: "var(--cds-link-primary, #0f62fe)", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            .
          </div>
        </Tile>
      </div>

      {/* ============================================================ */}
      {/* STEP 2 MODAL: Optional Academic Profile Completion           */}
      {/* ============================================================ */}
      <Modal
        open={isProfileModalOpen}
        modalHeading="Complete Your Profile (Optional)"
        primaryButtonText={isOnboardingSaving ? "Saving..." : "Save & Continue"}
        secondaryButtonText="Skip for now"
        onRequestSubmit={handleSaveOnboardingProfile}
        onRequestClose={handleSkipOnboardingProfile}
        onSecondarySubmit={handleSkipOnboardingProfile}
        primaryButtonDisabled={isOnboardingSaving}
        preventCloseOnClickOutside
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
          <p style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)", lineHeight: 1.5 }}>
            You can optionally add your institution, location, and bio so peers can recognize your
            contributions. You can skip this step and edit it anytime in your profile.
          </p>

          <TextInput
            id="onboarding-institution"
            labelText="Institution / School / University"
            placeholder="e.g. Royal College Colombo, University of Cambridge"
            value={onboardInstitution}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOnboardInstitution(e.target.value)
            }
            disabled={isOnboardingSaving}
            style={{ borderRadius: 0 }}
          />

          <TextInput
            id="onboarding-location"
            labelText="Location / Country"
            placeholder="e.g. Colombo, Sri Lanka or London, UK"
            value={onboardLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOnboardLocation(e.target.value)
            }
            disabled={isOnboardingSaving}
            style={{ borderRadius: 0 }}
          />

          <TextArea
            id="onboarding-bio"
            labelText="Bio"
            placeholder="Tell other students and educators about your academic background..."
            rows={3}
            value={onboardBio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOnboardBio(e.target.value)}
            disabled={isOnboardingSaving}
            style={{ borderRadius: 0 }}
          />
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* FORGOT PASSWORD ASSISTANCE MODAL                             */}
      {/* ============================================================ */}
      <Modal
        open={isForgotModalOpen}
        modalHeading="Password Reset Assistance"
        passiveModal
        onRequestClose={() => setIsForgotModalOpen(false)}
        style={{ borderRadius: 0 }}
      >
        <div
          style={{
            padding: "0.5rem 0 1.5rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <Information
              size={24}
              style={{
                color: "var(--cds-interactive, #0f62fe)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--cds-text-primary)",
                  lineHeight: 1.5,
                  marginBottom: "0.75rem",
                }}
              >
                Self-service password recovery is currently in development. To reset your password,
                please contact an archive administrator:
              </p>
              <div
                style={{
                  padding: "0.875rem 1rem",
                  backgroundColor: "var(--cds-layer-02)",
                  border: "1px solid var(--cds-border-subtle-01)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Email:{" "}
                <a
                  href="mailto:support@openpapers.org?subject=Password%20Reset%20Request"
                  style={{
                    color: "var(--cds-link-primary, #0f62fe)",
                    textDecoration: "underline",
                  }}
                >
                  support@openpapers.org
                </a>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button
              kind="primary"
              onClick={() => setIsForgotModalOpen(false)}
              style={{ borderRadius: 0 }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "calc(100vh - 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--cds-background)",
            color: "var(--cds-text-secondary)",
            fontFamily: "var(--op-font-sans)",
          }}
        >
          Loading...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
