-- RLS DRAFTS (DO NOT APPLY) - ops-workspace-dev
-- Label: RLS_DRAFT_v1

-- Enable RLS on approvals table and allow owners to insert/select their rows
-- Note: run only after users are in profiles and auth.uid() mapping is confirmed.

-- ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "approvals_select_own" ON approvals
--   FOR SELECT USING (created_by = auth.uid());
-- CREATE POLICY "approvals_insert_authenticated" ON approvals
--   FOR INSERT WITH CHECK (created_by = auth.uid());
-- CREATE POLICY "approvals_update_owner" ON approvals
--   FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Rationale: restrict approvals so users can only read/modify their own items.

-- For feed (audit-like), allow inserts by authenticated users, but selects allowed for all authenticated users:
-- ALTER TABLE feed ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "feed_insert_auth" ON feed
--   FOR INSERT WITH CHECK (auth.role() IS NOT NULL);
-- CREATE POLICY "feed_select_auth" ON feed
--   FOR SELECT USING (auth.role() IS NOT NULL);

-- Kanban columns/cards: allow read to authenticated users; card modifications restricted to owner
-- ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "kanban_columns_select_auth" ON kanban_columns
--   FOR SELECT USING (auth.role() IS NOT NULL);

-- ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "kanban_cards_select_auth" ON kanban_cards
--   FOR SELECT USING (auth.role() IS NOT NULL);
-- CREATE POLICY "kanban_cards_modify_owner" ON kanban_cards
--   FOR UPDATE USING (owner = auth.uid()) WITH CHECK (owner = auth.uid());

-- profiles table: allow users to select/update their own profile
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "profiles_select_own" ON profiles
--   FOR SELECT USING (id = auth.uid());
-- CREATE POLICY "profiles_update_own" ON profiles
--   FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- IMPORTANT: Do NOT enable these policies until Tim reviews and confirms auth.uid() mapping and sample rows for testing.
