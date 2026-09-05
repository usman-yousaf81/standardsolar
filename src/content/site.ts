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
   has NOT been written yet. Nothing here is invented copy.

   The comment above each field says what belongs there and roughly
   how long it should be so the layout keeps its proportions.
================================================================== */

export type NavItem = { label: string; href: string };
export type Stat = { value: string; label: string };
export type Service = { title: string; description: string; image: string };
export type Step = { title: string; description: string };
export type Point = { title: string; description: string };
export type Testimonial = { quote: string; name: string; location: string };

export const site = {
  /* ---------------------------------------------------------------
     1. COMPANY DETAILS
     Used in the header, footer, contact page, phone buttons and the
     structured data that search engines read.
  --------------------------------------------------------------- */
  company: {
    name: "Standard Solar",
    /* Short line under the logo in the footer. 6–12 words. */
    tagline: "[COMPANY_TAGLINE]",
    /* Registered/legal name for the footer small print. */
    legalName: "[LEGAL_COMPANY_NAME]",
    /* Digits only, no spaces — this is what the phone button dials.
       e.g. "+441234567890" */
    phone: "[PHONE_NUMBER_DIAL]",
    /* The same number formatted for humans to read.
       e.g. "0123 456 7890" */
    phoneDisplay: "[PHONE_NUMBER_DISPLAY]",
    email: "[EMAIL_ADDRESS]",
    /* Street address, one line per array entry. */
    address: ["[ADDRESS_LINE_1]", "[ADDRESS_LINE_2]", "[POSTCODE]"],
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
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /* The button on the far right of the desktop header. */
  headerCta: { label: "[HEADER_CTA_LABEL]", href: "/contact" },

  /* ---------------------------------------------------------------
     3. STICKY MOBILE BAR
     The bar pinned to the bottom of the screen on phones: one wide
     action button plus a square call button, per your reference.
  --------------------------------------------------------------- */
  mobileBar: {
    /* Keep this SHORT — 3 words maximum, it has to fit a phone.
       e.g. "Check your eligibility" */
    ctaLabel: "[MOBILE_CTA_LABEL]",
    ctaHref: "/contact",
    /* Screen-reader label for the round phone button. */
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
    secondaryCta: { label: "[HERO_SECONDARY_CTA]", href: "/services" },
    /* Drop a photo into /public/images/ and point to it, e.g.
       "/images/hero.jpg". Leave as-is to show the silver placeholder. */
    image: "",
    imageAlt: "[HERO_IMAGE_ALT_TEXT]",
  },

  /* ---------------------------------------------------------------
     5. STATS STRIP — the four figures under the hero
  --------------------------------------------------------------- */
  stats: [
    { value: "[STAT_1_VALUE]", label: "[STAT_1_LABEL]" },
    { value: "[STAT_2_VALUE]", label: "[STAT_2_LABEL]" },
    { value: "[STAT_3_VALUE]", label: "[STAT_3_LABEL]" },
    { value: "[STAT_4_VALUE]", label: "[STAT_4_LABEL]" },
  ] satisfies Stat[],

  /* ---------------------------------------------------------------
     6. INTRO BLOCK — the wide statement + tag list
  --------------------------------------------------------------- */
  intro: {
    /* Small marker on the left, e.g. a year or a short label. */
    marker: "[INTRO_MARKER]",
    /* Three short keywords listed under the marker. 1–3 words each. */
    tags: ["[INTRO_TAG_1]", "[INTRO_TAG_2]", "[INTRO_TAG_3]"],
    /* The large statement on the right. 25–45 words. */
    statement: "[INTRO_STATEMENT]",
    /* Smaller block bottom-left. */
    heading: "[INTRO_SUB_HEADING]",
    body: "[INTRO_SUB_BODY]",
    cta: { label: "[INTRO_CTA_LABEL]", href: "/contact" },
  },

  /* ---------------------------------------------------------------
     7. SERVICES
     Add or remove items — the grid reflows automatically.
  --------------------------------------------------------------- */
  services: {
    eyebrow: "[SERVICES_EYEBROW]",
    /* 3–6 words. */
    heading: "[SERVICES_HEADING]",
    /* 20–35 words. */
    intro: "[SERVICES_INTRO]",
    items: [
      {
        title: "[SERVICE_1_TITLE]",
        description: "[SERVICE_1_DESCRIPTION]",
        image: "",
      },
      {
        title: "[SERVICE_2_TITLE]",
        description: "[SERVICE_2_DESCRIPTION]",
        image: "",
      },
      {
        title: "[SERVICE_3_TITLE]",
        description: "[SERVICE_3_DESCRIPTION]",
        image: "",
      },
      {
        title: "[SERVICE_4_TITLE]",
        description: "[SERVICE_4_DESCRIPTION]",
        image: "",
      },
    ] satisfies Service[],
  },

  /* ---------------------------------------------------------------
     8. PROCESS — numbered steps
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
     9. WHY US
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
     10. TESTIMONIALS
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
     11. CLOSING CALL TO ACTION — the band above the footer
  --------------------------------------------------------------- */
  ctaBand: {
    heading: "[CTA_BAND_HEADING]",
    body: "[CTA_BAND_BODY]",
    primaryCta: { label: "[CTA_BAND_BUTTON]", href: "/contact" },
  },

  /* ---------------------------------------------------------------
     12. FOOTER
  --------------------------------------------------------------- */
  footer: {
    /* Column headings and their links. */
    columns: [
      {
        title: "[FOOTER_COL_1_TITLE]",
        links: [
          { label: "[FOOTER_LINK_1]", href: "/about" },
          { label: "[FOOTER_LINK_2]", href: "/services" },
          { label: "[FOOTER_LINK_3]", href: "/contact" },
        ],
      },
      {
        title: "[FOOTER_COL_2_TITLE]",
        links: [
          { label: "[FOOTER_LINK_4]", href: "/services" },
          { label: "[FOOTER_LINK_5]", href: "/services" },
          { label: "[FOOTER_LINK_6]", href: "/services" },
        ],
      },
    ],
    /* Small print line at the very bottom, next to the copyright. */
    legal: "[FOOTER_LEGAL_LINE]",
  },

  /* ---------------------------------------------------------------
     13. INNER PAGES
  --------------------------------------------------------------- */
  pages: {
    about: {
      eyebrow: "[ABOUT_EYEBROW]",
      heading: "[ABOUT_HEADING]",
      /* One entry per paragraph. Add as many as you need. */
      body: ["[ABOUT_PARAGRAPH_1]", "[ABOUT_PARAGRAPH_2]"],
    },
    services: {
      eyebrow: "[SERVICES_PAGE_EYEBROW]",
      heading: "[SERVICES_PAGE_HEADING]",
      intro: "[SERVICES_PAGE_INTRO]",
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
        postcode: "[FORM_LABEL_POSTCODE]",
        message: "[FORM_LABEL_MESSAGE]",
        submit: "[FORM_SUBMIT_LABEL]",
        /* Shown after a successful submission. */
        success: "[FORM_SUCCESS_MESSAGE]",
      },
    },
  },

  /* ---------------------------------------------------------------
     14. SEO
     Title and description used per page in the browser tab and in
     Google results.
  --------------------------------------------------------------- */
  seo: {
    /* Appended after every page title, e.g. "About — Standard Solar" */
    titleTemplate: "Standard Solar",
    defaultTitle: "[SEO_HOME_TITLE]",
    defaultDescription: "[SEO_HOME_DESCRIPTION]",
    /* Set once the domain is live, e.g. "https://standardsolar.co.uk" */
    siteUrl: "[SITE_URL]",
  },
} as const;

export type Site = typeof site;
