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
  kicker: string;
  description: string;
  tags: string[];
  image: string;
};
export type Step = { title: string; description: string };
export type Point = { title: string; description: string };
export type FaqItem = { question: string; answer: string };
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
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  headerCta: { label: "Get a quote", href: "/contact" },

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
    primaryCta: { label: "Get a quote", href: "/contact" },
    secondaryCta: { label: "See what we build", href: "#solutions" },
    /* Drop a photo into /public/images/ and point to it, e.g.
       "/images/hero.jpg". Leave as "" for the silver placeholder. */
    image: "",
    imageAlt: "A Standard Solar array installed on a rooftop in Faisalabad",
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
        kicker: "For Businesses & Offices", // from your site
        description:
          "Cut operational electricity costs by 70-90%, with return on investment typically inside two to four years.", // from your site
        tags: [
          "Corporate offices",
          "Retail stores",
          "Restaurants",
          "Healthcare",
          "Educational institutions",
          "Banks",
        ], // from your site
        image: "",
      },
      {
        title: "Industrial Solar Systems", // from your site
        kicker: "For Manufacturing & Heavy Industry", // from your site
        description:
          "As leaders in textile and manufacturing through Standard Industries, we understand industrial power needs — and design for them.", // from your site
        tags: [
          "Textile mills",
          "Manufacturing plants",
          "Food processing",
          "Chemical & pharmaceutical",
          "Warehousing",
        ], // from your site
        image: "",
      },
      {
        title: "Residential Solar Systems", // from your site
        kicker: "For Homes & Communities", // from your site
        description:
          "From a 3-5 kW starter system to a 10-20 kW whole-home installation, sized to what your household actually uses.", // from your site
        tags: ["Small systems 3-5 kW", "Large systems 10-20 kW"], // from your site
        image: "",
      },
      {
        title: "Agricultural Solar Solutions", // from your site
        kicker: "Solar Water Pumping Systems", // from your site
        description:
          "Solar water pumping that takes diesel out of irrigation, with power for the wider farm operation alongside it.", // from your site
        tags: ["Irrigation", "Farm operations"], // from your site
        image: "",
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
            image: "",
          },
          {
            name: "Polycrystalline", // from your site
            spec: "15-17% efficiency", // from your site
            description:
              "Multi-crystal cells at a lower cost per watt. Sensible where you have roof or ground area to spare and want the shortest route to payback.",
            image: "",
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
            image: "",
          },
          {
            name: "Off-Grid", // from your site
            spec: "Battery only",
            description:
              "Runs entirely on panels and storage, with no grid connection at all. Built for tube wells, remote sites and anywhere the line simply doesn't reach.",
            image: "",
          },
          {
            name: "Hybrid", // from your site
            spec: "Grid + battery",
            description:
              "Takes grid, panels and batteries together and chooses between them in real time. Keeps the circuits that matter running straight through an outage.",
            image: "",
          },
          {
            name: "Micro", // from your site
            spec: "One per panel",
            description:
              "A small inverter behind each panel, so shade or a fault on one module can't drag the rest of the array down with it. Best on broken or multi-angle roofs.",
            image: "",
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
            image: "",
          },
          {
            name: "Tubular", // from your site
            spec: "Deep-cycle lead acid",
            description:
              "Thick tubular plates built to be discharged deeply, day after day. Heavier, and it needs topping up — but proven in Pakistani conditions and far kinder on the opening budget.",
            image: "",
          },
          {
            name: "AGM", // from your site
            spec: "Sealed, maintenance-free",
            description:
              "Sealed glass-mat construction: no watering, no venting, no upkeep. A solid middle option for backup duty, where the bank isn't cycled hard every single day.",
            image: "",
          },
        ] satisfies BuilderItem[],
      },
    ],
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
