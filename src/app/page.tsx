"use client";

import { Navbar } from "@/components/Navbar";
import { PaperSearchBox } from "@/components/PaperSearchBox";
import { Typography, theme } from "antd";
import { useEffect } from "react";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <div className="-z-10 fixed top-0 left-0 bottom-0 h-svh w-screen dotted-bg"></div>
      <Typography.Title level={1} style={{ fontSize: "2.25rem", textAlign: "center" }}>
        Welcome to OpenPapers
      </Typography.Title>
      <Typography.Paragraph
        style={{ fontSize: "1.125rem", textAlign: "center", marginTop: "1rem" }}
      >
        An open platform for all exam papers
      </Typography.Paragraph>
      <div className="mt-16">
        <PaperSearchBox />
      </div>
    </main>
  );
}
