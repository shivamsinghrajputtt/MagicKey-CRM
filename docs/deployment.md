# Deployment

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

4. Deploy with the default Next.js settings.
5. Add the deployed URL to Supabase **Authentication > URL Configuration**.

## PWA

The app includes:

- `public/manifest.json`
- `public/sw.js`
- mobile viewport and theme-color metadata
- installable app icons

The service worker is registered only in production.
