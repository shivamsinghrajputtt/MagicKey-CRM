alter table public.properties
  add column if not exists notes text;

create index if not exists properties_user_filters_idx
  on public.properties(user_id, status, intent, type, bedrooms);

create index if not exists properties_price_idx
  on public.properties(user_id, price);
