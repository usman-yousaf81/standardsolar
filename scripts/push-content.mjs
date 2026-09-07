/**
 * Pushes src/content/site.ts into the database, overwriting the rows it
 * manages. Useful to reset after experimenting, or to load the file's
 * content into a fresh project without opening the SQL editor.
 *
 *   npm run content:push
 *
 * Once the client is editing through the portal the database is the
 * source of truth, and running this would overwrite their work — so it
 * asks for --force in that case.
 */
import { api } from "./lib-env.mjs";
import { site } from "../src/content/site.ts";

const force = process.argv.includes("--force");

const settings = {
  hero: {
    eyebrow: site.hero.eyebrow,
    headline: site.hero.headline,
    subhead: site.hero.subhead,
    mobileImage: site.hero.mobileImage,
    mobileImageAlt: site.hero.mobileImageAlt,
    desktopImage: site.hero.desktopImage,
    desktopImageAlt: site.hero.desktopImageAlt,
  },
  stats: site.stats,
  ctaBand: site.ctaBand,
  company: site.company,
};

const enquiries = await api("/rest/v1/enquiries?select=id&limit=1");
if (enquiries.length && !force) {
  console.error(
    "This project already has enquiries, so it is probably live and being edited.\n" +
      "Re-run with --force if you really want to overwrite the content rows.",
  );
  process.exit(1);
}

for (const [key, value] of Object.entries(settings)) {
  await api("/rest/v1/site_settings", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key, value }),
  });
}
console.log(`settings: ${Object.keys(settings).length} keys`);

await api("/rest/v1/sectors", {
  method: "POST",
  headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify(
    site.sectors.items.map((s, i) => ({
      id: s.id,
      position: i,
      title: s.title,
      kicker: s.kicker,
      description: s.description,
      overview: s.overview,
      applications: s.applications,
      figures: s.figures,
      image_url: s.image,
    })),
  ),
});
console.log(`sectors: ${site.sectors.items.length}`);
console.log("done — restart the dev server to clear the content cache.");
