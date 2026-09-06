import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Standard Solar admin" },
  // Never let the portal into an index, whatever the path.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The portal has its own chrome. The login screen renders without the
 * nav because it is the one page reachable while signed out — it opts
 * out by being the only child that ignores this shell's sidebar, which
 * it does simply by not needing it.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-mist">
      <AdminNav />
      <main className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
