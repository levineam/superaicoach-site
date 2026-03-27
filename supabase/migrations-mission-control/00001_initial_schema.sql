-- Initial schema for Vibe Geniuses
-- Run: supabase db push

-- File type enum
CREATE TYPE file_type AS ENUM ('soul', 'memory', 'goals', 'custom');
-- Message source enum
CREATE TYPE message_source AS ENUM ('app', 'imessage', 'web');
-- Message role enum
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    apple_id TEXT UNIQUE,
    display_name TEXT,
    phone_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Markdown files table
CREATE TABLE public.markdown_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    content TEXT DEFAULT '' NOT NULL,
    file_type file_type DEFAULT 'custom' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Each user can only have one file with a given name
    UNIQUE(user_id, filename)
);
-- Conversations table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source message_source DEFAULT 'app' NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    metadata JSONB
);
-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tokens_used INTEGER
);
-- Indexes
CREATE INDEX idx_markdown_files_user ON public.markdown_files(user_id);
CREATE INDEX idx_conversations_user ON public.conversations(user_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_users_phone ON public.users(phone_number);
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markdown_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- RLS Policies

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
-- Users can CRUD their own markdown files
CREATE POLICY "Users can view own files" ON public.markdown_files
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own files" ON public.markdown_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own files" ON public.markdown_files
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON public.markdown_files
    FOR DELETE USING (auth.uid() = user_id);
-- Users can CRUD their own conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations
    FOR DELETE USING (auth.uid() = user_id);
-- Users can CRUD messages in their conversations
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = messages.conversation_id
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = messages.conversation_id
            AND user_id = auth.uid()
        )
    );
-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply updated_at triggers
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER markdown_files_updated_at
    BEFORE UPDATE ON public.markdown_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Function to create default files for new users
CREATE OR REPLACE FUNCTION create_default_files()
RETURNS TRIGGER AS $$
BEGIN
    -- Create SOUL.md
    INSERT INTO public.markdown_files (user_id, filename, content, file_type)
    VALUES (
        NEW.id,
        'SOUL.md',
        '# SOUL.md

This is who I am at my core.

## Name
<!-- What should I call you? -->

## Values
<!-- What matters most to you? -->

## Personality
<!-- How do you like to communicate? -->
',
        'soul'
    );
    
    -- Create GOALS.md
    INSERT INTO public.markdown_files (user_id, filename, content, file_type)
    VALUES (
        NEW.id,
        'GOALS.md',
        '# GOALS.md

These are the things I''m working toward.

## Current Focus
<!-- What are you actively working on? -->

## This Quarter
<!-- What do you want to accomplish? -->
',
        'goals'
    );
    
    -- Create MEMORY.md
    INSERT INTO public.markdown_files (user_id, filename, content, file_type)
    VALUES (
        NEW.id,
        'MEMORY.md',
        '# MEMORY.md

Things I want you to remember.

## Important Context
<!-- Key life circumstances -->

## Preferences
<!-- How you like to receive feedback -->
',
        'memory'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger to create default files when user signs up
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_default_files();
