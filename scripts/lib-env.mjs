import { readFileSync } from "node:fs";

/** Reads .env.local without pulling in a dependency. */
export function loadEnv() {
  let raw = "";
  try {
    raw = readFileSync(".env.local", "utf8");
  } catch {
    throw new Error("No .env.local — copy .env.example and fill in the keys.");
  }

  const env = Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
  );

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set in .env.local.",
    );
  }
  return { url: url.replace(/\/+$/, ""), key };
}

/** Service-role request. Bypasses row level security — scripts only. */
export async function api(path, init = {}) {
  const { url, key } = loadEnv();
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${path} — ${JSON.stringify(body)}`);
  }
  return body;
}
