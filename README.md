# Lavish Wig

Luxury wig washing & restoration — Cape Town, South Africa.

React + Vite site with Supabase-backed bookings and an owner dashboard.

## Stack

- **Frontend**: React 18 + Vite
- **Database**: Supabase (`orders` and `settings` tables — SQL in `supabase/migrations/`)
- **Hosting**: Vercel, auto-deploys from `main`

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev
```

The site runs without Supabase credentials too — it falls back to
browser-only storage, useful for design work.

## Environment variables

| Name | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key |

Set the same two variables in Vercel → Project Settings → Environment
Variables for production.

## Owner dashboard

Tap the site logo 5 times (or Ctrl+Shift+A on desktop) and enter the
admin password. Orders, services, gallery, specials, contact details,
section visibility, and the admin password itself are all managed there;
everything syncs through Supabase so changes apply on every device.
