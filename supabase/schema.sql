create extension if not exists "pgcrypto";

create type client_type as enum ('buyer', 'tenant', 'owner', 'investor');
create type client_status as enum ('lead', 'active', 'hot', 'closed', 'lost');
create type furnished_type as enum ('unfurnished', 'semi_furnished', 'fully_furnished');
create type property_type as enum ('apartment', 'villa', 'office', 'shop', 'plot', 'warehouse');
create type property_status as enum ('available', 'reserved', 'leased', 'sold');
create type deal_intent as enum ('rent', 'buy');
create type followup_status as enum ('pending', 'done', 'missed');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  type client_type not null default 'tenant',
  requirement_type deal_intent,
  bhk integer check (bhk is null or bhk >= 0),
  furnished_type furnished_type,
  status client_status not null default 'lead',
  budget numeric(14,2),
  budget_min numeric(14,2),
  budget_max numeric(14,2),
  preferred_location text,
  preferred_locations text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  type property_type not null,
  status property_status not null default 'available',
  intent deal_intent not null,
  location text not null,
  address text,
  price numeric(14,2) not null check (price >= 0),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  area_sqft integer check (area_sqft is null or area_sqft >= 0),
  owner_name text,
  owner_phone text,
  image_urls text[] default '{}',
  amenities text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  intent deal_intent not null,
  property_type property_type,
  location text not null,
  budget_min numeric(14,2) not null check (budget_min >= 0),
  budget_max numeric(14,2) not null check (budget_max >= budget_min),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.followups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  title text not null,
  due_at timestamptz not null,
  status followup_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  unique(requirement_id, property_id)
);

create index clients_user_status_idx on public.clients(user_id, status);
create index clients_user_filters_idx on public.clients(user_id, status, bhk, furnished_type, requirement_type);
create index clients_budget_idx on public.clients(user_id, budget);
create index clients_search_idx on public.clients using gin (
  to_tsvector('simple', coalesce(full_name, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(preferred_location, '') || ' ' || coalesce(notes, ''))
);
create index properties_user_status_idx on public.properties(user_id, status);
create index properties_user_filters_idx on public.properties(user_id, status, intent, type, bedrooms);
create index properties_price_idx on public.properties(user_id, price);
create index properties_location_idx on public.properties(user_id, location);
create index requirements_user_client_idx on public.requirements(user_id, client_id);
create index followups_user_due_idx on public.followups(user_id, due_at) where status = 'pending';
create index matches_user_score_idx on public.matches(user_id, score desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users
for each row execute function public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients
for each row execute function public.set_updated_at();
create trigger properties_set_updated_at before update on public.properties
for each row execute function public.set_updated_at();
create trigger requirements_set_updated_at before update on public.requirements
for each row execute function public.set_updated_at();
create trigger followups_set_updated_at before update on public.followups
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.properties enable row level security;
alter table public.requirements enable row level security;
alter table public.followups enable row level security;
alter table public.matches enable row level security;

create policy "Users can read own profile" on public.users
for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.users
for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.users
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own clients" on public.clients
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own properties" on public.properties
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own requirements" on public.requirements
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own followups" on public.followups
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own matches" on public.matches
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set public = excluded.public;

create policy "Users can upload property images" on storage.objects
for insert with check (
  bucket_id = 'property-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view property images" on storage.objects
for select using (bucket_id = 'property-images');

create policy "Users can update own property images" on storage.objects
for update using (
  bucket_id = 'property-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own property images" on storage.objects
for delete using (
  bucket_id = 'property-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
