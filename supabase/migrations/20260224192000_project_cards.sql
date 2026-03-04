-- Project cards table for vault-to-Supabase sync
-- Replaces local filesystem reads from the Project Board API route

CREATE TABLE IF NOT EXISTS project_cards (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  column_id TEXT CHECK (column_id IN ('active', 'in-review', 'needs-you', 'done')),
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient filtering by column and project
CREATE INDEX IF NOT EXISTS idx_project_cards_column_id ON project_cards (column_id);
CREATE INDEX IF NOT EXISTS idx_project_cards_project ON project_cards (project);
CREATE INDEX IF NOT EXISTS idx_project_cards_priority ON project_cards (priority);

-- Comment
COMMENT ON TABLE project_cards IS 'Synced from vault Project Board markdown files via sync-vault-to-supabase.js. Updated every 15 minutes via cron.';
