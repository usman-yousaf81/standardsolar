import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-family",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-family",
});

export const metadata: Metadata = {
  // metadataBase is only set once a real domain is in src/content/site.ts.
  ...(isPlaceholder(site.seo.siteUrl)
    ? {}
    : { metadataBase: new URL(site.seo.siteUrl) }),
  title: {
    default: site.seo.defaultTitle,
    template: `%s — ${site.seo.titleTemplate}`,
  },
  description: site.seo.defaultDescription,
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* Spacer so the fixed mobile bar never covers the footer. */}
        <div aria-hidden className="action-bar-spacer lg:hidden" />
        <MobileActionBar />
      </body>
    </html>
  );
}
