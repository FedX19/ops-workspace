-- 001_create_approvals.sql
create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  risk text not null,
  state text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid
);
