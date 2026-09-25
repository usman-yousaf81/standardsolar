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

/**
 * A service's short name: "Home Solar Installation" → "Home Solar".
 * Service titles are written in full for their own page and for search;
 * a menu row, a heading or a sentence wants the short form. The trailing
 * generic noun carries no meaning once the context already says
 * "services", so it is dropped. Any other title passes through untouched.
 */
export function shortServiceName(title: string) {
  return title.replace(/\s+(Installation|Systems|Solutions)$/i, "");
}
