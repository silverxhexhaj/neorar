-- Migration: Add conversations table for organizing chat sessions
-- This extends the existing chat_messages table with conversation support
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/eodggpgpyzegzfbfdvzw/sql

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_conversations_user_last_message ON conversations(user_id, last_message_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Add conversation_id to chat_messages table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;

-- Create index for conversation_id in chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Create trigger to automatically update conversation's updated_at and last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the conversation's timestamps when a message is added
    UPDATE conversations 
    SET 
        updated_at = NOW(),
        last_message_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chat_messages
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Create trigger to automatically update conversations updated_at timestamp
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate conversation title from first user message
CREATE OR REPLACE FUNCTION generate_conversation_title(conversation_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    first_message TEXT;
    title TEXT;
BEGIN
    -- Get the first user message from the conversation
    SELECT content INTO first_message
    FROM chat_messages
    WHERE conversation_id = conversation_uuid 
    AND sender = 'user'
    ORDER BY timestamp ASC
    LIMIT 1;
    
    IF first_message IS NULL THEN
        RETURN 'New Chat';
    END IF;
    
    -- Truncate to reasonable length and clean up
    title := SUBSTRING(first_message FROM 1 FOR 50);
    
    -- Remove newlines and extra spaces
    title := REGEXP_REPLACE(title, '\s+', ' ', 'g');
    title := TRIM(title);
    
    -- Add ellipsis if truncated
    IF LENGTH(first_message) > 50 THEN
        title := title || '...';
    END IF;
    
    RETURN COALESCE(title, 'New Chat');
END;
$$ language 'plpgsql';

-- Create function to migrate existing messages to conversations
CREATE OR REPLACE FUNCTION migrate_existing_messages_to_conversations()
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    conversation_uuid UUID;
BEGIN
    -- For each user with messages, create a conversation and link their messages
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM chat_messages 
        WHERE conversation_id IS NULL
    LOOP
        -- Create a new conversation for this user
        INSERT INTO conversations (user_id, title, created_at, updated_at, last_message_at)
        VALUES (
            user_record.user_id,
            'Chat History',
            (SELECT MIN(timestamp) FROM chat_messages WHERE user_id = user_record.user_id),
            (SELECT MAX(timestamp) FROM chat_messages WHERE user_id = user_record.user_id),
            (SELECT MAX(timestamp) FROM chat_messages WHERE user_id = user_record.user_id)
        )
        RETURNING id INTO conversation_uuid;
        
        -- Update all messages for this user to belong to this conversation
        UPDATE chat_messages 
        SET conversation_id = conversation_uuid
        WHERE user_id = user_record.user_id AND conversation_id IS NULL;
        
        -- Generate and update the conversation title
        UPDATE conversations 
        SET title = generate_conversation_title(conversation_uuid)
        WHERE id = conversation_uuid;
    END LOOP;
END;
$$ language 'plpgsql';

-- Run the migration for existing messages
SELECT migrate_existing_messages_to_conversations();

-- Make conversation_id required for new messages (after migration)
-- We'll handle this in the application code to avoid breaking existing functionality 