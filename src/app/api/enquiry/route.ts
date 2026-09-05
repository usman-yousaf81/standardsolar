import { NextResponse } from "next/server";

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

  // ------------------------------------------------------------------
  // TODO: deliver the enquiry.
  // Nothing is sent anywhere yet — the submission is only logged on the
  // server. Wire up whichever of these you want and add the credentials
  // to .env.local:
  //   • Email  — Resend / SendGrid / Postmark
  //   • CRM    — HubSpot / Pipedrive / Zoho
  //   • Sheet  — Google Sheets API
  // ------------------------------------------------------------------
  console.info("[enquiry]", {
    name,
    email,
    phone: data.phone?.trim() || null,
    city: data.city?.trim() || null,
    message: data.message?.trim() || null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
