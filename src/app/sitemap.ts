import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getSectors } from "@/lib/content";

const base = (process.env.NEXT_PUBLIC_SITE_URL || site.seo.siteUrl).replace(/\/$/, "");

/** Every public page, with the service pages read from the database. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sectors = await getSectors();
  const now = new Date();

  const fixed = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/equipment", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/about", priority: 0.6 },
  ];

  return [
    ...fixed.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...sectors.map((sector) => ({
      url: `${base}/services/${sector.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
