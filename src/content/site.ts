/* ==================================================================
   STANDARD SOLAR — SITE CONTENT
   ------------------------------------------------------------------
   Every visible string on the site lives in this one file. Change it
   here and it changes everywhere.

   THREE THINGS TO KNOW
   1. Lines marked "// from your site" were taken from your existing
      page at mystandardgroup.com/standard-solar. Nothing on this site
      links to or loads from that domain — the wording lives here now.
   2. Lines marked "// CONFIRM" are written copy that makes a claim
      about how you operate. Read them and correct anything that isn't
      how you actually work.
   3. Anything still in [SQUARE_BRACKETS] is information only you have.
      There are three of them and they are listed in the README.
================================================================== */

export type NavItem = { label: string; href: string };
export type Stat = { value: string; label: string };
export type Service = {
  title: string;
  image: string;
};
export type Step = { title: string; description: string };
export type Point = { title: string; description: string };
export type FaqItem = { question: string; answer: string };
export type ProductType = {
  name: string;
  summary: string;
  detail: string;
  /* Optional bar chart. `from`/`to` are the range, `max` is the end of
     the scale it's drawn against. */
  meter?: { from: number; to: number; max: number; unit: string };
};
export type ProductSpec = { label: string; value: string };
export type BuilderItem = {
  name: string;
  spec: string;
  description: string;
  image: string;
};

export const site = {
  /* ---------------------------------------------------------------
     1. COMPANY DETAILS
  --------------------------------------------------------------- */
  company: {
    name: "Standard Solar",
    tagline: "Powering Pakistan's Sustainable Future", // from your site
    legalName: "Standard Solar",
    /* Digits only — this is what the phone button dials. Built from
       041-8781130 on your site, in international form. */
    phone: "+92418781130", // from your site
    phoneDisplay: "041-8781130", // from your site
    /* An email address has to be real or enquiries bounce, so this one
       is left for you. */
    email: "[EMAIL_ADDRESS]",
    address: ["62-A, 63-C, Ideal Town", "Sargodha Road", "Faisalabad"], // from your site
    /* Your actual opening hours — guessing these would send people to
       a closed office. */
    hours: ["[HOURS_WEEKDAYS]", "[HOURS_WEEKEND]"],
    /* Leave "" to hide the registration line in the footer. */
    registration: "",
  },

  /* ---------------------------------------------------------------
     2. NAVIGATION
  --------------------------------------------------------------- */
  nav: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  headerCta: { label: "Get a quote", href: "/contact" },

  /* ---------------------------------------------------------------
     2b. FULL-SCREEN MOBILE MENU
     What opens when you tap the menu button on a phone. Each group is
     a small label with a stack of large links underneath. Add, rename
     or reorder groups freely — the layout takes any number.
  --------------------------------------------------------------- */
  mobileMenu: {
    groups: [
      {
        label: "Solutions",
        links: [
          { label: "Commercial Solar", href: "/services#solutions" },
          { label: "Industrial Solar", href: "/services#solutions" },
          { label: "Residential Solar", href: "/services#solutions" },
          { label: "Agricultural Solar", href: "/services#solutions" },
        ],
      },
      {
        label: "Products",
        links: [
          { label: "Solar Panels", href: "/products#panels" },
          { label: "Solar Inverters", href: "/products#inverters" },
          { label: "Solar Batteries", href: "/products#batteries" },
        ],
      },
      {
        label: "Standard Solar",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    /* Social profiles for the bottom row, alongside the phone number
       and email. Add entries when you have the handles, e.g.
       { label: "Instagram", href: "https://instagram.com/..." } */
    social: [] as { label: string; href: string }[],
  },

  /* ---------------------------------------------------------------
     3. STICKY MOBILE BAR
  --------------------------------------------------------------- */
  mobileBar: {
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
    callLabel: "Call Standard Solar",
  },

  /* ---------------------------------------------------------------
     4. HERO
  --------------------------------------------------------------- */
  hero: {
    eyebrow: "Faisalabad, Pakistan",
    headline: "The sun doesn't send bills.",
    /* The two figures here are the commercial ones published on your
       page — 70-90% cost reduction and a 2-4 year payback. */
    subhead:
      "Solar systems engineered for Pakistani mills, farms, offices and homes — cutting electricity costs by up to 90%, and paying for themselves in as little as two years.",
    /* Background photographs behind the hero. The stat widgets are laid
       over them. Two files because the crops are different shapes — the
       portrait one would be badly cropped on a wide screen and the
       landscape one badly cropped on a phone. */
    mobileImage: "/images/mobile-hero.jpg",
    mobileImageAlt:
      "Aerial view of a solar array set among dense forest canopy",
    desktopImage: "/images/laptop-hero.jpg",
    desktopImageAlt:
      "Aerial view of a house with a rooftop solar array in a forest clearing",
  },

  /* ---------------------------------------------------------------
     5. SOLUTIONS — the four category cards below the hero
     Titles, kickers and tags are as published on your page.
  --------------------------------------------------------------- */
  services: {
    eyebrow: "What we build",
    heading: "Four sectors. One standard.",
    intro:
      "From mill roofs to tube wells to family homes — every system is sized, engineered and installed for the load it actually has to carry.",
    items: [
      {
        title: "Commercial Solar Systems", // from your site
        image: "/images/solutions/commercial.jpg",
      },
      {
        title: "Industrial Solar Systems", // from your site
        image: "/images/solutions/industrial.png",
      },
      {
        title: "Residential Solar Systems", // from your site
        image: "/images/solutions/residential.jpg",
      },
      {
        title: "Agricultural Solar Solutions", // from your site
        image: "/images/solutions/agricultural.jpg",
      },
    ] satisfies Service[],
  },

  /* ---------------------------------------------------------------
     6. BUILD YOUR SYSTEM — the scroll-driven product browser
     Family and type names are as published on your page, as are the
     panel efficiency figures and the battery capacity range. The
     descriptions explain what each type is and when it suits — they
     are general engineering, not claims about specific stock.

     Add or remove items freely: the scroll length, the dots and the
     progress bar all recalculate themselves.
  --------------------------------------------------------------- */
  builder: {
    eyebrow: "Build your system",
    nextLabel: "Next",
    /* Secondary button beside Next, through to the full product page. */
    moreLabel: "All products",
    moreHref: "/products",
    families: [
      {
        id: "panels",
        label: "Panels", // from your site
        icon: "panel",
        note: "",
        items: [
          {
            name: "Monocrystalline", // from your site
            spec: "19-22% efficiency", // from your site
            description:
              "Single-crystal cells, and the most output you can get from a square metre. The right call when roof space is tight and every kilowatt has to count.",
            image: "/images/products/monocrystalline.png",
          },
          {
            name: "Polycrystalline", // from your site
            spec: "15-17% efficiency", // from your site
            description:
              "Multi-crystal cells at a lower cost per watt. Sensible where you have roof or ground area to spare and want the shortest route to payback.",
            image: "/images/products/polycrystalline.webp",
          },
        ] satisfies BuilderItem[],
      },
      {
        id: "inverters",
        label: "Inverters", // from your site
        icon: "inverter",
        note: "",
        items: [
          {
            name: "On-Grid", // from your site
            spec: "Grid-tied",
            description:
              "Feeds straight into your supply and sends the surplus back out. The standard choice for a site with a reliable connection that wants the fastest return.",
            image: "/images/products/on-grid.png",
          },
          {
            name: "Off-Grid", // from your site
            spec: "Battery only",
            description:
              "Runs entirely on panels and storage, with no grid connection at all. Built for tube wells, remote sites and anywhere the line simply doesn't reach.",
            image: "/images/products/off-grid.png",
          },
          {
            name: "Hybrid", // from your site
            spec: "Grid + battery",
            description:
              "Takes grid, panels and batteries together and chooses between them in real time. Keeps the circuits that matter running straight through an outage.",
            image: "/images/products/hybrid.png",
          },
          {
            name: "Micro", // from your site
            spec: "One per panel",
            description:
              "A small inverter behind each panel, so shade or a fault on one module can't drag the rest of the array down with it. Best on broken or multi-angle roofs.",
            image: "/images/products/micro.png",
          },
        ] satisfies BuilderItem[],
      },
      {
        id: "batteries",
        label: "Batteries", // from your site
        icon: "battery",
        note: "100Ah - 1000Ah+", // from your site
        items: [
          {
            name: "Lithium-Ion", // from your site
            spec: "Longest service life",
            description:
              "The deepest usable capacity and the longest life, in the smallest footprint. The highest price at the start, and the lowest cost per cycle over everything that follows.",
            image: "/images/products/lithium-ion.png",
          },
          {
            name: "Tubular", // from your site
            spec: "Deep-cycle lead acid",
            description:
              "Thick tubular plates built to be discharged deeply, day after day. Heavier, and it needs topping up — but proven in Pakistani conditions and far kinder on the opening budget.",
            image: "/images/products/tubular.png",
          },
          {
            name: "AGM", // from your site
            spec: "Sealed, maintenance-free",
            description:
              "Sealed glass-mat construction: no watering, no venting, no upkeep. A solid middle option for backup duty, where the bank isn't cycled hard every single day.",
            image: "/images/products/agm.png",
          },
        ] satisfies BuilderItem[],
      },
    ],
  },

  /* ---------------------------------------------------------------
     6b. PRODUCTS PAGE — /products
     The bullets you supplied, mapped in full: every type, every
     warranty, every certification. `summary` is your own wording;
     `detail` is the longer explanation written around it.
  --------------------------------------------------------------- */
  products: {
    eyebrow: "Products",
    heading: "Our Solar Products & Services",
    intro:
      "We supply three things. Panels, inverters and batteries — that is the whole list. Here is what each one does, what your options are within it, and what is covered once it is installed.",
    /* The flow strip at the top of the page. Its job is to make the
       three product groups register before anyone starts reading. */
    overview: {
      heading: "Three products. One system.",
      intro:
        "Sunlight goes in at one end and usable, round-the-clock power comes out at the other. Three things do the work — and this is all three of them.",
      start: "Sunlight",
      end: "Power you can use",
    },
    families: [
      {
        id: "panels",
        index: "01",
        /* Header shot for this family on the products page. */
        image: "/images/products/monocrystalline.png",
        label: "Solar Panels",
        /* Plain-English line directly under the product name. Keep it to
           one short sentence — this is the bit a first-time visitor
           actually reads. */
        plain: "They make the electricity.",
        short: "Makes the electricity",
        intro:
          "The panels are the only part of the system that actually generates. Everything after them just moves, converts or stores what they make — which is why efficiency and warranty matter more here than anywhere else.",
        types: [
          {
            name: "Monocrystalline Panels",
            summary: "Highest efficiency", // your wording
            detail:
              "Cut from a single silicon crystal, so electrons meet the least resistance and each panel returns the most output per square metre we can supply. When the constraint is roof area rather than budget, monocrystalline is what gets you to your target kilowatts.",
            meter: { from: 19, to: 22, max: 25, unit: "%" }, // your figures
          },
          {
            name: "Polycrystalline Panels",
            summary: "Cost-effective solution", // your wording
            detail:
              "Cast from multiple silicon fragments. Less output per square metre, but meaningfully less cost per watt — so on a wide flat roof or a ground mount where area is not scarce, the same spend reaches payback sooner.",
            meter: { from: 15, to: 17, max: 25, unit: "%" }, // your figures
          },
        ] satisfies ProductType[],
        specs: [
          {
            label: "Brands",
            value: "Tier-1 — premium quality from trusted manufacturers",
          },
          { label: "Warranty", value: "25-year performance warranty on panels" },
          {
            label: "Certifications",
            value: "International quality standards (IEC, CE)",
          },
        ] satisfies ProductSpec[],
      },
      {
        id: "inverters",
        index: "02",
        /* Header shot for this family on the products page. */
        image: "/images/products/hybrid.png",
        label: "Solar Inverters",
        plain: "They turn it into power your equipment can use.",
        short: "Converts it for use",
        intro:
          "Panels produce direct current, which almost nothing in your building can run on. The inverter converts it — and the type you pick is what decides whether anything stays on when the grid goes down.",
        types: [
          {
            name: "On-Grid Inverters",
            summary: "For net metering systems", // your wording
            detail:
              "Synchronises with the utility supply and exports surplus generation back onto the grid under net metering. The simplest and least expensive configuration, and the quickest to pay for itself — though it shuts down alongside the grid, by design.",
          },
          {
            name: "Off-Grid Inverters",
            summary: "Complete independence from grid", // your wording
            detail:
              "Builds a supply of its own from the array and the battery bank, with no utility connection in the picture at all. This is what runs a tube well out in a field, or any site the distribution network never reached.",
          },
          {
            name: "Hybrid Inverters",
            summary: "Best of both worlds", // your wording
            detail:
              "Manages grid, array and battery together and chooses between them minute by minute — exporting when there is surplus, drawing from storage when there is not, and carrying your essential circuits straight through a shutdown.",
          },
          {
            name: "Micro Inverters",
            summary: "Panel-level optimization", // your wording
            detail:
              "One inverter behind each panel instead of one for the whole array. A shaded, soiled or failing module then costs you only that module's output rather than dragging the entire string down with it — which is what makes them worth it on broken roofs, mixed orientations, and anywhere a chimney throws a shadow.",
          },
        ] satisfies ProductType[],
        specs: [
          {
            label: "Brands",
            value: "Reliable international manufacturers",
          },
          { label: "Warranty", value: "5-10 years manufacturer warranty" },
        ] satisfies ProductSpec[],
      },
      {
        id: "batteries",
        index: "03",
        /* Header shot for this family on the products page. */
        image: "/images/products/lithium-ion.png",
        label: "Solar Batteries",
        plain: "They store it for night, and for outages.",
        short: "Stores it for later",
        intro:
          "Without storage, a solar system only works while the sun is up. Batteries keep what you do not use during the day, so it is there at night and when the grid drops. Which type suits you depends on how hard the bank gets used, and how long it has to last.",
        types: [
          {
            name: "Lithium-Ion Batteries",
            summary: "Longer life, better performance", // your wording
            detail:
              "The most usable capacity for a given size and weight, thousands of cycles of service life, and nothing to maintain. The highest price at purchase and the lowest cost per stored kilowatt-hour across everything that follows.",
          },
          {
            name: "Tubular Batteries",
            summary: "Cost-effective backup solution", // your wording
            detail:
              "Thick tubular positive plates, built to be discharged deeply and recharged daily without degrading. Heavier, and the electrolyte needs topping up on schedule — but the entry cost is a fraction of lithium and the technology is thoroughly proven in Pakistani conditions.",
          },
          {
            name: "AGM Batteries",
            summary: "Maintenance-free operation", // your wording
            detail:
              "Electrolyte held in an absorbent glass-mat separator and sealed for life: no topping up, no venting, no acid to handle. A practical middle ground for backup duty that is not cycled hard every single day.",
          },
        ] satisfies ProductType[],
        specs: [
          {
            label: "Capacity options",
            value: "100Ah to 1000Ah and beyond",
          },
          {
            label: "Design",
            value: "Deep cycle — optimized for solar applications",
          },
        ] satisfies ProductSpec[],
      },
    ],
    /* Closing line above the call to action on the products page. */
    closing: {
      heading: "Not sure which combination you need?",
      body: "That is what the site survey is for. We look at your load, your roof or land, and your budget, then tell you which of these actually belongs on your site — and which of them you can skip.",
    },
  },

  /* ---------------------------------------------------------------
     7. STATS STRIP
     All four figures are published on your page. Swapping in project
     counts or installed capacity would read stronger — send me real
     numbers and I'll put them here.
  --------------------------------------------------------------- */
  stats: [
    { value: "70-90%", label: "Cut from commercial bills" }, // from your site
    { value: "2-4 yrs", label: "Typical payback period" }, // from your site
    { value: "3-20 kW", label: "Residential system range" }, // from your site
    { value: "19-22%", label: "Monocrystalline efficiency" }, // from your site
  ] satisfies Stat[],

  /* ---------------------------------------------------------------
     8. INTRO BLOCK — mission statement
  --------------------------------------------------------------- */
  intro: {
    marker: "Faisalabad, Pakistan",
    tags: ["Commercial", "Industrial", "Residential", "Agricultural"],
    statement:
      "To make solar energy accessible, affordable, and reliable for Pakistani businesses and communities, contributing to energy independence and environmental sustainability.", // from your site
    heading: "Built by people who pay industrial bills.",
    body: "Standard Solar is the energy arm of Standard Group. Through Standard Industries we work in textile and manufacturing ourselves — so an industrial load curve is something we read from experience, not from a datasheet.", // CONFIRM
    cta: { label: "About Standard Solar", href: "/about" },
  },

  /* ---------------------------------------------------------------
     9. PROCESS
     This describes how a job runs from enquiry to handover. Check it
     against how you actually work and correct anything that's off.
  --------------------------------------------------------------- */
  process: {
    eyebrow: "How it works",
    heading: "From first call to first unit.",
    steps: [
      {
        title: "Site survey", // CONFIRM
        description:
          "We visit, measure the roof or the land, go through your recent bills and record the loads that actually matter.",
      },
      {
        title: "System design", // CONFIRM
        description:
          "You get a sized proposal: array layout, inverter and battery selection, expected generation, and a payback figure you can check for yourself.",
      },
      {
        title: "Installation", // CONFIRM
        description:
          "Mounting, DC and AC work, then inverter and battery commissioning — carried out to a schedule agreed before anyone turns up.",
      },
      {
        title: "Handover & support", // CONFIRM
        description:
          "We walk you through monitoring, hand over the documentation, and stay reachable for service and warranty afterwards.",
      },
    ] satisfies Step[],
  },

  /* ---------------------------------------------------------------
     10. WHY US
  --------------------------------------------------------------- */
  whyUs: {
    eyebrow: "Why Standard Solar",
    heading: "The standard is in the name.",
    points: [
      {
        title: "An industrial group, not a reseller",
        description:
          "Standard Solar sits inside Standard Group, alongside our textile and manufacturing operations. The people quoting your system are the people who have to stand behind it.", // CONFIRM
      },
      {
        title: "Sized to your load, not to a catalogue",
        description:
          "Every system is designed around your own consumption, your roof or land area and your budget — not pulled off a list of fixed packages.", // CONFIRM
      },
      {
        title: "One team, start to finish",
        description:
          "Survey, design, supply, installation and after-sales all sit with us, so there's no gap between whoever sold it and whoever has to fix it.", // CONFIRM
      },
      {
        title: "Equipment specified on merit",
        description:
          "Mono or poly, hybrid or off-grid, lithium or tubular — we specify what suits the site and explain the trade-off, rather than defaulting to one product line.", // CONFIRM
      },
    ] satisfies Point[],
  },

  /* ---------------------------------------------------------------
     11. FAQ
     This replaced a testimonials section. Writing customer reviews
     that nobody actually gave you would put fabricated quotes on a
     live site — send real ones and they can go back in.
  --------------------------------------------------------------- */
  faq: {
    eyebrow: "Questions",
    heading: "The ones we get asked most.",
    items: [
      {
        question: "How much will I actually save?",
        answer:
          "It depends on your tariff and your consumption, but commercial systems typically cut electricity costs by 70-90%, and pay for themselves within two to four years. A survey turns that range into a figure for your site.", // from your site
      },
      {
        question: "What size system do I need?",
        answer:
          "Homes usually land between 3-5 kW and 10-20 kW. Commercial and industrial sites are sized from metered load rather than floor area, so the survey settles it rather than a rule of thumb.", // from your site
      },
      {
        question: "Monocrystalline or polycrystalline panels?",
        answer:
          "Monocrystalline converts 19-22% of the light that reaches it; polycrystalline 15-17%. Choose mono when roof space is tight, and poly when you have room to spare and want a lower cost per watt.", // from your site
      },
      {
        question: "Do I need batteries?",
        answer:
          "Not always. An on-grid system without storage gives the fastest payback. You add batteries when loads need to ride through an outage, or when there's no grid connection to begin with.",
      },
      {
        question: "What happens when the grid goes down?",
        answer:
          "A plain on-grid system shuts down with the grid. A hybrid or off-grid system keeps your selected circuits running from the battery, which is usually the reason to choose one.",
      },
      {
        question: "What maintenance does it need?",
        answer:
          "Panels want occasional cleaning, more often through the dusty months. Tubular batteries need topping up; lithium and AGM don't. Inverters get checked periodically and otherwise look after themselves.",
      },
    ] satisfies FaqItem[],
  },

  /* ---------------------------------------------------------------
     12. CLOSING CALL TO ACTION
  --------------------------------------------------------------- */
  ctaBand: {
    heading: "Find out what your roof is worth.",
    body: "Tell us where the site is and roughly what you pay each month. We'll come back with a sized system, a generation estimate and a payback figure.", // CONFIRM
    primaryCta: { label: "Get a quote", href: "/contact" },
  },

  /* ---------------------------------------------------------------
     13. FOOTER
  --------------------------------------------------------------- */
  footer: {
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Solutions", href: "/services" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "Commercial Solar", href: "/services#solutions" },
          { label: "Industrial Solar", href: "/services#solutions" },
          { label: "Residential Solar", href: "/services#solutions" },
          { label: "Agricultural Solar", href: "/services#solutions" },
        ],
      },
      {
        title: "Products",
        links: [
          { label: "Solar Panels", href: "/products#panels" },
          { label: "Solar Inverters", href: "/products#inverters" },
          { label: "Solar Batteries", href: "/products#batteries" },
        ],
      },
    ],
    legal: "The energy division of Standard Group.", // CONFIRM
  },

  /* ---------------------------------------------------------------
     14. INNER PAGES
  --------------------------------------------------------------- */
  pages: {
    about: {
      eyebrow: "About Us",
      heading: "The energy arm of Standard Group.",
      body: [
        "Standard Solar is the renewable energy division of Standard Group, working out of Faisalabad across commercial, industrial, residential and agricultural sites. Through Standard Industries the group already operates in textile and manufacturing, which is where our understanding of heavy electrical load came from.", // CONFIRM
        "Our mission is to make solar energy accessible, affordable, and reliable for Pakistani businesses and communities, contributing to energy independence and environmental sustainability.", // from your site
        "The vision behind it is a Pakistan powered by clean, renewable energy—reducing dependence on fossil fuels, lowering electricity costs, and protecting our environment for future generations.", // from your site
      ],
    },
    services: {
      eyebrow: "What we build",
      heading: "Four sectors. One standard.",
      intro:
        "Commercial, industrial, residential and agricultural systems — each one sized from the load it has to carry, then built from panels, inverters and storage chosen to match.",
    },
    contact: {
      eyebrow: "Contact",
      heading: "Tell us about your site.",
      intro:
        "Survey requests, system sizing, pricing, or support on something already installed — send the details and we'll come back to you.",
      form: {
        name: "Your name",
        email: "Email address",
        phone: "Phone number",
        city: "City",
        message: "What do you need?",
        submit: "Send enquiry",
        success:
          "Thank you — your enquiry has reached us. We'll be in touch shortly.",
      },
    },
  },

  /* ---------------------------------------------------------------
     15. SEO
  --------------------------------------------------------------- */
  seo: {
    titleTemplate: "Standard Solar",
    defaultTitle: "Standard Solar — Solar Energy Systems in Faisalabad",
    defaultDescription:
      "Commercial, industrial, residential and agricultural solar systems from Standard Solar, Faisalabad. Cut electricity costs by up to 90%, with typical payback in two to four years.",
    /* Set once the domain is live, e.g. "https://standardsolar.com.pk" */
    siteUrl: "[SITE_URL]",
  },
} as const;

export type Site = typeof site;
