/**
 * The admin portal lives at an unguessable path. That is convenience,
 * not security — the real guard is Supabase auth plus row level
 * security, which is enforced in the database and cannot be bypassed by
 * finding the URL.
 *
 * Change this and the folder name under src/app/ together.
 */
export const ADMIN_PATH = "/admin_usman6655";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;

export type AdminNavItem = {
  href: string;
  label: string;
  /** Overview matches only itself; the rest match their subtree. */
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: ADMIN_PATH, label: "Overview", exact: true },
  { href: `${ADMIN_PATH}/enquiries`, label: "Enquiries" },
  { href: `${ADMIN_PATH}/hero`, label: "Hero" },
  { href: `${ADMIN_PATH}/sectors`, label: "Sectors" },
  { href: `${ADMIN_PATH}/products`, label: "Products" },
];
