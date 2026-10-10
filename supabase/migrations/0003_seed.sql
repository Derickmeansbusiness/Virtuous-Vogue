-- Seed: services (prices left null on purpose), categories, default availability.
-- DEMO rows are clearly marked. Nothing here invents prices, clients or press.

insert into public.services (slug, sort_order, duration_minutes, price_xaf, deposit_percent, capacity, formats) values
  ('style-clarity', 1, 75, null, 50, 1, '{virtual,in_person}'),
  ('colour-harmony', 2, 90, null, 50, 1, '{in_person,virtual}'),
  ('wardrobe-edit', 3, 180, null, 50, 1, '{in_person,virtual}'),
  ('occasion-styling', 4, 90, null, 50, 1, '{virtual,in_person}'),
  ('personal-shopping', 5, 180, null, 50, 1, '{in_person,virtual}'),
  ('signature-private-styling', 6, 120, null, 30, 1, '{in_person,virtual}')
on conflict (slug) do nothing;

insert into public.categories (slug, name_en, name_fr, sort_order) values
  ('style','Style','Style',1), ('wardrobe','Wardrobe','Garde-robe',2), ('colour','Colour','Couleur',3),
  ('modest-elegance','Modest Elegance','Élégance Modeste',4), ('work-occasion','Work & Occasion','Travail & Occasion',5),
  ('culture','Culture','Culture',6), ('confidence','Confidence & Identity','Confiance & Identité',7), ('lifestyle','Lifestyle','Art de vivre',8)
on conflict (slug) do nothing;

insert into public.authors (slug, name, role_en, role_fr, bio_en, bio_fr) values
  ('vv-editors', 'The Virtuous Vogue Editors', 'Editorial', 'Rédaction',
   'DEMO byline until the founder''s approved biography is supplied.',
   'Signature DEMO en attendant la biographie approuvée de la fondatrice.')
on conflict (slug) do nothing;

-- Default availability: Tue–Sat 09:00–17:00 Douala time, 15 min buffers.
insert into public.availability (weekday, start_time, end_time, buffer_minutes) values
  (2,'09:00','17:00',15),(3,'09:00','17:00',15),(4,'09:00','17:00',15),(5,'09:00','17:00',15),(6,'10:00','15:00',15);
