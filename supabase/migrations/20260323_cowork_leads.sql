-- Cowork Starter Pack lead capture
-- Run this migration against the Supabase project before deploying SUP-209

CREATE TABLE IF NOT EXISTS cowork_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  profession text NOT NULL,
  source text DEFAULT 'cowork',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cowork_leads_email ON cowork_leads(email);
CREATE INDEX IF NOT EXISTS idx_cowork_leads_profession ON cowork_leads(profession);
