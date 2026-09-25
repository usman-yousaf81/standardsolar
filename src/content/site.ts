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
/** A system type as it applies to one service, e.g. hybrid for homes. */
export type ServiceSystem = { name: string; note: string; href?: string };
/** What sits on a service page beyond the database copy. */
export type ServiceDetail = {
  /** Plural noun for the headings — "homes", "businesses". */
  audience: string;
  /** Chip value in the quote form. */
  quoteLabel: string;
  systems: ServiceSystem[];
  faqs: FaqItem[];
};
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
    /* International format, digits only, no "+" — what wa.me expects.
       CONFIRM this number is on WhatsApp: every WhatsApp button on the
       site opens a chat with it. Set it to "" and they all disappear. */
    whatsapp: "923216675511",
    /* Pre-filled first message when someone taps a WhatsApp button. */
    whatsappGreeting:
      "Hi Standard Solar, I'd like a quote for a solar installation.",
    email: "usman.yousaf12797@gmail.com",
    address: ["62-A, 63-C, Ideal Town", "Sargodha Road", "Faisalabad"], // from your site
    hours: ["Open every day", "24 hours"],
    /* Leave "" to hide the registration line in the footer. */
    registration: "",
  },

  /* ---------------------------------------------------------------
     2. NAVIGATION
     Services and Equipment carry sub-menus, built from the database in
     src/app/(site)/layout.tsx so they follow whatever the admin holds.
  --------------------------------------------------------------- */
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Equipment", href: "/equipment" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /* The one action every page is built to lead to. */
  headerCta: { label: "Get a free quote", href: "/contact" },

  /* ---------------------------------------------------------------
     3. STICKY MOBILE BAR
  --------------------------------------------------------------- */
  mobileBar: {
    ctaLabel: "Get a free quote",
    ctaHref: "/contact",
    callLabel: "Call Standard Solar",
    whatsappLabel: "WhatsApp Standard Solar",
  },

  /* ---------------------------------------------------------------
     4. HERO
     eyebrow, headline, subhead and the photographs are editable in the
     admin (the database overrides these). The buttons are fixed here.
  --------------------------------------------------------------- */
  hero: {
    eyebrow: "Solar installation in Faisalabad",
    headline: "We install solar that pays for itself.",
    /* "Up to 90%" is the commercial figure published on your page. */
    subhead:
      "Panels, inverters and lithium batteries for homes, businesses, factories and farms — surveyed, designed and installed by our own team. Cut your electricity bill by up to 90%.", // CONFIRM
    primaryCta: { label: "Get a free quote", href: "/contact" },
    whatsappCta: "WhatsApp us",
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
     5. SERVICES — the four kinds of installation
     Titles, kickers, descriptions, overviews and the "We install for"
     lists are editable in the admin; the database overrides these.
     Figures are as published on your page.

     `projects` and `testimonials` are empty on purpose. Each block
     hides itself while its list is empty, and appears the moment real
     installations or real client quotes are added from the admin.
     Never fill them with invented ones.
  --------------------------------------------------------------- */
  services: {
    eyebrow: "Our services",
    heading: "Solar installation for every kind of site.",
    intro:
      "Homes, businesses, factories and farms — each one surveyed, sized for the load it actually carries, and installed by our own team.", // CONFIRM
    /* Headings used on each service's own page. */
    coverLabel: "We install for",
    systemsLabel: "Systems we install",
    projectsLabel: "Installations",
    testimonialsLabel: "What clients say",
    faqLabel: "Questions",
    othersLabel: "Other services",
    items: [
      {
        id: "commercial",
        index: "01",
        title: "Commercial Solar Installation",
        kicker: "Offices, shops, hospitals, schools and banks",
        description:
          "We install rooftop solar for businesses, sized to your daytime load — cutting operating electricity costs by 70-90%, with payback typically inside two to four years.", // figures from your site
        overview:
          "A commercial roof is usually the easiest win in solar: the building draws its load through the working day, which is exactly when the array is generating, so almost everything it produces is used on site. We size the system from twelve months of your bills and your daytime profile, schedule the installation around your trading hours, and hand it over with monitoring so you can watch the saving yourself.", // CONFIRM
        applications: [
          "Offices and corporate buildings",
          "Shops and retail plazas",
          "Restaurants and hotels",
          "Hospitals and clinics",
          "Schools and colleges",
          "Banks",
        ],
        figures: [
          { value: "70-90%", label: "Cut from electricity costs" }, // from your site
          { value: "2-4 yrs", label: "Typical return on investment" }, // from your site
        ],
        image: "/images/solutions/commercial.jpg",
        projects: [] as SectorProject[],
        testimonials: [] as SectorTestimonial[],
      },
      {
        id: "industrial",
        index: "02",
        title: "Industrial Solar Installation",
        kicker: "Mills, factories and processing plants",
        description:
          "We install solar for mills and factories, sized from metered demand and your shift pattern — engineered by a group that runs textile and manufacturing plants of its own.",
        overview:
          "Industrial sites are a different problem from commercial ones. The load is heavier, it runs across shifts, and it does not politely follow daylight. We start from metered demand and the shift pattern rather than roof area — and the answer often involves a hybrid configuration or storage rather than a plain grid-tied array. Because Standard Group runs textile and manufacturing operations of its own, an industrial load curve is something we read from experience, not from a datasheet.", // CONFIRM
        applications: [
          "Textile mills",
          "Manufacturing plants",
          "Food processing",
          "Chemical and pharmaceutical",
          "Warehousing and cold storage",
        ],
        figures: [],
        image: "/images/solutions/industrial.png",
        projects: [] as SectorProject[],
        testimonials: [] as SectorTestimonial[],
      },
      {
        id: "residential",
        index: "03",
        title: "Home Solar Installation",
        kicker: "Homes, from 3 kW to 20 kW",
        description:
          "We install home solar from 3-5 kW starter systems to 10-20 kW whole-home setups, with lithium batteries that keep the house running through load-shedding.", // sizes from your site
        overview:
          "A home system is sized from your own bill, not from the size of your roof. Most households land between a 3-5 kW starter system and a 10-20 kW installation that covers everything including air-conditioning — and the decision that matters most is whether you want a battery to carry the house through load-shedding. We survey the house, recommend the system, install it, and set up the monitoring app so you can see what it produces.",
        applications: [
          "Starter systems, 3-5 kW",
          "Mid-size homes, 5-10 kW",
          "Whole-home systems, 10-20 kW",
          "Battery backup for load-shedding",
        ],
        figures: [
          { value: "3-20 kW", label: "System range" }, // from your site
        ],
        image: "/images/solutions/residential.jpg",
        projects: [] as SectorProject[],
        testimonials: [] as SectorTestimonial[],
      },
      {
        id: "agricultural",
        index: "04",
        title: "Agricultural Solar Installation",
        kicker: "Solar tube-wells and farm power",
        description:
          "We install solar tube-wells and farm power systems that take diesel out of irrigation — pumping hardest in exactly the months your crops need the water.",
        overview:
          "On a farm the arithmetic is about diesel rather than grid tariffs. A solar pump has no fuel to buy and no fuel to carry, and it runs hardest in the months when irrigation demand and sunshine both peak. We size the array to your pump, your well depth and the water you need, and can extend the same system to the farmhouse, sheds and milk chilling.", // CONFIRM
        applications: [
          "Solar tube-wells",
          "Submersible and surface pumps",
          "Dairy and poultry farms",
          "Farmhouses and sheds",
        ],
        figures: [],
        image: "/images/solutions/agricultural.jpg",
        projects: [] as SectorProject[],
        testimonials: [] as SectorTestimonial[],
      },
    ] satisfies Sector[],

    /* What each service page shows beyond the database copy: the system
       types that suit it, and the questions that customer asks. Keyed by
       service id — a service added in the admin without an entry here
       simply shows neither block. The system notes are general
       engineering, not claims about specific stock. */
    details: {
      residential: {
        audience: "homes",
        quoteLabel: "Home",
        systems: [
          {
            name: "Hybrid system",
            note: "Grid and battery together. The house runs on solar by day, the battery carries it through load-shedding, and the grid tops up the rest. What most homes end up choosing.",
            href: "/equipment#inverters",
          },
          {
            name: "On-grid system",
            note: "No battery, so the lowest price and the fastest payback, with surplus exported under net metering. The catch: it switches off whenever the grid does.",
            href: "/equipment#inverters",
          },
          {
            name: "Lithium battery bank",
            note: "Stores the daytime output for the evening, when a home uses most of its power. Fitted now or added later, sized to the hours you want covered.",
            href: "/equipment#batteries",
          },
        ],
        faqs: [
          {
            question: "Will solar run my air-conditioner?",
            answer:
              "Yes, if the system is sized for it. A 1.5-ton inverter AC draws roughly 1-1.5 kW while it runs, so daytime cooling is usually the first thing a correctly sized home system covers. The survey checks your peak load before anything is specified.",
          },
          {
            question: "What happens during load-shedding?",
            answer:
              "An on-grid system shuts down with the grid, by design. A hybrid system with a battery keeps the circuits you choose running — lights, fans, fridge, internet, and an AC if the battery is sized for it.",
          },
          {
            question: "Can I start small and add more later?",
            answer:
              "Usually, yes. A hybrid inverter chosen with some headroom lets you add panels or a second battery later. We'll tell you at the survey whether your roof and wiring allow it.",
          },
        ],
      },
      commercial: {
        audience: "businesses",
        quoteLabel: "Business",
        systems: [
          {
            name: "On-grid system",
            note: "Offices and shops consume through daylight, so a grid-tied system uses nearly everything it produces — the shortest route to payback. Weekend surplus can be exported under net metering.",
            href: "/equipment#inverters",
          },
          {
            name: "Hybrid system",
            note: "For sites that cannot stop — clinics, server rooms, cold display — a battery carries the critical circuits through an outage while the rest stays grid-tied.",
            href: "/equipment#inverters",
          },
          {
            name: "High-efficiency panels",
            note: "Monocrystalline modules where roof space is the limit, so every square metre produces as much as it can.",
            href: "/equipment#panels",
          },
        ],
        faqs: [
          {
            question: "Will we have to close while it's installed?",
            answer:
              "Rarely. The structure, panels and DC wiring go in on the roof with the building running. The final connection needs a short shutdown, which we schedule with you — often outside trading hours.", // CONFIRM
          },
          {
            question: "How do you size a commercial system?",
            answer:
              "From twelve months of your bills and the shape of your daytime load, not from the area of the roof. That keeps the system from being oversized — the most common reason a commercial payback runs long.",
          },
          {
            question: "Can the surplus be exported to the grid?",
            answer:
              "Yes, on a grid-tied system with net metering, units you export are credited against the ones you import. We explain the current terms for your connection when we quote.", // CONFIRM
          },
        ],
      },
      industrial: {
        audience: "factories",
        quoteLabel: "Factory",
        systems: [
          {
            name: "On-grid at scale",
            note: "Three-phase, grid-synchronised arrays across shed and rooftop, metered per hall so you can see exactly which production line the solar is carrying.",
            href: "/equipment#inverters",
          },
          {
            name: "Hybrid with storage",
            note: "Battery capacity sized to carry critical processes through a grid switchover — cold chain, controls, anything that loses product the moment it stops.",
            href: "/equipment#batteries",
          },
        ],
        faqs: [
          {
            question: "Can solar carry a three-shift load?",
            answer:
              "Not on its own, and anyone who says otherwise is overselling. Solar carries the daytime shifts — usually the heaviest — and storage can stretch into the evening. Night load stays on the grid or your generator. What changes is how much of the bill that leaves.",
          },
          {
            question: "Roof, shed or ground mount?",
            answer:
              "Whichever the site supports. Shed roofs are checked for structural capacity before anything is specified; where they fall short, unused land nearby often carries a ground-mount array more cheaply than reinforcing a roof.",
          },
          {
            question: "Will it interfere with our machinery?",
            answer:
              "No. Grid-tied inverters synchronise to your existing supply and feed the same busbar, so the plant sees one supply. Sizing takes your largest motor start-ups into account.",
          },
        ],
      },
      agricultural: {
        audience: "farms",
        quoteLabel: "Farm / tube-well",
        systems: [
          {
            name: "Solar pumping system",
            note: "Panels driving your pump directly through a solar pump drive, with no battery at all — the water you store is the storage. The simplest and most reliable setup for a tube-well.",
          },
          {
            name: "Off-grid system",
            note: "For farmhouses and sheds with no grid line, or one that cannot be relied upon — panels and a battery bank running lights, fans and milk chilling.",
            href: "/equipment#inverters",
          },
        ],
        faqs: [
          {
            question: "Can solar run my existing tube-well pump?",
            answer:
              "In most cases, yes. A solar pump drive runs standard submersible and surface pump motors; we size the array from the pump's rating, the well depth and the water you need each day.",
          },
          {
            question: "What happens on a cloudy day?",
            answer:
              "Output drops and the pump runs slower, then picks up as the sky clears. Across the Punjab irrigation season clear days far outnumber cloudy ones, which is exactly why solar pumping works here.",
          },
          {
            question: "Do I need batteries for irrigation?",
            answer:
              "Usually not. Pumping while the sun is up and storing water in a tank or pond is far cheaper than storing electricity in a battery, and there is nothing to replace in five years.",
          },
        ],
      },
    } satisfies Record<string, ServiceDetail>,

    /* Shared by every service page and the services index. */
    included: {
      eyebrow: "Every installation includes",
      heading: "One team, from survey to switch-on.",
      items: [
        { title: "Site survey", description: "We visit, measure the roof or land and read your bills." },
        { title: "Design and quote", description: "A sized system with a written, itemised price." },
        { title: "Supply", description: "Panels, inverter, batteries, structure and cabling." },
        { title: "Installation", description: "Mounting, wiring, earthing and protection." },
        { title: "Commissioning", description: "Tested, switched on and handed over to you." },
        { title: "Monitoring", description: "The app set up, so you can see what it produces." }, // where the inverter supports it
        { title: "Net metering", description: "Help with the application to your electricity company." }, // CONFIRM
        { title: "After-sales", description: "Service and warranty claims handled by us." },
      ] satisfies Point[],
    },
  },

  /* ---------------------------------------------------------------
     6. WHAT WE INSTALL — the home-page equipment wheel
     Labels only. The wheel's items come from the equipment catalogue
     below, via getProductFamilies() — there is one list, not two.
  --------------------------------------------------------------- */
  builder: {
    eyebrow: "What we install",
    nextLabel: "Next",
    /* Secondary button beside Next, through to the full equipment page. */
    moreLabel: "All equipment",
    moreHref: "/equipment",
  },

  /* ---------------------------------------------------------------
     6b. EQUIPMENT PAGE — /equipment
     Everything we supply and install, grouped the way we quote it.
  --------------------------------------------------------------- */
  equipment: {
    eyebrow: "Equipment",
    heading: "The equipment we install.",
    intro:
      "Panels, inverters and lithium battery banks from trusted manufacturers — supplied, installed and commissioned by our own team, and covered by the manufacturer's warranty.", // CONFIRM
    /* Under every product: opens the quote form with the item noted. */
    askLabel: "Get a price installed",
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
     7. KEY FIGURES — the hero widgets and the strip on inner pages
     Editable in the admin (the database overrides these). Each one is
     taken from your page or from details you supplied. Installed
     capacity or a count of systems installed would read stronger still
     — add them in the admin when you have the real numbers.
  --------------------------------------------------------------- */
  stats: [
    { value: "70-90%", label: "Cut from commercial bills" }, // from your site
    { value: "2-4 yrs", label: "Typical payback period" }, // from your site
    { value: "25 yrs", label: "Panel performance warranty" }, // from your site
    { value: "24/7", label: "Open every day" },
  ] satisfies Stat[],

  /* ---------------------------------------------------------------
     8. PROCESS
     How an installation runs from first call to handover. Check it
     against how you actually work and correct anything that's off.
  --------------------------------------------------------------- */
  process: {
    eyebrow: "How it works",
    heading: "From first call to first unit.",
    steps: [
      {
        title: "Site survey",
        description:
          "We visit, measure the roof or the land, go through your recent bills and record the loads that actually matter.", // CONFIRM
      },
      {
        title: "Design and quote",
        description:
          "You get a sized proposal: panel layout, inverter and battery selection, expected generation, an itemised price and a payback figure you can check yourself.", // CONFIRM
      },
      {
        title: "Installation",
        description:
          "Structure, panels, wiring and earthing, then inverter and battery commissioning — carried out by our own crew to a schedule agreed before anyone arrives.", // CONFIRM
      },
      {
        title: "Handover and aftercare",
        description:
          "We set up monitoring, help with the net-metering application, hand over the documents and stay on call for service and warranty.", // CONFIRM
      },
    ] satisfies Step[],
    cta: { label: "Start with a site survey", href: "/contact" },
  },

  /* ---------------------------------------------------------------
     9. WHY US
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
     10. FAQ — the home page. Each service page has its own set, under
     services.details.
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
        question: "What does an installation include?",
        answer:
          "Everything from the survey to switch-on: design and quote, supply of the panels, inverter, batteries, structure and cabling, installation, commissioning, monitoring set-up, help with net metering and after-sales service. One team, one point of contact.", // CONFIRM
      },
      {
        question: "Can you arrange net metering?",
        answer:
          "Yes — we prepare the technical side of the application and help you through it with your electricity company, so the units you export are credited against your bill.", // CONFIRM
      },
      {
        question: "What maintenance does it need?",
        answer:
          "Panels want occasional cleaning, more often through the dusty months. Lithium batteries need no topping up. Inverters get checked periodically and otherwise look after themselves.",
      },
    ] satisfies FaqItem[],
  },

  /* ---------------------------------------------------------------
     11. QUOTE — the form that closes every page, and the contact page
  --------------------------------------------------------------- */
  quote: {
    eyebrow: "Free quote",
    heading: "Find out what solar will save you.",
    body: "Tell us about the site and roughly what you pay each month. We'll come back with a sized system, an installed price and a payback estimate.", // CONFIRM
    reassurances: [
      "No-obligation quote",
      "Sized from your actual bills",
      "We answer every day, 24 hours",
    ],
    altLabel: "Rather talk it through?",
    form: {
      serviceLabel: "What is it for?",
      /* Values match the service ids, so a service page can preselect
         its own. "unsure" is always offered last. */
      services: [
        { value: "residential", label: "Home" },
        { value: "commercial", label: "Business" },
        { value: "industrial", label: "Factory" },
        { value: "agricultural", label: "Farm / tube-well" },
        { value: "unsure", label: "Not sure" },
      ],
      billLabel: "Monthly electricity bill",
      bills: [
        "Under Rs 15,000",
        "Rs 15,000 – 50,000",
        "Rs 50,000 – 2 lakh",
        "Over Rs 2 lakh",
      ],
      name: "Your name",
      phone: "Phone or WhatsApp",
      city: "City",
      cityPlaceholder: "Faisalabad",
      email: "Email",
      optional: "optional",
      message: "Anything else?",
      messagePlaceholder: "Roof size, current backup, the loads you want covered…",
      submit: "Get my free quote",
      sending: "Sending…",
      privacy: "We only use your number to discuss your quote.",
      successHeading: "Thank you — we have your details.",
      successBody:
        "We'll call you back shortly to arrange the survey. Want a faster answer? Message us on WhatsApp.",
    },
  },

  /* ---------------------------------------------------------------
     12. FOOTER
     The Services and Equipment columns are built from the database, the
     same lists the navigation uses.
  --------------------------------------------------------------- */
  footer: {
    blurb:
      "Solar installation for homes, businesses, factories and farms, from our base in Faisalabad.",
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Get a free quote", href: "/contact" },
    ] satisfies NavItem[],
    legal: "The energy division of Standard Group.", // CONFIRM
    /* Required credit for the CC BY photographs on the home page. Do not
       remove it while those images are in use — the licence only permits
       them if the author is credited. Swap in your own photography and
       this line can go. */
    imageCredits:
      "Photographs: Eneco Group; Stephen Yang / The Solutions Project (CC BY).",
  },

  /* ---------------------------------------------------------------
     13. INNER PAGES
  --------------------------------------------------------------- */
  pages: {
    about: {
      eyebrow: "About Us",
      heading: "The energy arm of Standard Group.",
      /* --------------------------------------------------------------
         The managing director. Every claim in this block is about a
         real person, so all of it is marked CONFIRM — read it through
         and correct anything that overstates. `name` prints under the
         photograph when it is set; leave it "" and only the role shows.
      -------------------------------------------------------------- */
      director: {
        image: "/images/team/managing-director.jpg",
        name: "", // CONFIRM — the name as it should appear in print
        role: "Managing Director",
        eyebrow: "Leadership",
        heading: "Decades on site, in every sector we serve.", // CONFIRM
        body: [
          "Standard Solar is led by its managing director, who has spent decades in solar in the field rather than behind a desk — surveying roofs and land himself, and sizing the systems that went onto them.", // CONFIRM
          "That range is the whole point. A tube-well that runs at full draw through the irrigation season, a mill on three shifts, an office that consumes only during daylight and a house that wants most of its power after sunset are four different problems wearing the same panels. Having solved all four, he sizes a system around what your site actually does — rather than reaching for the nearest package and hoping it fits.", // CONFIRM
          "It also means one person carries the standard. The figure you are quoted is one he has to stand behind, and the crew that turns up to install it is one he trained.", // CONFIRM
        ],
        /* The four sectors, and what he brings to each. */
        coverage: [
          {
            label: "Residential",
            note: "Rooftops from three to twenty kilowatts, where the load lands in the evening and the storage decision matters more than the array.", // CONFIRM
          },
          {
            label: "Commercial",
            note: "Offices, showrooms and warehouses that consume through the working day — the easiest case to get right, and the easiest to oversize.", // CONFIRM
          },
          {
            label: "Industrial",
            note: "Mills and manufacturing on heavy three-phase load, read from inside Standard Group's own textile operations.", // CONFIRM
          },
          {
            label: "Agricultural",
            note: "Tube-wells and farm supply, where the season sets the demand curve and grid quality cannot be relied upon.", // CONFIRM
          },
        ],
      },

      /* --------------------------------------------------------------
         The team. Roles rather than named individuals — send me names,
         photographs and titles and this becomes a people grid.
      -------------------------------------------------------------- */
      team: {
        eyebrow: "The team",
        heading: "The same people, survey to service.",
        intro:
          "A solar system is a twenty-five year commitment, not a sale. Everything below sits with us, so there is never a gap between whoever sold it and whoever has to fix it.", // CONFIRM
        roles: [
          {
            title: "Survey",
            description:
              "Someone comes to the site, measures the roof or the land, and reads your actual bills. No system is quoted from a phone call.", // CONFIRM
          },
          {
            title: "Design and sizing",
            description:
              "The array, inverter and storage are specified against your consumption and your budget — and we explain the trade-off rather than defaulting to one product line.", // CONFIRM
          },
          {
            title: "Installation",
            description:
              "Fitted by our own crews, trained in-house. No subcontractors, no handover to a third party you have never met.", // CONFIRM
          },
          {
            title: "After-sales",
            description:
              "One number to call for the life of the system, answered by people who know which array is yours.", // CONFIRM
          },
        ],
      },
    },
    services: {
      eyebrow: "Services",
      heading: "Solar installation, start to finish.",
      intro:
        "We survey, design, supply and install solar systems for homes, businesses, factories and farms — each sized from the site in front of us, and looked after long after the switch-on.", // CONFIRM
    },
    contact: {
      eyebrow: "Free quote",
      heading: "Get a free solar quote.",
      intro:
        "A few details and we'll call you back to arrange a survey. Already have a system? Use the same form for service and support.",
    },
  },

  /* ---------------------------------------------------------------
     14. SEO
  --------------------------------------------------------------- */
  seo: {
    titleTemplate: "Standard Solar",
    defaultTitle: "Solar Installation in Faisalabad — Standard Solar",
    defaultDescription:
      "Standard Solar installs solar panels, inverters and lithium batteries for homes, businesses, factories and farms in Faisalabad. Free quote, own installation team, 25-year panel warranty.",
    /* Appended to each service page title for local search. */
    serviceSuffix: "in Faisalabad",
    /* Live domain. standardsolar.com.pk is registered but stuck at the
       registrar; switch back to it once that is resolved.
       NEXT_PUBLIC_SITE_URL overrides this if set. */
    siteUrl: "https://standardsolar.site",
  },
} as const;

export type Site = typeof site;
