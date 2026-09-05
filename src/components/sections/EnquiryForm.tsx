"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { ButtonElement, ArrowRight } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "h-12 w-full rounded-xl border border-hairline bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-navy/40";

const labelClass =
  "text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const labels = site.pages.contact.form;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-card border border-hairline bg-mist p-8"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="size-8 text-navy"
        >
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeWidth="1.3"
            opacity="0.3"
          />
          <path
            d="m7.5 12.4 3.1 3.1L16.8 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[15px] leading-relaxed text-ink">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            {labels.name}
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelClass}>
            {labels.phone}
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="postcode" className={labelClass}>
            {labels.postcode}
          </label>
          <input id="postcode" name="postcode" className={fieldClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${fieldClass} h-auto resize-y py-3.5`}
        />
      </div>

      {/* Honeypot — hidden from people, filled in by most bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          {error}
        </p>
      ) : null}

      <ButtonElement
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="self-start"
      >
        {status === "sending" ? "Sending…" : labels.submit}
        <ArrowRight />
      </ButtonElement>
    </form>
  );
}
