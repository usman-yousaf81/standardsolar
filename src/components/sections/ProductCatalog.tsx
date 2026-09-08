import type { ProductCategory, Product } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { BuilderIcon } from "@/components/ui/BuilderIcons";

/**
 * The whole catalogue: photographs first, words only where they carry a
 * fact. A category either splits into sub-categories or lists its
 * products directly, and both cases end in the same grid of cards, so
 * the page reads the same depth whether or not a category is split.
 */
export function ProductCatalog({
  categories,
}: {
  categories: readonly ProductCategory[];
}) {
  return (
    <>
      {categories.map((category, index) => (
        <Section
          key={category.id}
          id={category.id}
          className={cn(index > 0 && "border-t border-hairline")}
        >
          <Container>
            <header className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                <BuilderIcon name={category.icon} />
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
                {category.label}
              </h2>
              {category.note ? (
                <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
                  {category.note}
                </p>
              ) : null}
            </header>

            {/* Facts that hold for everything in the category. */}
            {category.specs.length ? (
              <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                      {spec.label}
                    </dt>
                    <dd className="text-[14px] leading-snug text-ink">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Products hanging straight off the category. */}
            {category.products.length ? (
              <ProductGrid products={category.products} className="mt-10" />
            ) : null}

            {/* Sub-categories, each with its own grid. */}
            {category.groups.map((group) => (
              <section key={group.id} className="mt-14 first:mt-10">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                    {group.label}
                  </h3>
                  {group.note ? (
                    <p className="max-w-xl text-[14px] leading-relaxed text-ink-muted">
                      {group.note}
                    </p>
                  ) : null}
                </div>
                <ProductGrid products={group.products} className="mt-7" />
              </section>
            ))}
          </Container>
        </Section>
      ))}
    </>
  );
}

function ProductGrid({
  products,
  className,
}: {
  products: readonly Product[];
  className?: string;
}) {
  if (!products.length) return null;

  return (
    <ul
      className={cn(
        "grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="flex flex-col">
          {/* The photograph is the point, so it gets a square box and no
              panel behind it — product shots are uploaded as cut-outs
              and sit straight on the page. */}
          <MediaSlot
            src={product.image}
            alt={product.name}
            label={product.name.toUpperCase()}
            className="aspect-square w-full"
            fit="contain"
            surface="none"
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 96vw"
          />

          <div className="mt-4 flex flex-col gap-1">
            <h4 className="font-display text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink">
              {product.name}
            </h4>
            {product.tagline ? (
              <p className="text-[13.5px] leading-snug text-ink-muted">
                {product.tagline}
              </p>
            ) : null}
          </div>

          {product.specs.length ? (
            <dl className="mt-3 flex flex-col gap-1.5 border-t border-hairline pt-3">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="shrink-0 text-[12px] text-ink-muted">
                    {spec.label}
                  </dt>
                  <dd className="text-right text-[12.5px] font-medium text-ink">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
