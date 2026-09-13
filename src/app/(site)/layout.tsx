import { SiteHeader, type MobileNavItem } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";

/** The public website: header, content, footer, sticky call bar. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* The drawer lists destinations, not every page under them: four
     rows, as the reference does. Sectors and Products lead to their own
     index pages, which carry the full lists. */
  const nav: MobileNavItem[] = [
    { label: "Sectors", href: "/sectors" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader nav={nav} />
      <main id="main">{children}</main>
      <SiteFooter />
      {/* Spacer so the fixed mobile bar never covers the footer. */}
      <div aria-hidden className="action-bar-spacer lg:hidden" />
      <MobileActionBar />
    </>
  );
}
