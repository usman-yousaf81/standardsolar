"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ghostButtonClass, inputClass } from "./ui";

export type Spec = { label: string; value: string };

/**
 * A short list of label/value pairs. The two columns post as parallel
 * `spec_label` / `spec_value` arrays, so the server reads them with
 * getAll() and never has to parse JSON out of a text box.
 *
 * Rows are added and removed on the client only; nothing is saved until
 * the surrounding form is submitted.
 */
export function SpecRows({
  defaultValue,
  hint = "Short facts shown under the name. Leave empty if there are none.",
}: {
  defaultValue: Spec[];
  hint?: string;
}) {
  const [rows, setRows] = useState<Spec[]>(
    defaultValue.length ? defaultValue : [],
  );

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <span className="text-[12.5px] font-medium text-ink">Specs</span>
        <span className="text-[12px] text-ink-muted">{hint}</span>
      </div>

      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            name="spec_label"
            defaultValue={row.label}
            placeholder="Capacity"
            aria-label={`Spec ${i + 1} label`}
            className={cn(inputClass, "flex-1")}
          />
          <input
            name="spec_value"
            defaultValue={row.value}
            placeholder="16 kWh"
            aria-label={`Spec ${i + 1} value`}
            className={cn(inputClass, "flex-1")}
          />
          <button
            type="button"
            onClick={() => setRows(rows.filter((_, index) => index !== i))}
            aria-label={`Remove spec ${i + 1}`}
            className="shrink-0 rounded-full px-2 py-1 text-[16px] leading-none text-ink-muted transition-colors hover:bg-ink/6 hover:text-ink"
          >
            ×
          </button>
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={() => setRows([...rows, { label: "", value: "" }])}
          className={ghostButtonClass}
        >
          Add a spec
        </button>
      </div>
    </div>
  );
}
