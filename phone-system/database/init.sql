-- Create database and user
CREATE DATABASE IF NOT EXISTS bowery_platform;
CREATE USER IF NOT EXISTS bowery_user WITH PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE bowery_platform TO bowery_user;

-- Connect to the database
\c bowery_platform;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial admin user (password: admin123)
-- Note: Change this password immediately after first login
INSERT INTO users (
  id,
  email,
  "passwordHash",
  "firstName",
  "lastName",
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  uuid_generate_v4(),
  'admin@boweryplatform.com',
  '$2a$10$8KqKXJ7EfB6r1hGrJqXxHOhXmFJI4Y7CtcO7sS7BNBtPqPKRsGHDm', -- bcrypt hash of 'admin123'
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create sample client for testing
INSERT INTO clients (
  id,
  "clientCode",
  name,
  "businessName",
  "contactEmail",
  "contactPhone",
  status,
  "billingCycle",
  "creditLimit",
  "currentBalance",
  settings,
  "createdAt",
  "updatedAt"
) VALUES (
  uuid_generate_v4(),
  'DRPEDRO001',
  'Dr. Pedro Martinez',
  'Dr. Pedro Medical Practice',
  'contact@drpedro.com',
  '+1234567890',
  'active',
  'monthly',
  1000.00,
  500.00,
  '{"notifications": {"email": true, "sms": false, "lowBalance": true, "highUsage": true}}'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT ("clientCode") DO NOTHING;