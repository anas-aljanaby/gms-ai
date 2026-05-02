-- Seed a super admin user
-- Run this in the Supabase SQL Editor
-- Replace email/password with your real values

-- 1. Create a sentinel "Platform" org to hold super admin memberships
INSERT INTO organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Platform');

-- 2. Create the auth user
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at, confirmation_token, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'superadmin@yourdomain.com',
  crypt('your-secure-password-here', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  ''
);

-- 3. Link the user as super_admin under the Platform org
INSERT INTO memberships (user_id, org_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'superadmin@yourdomain.com'),
  '00000000-0000-0000-0000-000000000001',
  'super_admin'
);
