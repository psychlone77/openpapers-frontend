"use client";

import { HamburgerMenuIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { NavigationMenu } from "radix-ui";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const routes = [
  { name: "Home", path: "/" },
  { name: "Papers", path: "/papers" },
  { name: "Guide", path: "/guide" },
  { name: "About Us", path: "/about" },
];

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme ? savedTheme === "dark" : systemPrefersDark;

    setIsDarkMode(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const checkPathname = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.includes(path);
  };

  return (
    <header className="fixed top-0 w-screen shadow-sm font-sans bg-transparent backdrop-blur-xl">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-primary font-bold text-xl">OpenPapers</span>
            </Link>
          </div>
          <NavigationMenu.Root className="hidden md:flex m-auto space-x-8">
            <NavigationMenu.List className="flex space-x-8">
              {routes.map((route) => (
                <NavigationMenu.Item key={route.name}>
                  <Link
                    href={route.path}
                    className={`${
                      checkPathname(route.path)
                        ? "border-accent"
                        : "border-transparent hover:border-accent-light hover:text-accent"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {route.name}
                  </Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer bg-background hover:bg-background-light"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>
            <div className="flex-shrink-0 hidden md:flex">
              <Link
                href="https://github.com/psychlone77/openpapers-data-collecting"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
              >
                Contribute
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <NavigationMenu.Root>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger className="inline-flex items-center justify-center p-2 rounded-md hover hover:bg-background-light">
                    <span className="sr-only">Open main menu</span>
                    <HamburgerMenuIcon />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="z-10 absolute right-0 bg-background-light shadow-md rounded-md mt-2">
                    <NavigationMenu.List className="w-64 px-2 pt-2 pb-3 space-y-1">
                      {routes.map((route) => (
                        <NavigationMenu.Item key={route.name}>
                          <Link
                            href={route.path}
                            className={`${
                              checkPathname(route.path)
                                ? "bg-primary-light border-accent"
                                : "border-transparent hover:bg-gray-50 hover:border-accent-light hover:text-accent"
                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                          >
                            {route.name}
                          </Link>
                        </NavigationMenu.Item>
                      ))}
                      <NavigationMenu.Item>
                        <button className="w-full bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium">
                          Contribute
                        </button>
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.Root>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
