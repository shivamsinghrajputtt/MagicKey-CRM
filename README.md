# MagicKey CRM

Production-ready mobile-first real estate broker CRM built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, and Supabase.

## Features

- Supabase authentication with email/password and magic links
- Client, property, requirement, follow-up, and match data model
- Mobile bottom navigation
- Dashboard analytics
- Requirement matching scores
- Search/filter-ready list screens
- WhatsApp share links
- Supabase Storage image upload flow
- Dark/light mode
- PWA manifest and service worker
- Vercel-ready config

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Read:

- `docs/supabase-setup.md`
- `docs/deployment.md`
- `supabase/schema.sql`

The UI ships with demo data so the CRM is usable immediately. Connect Supabase to persist real broker data.
