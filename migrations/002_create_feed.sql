-- 002_create_feed.sql
create table if not exists feed (
  id uuid primary key default gen_random_uuid(),
  time timestamptz default now(),
  actor text,
  summary text,
  metadata jsonb
);
