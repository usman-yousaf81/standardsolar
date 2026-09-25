import { site } from "@/content/site";

/**
 * Every way into a conversation, built in one place so a number change
 * in site.ts reaches every button on the site.
 */

export const telHref = `tel:${site.company.phone}`;

/** False when no WhatsApp number is set — every WhatsApp button hides. */
export const hasWhatsApp = Boolean(site.company.whatsapp);

/**
 * A wa.me link with the first message already typed, so the customer
 * only has to press send. Pass a line about what they were looking at
 * and the enquiry arrives with its context.
 */
export function whatsappHref(message: string = site.company.whatsappGreeting) {
  return `https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(message)}`;
}
