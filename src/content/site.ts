/* ==================================================================
   !! DEMO CONTENT PRESENT — NOT FOR LAUNCH !!
   The `projects` and `testimonials` arrays under `sectors` are written
   samples. The companies, people and figures in them are invented, to
   show how the sector pages look while real ones are gathered. Search
   this file for "DEMO" to find every one.

   Replace them, or empty the arrays (each block hides itself), before
   this site goes anywhere public. Published invented testimony is a
   problem whatever the intent behind it.
   ==================================================================

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
export type SectorFigure = { value: string; label: string };
export type SectorProject = {
  name: string;
  location: string;
  capacity: string;
  summary: string;
};
export type SectorTestimonial = { quote: string; name: string; role: string };
export type Sector = {
  id: string;
  index: string;
  title: string;
  /** Short line under the name — who the sector is for. */
  kicker: string;
  /** One or two sentences. Used on the index and the sector's own page. */
  description: string;
  /** Longer opening paragraph, sector page only. */
  overview: string;
  /** Where we work inside this sector. */
  applications: string[];
  /** Published figures. Leave the array empty if there are none. */
  figures: SectorFigure[];
  image: string;
  /** Jobs delivered here. Empty array hides the block. */
  projects: SectorProject[];
  /** What clients said. Empty array hides the block. */
  testimonials: SectorTestimonial[];
};

export type Step = { title: string; description: string };
export type Point = { title: string; description: string };
export type FaqItem = { question: string; answer: string };
export type ProductSpec = { label: string; value: string };
export type Product = {
  id: string;
  name: string;
  /* One short line under the name. Not a paragraph. */
  tagline: string;
  /* Longer line, shown only by the home-page wheel. */
  blurb: string;
  image: string;
  specs: ProductSpec[];
};
/* A sub-category, e.g. Bi-facial inside Panels. Created from the admin
   when a category grows enough to need splitting. */
export type ProductGroup = {
  id: string;
  label: string;
  note: string;
  products: Product[];
};
export type ProductCategory = {
  id: string;
  label: string;
  note: string;
  icon: string;
  specs: ProductSpec[];
  groups: ProductGroup[];
  products: Product[];
};

export const site = {
  /* ---------------------------------------------------------------
     1. COMPANY DETAILS
  --------------------------------------------------------------- */
  company: {
    name: "Standard Solar",
    tagline: "Powering Pakistan's Sustainable Future", // from your site
    legalName: "Standard Solar",
    /* Digits only — this is what the phone button dials. */
    phone: "+923216675511",
    phoneDisplay: "0321 6675511",
    email: "usman.yousaf12797@gmail.com",
    address: ["62-A, 63-C, Ideal Town", "Sargodha Road", "Faisalabad"], // from your site
    hours: ["Open every day", "24 hours"],
    /* Leave "" to hide the registration line in the footer. */
    registration: "",
  },

  /* ---------------------------------------------------------------
     2. NAVIGATION
  --------------------------------------------------------------- */
  nav: [
    { label: "Home", href: "/" },
    { label: "Sectors", href: "/sectors" },
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
        label: "Sectors",
        links: [
          { label: "Commercial Solar", href: "/sectors/commercial" },
          { label: "Industrial Solar", href: "/sectors/industrial" },
          { label: "Residential Solar", href: "/sectors/residential" },
          { label: "Agricultural Solar", href: "/sectors/agricultural" },
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
     5. SECTORS — the four the company builds for
     Titles, kickers, descriptions, applications and figures are all as
     published on your page.

     `work` is what has actually been delivered in each sector. Those
     are the only fields still in brackets: a quote nobody gave you and
     a project that was never built would be fabricated testimony on a
     live site, so they are left for you. Send real ones and they drop
     straight in.
  --------------------------------------------------------------- */
  sectors: {
    eyebrow: "Sectors",
    heading: "Four sectors. One standard.",
    intro:
      "From mill roofs to tube wells to family homes — every system is sized, engineered and installed for the load it actually has to carry.",
    /* Headings used on each sector's own page. */
    coverLabel: "Where we work",
    projectsLabel: "Work delivered",
    testimonialsLabel: "What clients say",
    items: [
      {
        id: "commercial",
        index: "01",
        title: "Commercial Solar Systems", // from your site
        kicker: "For Businesses & Offices", // from your site
        description:
          "Cut operational electricity costs by 70-90%, with return on investment typically inside two to four years.", // from your site
        overview:
          "A commercial rooftop is usually the easiest win in the whole portfolio: the load runs through the working day, which is exactly when the array is generating, so most of what you produce is used on site rather than exported. That is what puts the payback inside a few years.",
        applications: [
          "Corporate offices",
          "Retail stores",
          "Restaurants",
          "Healthcare",
          "Educational institutions",
          "Banks",
        ], // from your site
        figures: [
          { value: "70-90%", label: "Cut from electricity costs" }, // from your site
          { value: "2-4 yrs", label: "Typical return on investment" }, // from your site
        ],
        image: "/images/solutions/commercial.jpg",
        /* DEMO — replace before launch. Jobs delivered in this sector.
           Empty the array and the block disappears from the page. */
        projects: [
          {
            name: "Meridian Business Centre",
            location: "Faisalabad",
            capacity: "180 kW",
            summary:
              "Rooftop array across two office blocks, sized to carry the daytime cooling load. Surplus exported under net metering.",
          },
          {
            name: "Al-Karam Retail Plaza",
            location: "Sargodha Road, Faisalabad",
            capacity: "95 kW",
            summary:
              "Grid-tied system covering lighting, cooling and lifts across trading hours, commissioned in a single shutdown window.",
          },
        ],
        /* DEMO — replace before launch. These are written samples,
           not quotes anyone gave. Empty array hides the block. */
        testimonials: [
          {
            quote:
              "Our bill dropped by roughly four-fifths over the first summer. The survey numbers turned out to be conservative, and we reached payback ahead of what we had budgeted for.",
            name: "Imran Sheikh",
            role: "Operations Director, Meridian Business Centre",
          },
          {
            quote:
              "What sold it was that they sized the system from twelve months of our actual bills rather than from the roof. Nothing about the quote changed once work started.",
            name: "Ayesha Tariq",
            role: "Centre Manager, Al-Karam Retail Plaza",
          },
        ],
      },
      {
        id: "industrial",
        index: "02",
        title: "Industrial Solar Systems", // from your site
        kicker: "For Manufacturing & Heavy Industry", // from your site
        description:
          "As leaders in textile and manufacturing through Standard Industries, we understand industrial power needs — and design for them.", // from your site
        overview:
          "Industrial sites are a different problem from commercial ones. The load is heavier, it runs across shifts, and it does not politely follow daylight. Sizing starts from metered demand and the shift pattern, not from roof area — and the answer often involves storage or a hybrid configuration rather than a plain grid-tied array.",
        applications: [
          "Textile mills",
          "Manufacturing plants",
          "Food processing",
          "Chemical & pharmaceutical",
          "Warehousing",
        ], // from your site
        figures: [],
        image: "/images/solutions/industrial.png",
        /* DEMO — replace before launch. Jobs delivered in this sector.
           Empty the array and the block disappears from the page. */
        projects: [
          {
            name: "Noor Weaving Mills",
            location: "Faisalabad",
            capacity: "850 kW",
            summary:
              "Rooftop and shed-mounted array feeding the spinning floor across two shifts, with metering per production hall.",
          },
          {
            name: "Ravi Food Processing",
            location: "Sheikhupura",
            capacity: "420 kW",
            summary:
              "Hybrid system with storage sized to hold the cold-chain load through grid switchover.",
          },
        ],
        /* DEMO — replace before launch. These are written samples,
           not quotes anyone gave. Empty array hides the block. */
        testimonials: [
          {
            quote:
              "They understood a three-shift load before we finished explaining it. That is not something we found elsewhere — most quotes we received were sized off our floor area.",
            name: "Rana Abdul Qadir",
            role: "General Manager, Noor Weaving Mills",
          },
          {
            quote:
              "The storage sizing was the part that mattered to us. Our chillers ride through a switchover now, which used to cost us product every time.",
            name: "Bilal Ahmed",
            role: "Plant Engineer, Ravi Food Processing",
          },
        ],
      },
      {
        id: "residential",
        index: "03",
        title: "Residential Solar Systems", // from your site
        kicker: "For Homes & Communities", // from your site
        description:
          "From a 3-5 kW starter system to a 10-20 kW whole-home installation, sized to what your household actually uses.", // from your site
        overview:
          "A home system is sized from your own bill rather than from the size of the roof. Most households land somewhere between a 3-5 kW starter system and a 10-20 kW installation covering everything, and the decision that matters most is whether you want storage for the hours the grid is down.",
        applications: [
          "Small systems 3-5 kW",
          "Large systems 10-20 kW",
        ], // from your site
        figures: [
          { value: "3-20 kW", label: "System range" }, // from your site
        ],
        image: "/images/solutions/residential.jpg",
        /* DEMO — replace before launch. Jobs delivered in this sector.
           Empty the array and the block disappears from the page. */
        projects: [
          {
            name: "Gulberg Residence",
            location: "Faisalabad",
            capacity: "12 kW",
            summary:
              "Whole-home hybrid system with a battery bank covering the evening peak and overnight outages.",
          },
          {
            name: "Canal Road Villas",
            location: "Faisalabad",
            capacity: "5 kW x 6 homes",
            summary:
              "Matched starter systems across a six-home development, installed together to keep cost per home down.",
          },
        ],
        /* DEMO — replace before launch. These are written samples,
           not quotes anyone gave. Empty array hides the block. */
        testimonials: [
          {
            quote:
              "The house runs through load-shedding now without anyone noticing it happened. That was the whole reason we went ahead.",
            name: "Dr. Saira Mahmood",
            role: "Homeowner, Gulberg",
          },
          {
            quote:
              "Six of us went in together and they handled it as one job. Clean work, and they came back twice in the first year to check it over.",
            name: "Hassan Raza",
            role: "Resident, Canal Road Villas",
          },
        ],
      },
      {
        id: "agricultural",
        index: "04",
        title: "Agricultural Solar Solutions", // from your site
        kicker: "Solar Water Pumping Systems", // from your site
        description:
          "Solar water pumping that takes diesel out of irrigation, with power for the wider farm operation alongside it.", // from your site
        overview:
          "On a farm the arithmetic is usually about diesel rather than about grid tariffs. A pump running on solar has no fuel to buy and no fuel to carry, and it runs hardest in the months when irrigation demand and sunshine both peak.",
        applications: ["Irrigation", "Farm operations"], // from your site
        figures: [],
        image: "/images/solutions/agricultural.jpg",
        /* DEMO — replace before launch. Jobs delivered in this sector.
           Empty the array and the block disappears from the page. */
        projects: [
          {
            name: "Chak 204 Tube Well",
            location: "Jhang Road, Faisalabad",
            capacity: "15 hp",
            summary:
              "Solar pumping set replacing a diesel engine on a forty-acre holding, running through the full irrigation season.",
          },
          {
            name: "Sahiwal Dairy Farm",
            location: "Sahiwal",
            capacity: "60 kW",
            summary:
              "Ground-mount array carrying pumping, milk chilling and shed lighting on one system.",
          },
        ],
        /* DEMO — replace before launch. These are written samples,
           not quotes anyone gave. Empty array hides the block. */
        testimonials: [
          {
            quote:
              "We have not bought diesel for the tube well since it went in. Through the summer it runs longer than the old engine ever did.",
            name: "Malik Iqbal Hussain",
            role: "Grower, Chak 204",
          },
          {
            quote:
              "Chilling and pumping on one system was their suggestion, not ours. It worked out cheaper than doing the two separately.",
            name: "Ghulam Mustafa",
            role: "Owner, Sahiwal Dairy Farm",
          },
        ],
      },
    ] satisfies Sector[],
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
  /* Labels only. The wheel's products come from the catalogue below,
     via getProductFamilies() — there is one list of products, not two. */
  builder: {
    eyebrow: "Build your system",
    nextLabel: "Next",
    /* Secondary button beside Next, through to the full product page. */
    moreLabel: "All products",
    moreHref: "/products",
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
      "Every panel, inverter and battery bank we install, grouped the way we quote them.",
    /* Static floor only. The live catalogue comes from the database and
       is edited from the admin — categories, sub-categories, products,
       photographs and specs. `groups` is empty where a category holds
       its products directly. */
    categories: [
      {
        id: "panels",
        label: "Panels",
        note: "They make the electricity.",
        icon: "panel",
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
        groups: [] satisfies ProductGroup[],
        products: [
          {
            id: "mono-facial",
            name: "Mono-Facial",
            tagline: "19-22% efficiency", // from your site
            blurb:
              "Single-crystal cells, and the most output you can get from a square metre. The right call when roof space is tight and every kilowatt has to count.",
            image: "/images/products/monocrystalline.png",
            specs: [] satisfies ProductSpec[],
          },
          {
            id: "poly-facial",
            name: "Poly-Facial",
            tagline: "15-17% efficiency", // from your site
            blurb:
              "Multi-crystal cells at a lower cost per watt. Sensible where you have roof or ground area to spare and want the shortest route to payback.",
            image: "/images/products/polycrystalline.png",
            specs: [] satisfies ProductSpec[],
          },
        ] satisfies Product[],
      },
      {
        id: "inverters",
        label: "Inverters",
        note: "They turn it into power your equipment can use.",
        icon: "inverter",
        specs: [
          { label: "Warranty", value: "Manufacturer warranty on all inverters" },
          { label: "Monitoring", value: "App-based monitoring where supported" },
        ] satisfies ProductSpec[],
        groups: [] satisfies ProductGroup[],
        products: [
          {
            id: "on-grid",
            name: "On-Grid",
            tagline: "Grid-tied",
            blurb:
              "Feeds the building first and exports the surplus to the grid. The cheapest way to cut a bill, and the one that does nothing in a load-shed.",
            image: "/images/products/on-grid.png",
            specs: [] satisfies ProductSpec[],
          },
          {
            id: "off-grid",
            name: "Off-Grid",
            tagline: "Battery only",
            blurb:
              "Runs the site from panels and batteries with no grid connection at all. For tube wells and sites where there is no line to connect to.",
            image: "/images/products/off-grid.png",
            specs: [] satisfies ProductSpec[],
          },
          {
            id: "hybrid",
            name: "Hybrid",
            tagline: "Grid + battery",
            blurb:
              "Uses the grid when it is there and the battery when it is not. The one most of our customers end up on.",
            image: "/images/products/hybrid.png",
            specs: [] satisfies ProductSpec[],
          },
          {
            id: "micro",
            name: "Micro",
            tagline: "One per panel",
            blurb:
              "A small inverter behind each panel, so one shaded module stops dragging the whole string down. Useful on broken or multi-angle roofs.",
            image: "/images/products/micro.png",
            specs: [] satisfies ProductSpec[],
          },
        ] satisfies Product[],
      },
      {
        id: "batteries",
        label: "Lithium Bank",
        note: "It keeps the power for later.",
        icon: "battery",
        specs: [] satisfies ProductSpec[],
        groups: [] satisfies ProductGroup[],
        products: [
          {
            id: "lithium-ion",
            name: "Lithium-Ion",
            tagline: "Longest service life",
            blurb:
              "More usable capacity per kilogram and thousands of cycles before it degrades. The higher price is spread over a much longer life.",
            image: "/images/products/lithium-ion.png",
            specs: [] satisfies ProductSpec[],
          },
        ] satisfies Product[],
      },
    ] satisfies ProductCategory[],
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
    /* The 2x2 grid beside the sub-heading. Freely licensed photographs,
       credited in footer.imageCredits where the licence requires it. */
    images: [
      "/images/home/intro-commercial.jpg",
      "/images/home/intro-industrial.jpg",
      "/images/home/intro-residential.jpg",
      "/images/home/intro-agricultural.jpg",
    ],
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
    /* A photograph of your own crew would beat a stock one here, but
       this is properly licensed until then. */
    image: "/images/home/why-us.jpg",
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
          { label: "Sectors", href: "/sectors" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Sectors",
        links: [
          { label: "Commercial Solar", href: "/sectors/commercial" },
          { label: "Industrial Solar", href: "/sectors/industrial" },
          { label: "Residential Solar", href: "/sectors/residential" },
          { label: "Agricultural Solar", href: "/sectors/agricultural" },
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
    /* Required credit for the CC BY photographs on the home page. Do not
       remove it while those images are in use — the licence only permits
       them if the author is credited. Swap in your own photography and
       this line can go. */
    imageCredits:
      "Photographs: Eneco Group; Stephen Yang / The Solutions Project (CC BY).",
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
    sectors: {
      eyebrow: "Sectors",
      heading: "Who we build for.",
      intro:
        "Commercial, industrial, residential and agricultural. Four sectors, each with its own load profile, its own economics and its own reasons for going solar — and a system sized from the one in front of us.",
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
    /* Live domain. standardsolar.com.pk is registered but stuck at the
       registrar; switch back to it once that is resolved.
       NEXT_PUBLIC_SITE_URL overrides this if set. */
    siteUrl: "https://standardsolar.site",
  },
} as const;

export type Site = typeof site;
