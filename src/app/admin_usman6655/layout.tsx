import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Standard Solar admin" },
  // Never let the portal into an index, whatever the path.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Metadata only. The sidebar lives in (portal)/layout.tsx so the
 * sign-in screen, which sits outside that group, does not inherit it —
 * there is no nav worth showing to someone who is not signed in.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
