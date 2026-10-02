-- Amara Scents --- initial schema
-- Provider: Supabase PostgreSQL.
-- Entities follow docs/DATABASE.md. Prices are resolved server-side from the
-- products table; the browser never supplies a trusted price.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- Read-only to the browser. Populated with the nine catalogue fragrances so
-- the order function can resolve names and prices from trusted data.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  scent_notes text[] not null default '{}',
  mood text[] not null default '{}',
  image_url text,
  price_50ml numeric(10, 2) not null default 250 check (price_50ml > 0),
  price_100ml numeric(10, 2) not null default 500 check (price_100ml > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles
-- One row per authenticated user, created by the trigger below.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- orders
-- Written only by the server-side order function using the service role, so
-- there is deliberately no client INSERT policy.
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique default (
    'AMR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  user_id uuid not null references auth.users (id) on delete restrict,
  email text not null,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  country text not null default 'South Africa',
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping numeric(10, 2) not null default 0 check (shipping >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- order_items
-- product_name_snapshot and unit_price preserve what was bought at the time
-- of purchase, independent of later catalogue edits.
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  product_name_snapshot text not null,
  selected_size text not null check (selected_size in ('50ml', '100ml')),
  unit_price numeric(10, 2) not null check (unit_price > 0),
  quantity integer not null check (quantity > 0 and quantity <= 10),
  line_total numeric(10, 2) not null check (line_total > 0)
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public catalogue reads are limited to active products.
create policy "products_select_active"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "order_items_select_own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Catalogue seed
-- Matches src/data/products.ts. Image URLs are omitted here because the
-- storefront imports the real photography from product-images/.
-- ---------------------------------------------------------------------------
insert into public.products (
  id, name, slug, description, scent_notes, mood, price_50ml, price_100ml
)
values
  (
    'velvet-hour', 'VELVET HOUR', 'velvet-hour',
    'A soft-focus vanilla wrapped in cashmere warmth, finished with a clean musk that lingers close to the skin.',
    array['Vanilla', 'Cashmere', 'Musk'],
    array['Soft', 'Sensual', 'Comforting'],
    250, 500
  ),
  (
    'afterglow', 'AFTERGLOW', 'afterglow',
    'Amber and tonka glow against warm woods, a slow-burn scent that stays with whoever walked into the room.',
    array['Amber', 'Tonka', 'Warm Woods'],
    array['Warm', 'Magnetic', 'Sophisticated'],
    250, 500
  ),
  (
    'sahara', 'SAHARA', 'sahara',
    'Spiced citrus lifts into saffron and settles into amber. Bright at first, unmistakably confident all evening.',
    array['Spiced Citrus', 'Saffron', 'Amber'],
    array['Radiant', 'Exotic', 'Bold'],
    250, 500
  ),
  (
    'nocturne', 'NOCTURNE', 'nocturne',
    'Black plum and rose move through a haze of incense — the fragrance for the hours nobody else is awake for.',
    array['Black Plum', 'Rose', 'Incense'],
    array['Dark', 'Mysterious', 'Seductive'],
    250, 500
  ),
  (
    'sweet-talk', 'SWEET TALK', 'sweet-talk',
    'Caramel sweetness softened by jasmine and a vanilla base. Cheeky on purpose, and impossible to ignore.',
    array['Caramel', 'Jasmine', 'Vanilla'],
    array['Playful', 'Sweet', 'Flirty'],
    250, 500
  ),
  (
    'soleil', 'SOLÉIL', 'soleil',
    'Bergamot and neroli over white musk: a bright South African afternoon compressed into one spritz.',
    array['Bergamot', 'Neroli', 'White Musk'],
    array['Fresh', 'Luminous', 'Effortless'],
    250, 500
  ),
  (
    'ember', 'EMBER', 'ember',
    'Smoked vanilla and cedar embers glowing under amber. Heavy, warm, and made for cold nights.',
    array['Smoked Vanilla', 'Cedar', 'Amber'],
    array['Smoky', 'Warm', 'Intense'],
    250, 500
  ),
  (
    'fig-and-honey', 'FIG & HONEY', 'fig-honey',
    'Ripe fig and golden honey over creamy sandalwood — lush without being loud, and quietly sensual.',
    array['Fig', 'Honey', 'Sandalwood'],
    array['Lush', 'Golden', 'Sensual'],
    250, 500
  ),
  (
    'sea-talk', 'SEA TALK', 'sea-talk',
    'Bergamot, sea salt and cedarwood — cool, coastal and calm, like an empty shoreline at midday.',
    array['Bergamot', 'Sea Salt', 'Cedarwood'],
    array['Fresh', 'Coastal', 'Serene'],
    250, 500
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  scent_notes = excluded.scent_notes,
  mood = excluded.mood,
  price_50ml = excluded.price_50ml,
  price_100ml = excluded.price_100ml;