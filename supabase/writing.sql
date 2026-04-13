-- Writing / shares: metadata in PG, MDX files in Storage bucket `writing`.
-- Run in Supabase SQL editor after creating the bucket (Dashboard → Storage → New bucket → name: writing, public).
-- 不预置示例行；数据请用 `pnpm upload-writing` 或自行 INSERT。

create table if not exists public.writing_shares (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  type text not null default 'md' check (type in ('md', 'link')),
  url text,
  file_path text,
  created_at timestamptz not null default now()
);

alter table public.writing_shares enable row level security;

drop policy if exists "Allow public read writing_shares" on public.writing_shares;
create policy "Allow public read writing_shares"
  on public.writing_shares
  for select
  to anon, authenticated
  using (true);
