import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Button";
import { BuilderIcon } from "@/components/ui/BuilderIcons";

const icons = ["panel", "inverter", "battery"] as const;

/** Three jump links to the family sections further down the page. */
export function ProductIndex() {
  return (
    <section aria-label="Product families" className="border-b border-hairline">
      <Container className="px-0 sm:px-8">
        <ul className="grid sm:grid-cols-3">
          {site.products.families.map((family, i) => (
            <li key={family.id} className="sm:border-r sm:border-hairline sm:last:border-r-0">
              <Link
                href={`#${family.id}`}
                className="group flex items-center justify-between gap-4 border-b border-hairline px-5 py-6 transition-colors hover:bg-mist sm:h-full sm:flex-col sm:items-start sm:justify-start sm:gap-3 sm:border-b-0 sm:px-6 sm:py-8"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-silver text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                    <BuilderIcon name={icons[i]} />
                  </span>
                  <span className="font-display text-[15px] font-semibold tracking-[-0.015em] text-ink">
                    {family.label}
                  </span>
                </span>

                <span className="flex items-center gap-2 text-[12px] text-ink-muted sm:mt-auto">
                  {family.types.length} types
                  <ArrowRight className="size-3.5 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
