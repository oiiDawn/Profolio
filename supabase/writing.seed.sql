-- Seed rows for local smoke tests of the writing pipeline.
-- Usage (example):
--   1) Run supabase/writing.sql
--   2) Run this file
--   3) Upload matching MDX to Storage bucket `writing` (for the md row below)

insert into public.writing_shares (
  id,
  title,
  description,
  tag,
  type,
  url,
  file_path,
  created_at
)
values
  (
    '550e8400-e29b-41d4-a716-44665544aa01',
    'Seeded MDX Share',
    'Seed row for /writing/[id] md rendering smoke test.',
    'seed',
    'md',
    null,
    'hello-profolio.mdx',
    '2026-04-15T00:00:00Z'
  ),
  (
    '550e8400-e29b-41d4-a716-44665544aa02',
    'Seeded External Link',
    'Seed row for external redirect smoke test.',
    'seed',
    'link',
    'https://example.com',
    null,
    '2026-04-15T00:00:00Z'
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  tag = excluded.tag,
  type = excluded.type,
  url = excluded.url,
  file_path = excluded.file_path;
