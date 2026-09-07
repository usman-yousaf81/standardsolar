import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/config";
import { EmptyState, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Sectors" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  position: number;
  title: string;
  kicker: string;
  image_url: string | null;
  is_published: boolean;
  sector_projects: { id: string }[] | null;
  testimonials: { id: string }[] | null;
};

export default async function SectorsAdminPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("sectors")
    .select(
      "id, position, title, kicker, image_url, is_published, sector_projects(id), testimonials(id)",
    )
    .order("position");

  const sectors = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Sectors"
        description="The four sectors, their photographs and copy, plus the work and client quotes shown on each sector's own page."
      />

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          Could not load sectors: {error.message}
        </p>
      ) : sectors.length === 0 ? (
        <EmptyState
          title="No sectors"
          body="Run supabase/setup.sql to load the starting content."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {sectors.map((sector) => (
            <li key={sector.id}>
              <Link
                href={`${ADMIN_PATH}/sectors/${sector.id}`}
                className="flex h-full gap-4 rounded-card border border-hairline bg-white p-4 transition-colors hover:border-navy/35"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-silver">
                  {sector.image_url ? (
                    <Image
                      src={sector.image_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </span>

                <span className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-[14.5px] font-medium text-ink">
                    {sector.title}
                  </span>
                  <span className="truncate text-[12.5px] text-ink-muted">
                    {sector.kicker}
                  </span>
                  <span className="mt-1 text-[12px] text-ink-muted">
                    {sector.sector_projects?.length ?? 0} projects ·{" "}
                    {sector.testimonials?.length ?? 0} quotes
                    {!sector.is_published ? " · hidden" : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
