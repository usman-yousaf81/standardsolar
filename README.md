# Standard Solar

Marketing website for Standard Solar, built with Next.js (App Router),
TypeScript and Tailwind CSS v4.

---

## Running it

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
```

> **Stop the dev server before running `npm run build`.** Both write to
> `.next`, and running them together corrupts it — the dev server then
> serves 500s until you `rm -rf .next` and restart.

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

Nothing is hard-coded into the components. The site is fully written —
three markers are worth knowing about:

**`// from your site`** — wording taken from the existing page at
mystandardgroup.com/standard-solar. This site links to nothing on that
domain and loads nothing from it; the wording lives here now.

**`// CONFIRM`** — written copy that makes a claim about how you
operate (the process steps, the "why us" points, the group
relationship). Read these and correct anything that isn't accurate.
There are 13 of them.

**`[SQUARE_BRACKETS]`** — information only you have. Three remain:

| Token                            | Why it's still empty                        |
| -------------------------------- | ------------------------------------------- |
| `[EMAIL_ADDRESS]`                | Has to be real or enquiries bounce          |
| `[HOURS_WEEKDAYS]` / `[HOURS_WEEKEND]` | Guessing sends people to a closed office |
| `[SITE_URL]`                     | Set when the domain goes live               |

### What is deliberately not written

There are no testimonials. Writing customer reviews nobody actually
gave you would put fabricated quotes on a live site, so an FAQ sits in
that slot instead. Send real reviews and the section can go back in —
it is in the git history at commit `459d0fd`.

The stats strip uses the four figures published on your page (70-90%
saving, 2-4 year payback, 3-20 kW range, 19-22% efficiency) rather than
invented project counts or installed capacity. Real numbers would read
stronger — they just have to be real.

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

### Logo

`public/logo.png` is the mark with its white background removed and the
surrounding whitespace cropped off. The transparency was made by
flood-filling inward from the edges rather than deleting every white
pixel, so the white `S` and the white `STANDARD` lettering inside the
mark survive. It is used for the header lockup and the favicon, and it
sits directly on the page with no chip or ring behind it.

The original `logo.jpeg` is in git history at commit `11118b5` if the
source file is ever needed again.

### Mobile menu

Tapping the menu button opens a full-screen panel: small letterspaced
group labels with large stacked links under each, and a row of contact
links pinned to the bottom. Groups live in `site.mobileMenu.groups` and
the layout takes any number of them.

On phones the header is arranged menu-left, mark-centre, call-right, so
the menu button doesn't move when it turns into the close button. The
panel closes on Escape, on route change and on any link tap; it locks
page scroll while open, takes focus on open and hands it back to the
menu button on close.

`site.mobileMenu.social` is an empty array ready for Instagram,
Facebook or LinkedIn links — add them and they join the bottom row.

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

## Home page sections

| Order | Section            | Source                                    |
| ----- | ------------------ | ----------------------------------------- |
| 1     | Hero               | `site.hero`                               |
| 2     | Solutions (4 cards)| `site.services` — filled from your page   |
| 3     | Stats strip        | `site.stats`                              |
| 4     | Build your system  | `site.builder` — scroll-driven            |
| 5     | Intro / mission    | `site.intro`                              |
| 6     | Process            | `site.process`                            |
| 7     | Why us             | `site.whyUs`                              |
| 8     | FAQ                | `site.faq`                                |
| 9     | Closing CTA        | `site.ctaBand`                            |

### Build your system

`src/components/sections/BuildYourSystem.tsx` is the scroll-driven
product browser. Every product across every family is flattened into one
ordered list; the section is taller than the viewport, its panel sticks
to the top while you scroll past, and scroll progress selects the active
product. Scrolling is never hijacked — it just also drives the selection.

The family tabs, the name list, the dots and the Next button all jump the
page to the matching scroll offset rather than setting state directly, so
the selection can never drift out of step with the scroll position.

Add or remove products in `site.builder.families` and the scroll length,
the dots and the progress bar all recalculate. The scroll distance per
product is set by `.builder-stage` in `globals.css` (42vh on desktop,
34vh on phones). Under `prefers-reduced-motion` the section collapses to
its natural height and becomes a plain click-through list.

---

## Still to do

- [ ] Fill the three remaining `[TOKENS]` — email address and opening
      hours (see the table above)
- [ ] Read the 13 `// CONFIRM` lines and correct anything inaccurate
- [ ] Send real project numbers to replace the spec-sheet figures in the
      stats strip
- [ ] Add real photography to `public/images/`
- [ ] Supply a transparent PNG or SVG version of the logo (the current
      `public/logo.jpeg` has a baked-in white background)
- [ ] Wire the enquiry form to an email service or CRM
- [ ] Set the live domain in `site.seo.siteUrl`
- [ ] Add favicon set, `sitemap.xml` and `robots.txt`
- [ ] Cookie/analytics decision before launch
