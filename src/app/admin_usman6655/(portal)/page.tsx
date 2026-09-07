import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/config";
import { Card, PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function counts(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>["supabase"]) {
  const head = { count: "exact" as const, head: true };

  const [enquiries, unread, sectors, products, testimonials] =
    await Promise.all([
      supabase.from("enquiries").select("id", head),
      supabase.from("enquiries").select("id", head).eq("status", "new"),
      supabase.from("sectors").select("id", head),
      supabase.from("products").select("id", head),
      supabase.from("testimonials").select("id", head),
    ]);

  return {
    enquiries: enquiries.count ?? 0,
    unread: unread.count ?? 0,
    sectors: sectors.count ?? 0,
    products: products.count ?? 0,
    testimonials: testimonials.count ?? 0,
  };
}

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();
  const stats = await counts(supabase);

  const tiles = [
    {
      label: "New enquiries",
      value: stats.unread,
      href: `${ADMIN_PATH}/enquiries?status=new`,
      accent: stats.unread > 0,
    },
    {
      label: "Enquiries in total",
      value: stats.enquiries,
      href: `${ADMIN_PATH}/enquiries`,
    },
    { label: "Sectors", value: stats.sectors, href: `${ADMIN_PATH}/sectors` },
    { label: "Products", value: stats.products, href: `${ADMIN_PATH}/products` },
    {
      label: "Testimonials",
      value: stats.testimonials,
      href: `${ADMIN_PATH}/sectors`,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Overview"
        description="Everything the website shows is edited from here. Changes go live the moment they are saved."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Link href={tile.href} className="block">
              <Card className="transition-colors hover:border-navy/35">
                <p className="font-display text-[30px] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
                  {tile.value}
                  {tile.accent ? (
                    <span className="ml-2 inline-block size-2 translate-y-[-6px] rounded-full bg-signal align-middle" />
                  ) : null}
                </p>
                <p className="mt-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {tile.label}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
