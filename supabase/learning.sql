-- Run this in Supabase SQL Editor (Dashboard → SQL → New query).
-- Creates learning tracker tables, RLS for public read, and sample rows.

-- 1) Tables -----------------------------------------------------------------

create table if not exists public.learning_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tag text not null default '',
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'paused')),
  created_at timestamptz not null default now()
);

create table if not exists public.learning_chapters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.learning_projects (id) on delete cascade,
  title text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  share_id text,
  share_url text,
  created_at timestamptz not null default now()
);

create index if not exists learning_chapters_project_id_idx
  on public.learning_chapters (project_id);

-- 2) Row Level Security ------------------------------------------------------

alter table public.learning_projects enable row level security;
alter table public.learning_chapters enable row level security;

-- Public read (anon key) for portfolio page
drop policy if exists "Allow public read learning_projects" on public.learning_projects;
create policy "Allow public read learning_projects"
  on public.learning_projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public read learning_chapters" on public.learning_chapters;
create policy "Allow public read learning_chapters"
  on public.learning_chapters
  for select
  to anon, authenticated
  using (true);

-- Optional: allow authenticated users to insert/update/delete via dashboard user only.
-- For manual edits in Table Editor, use the service role or disable RLS temporarily,
-- or add policies for your auth role. This script keeps writes to dashboard/service role.

-- 3) Sample seed (optional) --------------------------------------------------
-- 仅在两张表均为空时插入示例数据，避免重复执行时产生重复行。

do $$
declare
  p1 uuid;
  p2 uuid;
begin
  if exists (select 1 from public.learning_projects limit 1) then
    return;
  end if;

  insert into public.learning_projects (title, description, tag, status)
  values (
    'Next.js 应用架构',
    '路由、数据获取与部署实践，作为本站技术栈的延伸实验。',
    '前端',
    'in_progress'
  )
  returning id into p1;

  insert into public.learning_projects (title, description, tag, status)
  values (
    '系统设计笔记',
    '从缓存、队列到一致性，按主题整理可执行的设计要点。',
    '后端',
    'paused'
  )
  returning id into p2;

  insert into public.learning_chapters (project_id, title, status, share_id, share_url)
  values
    (p1, '第 1 章：App Router 与布局', 'completed', '01', null),
    (p1, '第 2 章：服务端数据与缓存', 'in_progress', null, null),
    (p2, '主题：可扩展性与负载', 'not_started', '02', null);
end $$;
