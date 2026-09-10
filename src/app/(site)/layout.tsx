import { getProductCatalog, getSectors } from "@/lib/content";
import { SiteHeader, type MobileNavItem } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";

/** The public website: header, content, footer, sticky call bar. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* The mobile menu's sub-menus are the real sectors and product
     categories, read here because the header is a client component and
     cannot query the database itself. Built from the same source the
     pages use, so renaming a category in the admin renames it in the
     navigation too. */
  const [sectors, categories] = await Promise.all([
    getSectors(),
    getProductCatalog(),
  ]);

  const nav: MobileNavItem[] = [
    {
      label: "Sectors",
      href: "/sectors",
      links: sectors.map((sector) => ({
        label: sector.title,
        href: `/sectors/${sector.id}`,
      })),
    },
    {
      label: "Products",
      href: "/products",
      links: categories.map((category) => ({
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
