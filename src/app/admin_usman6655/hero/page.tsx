import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getHero, getStats } from "@/lib/content";
import { Card, Field, PageTitle, inputClass } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveHero, saveStats } from "./actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Hero" };
export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  await requireAdmin();
  const [hero, stats] = await Promise.all([getHero(), getStats()]);

  return (
    <div className="flex flex-col gap-10">
      <PageTitle
        title="Hero"
        description="The first screen of the home page. Two photographs, because the crops differ — the phone gets a tall one, the laptop a wide one."
      />

      <form action={saveHero} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <Field label="Eyebrow" hint="Small line above the headline. 2–4 words.">
            <input name="eyebrow" defaultValue={hero.eyebrow} className={inputClass} />
          </Field>

          <Field label="Headline" hint="4–8 words reads best at this size.">
            <input name="headline" defaultValue={hero.headline} required className={inputClass} />
          </Field>

          <Field label="Subhead" hint="15–30 words.">
            <textarea
              name="subhead"
              rows={3}
              defaultValue={hero.subhead}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
        </Card>

        <Card className="flex flex-col gap-8">
          <ImageField
            name="mobileImage"
            label="Phone image (tall)"
            folder="hero"
            defaultValue={hero.mobileImage}
            hint="Portrait. At least 1200px wide for a sharp result on a modern phone."
          />
          <Field label="Phone image description" hint="Read aloud by screen readers.">
            <input name="mobileImageAlt" defaultValue={hero.mobileImageAlt} className={inputClass} />
          </Field>

          <ImageField
            name="desktopImage"
            label="Laptop image (wide)"
            folder="hero"
            defaultValue={hero.desktopImage}
            hint="Landscape. At least 2400px wide — it fills the whole screen."
          />
          <Field label="Laptop image description">
            <input name="desktopImageAlt" defaultValue={hero.desktopImageAlt} className={inputClass} />
          </Field>
        </Card>

        <SaveBar label="Save hero" />
      </form>

      <form action={saveStats} className="flex flex-col gap-6">
        <PageTitle
          title="Headline figures"
          description="The four glass widgets laid over the hero photograph. Leave a pair blank to drop it."
        />

        <Card className="grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Field label={`Figure ${i + 1}`}>
                <input
                  name={`value-${i}`}
                  defaultValue={stats[i]?.value ?? ""}
                  placeholder="70-90%"
                  className={inputClass}
                />
              </Field>
              <Field label="Label">
                <input
                  name={`label-${i}`}
                  defaultValue={stats[i]?.label ?? ""}
                  placeholder="Cut from commercial bills"
                  className={inputClass}
                />
              </Field>
            </div>
          ))}
        </Card>

        <SaveBar label="Save figures" />
      </form>
    </div>
  );
}
