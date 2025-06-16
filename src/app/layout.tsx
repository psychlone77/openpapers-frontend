import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Navbar } from "@/components/Navbar";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import Providers from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenPapers",
  description: "An open platform for all exam papers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <AntdRegistry>
        <Providers>
          <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
            <Navbar />
            <div className="pt-16">{children}</div>
          </body>
        </Providers>
      </AntdRegistry>
    </html>
  );
}
