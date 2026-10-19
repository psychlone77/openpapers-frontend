import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main id="main-content" style={{ flex: "1 0 auto" }}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
