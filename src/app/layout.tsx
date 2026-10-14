import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Navbar } from "@/components/Navbar";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "OpenPapers | Open Examination Papers Platform",
  description: "An open platform for past examination papers, solutions, and structured practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers>
          <div className="openpapers-grid-bg" aria-hidden="true" />
          <Navbar />
          <main id="main-content" style={{ minHeight: "calc(100vh - 48px)" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
