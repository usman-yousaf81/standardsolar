import { site } from "@/content/site";
import { SiteHeader, type MobileNavItem } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { getSectors, getProductCatalog } from "@/lib/content";
import { shortServiceName } from "@/lib/utils";

/* Who the business is, for search engines — what a map listing and a
   "solar installer near me" result are built from. */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.company.name,
  description: site.seo.defaultDescription,
  url: site.seo.siteUrl,
  telephone: site.company.phone,
  email: site.company.email,
  image: `${site.seo.siteUrl}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.company.address.slice(0, 2).join(", "),
    addressLocality: "Faisalabad",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  areaServed: { "@type": "City", name: "Faisalabad" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
};

/** The public website: header, content, footer, sticky call bar. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Services and equipment carry their own sub-menus, read from the same
     source the pages themselves use — so renaming a category in the
     admin renames it in the menus and the footer too. */
  const [sectors, categories] = await Promise.all([
    getSectors(),
    getProductCatalog(),
  ]);

  const services: MobileNavItem = {
    label: "Services",
    href: "/services",
    children: sectors.map((sector) => ({
      label: shortServiceName(sector.title),
      href: `/services/${sector.id}`,
    })),
  };

  const equipment: MobileNavItem = {
    label: "Equipment",
    href: "/equipment",
    children: categories.map((category) => ({
      label: category.label,
      href: `/equipment#${category.id}`,
    })),
  };

  const nav: MobileNavItem[] = [
    { label: "Home", href: "/" },
    services,
    equipment,
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader nav={nav} />
      <main id="main">{children}</main>
      <SiteFooter services={services} equipment={equipment} />
      {/* Spacer so the fixed mobile bar never covers the footer. */}
      <div aria-hidden className="action-bar-spacer lg:hidden" />
      <MobileActionBar />
    </>
  );
}
