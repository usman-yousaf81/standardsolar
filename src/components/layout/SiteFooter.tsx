import Link from "next/link";
import { site } from "@/content/site";
import { hasWhatsApp, telHref, whatsappHref } from "@/lib/contact";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import type { MobileNavItem } from "@/components/layout/SiteHeader";

const headingClass =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-ink";
const linkClass = "text-sm text-ink-muted transition-colors hover:text-navy";

/**
 * Services and Equipment are passed in from the layout — the same lists
 * the navigation is built from — so the footer can never name a
 * category the admin has since renamed.
 */
export function SiteFooter({
  services,
  equipment,
}: {
  services: MobileNavItem;
  equipment: MobileNavItem;
}) {
  const year = new Date().getFullYear();

  const columns = [
    { title: services.label, href: services.href, links: services.children ?? [] },
    { title: equipment.label, href: equipment.href, links: equipment.children ?? [] },
    { title: "Company", href: null, links: site.footer.company },
  ];

  return (
    <footer className="border-t border-hairline bg-mist">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(3,0.8fr)_1.05fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-[34ch] text-sm leading-relaxed text-ink-muted">
              {site.footer.blurb}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className={headingClass}>
                {col.href ? (
                  <Link href={col.href} className="transition-colors hover:text-navy">
                    {col.title}
                  </Link>
                ) : (
                  col.title
                )}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-muted">
              <li>
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-navy"
                >
                  <PhoneIcon className="size-4" />
                  {site.company.phoneDisplay}
                </a>
              </li>
              {hasWhatsApp ? (
                <li>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-navy"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${site.company.email}`}
                  className="break-all transition-colors hover:text-navy"
                >
                  {site.company.email}
                </a>
              </li>
              <li className="pt-1">
                <address className="not-italic leading-relaxed">
                  {site.company.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="pt-1 leading-relaxed">
                {site.company.hours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.company.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{site.footer.legal}</span>
            <span>{site.footer.imageCredits}</span>
            {site.company.registration ? (
              <span>{site.company.registration}</span>
            ) : null}
          </p>
        </div>
      </Container>
    </footer>
  );
}
