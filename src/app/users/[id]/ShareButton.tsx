"use client";

import React, { useState } from "react";
import { Button, CheckmarkFilled, Share } from "@/components/carbon";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <Button
      kind="ghost"
      size="md"
      renderIcon={copied ? CheckmarkFilled : Share}
      onClick={handleCopy}
      style={{ borderRadius: 0 }}
    >
      {copied ? "Link Copied!" : "Share Profile"}
    </Button>
  );
}
