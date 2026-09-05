/* ==================================================================
   STANDARD SOLAR — SITE CONTENT
   ------------------------------------------------------------------
   This is the ONLY file you need to touch to put real copy on the
   site. Every visible string lives here.

   HOW TO USE
   1. Find the token you want, e.g. "[HERO_HEADLINE]".
   2. Replace the whole token — brackets included — with your text.
   3. Save. The site updates everywhere that string is used.

   Anything still wrapped in [SQUARE_BRACKETS] is a placeholder that
   has NOT been written yet.

   Text WITHOUT brackets was taken from your existing page at
   mystandardgroup.com/standard-solar and is marked "// from your site".
   Nothing on this site links to or loads anything from that domain —
   the wording was copied across and now lives here.
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
export type Testimonial = { quote: string; name: string; location: string };
export type BuilderItem = {
  name: string;
  spec: string;
  description: string;
  image: string;
};

export const site = {
  /* ---------------------------------------------------------------
     1. COMPANY DETAILS
     Used in the header, footer, contact page, phone buttons and the
     structured data that search engines read.
  --------------------------------------------------------------- */
  company: {
    name: "Standard Solar",
    tagline: "Powering Pakistan's Sustainable Future", // from your site
    /* Registered/legal name for the footer small print. */
    legalName: "[LEGAL_COMPANY_NAME]",
    /* Digits only — this is what the phone button dials. Built from
       041-8781130 on your site, in international form. */
    phone: "+92418781130", // from your site
    phoneDisplay: "041-8781130", // from your site
    email: "[EMAIL_ADDRESS]",
    address: ["62-A, 63-C, Ideal Town", "Sargodha Road", "Faisalabad"], // from your site
    /* Opening hours, one line per array entry. */
    hours: ["[HOURS_WEEKDAYS]", "[HOURS_WEEKEND]"],
    /* Company registration / accreditation numbers for the footer. */
    registration: "[COMPANY_REG_NUMBER]",
  },

  /* ---------------------------------------------------------------
     2. NAVIGATION
     Rename or remove items freely. Every href must match a real page
     folder in src/app/ or an #anchor on the home page.
  --------------------------------------------------------------- */
  nav: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /* The button on the far right of the desktop header. */
  headerCta: { label: "[HEADER_CTA_LABEL]", href: "/contact" },

  /* ---------------------------------------------------------------
     3. STICKY MOBILE BAR
     The bar pinned to the bottom of the screen on phones: one wide
     action button plus a square call button.
  --------------------------------------------------------------- */
  mobileBar: {
    /* Keep this SHORT — 3 words maximum, it has to fit a phone. */
    ctaLabel: "[MOBILE_CTA_LABEL]",
    ctaHref: "/contact",
    /* Screen-reader label for the square phone button. */
    callLabel: "[CALL_BUTTON_ARIA_LABEL]",
  },

  /* ---------------------------------------------------------------
     4. HERO — the first screen
  --------------------------------------------------------------- */
  hero: {
    /* Tiny line above the headline. 2–4 words. */
    eyebrow: "[HERO_EYEBROW]",
    /* The big statement. 4–8 words reads best at this size. */
    headline: "[HERO_HEADLINE]",
    /* Supporting sentence under the headline. 15–30 words. */
    subhead: "[HERO_SUBHEAD]",
    primaryCta: { label: "[HERO_PRIMARY_CTA]", href: "/contact" },
    secondaryCta: { label: "[HERO_SECONDARY_CTA]", href: "#solutions" },
    /* Drop a photo into /public/images/ and point to it, e.g.
       "/images/hero.jpg". Leave as-is to show the silver placeholder. */
    image: "",
    imageAlt: "[HERO_IMAGE_ALT_TEXT]",
  },

  /* ---------------------------------------------------------------
     5. SOLUTIONS — the four category cards below the hero
     All four titles, kickers, descriptions and tags below came from
     your existing page.
  --------------------------------------------------------------- */
  services: {
    eyebrow: "Our Solutions", // from your site
    heading: "Standard Solar Energy Solutions", // from your site
    intro: "Powering Pakistan's Sustainable Future", // from your site
    items: [
      {
        title: "Commercial Solar Systems", // from your site
        kicker: "For Businesses & Offices", // from your site
        description:
          "Reduce operational electricity costs by 70-90%, with ROI typically within 2-4 years.", // from your site
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
          "As leaders in textile and manufacturing through Standard Industries, we understand industrial power needs.", // from your site
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
          "System options from small 3-5 kW installations through to large 10-20 kW systems.", // from your site
        tags: ["Small systems 3-5 kW", "Large systems 10-20 kW"], // from your site
        image: "",
      },
      {
        title: "Agricultural Solar Solutions", // from your site
        kicker: "Solar Water Pumping Systems", // from your site
        description:
          "Eliminate diesel costs for irrigation, with support across wider farm operations.", // from your site
        tags: ["Irrigation", "Farm operations"], // from your site
        image: "",
      },
    ] satisfies Service[],
  },

  /* ---------------------------------------------------------------
     6. BUILD YOUR SYSTEM — the scroll-driven product browser
     Product families and type names came from your site. The `spec`
     figures that were published there are filled in; the rest are
     tokens waiting for your numbers.

     Scrolling through the section steps through every item in order.
     Add or remove items freely — the scroll length, the dots and the
     progress bar all recalculate themselves.
  --------------------------------------------------------------- */
  builder: {
    /* Small label at the top of the section. 2–4 words. */
    eyebrow: "Build your system",
    /* 3–6 words. */
    heading: "[BUILDER_HEADING]",
    /* Label on the button that advances to the next item. */
    nextLabel: "Next",
    families: [
      {
        id: "panels",
        label: "Panels", // from your site
        icon: "panel",
        /* Optional note shown beside the family name. Leave "" to hide. */
        note: "",
        items: [
          {
            name: "Monocrystalline", // from your site
            spec: "19-22% efficiency", // from your site
            description: "[PANEL_MONO_DESCRIPTION]",
            image: "",
          },
          {
            name: "Polycrystalline", // from your site
            spec: "15-17% efficiency", // from your site
            description: "[PANEL_POLY_DESCRIPTION]",
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
            spec: "[INVERTER_ONGRID_SPEC]",
            description: "[INVERTER_ONGRID_DESCRIPTION]",
            image: "",
          },
          {
            name: "Off-Grid", // from your site
            spec: "[INVERTER_OFFGRID_SPEC]",
            description: "[INVERTER_OFFGRID_DESCRIPTION]",
            image: "",
          },
          {
            name: "Hybrid", // from your site
            spec: "[INVERTER_HYBRID_SPEC]",
            description: "[INVERTER_HYBRID_DESCRIPTION]",
            image: "",
          },
          {
            name: "Micro", // from your site
            spec: "[INVERTER_MICRO_SPEC]",
            description: "[INVERTER_MICRO_DESCRIPTION]",
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
            spec: "[BATTERY_LITHIUM_SPEC]",
            description: "[BATTERY_LITHIUM_DESCRIPTION]",
            image: "",
          },
          {
            name: "Tubular", // from your site
            spec: "[BATTERY_TUBULAR_SPEC]",
            description: "[BATTERY_TUBULAR_DESCRIPTION]",
            image: "",
          },
          {
            name: "AGM", // from your site
            spec: "[BATTERY_AGM_SPEC]",
            description: "[BATTERY_AGM_DESCRIPTION]",
            image: "",
          },
        ] satisfies BuilderItem[],
      },
    ],
  },

  /* ---------------------------------------------------------------
     7. STATS STRIP — the four figures under the solutions grid
  --------------------------------------------------------------- */
  stats: [
    { value: "[STAT_1_VALUE]", label: "[STAT_1_LABEL]" },
    { value: "[STAT_2_VALUE]", label: "[STAT_2_LABEL]" },
    { value: "[STAT_3_VALUE]", label: "[STAT_3_LABEL]" },
    { value: "[STAT_4_VALUE]", label: "[STAT_4_LABEL]" },
  ] satisfies Stat[],

  /* ---------------------------------------------------------------
     8. INTRO BLOCK — the wide statement + tag list
  --------------------------------------------------------------- */
  intro: {
    /* Small marker on the left, e.g. a year or a short label. */
    marker: "[INTRO_MARKER]",
    /* Three short keywords listed under the marker. 1–3 words each. */
    tags: ["Commercial", "Industrial", "Residential"], // from your site
    /* The large statement on the right — your mission statement. */
    statement:
      "To make solar energy accessible, affordable, and reliable for Pakistani businesses and communities, contributing to energy independence and environmental sustainability.", // from your site
    /* Smaller block bottom-left. */
    heading: "[INTRO_SUB_HEADING]",
    body: "[INTRO_SUB_BODY]",
    cta: { label: "[INTRO_CTA_LABEL]", href: "/contact" },
  },

  /* ---------------------------------------------------------------
     9. PROCESS — numbered steps
  --------------------------------------------------------------- */
  process: {
    eyebrow: "[PROCESS_EYEBROW]",
    heading: "[PROCESS_HEADING]",
    steps: [
      { title: "[STEP_1_TITLE]", description: "[STEP_1_DESCRIPTION]" },
      { title: "[STEP_2_TITLE]", description: "[STEP_2_DESCRIPTION]" },
      { title: "[STEP_3_TITLE]", description: "[STEP_3_DESCRIPTION]" },
      { title: "[STEP_4_TITLE]", description: "[STEP_4_DESCRIPTION]" },
    ] satisfies Step[],
  },

  /* ---------------------------------------------------------------
     10. WHY US
  --------------------------------------------------------------- */
  whyUs: {
    eyebrow: "[WHY_US_EYEBROW]",
    heading: "[WHY_US_HEADING]",
    points: [
      { title: "[WHY_1_TITLE]", description: "[WHY_1_DESCRIPTION]" },
      { title: "[WHY_2_TITLE]", description: "[WHY_2_DESCRIPTION]" },
      { title: "[WHY_3_TITLE]", description: "[WHY_3_DESCRIPTION]" },
      { title: "[WHY_4_TITLE]", description: "[WHY_4_DESCRIPTION]" },
    ] satisfies Point[],
  },

  /* ---------------------------------------------------------------
     11. TESTIMONIALS
  --------------------------------------------------------------- */
  testimonials: {
    eyebrow: "[TESTIMONIALS_EYEBROW]",
    heading: "[TESTIMONIALS_HEADING]",
    items: [
      {
        quote: "[TESTIMONIAL_1_QUOTE]",
        name: "[TESTIMONIAL_1_NAME]",
        location: "[TESTIMONIAL_1_LOCATION]",
      },
      {
        quote: "[TESTIMONIAL_2_QUOTE]",
        name: "[TESTIMONIAL_2_NAME]",
        location: "[TESTIMONIAL_2_LOCATION]",
      },
      {
        quote: "[TESTIMONIAL_3_QUOTE]",
        name: "[TESTIMONIAL_3_NAME]",
        location: "[TESTIMONIAL_3_LOCATION]",
      },
    ] satisfies Testimonial[],
  },

  /* ---------------------------------------------------------------
     12. CLOSING CALL TO ACTION — the band above the footer
  --------------------------------------------------------------- */
  ctaBand: {
    heading: "[CTA_BAND_HEADING]",
    body: "[CTA_BAND_BODY]",
    primaryCta: { label: "[CTA_BAND_BUTTON]", href: "/contact" },
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
          { label: "Commercial Solar", href: "/services#solutions" }, // from your site
          { label: "Industrial Solar", href: "/services#solutions" }, // from your site
          { label: "Residential Solar", href: "/services#solutions" }, // from your site
          { label: "Agricultural Solar", href: "/services#solutions" }, // from your site
        ],
      },
    ],
    /* Small print line at the very bottom, next to the copyright. */
    legal: "[FOOTER_LEGAL_LINE]",
  },

  /* ---------------------------------------------------------------
     14. INNER PAGES
  --------------------------------------------------------------- */
  pages: {
    about: {
      eyebrow: "About Us",
      heading: "[ABOUT_HEADING]",
      /* One entry per paragraph — your mission and vision statements. */
      body: [
        "To make solar energy accessible, affordable, and reliable for Pakistani businesses and communities, contributing to energy independence and environmental sustainability.", // from your site
        "A Pakistan powered by clean, renewable energy—reducing dependence on fossil fuels, lowering electricity costs, and protecting our environment for future generations.", // from your site
      ],
    },
    services: {
      eyebrow: "Our Solutions", // from your site
      heading: "Standard Solar Energy Solutions", // from your site
      intro: "Powering Pakistan's Sustainable Future", // from your site
    },
    contact: {
      eyebrow: "[CONTACT_EYEBROW]",
      heading: "[CONTACT_HEADING]",
      intro: "[CONTACT_INTRO]",
      /* Labels on the enquiry form. */
      form: {
        name: "[FORM_LABEL_NAME]",
        email: "[FORM_LABEL_EMAIL]",
        phone: "[FORM_LABEL_PHONE]",
        city: "[FORM_LABEL_CITY]",
        message: "[FORM_LABEL_MESSAGE]",
        submit: "[FORM_SUBMIT_LABEL]",
        success: "[FORM_SUCCESS_MESSAGE]",
      },
    },
  },

  /* ---------------------------------------------------------------
     15. SEO
  --------------------------------------------------------------- */
  seo: {
    /* Appended after every page title, e.g. "About — Standard Solar" */
    titleTemplate: "Standard Solar",
    defaultTitle: "[SEO_HOME_TITLE]",
    defaultDescription: "[SEO_HOME_DESCRIPTION]",
    /* Set once the domain is live, e.g. "https://standardsolar.com.pk" */
    siteUrl: "[SITE_URL]",
  },
} as const;

export type Site = typeof site;
