# Admin portal & database

The site is becoming an application: the same pages, but with the
content behind them editable from an admin portal instead of a file.

## How it is put together

```
Supabase (Postgres + Auth + Storage)
        │
        ▼
src/lib/content.ts      ← reads the database, falls back to the file
        │
        ▼
public pages            ← unchanged shape, so components barely move
```

**The static file is the floor.** `src/content/site.ts` stays. If
Supabase is not configured, or a query fails, or a table is empty, every
getter in `src/lib/content.ts` returns what the file holds. The site
cannot go blank or 500 because of the database — which also means the
repo runs on a fresh clone with no keys at all.

**Reads are cached, writes publish.** Getters are wrapped in
`unstable_cache` under the `content` tag with an hour ceiling. Pages stay
static and CDN-fast; admin saves call `revalidateTag("content")` so a
change is live immediately instead of every visitor paying for a query.

**Row level security does the guarding, not the UI.** Public users can
read published rows and insert an enquiry — nothing else. Every write,
and every read of the enquiry list, requires a row in `admins`. A leaked
anon key exposes what is already on the website and no more.

## Setting it up

1. **Create the project** at supabase.com. Copy Project Settings → API.

2. **Fill `.env.local`** from `.env.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
   The service role key bypasses row level security. Server only — never
   `NEXT_PUBLIC_`, never committed, never imported into a client
   component.

3. **Run the migrations** in the SQL editor, in order:
   - `supabase/migrations/0001_init.sql` — tables, policies, storage
   - `supabase/migrations/0002_seed.sql` — loads today's content

4. **Create your admin user** in Authentication → Users, then grant it:
   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```

5. **Check it took**: `curl localhost:3000/api/health` should report
   `"supabaseConfigured": true`.

## Regenerating the seed

`npm run seed:gen` rewrites `0002_seed.sql` from the static file. Useful
if the file changes before the database is live; pointless afterwards,
since the database becomes the source of truth.

## Tables

| Table | Holds |
| --- | --- |
| `site_settings` | Hero, stats, CTA, company details — one JSON row per key |
| `sectors` | The four sectors, with their figures and applications |
| `sector_projects` | Work delivered, per sector |
| `testimonials` | Client quotes, per sector |
| `product_families` | Panels / inverters / batteries |
| `products` | The items inside each family |
| `enquiries` | Contact form submissions, with a status for follow-up |
| `admins` | Who is allowed to write |

Images live in the `media` storage bucket: public to read, admin to
write. `next.config.ts` allows `*.supabase.co` under the public object
path so `next/image` will serve them.
