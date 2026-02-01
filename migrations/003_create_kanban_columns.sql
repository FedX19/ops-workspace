-- 003_create_kanban_columns.sql
create table if not exists kanban_columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ordering int default 0
);
