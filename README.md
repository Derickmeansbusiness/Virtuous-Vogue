# Virtuous Vogue

**Style should express you. It should not define you.**

A digital styling house for women who dress with intention: personal styling consultations in Douala and virtually, the VV Style Studio (Style Compass, Colour Lens, Closet Remix), an editorial magazine, a private Style Passport for clients and a cockpit for the stylist. Bilingual (EN/FR), mobile-first, built as a PWA.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 with brand tokens in `src/app/globals.css` |
| Motion | `motion/react` (reduced-motion aware) |
| i18n | `next-intl` with `/` (EN) and `/fr` routes; messages in `messages/*.json` |
| Data | Supabase (Postgres 17, Auth, Storage, RLS). Migrations in `supabase/migrations`. Local JSON store fallback for development. |
| Email | Resend + React Email (`src/lib/email`) |
| Booking | Native availability engine + optional Cal.com mirror (`src/lib/booking`) |
| Payments | Provider abstraction: CamPay / Flutterwave (MTN MoMo, Orange Money, XAF) and Stripe (international cards) (`src/lib/payments`) |
| AI | Provider abstraction, heuristic by default, Anthropic optional (`src/lib/ai`) |
| Imagery | Higgsfield-generated campaign library, stamped with the approved VV lockup by `scripts/assets/build.mjs` |

## Quick start

```bash
pnpm install
cp .env.example .env.local      # fill in what you have; everything is optional for local dev
pnpm dev
```

Without Supabase credentials the app runs in **local mode**: data is written to `.data/*.json`, sign-in creates a signed dev session directly (first email becomes the admin unless `LOCAL_ADMIN_EMAIL` is set), and emails are logged to the console. Nothing in local mode is meant for production; the store refuses to run there unless `ALLOW_LOCAL_STORE=true`.

## Production setup

1. **Supabase**: create a project, run the migrations in order (`supabase db push` or paste into the SQL editor): `0001_init.sql`, `0002_rls.sql`, `0003_seed.sql`. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Promote the stylist: `update profiles set role = 'admin' where email = '…'`.
2. **Auth**: enable Email (magic link) in Supabase Auth; set the site URL and add `https://yourdomain/auth/callback` to redirect URLs.
3. **Email**: `RESEND_API_KEY`, `EMAIL_FROM`, `STYLIST_NOTIFICATION_EMAIL`.
4. **Payments**: set `CAMPAY_PERMANENT_TOKEN` (+ `CAMPAY_WEBHOOK_KEY`) or `FLUTTERWAVE_SECRET_KEY` (+ `FLUTTERWAVE_WEBHOOK_HASH`). Point the gateway webhook at `/api/webhooks/payments/campay` or `/api/webhooks/payments/flutterwave`. Add Stripe for international cards if wanted. Without any gateway, bookings are confirmed by the stylist and marked paid manually in the cockpit.
5. **Reminders**: set `CRON_SECRET`. `vercel.json` schedules `/api/cron/reminders` once a day at 06:00 UTC (the most a Vercel Hobby plan allows). For timely 2-hour reminders, add the repository secrets `SITE_URL` and `CRON_SECRET` so `.github/workflows/reminders.yml` pings the endpoint hourly for free, or move the Vercel cron to hourly on a Pro plan.
6. **Services & prices**: set duration, price (XAF), deposit, capacity and formats in **Cockpit → Services**. Prices are never invented in code; until set, the site says "Pricing shared on request".
7. **WhatsApp / socials / founder photo**: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_FOUNDER_PHOTO`.
8. **Analytics**: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

Deploy on Vercel (or any Node host). `next build` must pass with `pnpm build`.

## Project map

```
src/app/[locale]/(site)      public site: home, studio, services, book, magazine, about, contact, styling landings, edit, policies
src/app/[locale]/(auth)      login / signup (magic link)
src/app/[locale]/account     Style Passport (client dashboard)
src/app/[locale]/admin       Stylist cockpit
src/app/api                  webhooks, calendar .ics, reminders cron, CSV export
src/components               ui primitives, motion, layout, home sections, studio, booking, magazine, account, admin
src/content                  bilingual seed content (services, articles, authors, categories, FAQs, landing pages) — DEMO where fictional
src/lib/studio               deterministic Style Compass model, Colour Lens analysis, Closet Remix engine
src/lib/booking              availability engine + Cal.com adapter
src/lib/payments             gateway abstraction (CamPay, Flutterwave, Stripe, manual)
src/lib/ai                   AI provider abstraction (heuristic, Anthropic)
src/lib/data                 store abstraction (Supabase / local JSON)
supabase/migrations          schema, RLS, seed
assets-src/                  asset manifest, approved logo kit, rejection log
scripts/assets/build.mjs     asset pipeline (fetch → master → responsive JPEG → VV stamp → manifest)
docs/                        architecture, asset library and creative audit
```

## Commands

```bash
pnpm dev            # development server
pnpm build          # production build
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm assets:build   # rebuild public assets from assets-src/manifest.json (FETCH=1 to download sources)
```

## Content and honesty rules baked in

- No fake testimonials: the homepage shows an honest empty state until a consented client story is published from the cockpit.
- No invented prices, press, awards or credentials.
- Campaign imagery is generated and art-directed; the footer and terms say so. The women pictured are not clients.
- The founder's About photo is a placeholder until her approved photograph is supplied; no generated portrait is used.
- Photos uploaded by clients are never used to train models and can be deleted at any time.

See `docs/ARCHITECTURE.md`, `docs/ASSETS.md` and `docs/CREATIVE-AUDIT.md`.
