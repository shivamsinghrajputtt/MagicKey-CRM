do $$
begin
  if not exists (select 1 from pg_type where typname = 'furnished_type') then
    create type furnished_type as enum ('unfurnished', 'semi_furnished', 'fully_furnished');
  end if;
end $$;

alter table public.clients
  add column if not exists requirement_type deal_intent,
  add column if not exists bhk integer check (bhk is null or bhk >= 0),
  add column if not exists furnished_type furnished_type,
  add column if not exists budget numeric(14,2),
  add column if not exists preferred_location text;

create index if not exists clients_user_filters_idx
  on public.clients(user_id, status, bhk, furnished_type, requirement_type);

create index if not exists clients_budget_idx
  on public.clients(user_id, budget);
