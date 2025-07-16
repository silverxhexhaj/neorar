import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  user_id?: string
  conversation_id?: string
}

export interface DatabaseChatMessage {
  id: string
  user_id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
  created_at: string
  updated_at: string
  conversation_id?: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: Date
  updated_at: Date
  last_message_at: Date
}

export interface DatabaseConversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  last_message_at: string
}

export class ChatService {
  /**
   * Create a new conversation for a user
   */
  static async createConversation(user: User, title: string = 'New Chat'): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating conversation:', error)
        return null
      }

      return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        last_message_at: new Date(data.last_message_at),
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }

  /**
   * Get all conversations for a user
   */
  static async getConversationsForUser(user: User): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        return []
      }

      return data.map((conv: DatabaseConversation) => ({
        id: conv.id,
        user_id: conv.user_id,
        title: conv.title,
        created_at: new Date(conv.created_at),
        updated_at: new Date(conv.updated_at),
        last_message_at: new Date(conv.last_message_at),
      }))
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  /**
   * Get a specific conversation by ID
   */
  static async getConversation(user: User, conversationId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching conversation:', error)
        return null
      }

      return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        last_message_at: new Date(data.last_message_at),
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return null
    }
  }

  /**
   * Update conversation title
   */
  static async updateConversationTitle(user: User, conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating conversation title:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating conversation title:', error)
      return false
    }
  }

  /**
   * Update conversation's last_message_at timestamp
   */
  static async updateConversationLastMessageAt(user: User, conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating conversation last_message_at:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating conversation last_message_at:', error)
      return false
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  static async deleteConversation(user: User, conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting conversation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }

  /**
   * Save a chat message to the database
   */
  static async saveMessage(
    user: User,
    content: string,
    sender: 'user' | 'bot',
    conversationId?: string
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content,
          sender,
          timestamp: new Date().toISOString(),
          conversation_id: conversationId,
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving message:', error)
        return null
      }

      // Update conversation's last_message_at timestamp
      if (conversationId) {
        await this.updateConversationLastMessageAt(user, conversationId)
      }

      return {
        id: data.id,
        content: data.content,
        sender: data.sender,
        timestamp: new Date(data.timestamp),
        user_id: data.user_id,
        conversation_id: data.conversation_id,
      }
    } catch (error) {
      console.error('Error saving message:', error)
      return null
    }
  }

  /**
   * Get all chat messages for a specific user (backward compatibility)
   */
  static async getMessagesForUser(user: User): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        return []
      }

      return data.map((msg: DatabaseChatMessage) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        user_id: msg.user_id,
        conversation_id: msg.conversation_id,
      }))
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  /**
   * Get messages for a specific conversation
   */
  static async getMessagesForConversation(user: User, conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Error fetching conversation messages:', error)
        return []
      }

      return data.map((msg: DatabaseChatMessage) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        user_id: msg.user_id,
        conversation_id: msg.conversation_id,
      }))
    } catch (error) {
      console.error('Error fetching conversation messages:', error)
      return []
    }
  }

  /**
   * Get or create the current active conversation for a user
   */
  static async getOrCreateActiveConversation(user: User): Promise<Conversation | null> {
    try {
      // First try to get the most recent conversation
      const conversations = await this.getConversationsForUser(user)
      
      if (conversations.length > 0) {
        return conversations[0] // Most recent conversation
      }

      // If no conversations exist, create a new one
      return await this.createConversation(user, 'New Chat')
    } catch (error) {
      console.error('Error getting or creating active conversation:', error)
      return null
    }
  }

  /**
   * Auto-generate conversation title from first user message
   */
  static async generateConversationTitle(user: User, conversationId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .rpc('generate_conversation_title', { conversation_uuid: conversationId })

      if (error) {
        console.error('Error generating conversation title:', error)
        return 'New Chat'
      }

      return data || 'New Chat'
    } catch (error) {
      console.error('Error generating conversation title:', error)
      return 'New Chat'
    }
  }

  /**
   * Update conversation title automatically after first message
   */
  static async updateConversationTitleFromFirstMessage(user: User, conversationId: string): Promise<void> {
    try {
      const title = await this.generateConversationTitle(user, conversationId)
      if (title !== 'New Chat') {
        await this.updateConversationTitle(user, conversationId, title)
      }
    } catch (error) {
      console.error('Error updating conversation title from first message:', error)
    }
  }

  /**
   * Delete all messages for a user (useful for clearing chat history)
   */
  static async clearMessagesForUser(user: User): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing messages:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing messages:', error)
      return false
    }
  }

  /**
   * Delete a specific message
   */
  static async deleteMessage(user: User, messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id) // Ensure user can only delete their own messages

      if (error) {
        console.error('Error deleting message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting message:', error)
      return false
    }
  }

  /**
   * Get the welcome message for a user (creates it if it doesn't exist)
   */
  static async getOrCreateWelcomeMessage(user: User, conversationId?: string): Promise<ChatMessage> {
    try {
      // Check if user already has messages in the conversation
      const existingMessages = conversationId 
        ? await this.getMessagesForConversation(user, conversationId)
        : await this.getMessagesForUser(user)
      
      if (existingMessages.length === 0) {
        // Create welcome message if no messages exist
        const welcomeMessage = await this.saveMessage(
          user,
          'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
          'bot',
          conversationId
        )
        
        if (welcomeMessage) {
          return welcomeMessage
        }
      }
      
      // Return first message if exists, or create a fallback
      return existingMessages[0] || {
        id: '1',
        content: 'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
        sender: 'bot',
        timestamp: new Date(),
        conversation_id: conversationId,
      }
    } catch (error) {
      console.error('Error getting/creating welcome message:', error)
      return {
        id: '1',
        content: 'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
        sender: 'bot',
        timestamp: new Date(),
        conversation_id: conversationId,
      }
    }
  }

  /**
   * Real-time subscription to chat messages for a user
   */
  static subscribeToMessages(
    user: User,
    callback: (messages: ChatMessage[]) => void
  ) {
    return supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          // Fetch updated messages when changes occur
          const messages = await this.getMessagesForUser(user)
          callback(messages)
        }
      )
      .subscribe()
  }

  /**
   * Real-time subscription to conversations for a user
   */
  static subscribeToConversations(
    user: User,
    callback: (conversations: Conversation[]) => void
  ) {
    return supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          // Fetch updated conversations when changes occur
          const conversations = await this.getConversationsForUser(user)
          callback(conversations)
        }
      )
      .subscribe()
  }
} 