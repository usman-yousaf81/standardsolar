import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  /** Honeypot field — should always be empty for a real person. */
  company?: string;
};

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

  const name = data.name?.trim();
  const email = data.email?.trim();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Please provide your name and email address." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const enquiry = {
    name,
    email,
    phone: data.phone?.trim() || null,
    city: data.city?.trim() || null,
    message: data.message?.trim() || null,
  };

  // Anon inserts are allowed by policy; reads are admin-only, so a
  // leaked anon key cannot pull the enquiry list back out.
  const supabase = createPublicClient();

  if (supabase) {
    const { error } = await supabase.from("enquiries").insert(enquiry);

    if (error) {
      console.error("[enquiry] insert failed", error);
      return NextResponse.json(
        { error: "We couldn't send that just now. Please try again." },
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
