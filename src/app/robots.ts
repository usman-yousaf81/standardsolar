import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const base = (process.env.NEXT_PUBLIC_SITE_URL || site.seo.siteUrl).replace(/\/$/, "");

/* The admin path is deliberately not listed here: robots.txt is public,
   and naming the path would publish it. The admin keeps itself out of
   search with a noindex tag in its own layout instead. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
