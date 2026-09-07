import { AdminSidebar, AdminTopBar } from "@/components/admin/AdminNav";

/** The signed-in portal: sidebar on desktop, top bar on mobile. */
export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-mist lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <AdminSidebar />

      <div className="flex min-w-0 flex-col">
        <AdminTopBar />
        <main className="mx-auto w-full max-w-[980px] flex-1 px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
