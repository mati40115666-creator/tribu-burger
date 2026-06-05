-- ══════════════════════════════════════════════════════════
-- TRIBU BURGER · Schema de Supabase
-- Pegá todo esto en el SQL Editor de tu proyecto Supabase
-- y ejecutalo con "Run"
-- ══════════════════════════════════════════════════════════

-- 1. Tablas
-- ─────────────────────────────────────────────────────────

create table public.config (
  id integer primary key default 1,
  name text not null default 'TRIBU BURGER',
  tagline text default 'SABORES ANCESTRALES · FUEGO · IDENTIDAD',
  whatsapp text not null default '5493420000000',
  schedule text default 'Todos los días (excepto martes) · 19 a 00hs',
  address text default 'Santa Fe, Argentina',
  instagram text default '@tribu.burger_',
  bank_alias text default 'tribu.burger.mp'
);

create table public.categories (
  id text primary key,
  name text not null,
  banner_color text not null default 'amber',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table public.products (
  id text primary key,
  category_id text not null references public.categories(id),
  name text not null,
  subtitle text,
  description text,
  base_price integer not null default 0,
  has_medallon boolean not null default false,
  theme text not null default 'totem',
  mask_type text not null default 'totem',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table public.extras (
  id text primary key,
  name text not null,
  price integer not null default 0,
  active boolean not null default true
);

create table public.zones (
  id text primary key,
  name text not null,
  price integer not null default 0,
  active boolean not null default true
);

-- 2. Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────

alter table public.config enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.extras enable row level security;
alter table public.zones enable row level security;

-- Lectura pública (el menú es visible para todos)
create policy "Lectura pública config" on public.config for select using (true);
create policy "Lectura pública categories" on public.categories for select using (true);
create policy "Lectura pública products" on public.products for select using (true);
create policy "Lectura pública extras" on public.extras for select using (true);
create policy "Lectura pública zones" on public.zones for select using (true);

-- Escritura solo para usuarios autenticados (el admin)
create policy "Admin config" on public.config for all using (auth.role() = 'authenticated');
create policy "Admin categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Admin products" on public.products for all using (auth.role() = 'authenticated');
create policy "Admin extras" on public.extras for all using (auth.role() = 'authenticated');
create policy "Admin zones" on public.zones for all using (auth.role() = 'authenticated');

-- 3. Datos iniciales
-- ─────────────────────────────────────────────────────────

insert into public.config (id, name, tagline, whatsapp, schedule, address, instagram, bank_alias)
values (1, 'TRIBU BURGER', 'SABORES ANCESTRALES · FUEGO · IDENTIDAD',
        '5493420000000', 'Todos los días (excepto martes) · 19 a 00hs',
        'Santa Fe, Argentina', '@tribu.burger_', 'tribu.burger.mp');

insert into public.categories (id, name, banner_color, sort_order) values
  ('burgers', 'HAMBURGUESAS', 'amber', 1),
  ('sides',   'ACOMPAÑAMIENTOS', 'red', 2),
  ('drinks',  'BEBIDAS', 'green', 3);

insert into public.products
  (id, category_id, name, subtitle, description, base_price, has_medallon, theme, mask_type, sort_order)
values
  ('totem',       'burgers', 'TÓTEM BURGER',      null,              'Blend de carne · Barbacoa ahumada · Bacon · Cheddar fundido',                                                    10000, true,  'totem',     'totem',     1),
  ('azteca',      'burgers', 'AZTECA',             null,              'Blend de carne · Barbacoa ahumada · Bacon · Cebolla crispy · Cheddar fundido',                                   10000, true,  'azteca',    'azteca',    2),
  ('maya',        'burgers', 'MAYA BURGER',        null,              'Blend de carne · Salsa alioli · Tomates asados · Rúcula · Queso tybo',                                           10000, true,  'maya',      'maya',      3),
  ('inca-gold',   'burgers', 'INCA GOLD',          null,              'Blend de carne · Volcán de cheddar y panceta · Barbacoa ahumada · Bacon',                                       10000, true,  'inca',      'inca',      4),
  ('ancestral',   'burgers', 'ANCESTRAL BURGER',   null,              'Blend de carne · Salsa tasty · Pepinillos · Bacon · Cheddar',                                                   10000, true,  'ancestral', 'ancestral', 5),
  ('tribu',       'burgers', 'TRIBU BURGER',       'LA DE LA CASA',   'Blend de carne · Mayonesa de chimichurri · Lechuga · Tomate · Queso tybo · Jamón · Huevo',                     10000, true,  'tribu',     'tribu',     6),
  ('papas-clasicas', 'sides','PAPAS CLÁSICAS',     null,              'Papas fritas crocantes',                                                                                         10000, false, 'totem',     'fries',     1),
  ('papas-cheddar',  'sides','PAPAS CON CHEDDAR Y BACON', null,       'Papas fritas con cheddar fundido y bacon crocante',                                                              10000, false, 'inca',      'fries',     2),
  ('gaseosa',     'drinks',  'GASEOSA',            null,              'Línea Coca-Cola · consultar variedades',                                                                         10000, false, 'azteca',    'drink',     1),
  ('agua',        'drinks',  'AGUA',               null,              'Con o sin gas',                                                                                                  10000, false, 'maya',      'drink',     2),
  ('cerveza',     'drinks',  'CERVEZA',            null,              'Rubia / Negra / IPA',                                                                                            10000, false, 'inca',      'beer',      3);

insert into public.extras (id, name, price) values
  ('extra-burger',  'EXTRA BURGER',  2000),
  ('extra-cheddar', 'EXTRA CHEDDAR', 2000);

insert into public.zones (id, name, price) values
  ('sur',    'Zona Sur',    2000),
  ('centro', 'Zona Centro', 2000),
  ('norte',  'Zona Norte',  2000);
