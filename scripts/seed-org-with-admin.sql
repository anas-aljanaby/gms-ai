-- Create an org, a user, and make the user that org's admin
-- Run this in the Supabase SQL Editor
-- Replace org name, email, and password with real values

DO $$
DECLARE
  new_org_id  uuid;
  new_user_id uuid;
BEGIN
  -- 1. Create org
  INSERT INTO organizations (name)
  VALUES ('Test Waqf')
  RETURNING id INTO new_org_id;

  -- 2. Create auth user
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
    'anas.aljanaby667@gmail.com',
    crypt('ChangeMe123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- 3. Link user to org as admin
  INSERT INTO memberships (user_id, org_id, role)
  VALUES (new_user_id, new_org_id, 'org_admin');
END $$;
