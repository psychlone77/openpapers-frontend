"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCarbonTheme } from "@/contexts/CarbonThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems,
  Moon,
  Sun,
  LogoGithub,
  Login,
  Logout,
} from "./carbon";

function getInitials(username?: string): string {
  if (!username) return "OP";
  const parts = username.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { isDarkMode, toggleTheme } = useCarbonTheme();
  const { user, isAuthenticated, isModeratorOrAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    { name: "Papers", path: "/papers" },
    { name: "Guide", path: "/guide" },
    { name: "About Us", path: "/about" },
    ...(isModeratorOrAdmin ? [{ name: "Moderation", path: "/moderation" }] : []),
  ];

  const isRouteActive = (routePath: string) => {
    if (routePath === "/") {
      return pathname === "/";
    }
    return pathname === routePath || pathname.startsWith(`${routePath}/`);
  };

  const loginHref =
    pathname && pathname !== "/login"
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : "/login";

  return (
    <>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="OpenPapers Platform">
            <SkipToContent href="#main-content" />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
              aria-expanded={isSideNavExpanded}
            />
            <HeaderName as={Link} href="/" prefix="">
              <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>OpenPapers</span>
            </HeaderName>

            <HeaderNavigation aria-label="Main Navigation">
              {routes.map((route) => (
                <HeaderMenuItem
                  key={route.path}
                  as={Link}
                  href={route.path}
                  isActive={isRouteActive(route.path)}
                >
                  {route.name}
                </HeaderMenuItem>
              ))}
            </HeaderNavigation>

            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                tooltipAlignment="end"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Contribute on GitHub"
                tooltipAlignment="end"
                onClick={() => {
                  window.open(
                    "https://github.com/psychlone77/openpapers-data-collecting",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <LogoGithub size={20} />
              </HeaderGlobalAction>

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      height: "48px",
                      padding: "0 0.75rem",
                      textDecoration: "none",
                      borderLeft: "1px solid var(--cds-border-subtle-01)",
                      backgroundColor: isRouteActive("/profile")
                        ? "var(--cds-layer-selected-01)"
                        : "transparent",
                      color: "var(--cds-text-primary)",
                      fontFamily: "var(--op-font-sans)",
                    }}
                    title="View Contributor Profile"
                  >
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        backgroundColor: "var(--cds-interactive, #0f62fe)",
                        color: "var(--cds-text-on-color, #ffffff)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "var(--op-font-sans)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.username)}
                    </span>
                    <span
                      className="hidden sm:inline"
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--cds-text-primary)",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.username}
                    </span>
                    <span
                      style={{
                        padding: "0.125rem 0.375rem",
                        backgroundColor: "rgba(15, 98, 254, 0.15)",
                        border: "1px solid var(--cds-interactive, #0f62fe)",
                        color: "var(--cds-link-primary, #78a9ff)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        fontFamily: "var(--op-font-sans)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.reputation} ★
                    </span>
                  </Link>
                  <HeaderGlobalAction
                    aria-label="Sign out"
                    tooltipAlignment="end"
                    onClick={() => {
                      logout();
                      if (pathname === "/profile" || pathname === "/moderation") {
                        router.push("/");
                      }
                    }}
                  >
                    <Logout size={20} />
                  </HeaderGlobalAction>
                </>
              ) : (
                <Link
                  href={loginHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    height: "48px",
                    padding: "0 1rem",
                    backgroundColor: "var(--cds-interactive, #0f62fe)",
                    color: "var(--cds-text-on-color, #ffffff)",
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    fontFamily: "var(--op-font-sans)",
                  }}
                >
                  <Login size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </HeaderGlobalBar>

            <SideNav
              aria-label="Mobile Navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
              onSideNavBlur={onClickSideNavExpand}
            >
              <SideNavItems>
                <HeaderSideNavItems>
                  {routes.map((route) => (
                    <HeaderMenuItem
                      key={route.path}
                      as={Link}
                      href={route.path}
                      isActive={isRouteActive(route.path)}
                      onClick={onClickSideNavExpand}
                    >
                      {route.name}
                    </HeaderMenuItem>
                  ))}
                  {isAuthenticated && user ? (
                    <>
                      <HeaderMenuItem
                        as={Link}
                        href="/profile"
                        isActive={isRouteActive("/profile")}
                        onClick={onClickSideNavExpand}
                      >
                        My Profile ({user.username} • {user.reputation} ★)
                      </HeaderMenuItem>
                      <HeaderMenuItem
                        as="button"
                        onClick={() => {
                          logout();
                          onClickSideNavExpand();
                        }}
                      >
                        Sign Out
                      </HeaderMenuItem>
                    </>
                  ) : (
                    <HeaderMenuItem
                      as={Link}
                      href={loginHref}
                      isActive={isRouteActive("/login")}
                      onClick={onClickSideNavExpand}
                    >
                      Sign In
                    </HeaderMenuItem>
                  )}
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          </Header>
        )}
      />
      <div style={{ height: "48px" }} />
    </>
  );
}

export default Navbar;
