import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; next?: string }>;
}) {
  const { denied } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-5 py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
        Standard Solar
      </p>
      <h1 className="mt-3 font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">
        Admin sign in
      </h1>

      {!isSupabaseConfigured ? (
        <p className="mt-6 rounded-card border border-hairline bg-mist p-4 text-[13.5px] leading-relaxed text-ink-muted">
          The database is not connected yet. Add the Supabase keys to
          <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[12px]">
            .env.local
          </code>
          and restart the server.
        </p>
      ) : (
        <>
          {denied ? (
            <p
              role="alert"
              className="mt-6 rounded-card border border-signal/25 bg-signal/5 p-4 text-[13.5px] leading-relaxed text-ink"
            >
              That account is signed in but is not an administrator. Ask an
              existing admin to grant access.
            </p>
          ) : null}
          <LoginForm />
        </>
      )}
    </div>
  );
}
