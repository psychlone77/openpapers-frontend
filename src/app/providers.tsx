"use client";

import React from "react";
import { CarbonThemeProvider } from "@/contexts/CarbonThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CarbonThemeProvider>{children}</CarbonThemeProvider>;
}
