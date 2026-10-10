-- Virtuous Vogue · initial schema
-- Postgres 17 / Supabase. Every client-owned table has RLS so a client can only
-- ever see her own rows; the stylist (role = 'admin') sees everything.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------- enums
create type user_role as enum ('client', 'admin');
create type consultation_format as enum ('in_person', 'virtual', 'group');
create type appointment_status as enum ('pending_payment', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show');
create type payment_status as enum ('initiated', 'pending', 'succeeded', 'failed', 'refunded', 'cancelled');
create type payment_provider as enum ('flutterwave', 'campay', 'stripe', 'manual');
create type content_status as enum ('draft', 'published', 'archived');
create type lead_status as enum ('new', 'contacted', 'converted', 'closed');

-- ---------------------------------------------------------------- helpers
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  whatsapp text,
  city text,
  country text default 'CM',
  locale text not null default 'en' check (locale in ('en','fr')),
  time_zone text not null default 'Africa/Douala',
  role user_role not null default 'client',
  marketing_consent boolean not null default false,
  photo_processing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles for each row execute function set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, locale)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'locale', 'en'))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- style studio
create table public.style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  anon_token text,                          -- lets an anonymous visitor claim a result after sign-up
  version int not null default 1,
  scores jsonb not null,                    -- { "refined_feminine": 0.42, ... }
  primary_direction text not null,
  secondary_direction text,
  style_words text[] not null default '{}',
  colour_mood text,
  silhouette_direction text,
  wardrobe_priorities text[] not null default '{}',
  outfit_formulas jsonb not null default '[]',
  experiments text[] not null default '{}',
  recommended_service text,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.style_profiles (user_id, created_at desc);
create trigger style_profiles_updated before update on public.style_profiles for each row execute function set_updated_at();

create table public.style_answers (
  id uuid primary key default gen_random_uuid(),
  style_profile_id uuid not null references public.style_profiles(id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  created_at timestamptz not null default now()
);
create index on public.style_answers (style_profile_id);

create table public.colour_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  anon_token text,
  source text not null default 'digital_preview' check (source in ('digital_preview','stylist')),
  undertone text not null check (undertone in ('warm','cool','neutral','uncertain')),
  contrast text not null check (contrast in ('low','medium','high','uncertain')),
  confidence numeric(3,2) not null default 0,
  image_quality jsonb,
  families jsonb not null default '[]',
  neutrals jsonb not null default '[]',
  accents jsonb not null default '[]',
  metals text,
  combinations jsonb not null default '[]',
  test_carefully jsonb not null default '[]',
  notes text,
  image_path text,                          -- storage path; null once deleted
  image_deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.colour_profiles (user_id, created_at desc);

-- ---------------------------------------------------------------- wardrobe
create table public.wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  subcategory text,
  name text,
  colour text,
  colour_hex text,
  pattern text,
  fabric text,
  fit text,
  silhouette text,
  seasons text[] not null default '{}',
  occasions text[] not null default '{}',
  brand text,
  notes text,
  is_favourite boolean not null default false,
  source text not null default 'client' check (source in ('client','stylist','purchase')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.wardrobe_items (user_id, category);
create trigger wardrobe_items_updated before update on public.wardrobe_items for each row execute function set_updated_at();

create table public.wardrobe_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.wardrobe_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  cutout_path text,
  width int,
  height int,
  bytes int,
  is_primary boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.wardrobe_images (item_id);

create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text,
  occasion text,
  context jsonb not null default '{}',      -- climate, time, venue, dress code, modesty, shoes
  reasoning text,                           -- why this works (generated, labelled as such)
  gap_suggestions jsonb not null default '[]', -- "Optional Addition" items, never pushed
  created_by text not null default 'remix' check (created_by in ('remix','client','stylist')),
  scheduled_for date,
  created_at timestamptz not null default now()
);
create index on public.outfits (user_id, created_at desc);

create table public.outfit_items (
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  item_id uuid not null references public.wardrobe_items(id) on delete cascade,
  slot text not null,
  primary key (outfit_id, item_id)
);

create table public.saved_outfits (
  user_id uuid not null references public.profiles(id) on delete cascade,
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  hearted boolean not null default true,
  share_token text unique,
  created_at timestamptz not null default now(),
  primary key (user_id, outfit_id)
);

-- ---------------------------------------------------------------- lookbooks
create table public.lookbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id),
  title text not null,
  theme text,
  style_direction text,
  palette jsonb not null default '[]',
  cover_path text,
  stylist_note text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.lookbooks (user_id);
create trigger lookbooks_updated before update on public.lookbooks for each row execute function set_updated_at();

create table public.lookbook_items (
  id uuid primary key default gen_random_uuid(),
  lookbook_id uuid not null references public.lookbooks(id) on delete cascade,
  sort_order int not null default 0,
  kind text not null check (kind in ('outfit','board','note','recommendation')),
  outfit_id uuid references public.outfits(id) on delete set null,
  title text,
  body text,
  image_path text,
  annotations jsonb not null default '[]'
);
create index on public.lookbook_items (lookbook_id, sort_order);

-- ---------------------------------------------------------------- services & booking
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  active boolean not null default true,
  sort_order int not null default 0,
  name_en text, name_fr text,
  short_en text, short_fr text,
  duration_minutes int,
  price_xaf int,
  deposit_percent int default 50,
  capacity int default 1,
  formats consultation_format[] default '{virtual,in_person}',
  location_note text,
  cal_event_type_id text,                   -- optional Cal.com event type
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger services_updated before update on public.services for each row execute function set_updated_at();

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  weekday int check (weekday between 0 and 6),   -- null = specific date rule
  date date,
  start_time time not null,
  end_time time not null,
  formats consultation_format[] default '{virtual,in_person}',
  buffer_minutes int not null default 15,
  is_day_off boolean not null default false,
  note text
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  guest_name text,
  guest_phone text,
  service_slug text not null,
  format consultation_format not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  time_zone text not null default 'Africa/Douala',
  status appointment_status not null default 'pending_payment',
  style_goals text,
  context jsonb not null default '{}',      -- linked outfit, compass result, questions
  style_profile_id uuid references public.style_profiles(id) on delete set null,
  outfit_id uuid references public.outfits(id) on delete set null,
  cal_booking_uid text,
  manage_token text unique default encode(gen_random_bytes(16), 'hex'),
  reminders_sent jsonb not null default '{}',
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.appointments (starts_at);
create index on public.appointments (user_id);
create trigger appointments_updated before update on public.appointments for each row execute function set_updated_at();

create table public.consultation_forms (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  provider payment_provider not null,
  provider_reference text,                  -- gateway's id
  idempotency_key text unique not null,
  amount int not null,
  currency text not null default 'XAF',
  status payment_status not null default 'initiated',
  method text,                              -- mtn_momo, orange_money, card
  customer_email text,
  customer_phone text,
  metadata jsonb not null default '{}',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.payments (appointment_id);
create index on public.payments (provider, provider_reference);
create trigger payments_updated before update on public.payments for each row execute function set_updated_at();

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  event text not null,                      -- webhook event / verification step
  provider_event_id text,
  status payment_status,
  raw jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (payment_id, provider_event_id)
);

-- ---------------------------------------------------------------- stylist notes & documents
create table public.stylist_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid references public.profiles(id),
  appointment_id uuid references public.appointments(id) on delete set null,
  kind text not null default 'note' check (kind in ('note','principle','priority','colour','recommendation','outfit')),
  title text,
  body text not null,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.stylist_notes (user_id, created_at desc);
create trigger stylist_notes_updated before update on public.stylist_notes for each row execute function set_updated_at();

create table public.shopping_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid references public.profiles(id),
  title text not null,
  reason text,
  category text,
  budget_hint text,
  url text,
  fills_gap boolean not null default true,
  status text not null default 'suggested' check (status in ('suggested','bought','declined')),
  created_at timestamptz not null default now()
);

create table public.client_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- magazine CMS
create table public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role_en text, role_fr text,
  bio_en text, bio_fr text,
  photo_path text,
  created_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key,
  name_en text not null, name_fr text not null,
  description_en text, description_fr text,
  sort_order int not null default 0
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status content_status not null default 'draft',
  data jsonb not null,                      -- Article shape (bilingual), see src/content/types.ts
  search_en tsvector generated always as (to_tsvector('english', coalesce(data->'title'->>'en','') || ' ' || coalesce(data->'dek'->>'en',''))) stored,
  search_fr tsvector generated always as (to_tsvector('french', coalesce(data->'title'->>'fr','') || ' ' || coalesce(data->'dek'->>'fr',''))) stored,
  views int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.articles using gin (search_en);
create index on public.articles using gin (search_fr);
create trigger articles_updated before update on public.articles for each row execute function set_updated_at();

create table public.saved_articles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  article_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, article_slug)
);

-- ---------------------------------------------------------------- marketing
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed','bounced')),
  source text,
  locale text default 'en',
  consent_at timestamptz,
  resubscribed_at timestamptz,
  unsubscribe_token text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  channel text not null default 'contact_form',
  topic text,
  message text,
  context jsonb not null default '{}',
  status lead_status not null default 'new',
  locale text default 'en',
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  quote_en text not null,
  quote_fr text,
  context text,
  service_slug text,
  consent_at timestamptz,
  status content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text, title_fr text,
  body_en text, body_fr text,
  cta_label_en text, cta_label_fr text,
  cta_href text,
  image_asset_id text,
  placement text not null default 'home',
  starts_at timestamptz, ends_at timestamptz,
  status content_status not null default 'draft'
);

create table public.curated_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status content_status not null default 'draft',
  category text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('wardrobe', 'wardrobe', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('colour-lens', 'colour-lens', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('lookbooks', 'lookbooks', false, 20971520, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('cms', 'cms', true, 20971520, array['image/jpeg','image/png','image/webp','image/avif','video/mp4'])
on conflict (id) do nothing;
