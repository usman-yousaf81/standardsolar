import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

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
  // metadataBase is only set once a real domain is in .env.local.
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : isPlaceholder(site.seo.siteUrl)
      ? {}
      : { metadataBase: new URL(site.seo.siteUrl) }),
  title: {
    default: site.seo.defaultTitle,
    template: `%s — ${site.seo.titleTemplate}`,
  },
  description: site.seo.defaultDescription,
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

/**
 * Root layout holds only what every route needs: the document, the
 * fonts and the stylesheet. The public chrome lives in (site) and the
 * admin has its own, so the portal does not inherit a marketing header.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-paper antialiased">{children}</body>
    </html>
  );
}
