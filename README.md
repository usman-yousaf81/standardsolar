# Standard Solar

Marketing website for Standard Solar, built with Next.js (App Router),
TypeScript and Tailwind CSS v4.

---

## Running it

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
```

Other scripts:

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Local development server with hot reload      |
| `npm run build`     | Production build                              |
| `npm run start`     | Serve the production build                    |
| `npm run lint`      | ESLint                                        |
| `npm run typecheck` | TypeScript, no emit                           |

---

## Where the words live

**All site copy is in one file: [`src/content/site.ts`](src/content/site.ts).**

Nothing is hard-coded into the components. Anything still wrapped in
`[SQUARE_BRACKETS]` is a placeholder waiting for real copy — replace the
whole token, brackets included:

```ts
headline: "[HERO_HEADLINE]",        // before
headline: "Your real headline",     // after
```

Each field has a comment above it saying what belongs there and roughly
how long it should be, so the layout keeps its proportions.

## Where the pictures live

Drop image files into `public/images/`, then point at them from
`src/content/site.ts` with a path starting at `/images/`:

```ts
hero: {
  image: "/images/hero.jpg",
  imageAlt: "Describe the photo for screen readers",
}
```

Any image slot left as `""` renders a silver placeholder panel labelled
with the slot name, so the page still looks deliberate before the
photography arrives.

---

## Project structure

```
src/
├─ app/                        Routes (App Router)
│  ├─ layout.tsx               Shell: fonts, header, footer, mobile bar
│  ├─ page.tsx                 Home
│  ├─ about/ services/ contact/
│  ├─ api/enquiry/route.ts     Contact form endpoint
│  ├─ not-found.tsx            404
│  └─ globals.css              Design tokens + base styles
│
├─ components/
│  ├─ layout/                  SiteHeader, SiteFooter, MobileActionBar
│  ├─ sections/                Page sections (Hero, Services, …)
│  └─ ui/                      Primitives (Button, Container, MediaSlot…)
│
├─ content/site.ts             ← ALL COPY LIVES HERE
└─ lib/utils.ts                Small helpers
```

Sections are composed in `src/app/page.tsx`. To reorder the home page,
move the components around in that file — nothing else needs touching.

---

## Design system

Tokens are defined once in the `@theme` block of
[`src/app/globals.css`](src/app/globals.css) and become Tailwind
utilities automatically (`bg-mist`, `text-ink-muted`, `border-hairline`,
`rounded-card`, …).

The palette is deliberately bright — white, grey and silver surfaces —
with the navy and red taken directly from the logo used as accents only:

| Token           | Value     | Used for                          |
| --------------- | --------- | --------------------------------- |
| `paper`         | `#ffffff` | Page background                   |
| `mist`          | `#fafbfc` | Alternating section background    |
| `silver`        | `#f1f2f5` | Panels, image placeholders        |
| `hairline`      | `#e4e6ec` | Borders and dividers              |
| `ink`           | `#14151a` | Headings and primary text         |
| `ink-muted`     | `#6b7185` | Secondary text                    |
| `navy`          | `#2a1770` | Buttons, active nav, accents      |
| `signal`        | `#d8201a` | Errors only                       |

Typography: **Plus Jakarta Sans** for headings, **Inter** for body, both
loaded through `next/font` (self-hosted, no layout shift).

### Mobile action bar

`src/components/layout/MobileActionBar.tsx` is the bar pinned to the
bottom of the screen on phones — a wide action pill plus a square call
button. It is hidden from the `lg` breakpoint up, where the header CTA
takes over. Its label and destination come from `site.mobileBar` in the
content file, and the call button dials `site.company.phone`.

---

## Contact form

The form posts to `POST /api/enquiry`, which validates the submission and
rejects bots via a honeypot field.

**It does not deliver anywhere yet** — submissions are only logged to the
server console. See the `TODO` in
[`src/app/api/enquiry/route.ts`](src/app/api/enquiry/route.ts) to wire up
an email service (Resend, SendGrid, Postmark), a CRM, or a spreadsheet.
Put any credentials in `.env.local`, which is git-ignored.

---

## Still to do

- [ ] Replace every `[PLACEHOLDER]` token in `src/content/site.ts`
- [ ] Add real photography to `public/images/`
- [ ] Supply a transparent PNG or SVG version of the logo (the current
      `public/logo.jpeg` has a baked-in white background)
- [ ] Wire the enquiry form to an email service or CRM
- [ ] Set the live domain in `site.seo.siteUrl`
- [ ] Add favicon set, `sitemap.xml` and `robots.txt`
- [ ] Cookie/analytics decision before launch
