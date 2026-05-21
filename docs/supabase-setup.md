# Supabase Setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Authentication > Providers**, enable Email. Optional: enable magic links.
4. In **Storage**, confirm the `property-images` bucket exists.
5. Copy these values into `.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The schema enables row-level security for every CRM table. Each row is scoped by `user_id`, so brokers only read and write their own clients, properties, requirements, follow-ups, and matches.

If you already ran an older MagicKey schema before modules were expanded, run these once:

- `supabase/client-management-migration.sql`
- `supabase/property-management-migration.sql`

## Production Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` out of client code. It is only for trusted server jobs.
- Add `https://your-vercel-domain.vercel.app` to Supabase auth redirect URLs.
- Use the `property-images` storage bucket for uploaded listing images.
- Regenerate `lib/supabase/database.types.ts` from Supabase CLI when the schema changes:

```bash
npx supabase gen types typescript --project-id your-project-id > lib/supabase/database.types.ts
```
