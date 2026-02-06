-- 008_seed_kanban_columns.sql
insert into kanban_columns (title, ordering) values
  ('Backlog', 0),
  ('In Progress', 1),
  ('Review', 2),
  ('Done', 3)
on conflict do nothing;
