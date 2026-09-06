import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/config";
import { cn } from "@/lib/utils";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { EnquiryRow } from "@/components/admin/EnquiryRow";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;

  let query = supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  const enquiries = (data ?? []) as Enquiry[];

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Enquiries"
        description="Everything submitted through the contact form. Set a status as you work each one, and add notes for whoever picks it up next."
      />

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          return (
            <Link
              key={filter.label}
              href={
                filter.value
                  ? `${ADMIN_PATH}/enquiries?status=${filter.value}`
                  : `${ADMIN_PATH}/enquiries`
              }
              className={cn(
                "rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                active
                  ? "bg-ink text-white"
                  : "bg-white text-ink-soft ring-1 ring-hairline hover:text-ink",
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          Could not load enquiries: {error.message}
        </p>
      ) : enquiries.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body={
            status
              ? "No enquiries with that status. Try another filter."
              : "When someone submits the contact form on the website, it will appear here."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {enquiries.map((enquiry) => (
            <EnquiryRow key={enquiry.id} enquiry={enquiry} />
          ))}
        </ul>
      )}
    </div>
  );
}
