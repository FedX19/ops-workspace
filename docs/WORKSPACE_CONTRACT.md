# Workspace Contract

Guardrails and approval gates A1-A6 for Ops Workspace.

- Do NOT touch UniteHQ repos or infra.
- Approval gates:
  - A1: Repo creation and initial push
  - A2: Supabase project creation / invite
  - A3: RLS policy changes
  - A4: Vercel connect / env var setup
  - A5: Auth provider changes / public-signup
  - A6: Promote DEV -> PROD

Always create backups and stop for approvals at gates.
