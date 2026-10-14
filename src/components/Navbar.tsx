"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCarbonTheme } from "@/contexts/CarbonThemeProvider";
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
} from "./carbon";

export function Navbar() {
  const { isDarkMode, toggleTheme } = useCarbonTheme();
  const pathname = usePathname();

  const routes = [
    { name: "Papers", path: "/papers" },
    { name: "Guide", path: "/guide" },
    { name: "About Us", path: "/about" },
  ];

  const isRouteActive = (routePath: string) => {
    if (routePath === "/") {
      return pathname === "/";
    }
    return pathname === routePath || pathname.startsWith(`${routePath}/`);
  };

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
