-- One-off: drop legacy learning tables (replaced by writing_shares + Storage).
-- Safe to run if tables were already removed.

drop table if exists public.learning_chapters cascade;
drop table if exists public.learning_projects cascade;
