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

### Hero

One treatment at every size: the photograph fills the screen, the type
sits over it in white, and the four `site.stats` figures are laid on top
as frosted glass widgets.

Only two things change between phone and laptop — which photograph
loads, and whether the widgets stack two-up or run as a row of four:

| | Phone | Laptop |
| --- | --- | --- |
| Photo | `site.hero.mobileImage` | `site.hero.desktopImage` |
| Widgets | 2 x 2, under the type | 2 x 2, beside the type on the right |

Two files because the crops are different shapes: the portrait shot
would be gutted on a wide screen and the landscape one on a phone. The
laptop image was supplied portrait and rotated 90 degrees to landscape —
it is a top-down aerial, so turning the whole frame reads naturally.

The section carries `-mt-[72px]` so the photo runs up behind the header
and shows through its glass; the 72px is added back as top padding
inside. The mobile column is budgeted to fit between that header and the
fixed action bar, so if you lengthen the hero copy, re-check that the
bottom widgets still clear the bar.

The hero has no buttons: the sticky action bar carries the call to
action on phones, the header carries it on desktop. `StatsStrip` is no
longer on the home page for the same reason — the hero shows those four
figures now. It is still used on the About page.

**Both photos are under-sized for full-bleed use.** The mobile one is
673px wide, the laptop one 1142px. A 390pt phone at 3x wants ~1170px and
a 1440px laptop hero wants ~2400px, so both will look soft on real
hardware. Larger versions of the same shots drop straight in at the same
paths, no code change needed.

### Home page photography

`public/images/home/` holds five photographs fetched from Openverse.
Two are CC0 (no conditions). Three are **CC BY**, which permits
commercial use only while the author is credited — that credit is
`site.footer.imageCredits`, rendered in the footer's small print.

**Do not delete that line while those images are in use.** Replace them
with your own photography and it can go.

Sources were restricted to Wikimedia-hosted files: the larger CC0 pools
(rawpixel in particular) deliver watermarked previews, which are no use
on a real site.

### Logo

`public/logo.png` is the mark with its white background removed and the
surrounding whitespace cropped off. The transparency was made by
flood-filling inward from the edges rather than deleting every white
pixel, so the white `S` and the white `STANDARD` lettering inside the
mark survive. It is used for the header lockup and the favicon, and it
sits directly on the page with no chip or ring behind it.

The original `logo.jpeg` is in git history at commit `11118b5` if the
source file is ever needed again.

### Header

The mark stands alone — no wordmark beside it.

`PrimaryNav.tsx` is the desktop navigation. A single pill slides between
items rather than each item carrying its own background: it follows the
pointer on hover, follows keyboard focus while tabbing, and settles back
on the current page when either leaves. Positions are measured from the
live DOM rather than assumed, so the pill stays correct whatever the
labels say, and it re-measures on resize and once the webfont has
loaded — the font swap changes every label's width.

Glass in both states rather than transparent-then-solid: always
`backdrop-blur-xl backdrop-saturate-150`, with only the tint changing —
`bg-white/10` at the top of the page, `bg-white/70` plus a hairline once
scrolled past 8px.

The header sets its own text colour and the controls inherit it, so over
the hero photograph on phones they turn white and revert to ink as soon
as you scroll off it. If you ever put a dark section behind the header
on another page, that is the switch to extend.

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
| 2     | Sectors (4 cards)  | `site.sectors` — links through to /sectors |
| 3     | Stats strip        | `site.stats` — desktop only, see below    |
| 4     | Build your system  | `site.builder` — scroll-driven, links to `/products` |
| 5     | Intro / mission    | `site.intro`                              |
| 6     | Process            | `site.process`                            |
| 7     | Why us             | `site.whyUs`                              |
| 8     | FAQ                | `site.faq`                                |
| 9     | Closing CTA        | `site.ctaBand`                            |

### Sectors (`/sectors` and `/sectors/[slug]`)

`/sectors` is an index: four rows, each the way into that sector's own
page. A list rather than a grid on purpose — the home page already has
the grid, and a list gives the names room to be the largest thing on
screen.

`/sectors/[slug]` is one page per sector, statically generated from
`site.sectors.items` via `generateStaticParams`, so all four are
prerendered at build time and an unknown slug 404s. Each page runs:
photo hero, overview with the sector's published figures, what it
covers, work delivered, what clients said, the other three sectors, CTA.

Both work blocks are data-driven. Empty `projects` or `testimonials` for
a sector and that block disappears from its page rather than showing an
empty shell — so a sector with nothing to show yet claims nothing.

**Both arrays currently hold demo content.** The companies, people and
figures in them are written samples, there so the pages can be seen
finished while real ones are gathered. Every one is marked `DEMO` in
`site.ts`, under a banner at the top of the file.

### Products page (`/products`)

The full catalogue, at `src/content/site.ts` under `products`.

The page is built so the three product groups register before anyone
reads any detail. `ProductOverview.tsx` opens with a sunlight-to-power
flow — three linked cards, each with its number, its name and one plain
sentence saying what it does.

Each group then gets its own section from `ProductFamily.tsx`, where the
product name is the largest thing on screen, with `plain` sitting under
it as a one-line explanation and `intro` as the supporting paragraph.
The options within the group follow as cards, then a strip of specs.

Keep `plain` to one short sentence — it is the line a first-time visitor
actually reads.

Panel types carry a `meter` — `{ from, to, max, unit }` — drawn by
`RangeMeter.tsx` as a band on a shared 0-25% scale, so monocrystalline
and polycrystalline can be compared by eye. The band grows in the first
time it is scrolled into view. Add a `meter` to any other type and it
gets a bar too.

The `specs` list under each family holds the warranties, certifications,
brands, capacity range and design notes.

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

- [ ] **Replace the DEMO testimonials and projects** under `sectors`, or
      empty the arrays — each block hides itself. Invented testimony must
      not go live. `grep DEMO src/content/site.ts`
- [ ] Fill the three remaining `[TOKENS]` — email address and opening
      hours (see the table above)
- [ ] Read the 13 `// CONFIRM` lines and correct anything inaccurate
- [ ] Send real project numbers to replace the spec-sheet figures in the
      stats strip
- [ ] Replace the stock home-page photography with your own, and drop
      `footer.imageCredits` once the CC BY images are gone
- [ ] Supply a transparent PNG or SVG version of the logo (the current
      `public/logo.jpeg` has a baked-in white background)
- [ ] Wire the enquiry form to an email service or CRM
- [ ] Set the live domain in `site.seo.siteUrl`
- [ ] Add favicon set, `sitemap.xml` and `robots.txt`
- [ ] Cookie/analytics decision before launch
