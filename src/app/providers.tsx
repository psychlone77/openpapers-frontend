"use client";

import React from "react";
import { CarbonThemeProvider } from "@/contexts/CarbonThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CarbonThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </CarbonThemeProvider>
  );
}
