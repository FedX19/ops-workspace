-- 004_create_kanban_cards.sql
create table if not exists kanban_cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references kanban_columns(id) on delete set null,
  title text not null,
  body text,
  owner text,
  ordering int default 0
);
