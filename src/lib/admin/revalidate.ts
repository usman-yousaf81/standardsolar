import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";
import { ADMIN_PATH } from "./config";

/**
 * Called after every content write.
 *
 * Public pages are statically generated and read through a cache tagged
 * `content`. Dropping that tag is what makes an admin save appear on the
 * live site straight away, instead of visitors waiting out the hour or
 * every request paying for a query.
 */
export function publishContent(...adminPaths: string[]) {
  revalidateTag(CONTENT_TAG);

  // The public routes that render database content.
  revalidatePath("/", "layout");

  revalidatePath(ADMIN_PATH);
  adminPaths.forEach((path) => revalidatePath(path));
}
