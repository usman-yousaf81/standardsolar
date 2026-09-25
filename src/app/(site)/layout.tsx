import { SiteHeader, type MobileNavItem } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { getSectors, getProductCatalog } from "@/lib/content";

/**
 * Sector pages are titled in full — "Commercial Solar Systems" — which
 * is too long for a drawer row. The trailing generic noun carries no
 * meaning once the row already sits under "Sectors", so it is dropped.
 * Any other title passes through untouched.
 */
function shorten(title: string) {
  return title.replace(/\s+(Systems|Solutions)$/i, "");
}

/** The public website: header, content, footer, sticky call bar. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Sectors and products carry their own sub-menus, read from the same
     source the pages themselves use — so renaming a category in the
     admin renames it in the drawer too. */
  const [sectors, categories] = await Promise.all([
    getSectors(),
    getProductCatalog(),
  ]);

  const nav: MobileNavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Sectors",
      href: "/sectors",
      children: sectors.map((sector) => ({
        label: shorten(sector.title),
        href: `/sectors/${sector.id}`,
      })),
    },
    {
      label: "Products",
      href: "/products",
      children: categories.map((category) => ({
        label: category.label,
        href: `/products#${category.id}`,
      })),
    },
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
