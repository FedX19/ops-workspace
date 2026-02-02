Supabase Auth URL Configuration checklist

- Site URL: set to https://<your-deployment-domain>
- Redirect URLs: include https://<your-deployment-domain>/auth/callback and remove localhost entries for prod
- For DEV use preview URLs as needed
- Ensure NEXT_PUBLIC_SUPABASE_URL matches the deployment origin
- Verify magic link redirect runs exchangeCodeForSession on the callback route
