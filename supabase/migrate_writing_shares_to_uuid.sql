-- Migrate existing text-id `writing_shares` to UUID primary key and drop `updated_at`.
-- Run once in Supabase SQL editor if you already have the old table.

begin;

drop policy if exists "Allow public read writing_shares" on public.writing_shares;

create table public.writing_shares_migrated (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  type text not null default 'md' check (type in ('md', 'link')),
  url text,
  file_path text,
  created_at timestamptz not null default now()
);

insert into public.writing_shares_migrated (title, description, tag, type, url, file_path, created_at)
select title, description, tag, type, url, file_path, created_at
from public.writing_shares;

drop table public.writing_shares;
alter table public.writing_shares_migrated rename to writing_shares;

alter table public.writing_shares enable row level security;

create policy "Allow public read writing_shares"
  on public.writing_shares
  for select
  to anon, authenticated
  using (true);

commit;
