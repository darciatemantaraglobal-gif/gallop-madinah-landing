-- Gallop Madinah: website data + admin panel (/admin)
--
-- Who can do what
--   Visitors (anon):  read prices / FAQ / partners / published testimonials / rules / settings,
--                     create bookings and rider registrations (never read them back),
--                     look up ONE member or agent by its exact code (get_member / get_agent).
--   Admins:           signed-in users whose app_metadata.role = 'admin' (set by the owner in the
--                     SQL editor, never by the user) can read and change everything.
--
-- New tables are no longer exposed to the Data API automatically, so every table below gets
-- explicit grants AND row level security.

create schema if not exists private;

-- True when the signed-in user is an admin. app_metadata can only be changed server-side,
-- unlike user_metadata, so it is safe to use for authorization.
create or replace function private.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- Prices
-- ---------------------------------------------------------------------------------------------

create table public.packages (
  id text primary key check (id ~ '^[a-z0-9_]{2,30}$'),
  name text not null check (length(name) between 1 and 80),
  short_name text not null check (length(short_name) between 1 and 40),
  -- SAR per person; for tiered packages this is the 1-person price
  price integer not null check (price > 0),
  min_people integer not null default 1 check (min_people between 1 and 200),
  -- keys of the comparison-table rows: horse, helmet, boots, coach, rest, transport, videographer
  features text[] not null default '{}',
  featured boolean not null default false,
  tiered boolean not null default false,
  sort integer not null default 0
);

create table public.group_tiers (
  id bigint generated always as identity primary key,
  from_people integer not null check (from_people between 1 and 200),
  to_people integer check (to_people is null or to_people >= from_people),
  -- null = price on request
  price integer check (price is null or price > 0)
);

create table public.addons (
  id text primary key check (id ~ '^[a-z0-9_]{2,30}$'),
  name text not null check (length(name) between 1 and 60),
  price integer not null check (price > 0),
  sort integer not null default 0
);

-- ---------------------------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------------------------

create table public.faqs (
  id bigint generated always as identity primary key,
  sort integer not null default 0,
  q_id text not null check (length(q_id) between 1 and 300),
  a_id text not null check (length(a_id) between 1 and 2000),
  q_en text not null default '' check (length(q_en) <= 300),
  a_en text not null default '' check (length(a_en) <= 2000),
  q_ms text not null default '' check (length(q_ms) <= 300),
  a_ms text not null default '' check (length(a_ms) <= 2000),
  q_ar text not null default '' check (length(q_ar) <= 300),
  a_ar text not null default '' check (length(a_ar) <= 2000)
);

create table public.safety_rules (
  id bigint generated always as identity primary key,
  sort integer not null default 0,
  text_id text not null check (length(text_id) between 1 and 500),
  text_en text not null default '' check (length(text_en) <= 500),
  text_ms text not null default '' check (length(text_ms) <= 500),
  text_ar text not null default '' check (length(text_ar) <= 500)
);

create table public.partners (
  id bigint generated always as identity primary key,
  sort integer not null default 0,
  name text not null check (length(name) between 1 and 80),
  -- https link (uploaded logo) or a path on this site such as /partners/x.png
  logo_url text not null check (logo_url ~ '^(https://|/)'),
  size text not null default 'normal' check (size in ('normal', 'large', 'tall'))
);

create table public.testimonials (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 80),
  origin text not null default '' check (length(origin) <= 80),
  rating smallint not null default 5 check (rating between 1 and 5),
  body text not null check (length(body) between 1 and 1000),
  published boolean not null default true
);

-- Exactly one row of site-wide settings.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  booking_times text[] not null default '{}',
  max_days_ahead integer not null default 90 check (max_days_ahead between 1 and 365),
  min_age integer check (min_age between 1 and 99),
  max_weight integer check (max_weight between 20 and 300),
  maps_url text not null default '' check (maps_url = '' or maps_url ~ '^https://'),
  review_url text not null default '' check (review_url = '' or review_url ~ '^https://')
);

-- ---------------------------------------------------------------------------------------------
-- Members (/member/CODE) and travel partners (/partner/CODE)
-- ---------------------------------------------------------------------------------------------

create table public.members (
  code text primary key check (code ~ '^[A-Z0-9-]{3,20}$'),
  created_at timestamptz not null default now(),
  group_name text not null default '' check (length(group_name) <= 120),
  ride_date date,
  horse text not null default '' check (length(horse) <= 80),
  coach text not null default '' check (length(coach) <= 80),
  riders text[] not null default '{}' check (cardinality(riders) <= 60),
  -- public image URLs (uploaded to the "media" bucket, or Google Drive links)
  photos text[] not null default '{}' check (cardinality(photos) <= 30),
  video_url text not null default '' check (video_url = '' or video_url ~ '^https://'),
  drive_folder text not null default '' check (drive_folder = '' or drive_folder ~ '^https://')
);

create table public.agents (
  code text primary key check (code ~ '^[A-Z0-9-]{2,20}$'),
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 120),
  price_open_trip integer check (price_open_trip is null or price_open_trip > 0),
  price_premium integer check (price_premium is null or price_premium > 0),
  contact text not null default '' check (length(contact) <= 120),
  active boolean not null default true
);

-- ---------------------------------------------------------------------------------------------
-- Bookings and rider registrations (written by visitors, read by admins)
-- ---------------------------------------------------------------------------------------------

create table public.bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  code text not null unique check (code ~ '^GM-[A-Z0-9]{4,8}$'),
  package text not null check (length(package) between 1 and 80),
  ride_date date not null,
  ride_time text not null check (length(ride_time) between 1 and 20),
  people integer not null check (people between 1 and 200),
  addons text[] not null default '{}' check (cardinality(addons) <= 10),
  total integer check (total is null or total >= 0),
  name text not null check (length(name) between 1 and 80),
  phone text not null default '' check (length(phone) <= 24),
  hotel text not null default '' check (length(hotel) <= 100),
  notes text not null default '' check (length(notes) <= 500),
  agent_code text not null default '' check (agent_code = '' or agent_code ~ '^[A-Z0-9-]{2,20}$'),
  lang text not null default 'id' check (lang in ('id', 'en', 'ms', 'ar')),
  status text not null default 'baru' check (status in ('baru', 'terkonfirmasi', 'selesai', 'batal')),
  admin_note text not null default '' check (length(admin_note) <= 1000)
);

create index bookings_ride_date_idx on public.bookings (ride_date);
create index bookings_created_at_idx on public.bookings (created_at desc);
create index bookings_agent_code_idx on public.bookings (agent_code) where agent_code <> '';

create table public.registrations (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  booking_code text not null default '' check (booking_code = '' or booking_code ~ '^GM-[A-Z0-9]{4,8}$'),
  name text not null check (length(name) between 1 and 80),
  age integer not null check (age between 1 and 99),
  weight integer not null check (weight between 10 and 250),
  experience text not null check (experience in ('none', 'some', 'regular')),
  agreed boolean not null check (agreed)
);

create index registrations_booking_code_idx on public.registrations (booking_code);
create index registrations_created_at_idx on public.registrations (created_at desc);

-- ---------------------------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------------------------

alter table public.packages enable row level security;
alter table public.group_tiers enable row level security;
alter table public.addons enable row level security;
alter table public.faqs enable row level security;
alter table public.safety_rules enable row level security;
alter table public.partners enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.members enable row level security;
alter table public.agents enable row level security;
alter table public.bookings enable row level security;
alter table public.registrations enable row level security;

-- Public content: everyone reads, admins write.
do $$
declare
  t text;
begin
  foreach t in array array['packages', 'group_tiers', 'addons', 'faqs', 'safety_rules', 'partners', 'site_settings']
  loop
    execute format('create policy "everyone reads" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admins insert" on public.%I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "admins update" on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "admins delete" on public.%I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end
$$;

-- Testimonials: visitors only see published ones.
create policy "everyone reads published" on public.testimonials
  for select to anon, authenticated using (published or (select private.is_admin()));
create policy "admins insert" on public.testimonials
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update" on public.testimonials
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete" on public.testimonials
  for delete to authenticated using ((select private.is_admin()));

-- Members and agents: admins only. Visitors use get_member / get_agent below.
do $$
declare
  t text;
begin
  foreach t in array array['members', 'agents']
  loop
    execute format('create policy "admins read" on public.%I for select to authenticated using ((select private.is_admin()))', t);
    execute format('create policy "admins insert" on public.%I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "admins update" on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "admins delete" on public.%I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end
$$;

-- Bookings: anyone can create one (status always starts as 'baru'); only admins read or change them.
create policy "visitors create" on public.bookings
  for insert to anon, authenticated with check (status = 'baru' and admin_note = '');
create policy "admins read" on public.bookings
  for select to authenticated using ((select private.is_admin()));
create policy "admins update" on public.bookings
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete" on public.bookings
  for delete to authenticated using ((select private.is_admin()));

-- Registrations: anyone can add riders; only admins read or remove them.
create policy "visitors create" on public.registrations
  for insert to anon, authenticated with check (true);
create policy "admins read" on public.registrations
  for select to authenticated using ((select private.is_admin()));
create policy "admins delete" on public.registrations
  for delete to authenticated using ((select private.is_admin()));

-- ---------------------------------------------------------------------------------------------
-- Data API grants (RLS above decides which rows)
-- ---------------------------------------------------------------------------------------------

grant select on public.packages, public.group_tiers, public.addons, public.faqs, public.safety_rules,
  public.partners, public.testimonials, public.site_settings to anon, authenticated;
grant insert, update, delete on public.packages, public.group_tiers, public.addons, public.faqs,
  public.safety_rules, public.partners, public.testimonials, public.site_settings to authenticated;
grant select, insert, update, delete on public.members, public.agents to authenticated;
grant insert on public.bookings, public.registrations to anon, authenticated;
grant select, update, delete on public.bookings to authenticated;
grant select, delete on public.registrations to authenticated;

-- ---------------------------------------------------------------------------------------------
-- Lookups by code for visitors
--
-- SECURITY DEFINER on purpose: visitors have no SELECT on members/agents, so these functions are
-- the only way in, and each returns at most ONE row matching the exact code (codes are random
-- booking codes such as GM-7K2QX, so they cannot be guessed by listing). Nothing else is exposed.
-- ---------------------------------------------------------------------------------------------

create or replace function public.get_member(p_code text)
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'code', m.code,
    'group_name', m.group_name,
    'ride_date', m.ride_date,
    'horse', m.horse,
    'coach', m.coach,
    'riders', m.riders,
    'photos', m.photos,
    'video_url', m.video_url,
    'drive_folder', m.drive_folder
  )
  from public.members m
  where m.code = upper(trim(p_code))
  limit 1
$$;

create or replace function public.get_agent(p_code text)
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'code', a.code,
    'name', a.name,
    'price_open_trip', a.price_open_trip,
    'price_premium', a.price_premium,
    'contact', a.contact
  )
  from public.agents a
  where a.code = upper(trim(p_code)) and a.active
  limit 1
$$;

revoke all on function public.get_member(text) from public;
revoke all on function public.get_agent(text) from public;
grant execute on function public.get_member(text) to anon, authenticated;
grant execute on function public.get_agent(text) to anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- Storage: one public bucket for partner logos and member photos. Anyone can view a file by its
-- URL; only admins can upload, replace (upsert needs select + insert + update) or delete.
-- ---------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "admins read media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins replace media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select private.is_admin()));

-- ---------------------------------------------------------------------------------------------
-- Starting data: the prices and content the site shows today
-- ---------------------------------------------------------------------------------------------

insert into public.packages (id, name, short_name, price, min_people, features, featured, tiered, sort) values
  ('open_trip', 'Open Trip', 'Open Trip', 350, 20, array['horse', 'coach', 'rest'], false, false, 1),
  ('premium', 'Premium Experience', 'Premium', 1250, 1,
    array['horse', 'helmet', 'boots', 'coach', 'rest', 'transport', 'videographer'], true, true, 2);

insert into public.group_tiers (from_people, to_people, price) values
  (1, 1, 1250),
  (2, 4, 850),
  (5, 10, 750),
  (11, null, null);

insert into public.addons (id, name, price, sort) values
  ('gmc', 'GMC', 800, 1),
  ('drone', 'Video drone', 600, 2);

insert into public.site_settings (id) values (1);

insert into public.partners (sort, name, logo_url, size) values
  (1, 'Valeoora Art', '/partners/valeoora-art.png', 'normal'),
  (2, 'Partner 1', '/partners/partner-1.png', 'normal'),
  (3, 'Partner 4', '/partners/partner-4.png', 'normal'),
  (4, 'Partner 5', '/partners/partner-5.png', 'normal'),
  (5, 'Umroh Moment', '/partners/umroh-moment.png', 'large'),
  (6, 'Lintas Haramain Services', '/partners/lintas-haramain.png', 'normal'),
  (7, 'Ateena Visual', '/partners/ateena-visual.png', 'tall');

-- FAQ and safety rules in four languages (the safety rules are a DRAFT until the owner approves them)
insert into public.faqs (sort, q_id, q_en, q_ms, q_ar, a_id, a_en, a_ms, a_ar) values
  (1, 'Apakah berkuda di Gallop Madinah cocok untuk pemula?', 'Is riding at Gallop Madinah suitable for beginners?', 'Adakah menunggang kuda di Gallop Madinah sesuai untuk pemula?', 'هل ركوب الخيل في Gallop Madinah مناسب للمبتدئين؟', 'Ya, pemula bisa ikut karena akan didampingi coach berkuda selama aktivitas berlangsung.', 'Yes, beginners are welcome — a riding coach accompanies you throughout the activity.', 'Ya, pemula boleh menyertai kerana akan dibimbing oleh jurulatih sepanjang aktiviti.', 'نعم، يمكن للمبتدئين المشاركة، إذ يرافقهم مدرّب ركوب طوال النشاط.'),
  (2, 'Berapa lama perjalanan dari hotel ke stable Gallop Madinah?', 'How long is the trip from my hotel to the Gallop Madinah stable?', 'Berapa lama perjalanan dari hotel ke kandang Gallop Madinah?', 'كم تستغرق الطريق من الفندق إلى إسطبل Gallop Madinah؟', 'Sekitar 30 menit, tergantung lokasi hotel dan kondisi lalu lintas.', 'About 30 minutes, depending on your hotel''s location and traffic.', 'Lebih kurang 30 minit, bergantung pada lokasi hotel dan keadaan lalu lintas.', 'حوالي 30 دقيقة، بحسب موقع الفندق وحركة المرور.'),
  (3, 'Apa saja yang saya dapatkan dalam Paket Premium?', 'What do I get with the Premium package?', 'Apakah yang saya dapat dalam Pakej Premium?', 'ماذا تشمل باقة البريميوم؟', 'Paket Premium menawarkan fasilitas dan pengalaman berkuda eksklusif dengan benefit sesuai pilihan paket.', 'The Premium package offers exclusive facilities and riding experience, with benefits according to the package you choose.', 'Pakej Premium menawarkan kemudahan dan pengalaman menunggang eksklusif dengan manfaat mengikut pakej yang dipilih.', 'تقدّم باقة البريميوم مرافق وتجربة ركوب حصرية، مع مزايا حسب الباقة التي تختارها.'),
  (4, 'Apakah perlengkapan berkuda sudah disediakan?', 'Is riding equipment provided?', 'Adakah peralatan menunggang disediakan?', 'هل تتوفر معدات الركوب؟', 'Ya, kami menyediakan helm, sepatu berkuda, dan sorban untuk setiap peserta.', 'Yes, we provide a helmet, riding boots and a shemagh (headscarf) for every rider.', 'Ya, kami menyediakan topi keledar, but menunggang dan serban untuk setiap peserta.', 'نعم، نوفّر لكل مشارك خوذة وحذاء ركوب وشماغًا.'),
  (5, 'Berapa lama durasi aktivitas berkuda?', 'How long does the ride last?', 'Berapa lama tempoh aktiviti menunggang?', 'كم تستغرق جولة الركوب؟', 'Sekitar 1,5 jam dengan jarak tempuh kurang lebih 10 KM.', 'About 1.5 hours, covering roughly 10 km.', 'Lebih kurang 1.5 jam dengan jarak lebih kurang 10 KM.', 'حوالي ساعة ونصف لمسافة تقارب 10 كم.'),
  (6, 'Apakah anak-anak boleh ikut berkuda?', 'Can children ride?', 'Bolehkah kanak-kanak menunggang?', 'هل يمكن للأطفال الركوب؟', 'Ya, anak-anak dapat mengikuti aktivitas berkuda dengan ketentuan usia, kondisi fisik, dan pendampingan yang sesuai.', 'Yes, children can join the ride, subject to age, physical condition and appropriate supervision.', 'Ya, kanak-kanak boleh menyertai tertakluk kepada syarat umur, keadaan fizikal dan pengawasan yang sesuai.', 'نعم، يمكن للأطفال المشاركة وفق شروط العمر والحالة البدنية والإشراف المناسب.'),
  (7, 'Apakah tersedia dokumentasi foto dan video?', 'Are photos and videos available?', 'Adakah dokumentasi foto dan video disediakan?', 'هل يتوفر تصوير بالصور والفيديو؟', 'Silakan pilih paket yang tersedia untuk mengetahui fasilitas dokumentasi foto dan video.', 'Please check the available packages to see which include photo and video documentation.', 'Sila semak pakej yang tersedia untuk mengetahui kemudahan dokumentasi foto dan video.', 'يرجى الاطلاع على الباقات المتاحة لمعرفة ما يشمل التصوير بالصور والفيديو.'),
  (8, 'Apakah bisa berkuda bersama keluarga atau rombongan?', 'Can I ride with my family or a group?', 'Bolehkah menunggang bersama keluarga atau rombongan?', 'هل يمكن الركوب مع العائلة أو المجموعة؟', 'Tentu, kami menerima reservasi individu, keluarga, maupun rombongan.', 'Of course — we welcome individual, family and group bookings.', 'Sudah tentu, kami menerima tempahan individu, keluarga dan rombongan.', 'بالتأكيد، نستقبل حجوزات الأفراد والعائلات والمجموعات.'),
  (9, 'Apakah tersedia layanan antar-jemput hotel?', 'Is hotel pick-up and drop-off available?', 'Adakah perkhidmatan ambil dan hantar dari hotel disediakan?', 'هل تتوفر خدمة التوصيل من الفندق وإليه؟', 'Layanan transportasi dapat disediakan sesuai pilihan paket dan konfirmasi reservasi.', 'Transportation can be arranged depending on your package and booking confirmation.', 'Pengangkutan boleh disediakan mengikut pakej yang dipilih dan pengesahan tempahan.', 'يمكن ترتيب النقل حسب الباقة المختارة وتأكيد الحجز.'),
  (10, 'Apakah ada batasan usia atau berat badan peserta?', 'Is there an age or weight limit?', 'Adakah had umur atau berat badan untuk peserta?', 'هل يوجد حد للعمر أو الوزن؟', 'Ya, terdapat ketentuan tertentu untuk memastikan keselamatan dan kenyamanan selama berkuda.', 'Yes, certain requirements apply to ensure safety and comfort while riding.', 'Ya, terdapat syarat tertentu untuk memastikan keselamatan dan keselesaan semasa menunggang.', 'نعم، هناك شروط معيّنة لضمان السلامة والراحة أثناء الركوب.');

insert into public.safety_rules (sort, text_id, text_en, text_ms, text_ar) values
  (1, 'Saya akan mengikuti semua arahan coach selama berada di area stable dan selama berkuda.', 'I will follow every instruction from the coach at the stable and during the ride.', 'Saya akan mengikuti semua arahan jurulatih semasa berada di kawasan kandang dan semasa menunggang.', 'سألتزم بجميع تعليمات المدرّب في الإسطبل وأثناء الركوب.'),
  (2, 'Saya memakai perlengkapan keselamatan yang diberikan dan pakaian yang nyaman untuk berkuda.', 'I will wear the safety gear provided and clothing suitable for riding.', 'Saya akan memakai peralatan keselamatan yang diberikan dan pakaian yang selesa untuk menunggang.', 'سأرتدي معدات السلامة المقدَّمة وملابس مناسبة للركوب.'),
  (3, 'Saya memberi tahu coach jika sedang sakit, hamil, atau punya kondisi kesehatan yang perlu diperhatikan.', 'I will tell the coach if I am unwell, pregnant, or have a health condition to be aware of.', 'Saya akan memberitahu jurulatih jika sedang sakit, hamil atau mempunyai keadaan kesihatan yang perlu diberi perhatian.', 'سأُبلغ المدرّب إن كنت مريضًا أو حاملًا أو لدي حالة صحية تستدعي الانتباه.'),
  (4, 'Anak-anak wajib didampingi orang tua atau wali selama kegiatan.', 'Children must be accompanied by a parent or guardian throughout the activity.', 'Kanak-kanak wajib diiringi ibu bapa atau penjaga sepanjang aktiviti.', 'يجب أن يرافق الأطفالَ أحدُ الوالدين أو وليُّ الأمر طوال النشاط.'),
  (5, 'Saya memahami bahwa berkuda memiliki risiko dan coach berhak menyesuaikan atau menghentikan kegiatan demi keselamatan.', 'I understand riding carries risk and the coach may adjust or stop the activity for safety.', 'Saya faham bahawa menunggang kuda mempunyai risiko dan jurulatih berhak menyesuaikan atau menghentikan aktiviti demi keselamatan.', 'أدرك أن ركوب الخيل ينطوي على مخاطر، وأن للمدرّب الحق في تعديل النشاط أو إيقافه حفاظًا على السلامة.');
