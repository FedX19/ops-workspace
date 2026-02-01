-- 005_create_profiles.sql
create table if not exists profiles (
  id uuid primary key,
  email text,
  display_name text,
  created_at timestamptz default now()
);
