/**
 * Give a Supabase user access to the admin portal.
 *
 *   npm run admin:grant -- someone@example.com
 *   npm run admin:list
 *   npm run admin:revoke -- someone@example.com
 *
 * The user has to exist in Authentication → Users first; this only
 * grants the access, it does not create the account.
 */
import { api } from "./lib-env.mjs";

const [, , command = "grant", emailArg] = process.argv;

async function findUser(email) {
  const data = await api(`/auth/v1/admin/users?per_page=200`);
  const users = data.users ?? data ?? [];
  return users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
}

async function list() {
  const admins = await api("/rest/v1/admins?select=user_id,email,created_at");
  if (!admins.length) {
    console.log("No admins yet.");
    return;
  }
  console.log(`${admins.length} admin${admins.length === 1 ? "" : "s"}:`);
  admins.forEach((a) => console.log(`  ${a.email ?? "(no email)"}  ${a.user_id}`));
}

async function grant(email) {
  const user = await findUser(email);
  if (!user) {
    console.error(`No user with that email. Create it in Authentication → Users first.`);
    process.exit(1);
  }
  await api("/rest/v1/admins", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: user.id, email: user.email }),
  });
  console.log(`Granted admin access to ${user.email}`);
}

async function revoke(email) {
  const user = await findUser(email);
  if (!user) {
    console.error("No user with that email.");
    process.exit(1);
  }
  await api(`/rest/v1/admins?user_id=eq.${user.id}`, { method: "DELETE" });
  console.log(`Revoked admin access for ${user.email}`);
}

try {
  if (command === "list") await list();
  else if (command === "revoke") await revoke(emailArg ?? process.argv[3]);
  else await grant(command === "grant" ? emailArg : command);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
