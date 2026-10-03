-- Run once in Supabase: SQL Editor > New query > paste > Run.
create table if not exists settings (id int primary key check (id = 1), data jsonb not null default '{}');
insert into settings (id, data) values (1, '{}') on conflict do nothing;

create table if not exists admins (email text primary key);
create or replace function is_admin() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from admins where lower(email) = lower(auth.jwt() ->> 'email')) $$;

create table if not exists menu_items (
  id bigint primary key, slug text unique, title text not null, description text,
  price numeric(10,2) not null check (price >= 0), category text, images text[] default '{}',
  popular boolean default false, rating numeric(2,1) default 5, active boolean default true,
  sort int default 0, created_at timestamptz default now());

create table if not exists branches (
  id bigint generated always as identity primary key, name text not null, address text, phone text,
  hours text, map_embed text, featured boolean default false, active boolean default true, sort int default 0);

create table if not exists team_members (
  id bigint generated always as identity primary key, name text not null, role text, image text,
  active boolean default true, sort int default 0);

create table if not exists journey (
  id bigint generated always as identity primary key, year text, title text, body text,
  active boolean default true, sort int default 0);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(), reference text unique not null,
  customer_name text not null, phone text not null, phone2 text, email text not null,
  fulfilment text not null check (fulfilment in ('delivery','pickup')), address text,
  branch_id bigint references branches(id), items jsonb not null, amount numeric(10,2) not null,
  gateway text not null, status text not null default 'pending' check (status in ('pending','paid','delivered','cancelled')),
  ip text, created_at timestamptz default now(),
  check (fulfilment <> 'delivery' or coalesce(address, '') <> ''));

-- Row level security
alter table settings enable row level security;
alter table admins enable row level security;      -- no policies: nobody can read it directly
alter table orders enable row level security;
create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all using (is_admin()) with check (is_admin());
create policy "admin orders" on orders for all using (is_admin()) with check (is_admin());
-- Orders are created only by Edge Functions (service role), never straight from the browser.

do $$ declare t text; begin
  foreach t in array array['menu_items','branches','team_members','journey'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "public read" on %I for select using (active)', t);
    execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Image storage
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects for all using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());

-- Add yourself as the first admin (change the email, then run this line):
-- insert into admins (email) values ('you@example.com');
