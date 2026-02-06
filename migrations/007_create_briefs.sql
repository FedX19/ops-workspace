-- 007_create_briefs.sql
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
  priorities jsonb default '[]'::jsonb,
  opportunities jsonb default '[]'::jsonb,
  blockers jsonb default '[]'::jsonb,
  context text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_briefs_date on briefs(date desc);
