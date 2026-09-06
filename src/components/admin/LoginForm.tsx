"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { ADMIN_PATH } from "@/lib/admin/config";
import { Field, buttonClass, inputClass } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    if (!supabase) {
      setError("The database is not connected.");
      setBusy(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (signInError) {
      // Deliberately vague: naming which half was wrong tells an
      // attacker which addresses exist.
      setError("That email and password did not match.");
      setBusy(false);
      return;
    }

    router.replace(ADMIN_PATH);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className={inputClass}
        />
      </Field>

      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      {error ? (
        <p role="alert" className="text-[13px] text-signal">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
