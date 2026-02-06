-- 009_update_briefs_schema.sql
-- Add columns for interactive content
alter table briefs add column if not exists sections jsonb default '[]'::jsonb;
alter table briefs add column if not exists research_links jsonb default '[]'::jsonb;
alter table briefs add column if not exists detailed_outline jsonb default '{}'::jsonb;

comment on column briefs.sections is 'Interactive expandable sections with links and details';
comment on column briefs.research_links is 'Competitor analysis and reference links';
comment on column briefs.detailed_outline is 'Step-by-step outlines for each priority';
