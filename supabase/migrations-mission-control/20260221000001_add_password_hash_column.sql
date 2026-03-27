-- Add password_hash column to users table for email+password authentication
-- This supplements the magic-link auth, not replaces it

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Index for email lookups (should already exist but ensure it)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

COMMENT ON COLUMN users.password_hash IS 'bcrypt hash of user password. NULL means magic-link only auth.';
