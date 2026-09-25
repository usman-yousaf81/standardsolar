"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { hasWhatsApp, whatsappHref } from "@/lib/contact";
import { ButtonElement, ArrowRight } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Status = "idle" | "sending" | "sent" | "error";

const labels = site.quote.form;

const fieldClass =
  "h-12 w-full rounded-xl border border-hairline bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted/55 focus:border-navy/45";

const labelClass = "text-[12.5px] font-medium text-ink-soft";

/* A radio styled as a chip. The input stays in the page for keyboards
   and screen readers; the label carries the look. */
const chipClass =
  "relative inline-flex h-10 cursor-pointer select-none items-center rounded-full border border-hairline bg-white px-4 text-[13.5px] text-ink-soft transition-colors hover:border-navy/35 has-[input:checked]:border-navy has-[input:checked]:bg-navy has-[input:checked]:text-white has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-navy/40 has-[input:focus-visible]:ring-offset-2";

/**
 * The quote form. Built for a phone first: the two questions that size a
 * quote are one tap each, only name and number are required, and email
 * is optional — most customers here would rather be called or messaged.
 *
 * `service` preselects a chip (a service page passes its own). Without
 * it, `?service=` or `?interest=` in the address fill the form in, which
 * is how the equipment page's "get a price" links arrive.
 */
export function QuoteForm({
  service: presetService,
  className,
}: {
  service?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState(presetService ?? "");
  const [bill, setBill] = useState("");
  const [interest, setInterest] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (presetService) return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("service");
    if (fromUrl && labels.services.some((option) => option.value === fromUrl)) {
      setService(fromUrl);
    }
    setInterest(params.get("interest")?.slice(0, 120) ?? "");
  }, [presetService]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    if (!data.name?.trim() || !data.phone?.trim()) {
      setError("Please add your name and a phone number we can reach you on.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          service: labels.services.find((o) => o.value === service)?.label ?? "",
          bill,
          interest,
          page: pathname,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setName(data.name.trim());
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    const chosen = labels.services.find((o) => o.value === service)?.label;
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-start gap-4 rounded-card border border-hairline bg-white p-7 sm:p-8",
          className,
        )}
      >
        <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-9 text-navy">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.3" opacity="0.3" />
          <path
            d="m7.5 12.4 3.1 3.1L16.8 9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-[19px] font-semibold tracking-[-0.015em] text-ink">
            {labels.successHeading}
          </p>
          <p className="text-[14.5px] leading-relaxed text-ink-muted">
            {labels.successBody}
          </p>
        </div>
        {hasWhatsApp ? (
          <a
            href={whatsappHref(
              `Hi Standard Solar, I've just sent a quote request${
                chosen && service !== "unsure" ? ` for ${chosen.toLowerCase()} solar` : ""
              }${name ? ` — ${name}` : ""}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#1f8f4e] px-5 text-[14.5px] font-medium text-white transition hover:bg-[#1a7a43]"
          >
            <WhatsAppIcon className="size-5" />
            Continue on WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-6", className)}
    >
      <fieldset className="flex flex-col gap-2.5">
        <legend className={cn(labelClass, "mb-2.5")}>{labels.serviceLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {labels.services.map((option) => (
            <label key={option.value} className={chipClass}>
              <input
                type="radio"
                name="serviceChoice"
                value={option.value}
                checked={service === option.value}
                onChange={() => setService(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={cn(labelClass, "mb-2.5")}>
          {labels.billLabel}{" "}
          <span className="font-normal text-ink-muted">({labels.optional})</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {labels.bills.map((option) => (
            <label key={option} className={chipClass}>
              <input
                type="radio"
                name="billChoice"
                value={option}
                checked={bill === option}
                onChange={() => setBill(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {interest ? (
        <p className="-mt-1 rounded-xl bg-navy-tint px-4 py-3 text-[13.5px] text-ink-soft">
          Asking about: <span className="font-medium text-ink">{interest}</span>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="quote-name" className={labelClass}>
            {labels.name}
          </label>
          <input
            id="quote-name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quote-phone" className={labelClass}>
            {labels.phone}
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="03xx xxxxxxx"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quote-city" className={labelClass}>
            {labels.city}
          </label>
          <input
            id="quote-city"
            name="city"
            autoComplete="address-level2"
            placeholder={labels.cityPlaceholder}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quote-email" className={labelClass}>
            {labels.email}{" "}
            <span className="font-normal text-ink-muted">({labels.optional})</span>
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="quote-message" className={labelClass}>
          {labels.message}{" "}
          <span className="font-normal text-ink-muted">({labels.optional})</span>
        </label>
        <textarea
          id="quote-message"
          name="message"
          rows={3}
          placeholder={labels.messagePlaceholder}
          className={cn(fieldClass, "h-auto resize-y py-3")}
        />
      </div>

      {/* Honeypot — hidden from people, filled in by most bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="quote-company">Company</label>
        <input id="quote-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <ButtonElement
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="w-full justify-center sm:w-auto sm:self-start"
        >
          {status === "sending" ? labels.sending : labels.submit}
          <ArrowRight />
        </ButtonElement>
        <p className="text-[12px] text-ink-muted">{labels.privacy}</p>
      </div>
    </form>
  );
}
