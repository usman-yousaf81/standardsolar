/** Join class names, dropping anything falsy. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** True when a content string is still an unfilled [PLACEHOLDER] token. */
export function isPlaceholder(value: string) {
  return /^\[[A-Z0-9_ ]+\]$/.test(value.trim());
}

/** Sort helper for any row that carries a `position` column. */
export function byPosition(a: { position: number }, b: { position: number }) {
  return a.position - b.position;
}
