-- Row Level Security. Clients see only their own rows; admin sees all.

alter table public.profiles enable row level security;
create policy "profiles: self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles: admin update" on public.profiles for update using (public.is_admin());

-- generic owner policies
do $$
declare t text;
begin
  foreach t in array array['style_profiles','colour_profiles','wardrobe_items','wardrobe_images','outfits','saved_outfits','saved_articles','consultation_forms','client_documents']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%1$s: owner select" on public.%1$s for select using (user_id = auth.uid() or public.is_admin())', t);
    execute format('create policy "%1$s: owner insert" on public.%1$s for insert with check (user_id = auth.uid() or public.is_admin())', t);
    execute format('create policy "%1$s: owner update" on public.%1$s for update using (user_id = auth.uid() or public.is_admin())', t);
    execute format('create policy "%1$s: owner delete" on public.%1$s for delete using (user_id = auth.uid() or public.is_admin())', t);
  end loop;
end $$;

-- anonymous studio results: insertable without a user, claimable later by token (via service role)
create policy "style_profiles: anon insert" on public.style_profiles for insert with check (user_id is null and anon_token is not null);
create policy "colour_profiles: anon insert" on public.colour_profiles for insert with check (user_id is null and anon_token is not null);
create policy "style_profiles: shared read" on public.style_profiles for select using (share_slug is not null);

alter table public.style_answers enable row level security;
create policy "style_answers: via profile" on public.style_answers for all
  using (exists (select 1 from public.style_profiles sp where sp.id = style_profile_id and (sp.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.style_profiles sp where sp.id = style_profile_id and (sp.user_id = auth.uid() or sp.user_id is null or public.is_admin())));

alter table public.outfit_items enable row level security;
create policy "outfit_items: via outfit" on public.outfit_items for all
  using (exists (select 1 from public.outfits o where o.id = outfit_id and (o.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.outfits o where o.id = outfit_id and (o.user_id = auth.uid() or public.is_admin())));

alter table public.lookbooks enable row level security;
create policy "lookbooks: client read published" on public.lookbooks for select using ((user_id = auth.uid() and status = 'published') or public.is_admin());
create policy "lookbooks: admin write" on public.lookbooks for all using (public.is_admin()) with check (public.is_admin());
alter table public.lookbook_items enable row level security;
create policy "lookbook_items: via lookbook" on public.lookbook_items for select using (exists (select 1 from public.lookbooks l where l.id = lookbook_id and ((l.user_id = auth.uid() and l.status = 'published') or public.is_admin())));
create policy "lookbook_items: admin write" on public.lookbook_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.stylist_notes enable row level security;
create policy "stylist_notes: client read" on public.stylist_notes for select using ((user_id = auth.uid() and visible_to_client) or public.is_admin());
create policy "stylist_notes: admin write" on public.stylist_notes for all using (public.is_admin()) with check (public.is_admin());

alter table public.shopping_recommendations enable row level security;
create policy "recs: client read" on public.shopping_recommendations for select using (user_id = auth.uid() or public.is_admin());
create policy "recs: client status" on public.shopping_recommendations for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "recs: admin write" on public.shopping_recommendations for all using (public.is_admin()) with check (public.is_admin());

alter table public.appointments enable row level security;
create policy "appointments: client read" on public.appointments for select using (user_id = auth.uid() or public.is_admin());
create policy "appointments: client insert" on public.appointments for insert with check (user_id = auth.uid() or user_id is null);
create policy "appointments: admin write" on public.appointments for all using (public.is_admin()) with check (public.is_admin());

alter table public.payments enable row level security;
create policy "payments: client read" on public.payments for select using (user_id = auth.uid() or public.is_admin());
create policy "payments: admin" on public.payments for all using (public.is_admin()) with check (public.is_admin());
alter table public.transactions enable row level security;
create policy "transactions: admin" on public.transactions for all using (public.is_admin()) with check (public.is_admin());

-- public content
alter table public.services enable row level security;
create policy "services: public read" on public.services for select using (true);
create policy "services: admin write" on public.services for all using (public.is_admin()) with check (public.is_admin());
alter table public.availability enable row level security;
create policy "availability: public read" on public.availability for select using (true);
create policy "availability: admin write" on public.availability for all using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['authors','categories','campaigns','curated_products']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%1$s: public read" on public.%1$s for select using (true)', t);
    execute format('create policy "%1$s: admin write" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

alter table public.articles enable row level security;
create policy "articles: public read published" on public.articles for select using (status = 'published' or public.is_admin());
create policy "articles: admin write" on public.articles for all using (public.is_admin()) with check (public.is_admin());

alter table public.testimonials enable row level security;
create policy "testimonials: public read published" on public.testimonials for select using ((status = 'published' and consent_at is not null) or public.is_admin());
create policy "testimonials: admin write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

-- marketing: inserts happen through the service role in server actions
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter: admin" on public.newsletter_subscribers for all using (public.is_admin()) with check (public.is_admin());
alter table public.leads enable row level security;
create policy "leads: admin" on public.leads for all using (public.is_admin()) with check (public.is_admin());
alter table public.audit_log enable row level security;
create policy "audit: admin read" on public.audit_log for select using (public.is_admin());

-- storage: private buckets are scoped by the first path segment = user id
create policy "wardrobe: owner" on storage.objects for all
  using (bucket_id in ('wardrobe','colour-lens') and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()))
  with check (bucket_id in ('wardrobe','colour-lens') and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));
create policy "lookbooks: client read" on storage.objects for select
  using (bucket_id = 'lookbooks' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));
create policy "lookbooks: admin write" on storage.objects for all using (bucket_id = 'lookbooks' and public.is_admin()) with check (bucket_id = 'lookbooks' and public.is_admin());
create policy "cms: public read" on storage.objects for select using (bucket_id = 'cms');
create policy "cms: admin write" on storage.objects for all using (bucket_id = 'cms' and public.is_admin()) with check (bucket_id = 'cms' and public.is_admin());
