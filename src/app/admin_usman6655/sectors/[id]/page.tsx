import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/config";
import { Card, Field, PageTitle, inputClass } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { SaveBar } from "@/components/admin/SaveBar";
import { TestimonialList } from "@/components/admin/TestimonialList";
import { ProjectList } from "@/components/admin/ProjectList";
import { saveSector } from "../actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export type Testimonial = {
  id: string;
  sector_id: string;
  quote: string;
  name: string;
  role: string;
  is_published: boolean;
};

export type Project = {
  id: string;
  sector_id: string;
  name: string;
  location: string;
  capacity: string;
  summary: string;
  is_published: boolean;
};

type Sector = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  overview: string;
  applications: string[] | null;
  figures: { value: string; label: string }[] | null;
  image_url: string | null;
  is_published: boolean;
  sector_projects: Project[] | null;
  testimonials: Testimonial[] | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} sector` };
}

export default async function SectorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("sectors")
    .select(
      `id, title, kicker, description, overview, applications, figures,
       image_url, is_published,
       sector_projects ( id, sector_id, name, location, capacity, summary, is_published ),
       testimonials ( id, sector_id, quote, name, role, is_published )`,
    )
    .eq("id", id)
    .maybeSingle();

  const sector = data as Sector | null;
  if (!sector) notFound();

  const figureLines = (sector.figures ?? [])
    .map((figure) => `${figure.value} | ${figure.label}`)
    .join("\n");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Link
          href={`${ADMIN_PATH}/sectors`}
          className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-muted hover:text-ink"
        >
          ← All sectors
        </Link>
        <PageTitle
          title={sector.title}
          description="Everything on this sector's page. The photograph is also used on the home page card and the sectors index."
        />
      </div>

      <form action={saveSector} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={sector.id} />

        <Card className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input name="title" defaultValue={sector.title} required className={inputClass} />
            </Field>
            <Field label="Kicker" hint="Who it is for, e.g. For Businesses & Offices.">
              <input name="kicker" defaultValue={sector.kicker} className={inputClass} />
            </Field>
          </div>

          <Field label="Description" hint="The large statement near the top of the page.">
            <textarea
              name="description"
              rows={3}
              defaultValue={sector.description}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <Field label="Overview" hint="The longer paragraph underneath it.">
            <textarea
              name="overview"
              rows={5}
              defaultValue={sector.overview}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
        </Card>

        <Card className="flex flex-col gap-5">
          <Field
            label="Where we work"
            hint="One per line. These become the list on the sector page."
          >
            <textarea
              name="applications"
              rows={6}
              defaultValue={(sector.applications ?? []).join("\n")}
              className={cn(inputClass, "resize-y font-mono text-[13px]")}
            />
          </Field>

          <Field
            label="Figures"
            hint="One per line as: value | label. e.g. 70-90% | Cut from electricity costs. Leave empty for none."
          >
            <textarea
              name="figures"
              rows={3}
              defaultValue={figureLines}
              placeholder="70-90% | Cut from electricity costs"
              className={cn(inputClass, "resize-y font-mono text-[13px]")}
            />
          </Field>
        </Card>

        <Card className="flex flex-col gap-5">
          <ImageField
            name="image_url"
            label="Photograph"
            folder="sectors"
            defaultValue={sector.image_url ?? ""}
            hint="Used on this page's hero, the home page card and the sectors index. Portrait or landscape both work — it is cropped to fit."
          />

          <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={sector.is_published}
              className="size-4 accent-[var(--color-navy)]"
            />
            Show on the website
          </label>
        </Card>

        <SaveBar label="Save sector" />
      </form>

      <ProjectList
        sectorId={sector.id}
        projects={(sector.sector_projects ?? []).slice()}
      />

      <TestimonialList
        sectorId={sector.id}
        testimonials={(sector.testimonials ?? []).slice()}
      />
    </div>
  );
}
