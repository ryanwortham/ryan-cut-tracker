-- FORGED Supabase schema
-- Run in Supabase SQL editor for the FORGED project.

create table if not exists public.forged_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  start_weight numeric,
  goal_weight numeric,
  goal_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forged_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forged_profiles enable row level security;
alter table public.forged_user_state enable row level security;

create policy "forged_profiles_select_own"
  on public.forged_profiles for select
  using (auth.uid() = id);

create policy "forged_profiles_insert_own"
  on public.forged_profiles for insert
  with check (auth.uid() = id);

create policy "forged_profiles_update_own"
  on public.forged_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "forged_state_select_own"
  on public.forged_user_state for select
  using (auth.uid() = user_id);

create policy "forged_state_insert_own"
  on public.forged_user_state for insert
  with check (auth.uid() = user_id);

create policy "forged_state_update_own"
  on public.forged_user_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
