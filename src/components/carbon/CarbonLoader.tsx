"use client";

import React from "react";
import { Loading } from "./index";

export function CarbonLoader({ description = "Loading..." }: { description?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "1rem",
      }}
    >
      <Loading withOverlay={false} description={description} />
      <span
        style={{
          fontFamily: "var(--op-font-sans)",
          color: "var(--cds-text-secondary)",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
        }}
      >
        {description}
      </span>
    </div>
  );
}

export default CarbonLoader;
