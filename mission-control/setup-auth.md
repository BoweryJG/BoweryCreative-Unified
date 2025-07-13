# Dashboard Authentication Setup

## Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/fiozmyoedptukpkzuhqm
2. Navigate to the SQL Editor
3. Copy and paste the contents of `20250116_authorized_access.sql`
4. Click "Run" to execute the migration

## Step 2: Create Your Admin User

If you haven't already signed up through the dashboard:

1. Visit https://bowerycreative-dashboard.netlify.app/
2. Click "Sign Up" on the login modal
3. Use your admin email: jasonwilliamgolden@gmail.com or jgolden@bowerycreativeagency.com
4. Check your email for the confirmation link
5. Click the confirmation link to verify your account

## Step 3: Verify Admin Role

After creating your account, run this SQL in Supabase SQL Editor to ensure your admin role is set:

```sql
-- Check if your user exists
SELECT id, email FROM auth.users 
WHERE email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com');

-- If you see your user ID, run this to ensure admin role exists:
INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com')
ON CONFLICT (user_id, role) DO NOTHING;
```

## Alternative: Quick Test Access

For testing, you can temporarily disable the access check:

1. Open `/dashboard/src/contexts/AuthContext.tsx`
2. Find line ~89 where `hasAccess` is set
3. Temporarily change it to: `const hasAccess = true;`
4. Save and test (remember to revert this change later!)

## Troubleshooting

If you're still having issues:
1. Check browser console for specific error messages
2. Verify the .env file has correct Supabase credentials
3. Clear browser cache/cookies for the dashboard domain
4. Try incognito/private browsing mode