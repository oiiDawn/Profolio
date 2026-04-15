-- Writing / shares: metadata in PG, MDX files in Storage bucket `writing`.
-- Run in Supabase SQL editor after creating the bucket (Dashboard → Storage → New bucket → name: writing, public).
-- 不预置示例行；数据请用 `pnpm upload-writing` 或自行 INSERT。

create extension if not exists pgcrypto;

create table if not exists public.writing_shares (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  type text not null default 'md',
  url text,
  file_path text,
  created_at timestamptz not null default now(),
  constraint writing_shares_type_check check (type in ('md', 'link')),
  constraint writing_shares_shape_check check (
    (
      type = 'md'
      and nullif(btrim(file_path), '') is not null
      and url is null
    )
    or (
      type = 'link'
      and nullif(btrim(url), '') is not null
      and file_path is null
    )
  )
);

drop trigger if exists trg_set_writing_shares_updated_at on public.writing_shares;
drop function if exists public.set_writing_shares_updated_at();

alter table public.writing_shares
  drop column if exists updated_at;

alter table public.writing_shares
  drop constraint if exists writing_shares_type_check;

alter table public.writing_shares
  add constraint writing_shares_type_check check (type in ('md', 'link'));

alter table public.writing_shares
  drop constraint if exists writing_shares_shape_check;

alter table public.writing_shares
  add constraint writing_shares_shape_check check (
    (
      type = 'md'
      and nullif(btrim(file_path), '') is not null
      and url is null
    )
    or (
      type = 'link'
      and nullif(btrim(url), '') is not null
      and file_path is null
    )
  ) not valid;

alter table public.writing_shares enable row level security;

drop policy if exists "Allow public read writing_shares" on public.writing_shares;
create policy "Allow public read writing_shares"
  on public.writing_shares
  for select
  to anon, authenticated
  using (true);
