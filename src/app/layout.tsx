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
    <html lang="en" suppressHydrationWarning className="cds--white" data-carbon-theme="white">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('openpapers-theme');
                  var theme = 'white';
                  if (saved && (saved === 'white' || saved === 'g10' || saved === 'g90' || saved === 'g100')) {
                    theme = saved;
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = 'g100';
                  }
                  document.documentElement.setAttribute('data-carbon-theme', theme);
                  document.documentElement.classList.remove('cds--white', 'cds--g10', 'cds--g90', 'cds--g100');
                  document.documentElement.classList.add('cds--' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
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
