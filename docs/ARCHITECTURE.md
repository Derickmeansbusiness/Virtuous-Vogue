# Architecture

## Information architecture

| Route | Purpose |
| --- | --- |
| `/` | Narrative homepage: hero (video + poster), philosophy manifesto, Style Studio, consultations, Shop Your Closet interactive, magazine, private consultation, client stories, newsletter |
| `/studio`, `/studio/compass`, `/studio/colour-lens`, `/studio/closet-remix` | VV Style Studio. Anonymous exploration; saving requires a Style Passport |
| `/studio/compass/result/[id]` | Shareable Compass result (owner, admin or share slug) |
| `/services`, `/services/[slug]` | Six consultations with WHO / EXPLORE / RECEIVE / NEXT structure, Service JSON-LD |
| `/book`, `/book/manage/[token]`, `/book/confirm/[token]` | Native booking flow, manage/reschedule/cancel, payment return |
| `/magazine`, `/magazine/[slug]`, `/magazine/category/[slug]`, `/magazine/author/[slug]`, `/magazine/search` | Editorial publication with Article JSON-LD, reading progress, saves, sharing |
| `/about`, `/contact`, `/newsletter`, `/privacy`, `/terms` | Editorial about story, lead form, newsletter, policies |
| `/styling`, `/styling/[slug]` | Ten SEO landing pages for real search intents |
| `/edit` | Curated retail, feature-flagged (`NEXT_PUBLIC_FEATURE_EDIT`) |
| `/login`, `/signup`, `/auth/callback` | Passwordless auth |
| `/account/*` | Style Passport: overview, passport, wardrobe, looks, bookings, saves, notes, settings, privacy |
| `/admin/*` | Cockpit: dashboard, appointments + Client Style Brief, clients, lookbook builder, services, availability, payments, magazine CMS, newsletter, leads, testimonials, analytics |
| `/api/webhooks/payments/[provider]` | Signature-verified, idempotent payment webhooks |
| `/api/bookings/[token]/calendar.ics` | Calendar invite |
| `/api/cron/reminders` | 24h / 2h reminder dispatcher |

All public routes exist in EN (`/`) and FR (`/fr`). Brand names are never translated.

## Rendering model

Next.js 16 with `cacheComponents: false` for the first release: marketing routes are static by default, authenticated routes are dynamic. `proxy.ts` handles locale negotiation, Supabase session refresh and optimistic gating of `/account` and `/admin`. Real authorization lives in the data access layer (`src/lib/auth/session.ts`) and in Postgres RLS.

## Data

`src/lib/data/store.ts` exposes a small row store with two implementations. Domain modules (`src/lib/domain/*`) and server actions (`src/lib/actions/*`) never talk to Supabase directly, so the backend can be swapped and local development works without credentials.

Schema: `supabase/migrations/0001_init.sql` (users via `profiles`, `style_profiles`, `style_answers`, `colour_profiles`, `wardrobe_items`, `wardrobe_images`, `outfits`, `outfit_items`, `saved_outfits`, `lookbooks`, `lookbook_items`, `services`, `appointments`, `availability`, `payments`, `transactions`, `stylist_notes`, `articles`, `authors`, `categories`, `newsletter_subscribers`, `testimonials`, `leads`, `consultation_forms`, `shopping_recommendations`, `client_documents`, `campaigns`, `curated_products`, `audit_log`). RLS in `0002_rls.sql`: clients only ever see their own rows; `is_admin()` grants the stylist full access; storage buckets are scoped by user-id folder.

## Style Studio logic

- **Style Compass** (`src/lib/studio/compass-model.ts`): 17 questions, weighted scoring across eight directions, normalised to percentages. Directions, never identities. Copy per direction in `compass-content.ts`.
- **Colour Lens** (`colour-analysis.ts`): tone-agnostic reading using Lab hue angle (lightness-independent) for undertone and lightness spread for contrast, with explicit capture-quality checks. Refuses to guess when confidence is low. Guidance in `colour-guidance.ts` is deterministic and labelled "Digital colour preview".
- **Closet Remix** (`remix-engine.ts`): composes outfits only from uploaded pieces, scores colour harmony, occasion formality, climate, coverage and proportion balance, explains each pick, and names at most one true gap as an "Optional addition".
- **AI** (`src/lib/ai`): deterministic logic is separate from generative copy. The heuristic provider works with zero external calls; the Anthropic provider adds vision classification and explanations and falls back on any failure.

## Booking and payments

Availability = admin rules (weekly, dated, days off, buffers) ∩ existing appointments ∩ Cal.com busy times (when configured), with a 12h minimum notice, computed in `Africa/Douala` and displayed in the client's zone. Payments go through `getProviderFor(method, currency)`. Every payment has an idempotency key, provider reference, status machine and a `transactions` audit trail; webhooks are verified and the final status always comes from a server-side `verify` call. Client-side confirmation is never trusted.

## Integrations and environment

See `.env.example`. Every integration is optional and degrades gracefully: no gateway → manual confirmation; no Resend → console log; no Cal.com → native calendar only; no background removal → original image; no Anthropic → heuristics.
