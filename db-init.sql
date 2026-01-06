-- Database Initialization Script for Experience Club
-- This script creates the admin user and can be extended with product data

-- Create admin user with hashed password (admin123456)
-- Hash generated with: bcrypt.hash('admin123456', 10)
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@experienceclub.com',
  'Admin User',
  '$2b$10$WtDGK25ERg/HJqtck2xG7eCKAv4VauUk9pQB/I6Z4GWCCQLRsdYie',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify admin user was created
SELECT id, email, name, role, "createdAt"
FROM "User"
WHERE email = 'admin@experienceclub.com';
