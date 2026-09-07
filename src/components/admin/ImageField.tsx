"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { ghostButtonClass, inputClass } from "./ui";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Uploads to the `media` storage bucket and puts the resulting public
 * URL into a hidden input, so the surrounding form submits a plain
 * string and the server action stays simple.
 *
 * The upload runs in the browser under the admin's own session, so the
 * bucket's row level security applies — the service role key is never
 * anywhere near the client.
 */
export function ImageField({
  name,
  label,
  folder,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  /** Path prefix inside the bucket, e.g. "sectors". */
  folder: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("That is not an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over 8 MB. Please compress it first.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("The database is not connected.");
      return;
    }

    setBusy(true);

    // Timestamped so a re-upload never collides with a cached copy of
    // the old file at the same URL.
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);

    setUrl(publicUrl);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-card border border-hairline bg-silver">
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              unoptimized={url.startsWith("blob:")}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              None
            </span>
          )}
        </div>

        <div className="flex min-w-[240px] flex-1 flex-col gap-2">
          <input type="hidden" name={name} value={url} />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className={ghostButtonClass}
            >
              {busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
            </button>
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-[13px] text-ink-muted hover:text-signal"
              >
                Remove
              </button>
            ) : null}
          </div>

          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="or paste an image path / URL"
            className={cn(inputClass, "text-[12.5px]")}
          />

          {error ? (
            <p role="alert" className="text-[12.5px] text-signal">
              {error}
            </p>
          ) : null}
          {hint ? (
            <p className="text-[12px] text-ink-muted">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
