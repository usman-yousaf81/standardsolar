import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  /** Chip label from the form, e.g. "Home". */
  service?: string;
  /** Bill range chip, e.g. "Rs 15,000 – 50,000". */
  bill?: string;
  /** Product the customer arrived from, via ?interest=. */
  interest?: string;
  /** Path of the page the form was sent from. */
  page?: string;
  /** Honeypot field — should always be empty for a real person. */
  company?: string;
};

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let data: Payload;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept and drop anything that filled the honeypot.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(data.name, 120);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 200);

  /* Phone is what the team calls back on, so it is the one contact
     detail that is required. Email is optional. */
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Please add your name and a phone number we can reach you on." },
      { status: 400 },
    );
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return NextResponse.json(
      { error: "That phone number doesn't look right — please check it." },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  /* Service, bill and source page ride at the top of the message rather
     than in columns of their own, so the form works against the schema
     as it stands — no migration has to land before a lead can. */
  const context = [
    ["Service", clean(data.service, 60)],
    ["Monthly bill", clean(data.bill, 60)],
    ["Asking about", clean(data.interest, 120)],
    ["Sent from", clean(data.page, 120)],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  const note = clean(data.message, 4000);
  const message = [context.join("\n"), note].filter(Boolean).join("\n\n");

  const enquiry = {
    name,
    // The column is NOT NULL; an empty string means "none given".
    email,
    phone,
    city: clean(data.city, 80) || null,
    message: message || null,
  };

  // Anon inserts are allowed by policy; reads are admin-only, so a
  // leaked anon key cannot pull the enquiry list back out.
  const supabase = createPublicClient();

  if (supabase) {
    const { error } = await supabase.from("enquiries").insert(enquiry);

    if (error) {
      console.error("[enquiry] insert failed", error);
      return NextResponse.json(
        { error: "We couldn't send that just now. Please try again, or call us." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // No database yet — log it so nothing submitted during setup is lost.
  console.info("[enquiry] (no database configured)", {
    ...enquiry,
    receivedAt: new Date().toISOString(),
  });

  if (!isSupabaseConfigured && process.env.NODE_ENV === "production") {
    console.warn(
      "[enquiry] Supabase is not configured — this enquiry exists only in the server log.",
    );
  }

  return NextResponse.json({ ok: true });
}
