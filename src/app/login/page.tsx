"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tile,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Tag,
  ArrowRight,
  CheckmarkFilled,
} from "@/components/carbon";

function sanitizeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return "/profile";
  const trimmed = rawRedirect.trim();
  // Ensure internal relative path only to prevent open-redirect vulnerabilities
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/login")) {
    return trimmed;
  }
  return "/profile";
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const redirectTarget = sanitizeRedirect(searchParams.get("redirect"));

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [authLoading, isAuthenticated, redirectTarget, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password) {
      setErrorMsg("Please enter both your username/email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        identifier: trimmedIdentifier,
        password,
      });
      router.push(redirectTarget);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check your credentials.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      id="main-content"
      style={{
        minHeight: "calc(100vh - 48px)",
        backgroundColor: "var(--cds-background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "var(--op-font-sans)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <Tile
          style={{
            padding: "2rem",
            border: "1px solid var(--cds-border-subtle-01)",
            backgroundColor: "var(--cds-layer-01)",
          }}
        >
          {/* Top Tag & Header */}
          <div style={{ marginBottom: "1rem" }}>
            <Tag type="blue" size="sm">
              CONTRIBUTOR PORTAL
            </Tag>
          </div>

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--cds-text-primary)",
              marginBottom: "0.5rem",
              letterSpacing: "-0.01em",
              fontFamily: "var(--op-font-sans)",
            }}
          >
            Sign in to OpenPapers
          </h1>

          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--cds-text-secondary)",
              marginBottom: "1.5rem",
              lineHeight: 1.5,
            }}
          >
            Sign in to submit worked explanations, track your community reputation, and review
            examination solutions.
          </p>

          {errorMsg && (
            <div style={{ marginBottom: "1.25rem" }}>
              <InlineNotification
                kind="error"
                title="Authentication Error"
                subtitle={errorMsg}
                lowContrast
                hideCloseButton
              />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <TextInput
              id="login-identifier"
              labelText="Username or Email Address"
              placeholder="e.g. contributor@openpapers.org"
              value={identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
              disabled={isSubmitting}
              autoComplete="username"
              required
            />

            <PasswordInput
              id="login-password"
              labelText="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />

            <div style={{ marginTop: "0.5rem" }}>
              <Button
                type="submit"
                kind="primary"
                renderIcon={ArrowRight}
                disabled={isSubmitting}
                style={{ width: "100%", maxWidth: "none" }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* Benefits / Community Note */}
          <div
            style={{
              marginTop: "1.75rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--cds-border-subtle-01)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--cds-text-secondary)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <CheckmarkFilled size={14} style={{ color: "var(--cds-support-success, #24a148)" }} />
              <span>Earn reputation points when moderators approve your explanations.</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0.25rem",
              }}
            >
              <span>Browsing past papers does not require an account.</span>
              <Link
                href="/papers"
                style={{
                  color: "var(--cds-link-primary, #0f62fe)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Browse Archive →
              </Link>
            </div>
          </div>
        </Tile>
      </div>
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
          Loading authentication portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
