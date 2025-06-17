-- Check your access status
SELECT 
  u.id,
  u.email,
  ur.role,
  has_dashboard_access(u.id) as has_access
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'jasonwilliamgolden@gmail.com';