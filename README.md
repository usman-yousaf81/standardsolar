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

### Phone navigation

On phones the header is a floating pill: menu button, the first two
destinations inline, the mark, and a call button. The menu opens a dark
translucent panel from the left with the five destinations; Services and
Equipment each carry a chevron that opens their sub-menu in place. The
sub-menus are built in `src/app/(site)/layout.tsx` from the same database
reads the pages use, so a category renamed in the admin is renamed in the
menu and the footer too.

The panel closes on Escape, on route change and on any link tap, and
locks page scroll while open.

### Mobile action bar

`src/components/layout/MobileActionBar.tsx` is the bar pinned to the
bottom of the screen on phones: a wide **Get a free quote** button, then
WhatsApp and call as squares. It stays hidden until the hero has been
scrolled past, stands down while the menu is open, and on the contact
page — where the form is already on screen — shows only WhatsApp and
call, full width. Hidden from `lg` up, where the header button takes over.

---

## Quote form

`QuoteForm.tsx` is the one form on the site. It closes every page inside
`QuoteSection.tsx`, and fills the contact page on its own. Built for a
phone first:

- **Phone is required, email is optional.** Most customers here would
  rather be called or messaged than emailed.
- Service and monthly bill are **one tap each** (chips), so the quote
  can be sized from the first call.
- A service page preselects its own service. `/contact?service=<id>` and
  `/contact?interest=<product>` fill the form in the same way — the
  equipment page's "Get a price installed" links use the second.

`POST /api/enquiry` validates, rejects bots with a honeypot, and inserts
into the `enquiries` table, where the admin lists it. Service, bill,
product and the page it was sent from are written as the first lines of
the message, so the form needed no schema change.

### WhatsApp

Every WhatsApp button reads `site.company.whatsapp` through
`src/lib/contact.ts`, and opens a chat with the first message already
typed. Set the number to `""` and every WhatsApp button disappears.

---

## Home page sections

Ordered the way a buyer decides.

| Order | Section               | Source                                           |
| ----- | --------------------- | ------------------------------------------------ |
| 1     | Hero + two buttons    | `site.hero` (copy from the admin), `getStats()`  |
| 2     | Services (4 cards)    | `site.services` — each links to `/services/<id>` |
| 3     | Every install includes| `site.services.included`                         |
| 4     | How it works          | `site.process`                                   |
| 5     | What we install       | `site.builder` — the equipment wheel             |
| 6     | Why us                | `site.whyUs`                                     |
| 7     | FAQ                   | `site.faq`                                       |
| 8     | Quote form            | `site.quote`                                     |

### Services (`/services` and `/services/[slug]`)

The four kinds of installation — home, commercial, industrial and
agricultural. The copy (title, kicker, description, overview, "We install
for" list, figures, photograph) is edited in the admin under
**Services**; `site.services.items` is the fallback.

Each service page is a landing page: hero with its own quote and WhatsApp
buttons, overview, the systems that suit that kind of site, everything an
installation includes, how it works, installations and client quotes
(each hidden while empty), that service's own FAQ, the other services,
and the quote form with the service preselected. The systems and the FAQ
live in `site.services.details`, keyed by service id.

The routes used to be `/sectors`; permanent redirects in
`next.config.ts` carry old links across.

### Equipment page (`/equipment`)

The catalogue, from the database, with `site.equipment.categories` as
the static floor when the database is unreachable. Formerly `/products`,
redirected.

`ProductCatalog.tsx` renders each category as a heading, the facts that
hold across it as a spec row, then a grid of products — directly, or
split into sub-categories first. Every product carries a **Get a price
installed** link into the quote form. Product photographs sit on the page
with nothing behind them, so upload cut-outs with a transparent
background.

Edited from the admin under **Equipment**.

### What we install (the equipment wheel)

`src/components/sections/BuildYourSystem.tsx` is the equipment browser
on the home page: family tabs above a wheel of names, with the selected
item's photograph and description beside it. The wheel is one integer —
the selected index — drawn with transforms; swipe, scroll, the dots and
the Next button all change that one number, so what is selected can
never drift from what is on screen. Gesture tracking lives in refs rather
than state, because a touch that ends before React commits would
otherwise read a stale distance.

Items come from the same catalogue the equipment page reads —
`getProductFamilies()` flattens the tree for the wheel. One list, not two.

---

## Still to do

- [ ] **Run `supabase/migrations/0004_services.sql`** in the Supabase SQL
      editor. It writes the services copy and the new hero into the live
      database and removes the 16 invented sample projects and client
      quotes. Until it runs, the live site shows the old copy.
- [ ] **Confirm `0321 6675511` is on WhatsApp** — every WhatsApp button
      opens a chat with it (`site.company.whatsapp`).
- [ ] Read the `// CONFIRM` lines in `site.ts` and correct anything that
      overstates — net metering support, own crews, free quote, 24-hour
      answering. `grep -n CONFIRM src/content/site.ts`
- [ ] Add real installations and real client quotes from the admin as
      they come; each block appears on its service page when it has one
- [ ] Add installed capacity or a count of systems installed to the key
      figures when there are real numbers
- [ ] Replace the stock photography with your own, and drop
      `footer.imageCredits` once the CC BY images are gone
- [ ] The managing director's name (`pages.about.director.name`)
- [ ] Email notification for new enquiries (they reach the admin today,
      but nothing pings anyone)
- [ ] Cookie/analytics decision before launch
