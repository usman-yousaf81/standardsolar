import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-mist">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(3,0.8fr)_1.05fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-[34ch] text-sm leading-relaxed text-ink-muted">
              {site.company.tagline}
            </p>
          </div>

          {/* Link columns */}
          {site.footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-navy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-muted">
              <li>
                <a
                  href={`tel:${site.company.phone}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-navy"
                >
                  <PhoneIcon className="size-4" />
                  {site.company.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.company.email}`}
                  className="transition-colors hover:text-navy"
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
            {site.company.registration ? (
              <span>{site.company.registration}</span>
            ) : null}
          </p>
        </div>
      </Container>
    </footer>
  );
}
