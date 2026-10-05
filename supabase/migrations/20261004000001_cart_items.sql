-- Amara Scents --- shared server-side cart
-- Supports one row per user/product/size, mirroring the web cart's
-- lineId of "<product_id>::<size>". Prices are never stored here: the
-- cart holds identifiers and quantities only, and the order function
-- re-resolves prices from public.products, matching the existing
-- security stance in docs/API.md.

-- ---------------------------------------------------------------------------
-- cart_items
-- ---------------------------------------------------------------------------
create table if not exists public.cart_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  size text not null check (size in ('50ml', '100ml')),
  quantity integer not null check (quantity > 0 and quantity <= 10),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

create index if not exists cart_items_user_id_idx
  on public.cart_items (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.cart_items enable row level security;

create policy "cart_items_select_own"
  on public.cart_items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "cart_items_insert_own"
  on public.cart_items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "cart_items_update_own"
  on public.cart_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cart_items_delete_own"
  on public.cart_items for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row
  execute function public.set_updated_at();