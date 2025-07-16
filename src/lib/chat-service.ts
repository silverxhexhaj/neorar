import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  user_id?: string
}

export interface DatabaseChatMessage {
  id: string
  user_id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
  created_at: string
  updated_at: string
}

export class ChatService {
  /**
   * Save a chat message to the database
   */
  static async saveMessage(
    user: User,
    content: string,
    sender: 'user' | 'bot'
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content,
          sender,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving message:', error)
        return null
      }

      return {
        id: data.id,
        content: data.content,
        sender: data.sender,
        timestamp: new Date(data.timestamp),
        user_id: data.user_id,
      }
    } catch (error) {
      console.error('Error saving message:', error)
      return null
    }
  }

  /**
   * Get all chat messages for a specific user
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
      }))
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
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
  static async getOrCreateWelcomeMessage(user: User): Promise<ChatMessage> {
    try {
      // Check if user already has messages
      const existingMessages = await this.getMessagesForUser(user)
      
      if (existingMessages.length === 0) {
        // Create welcome message if no messages exist
        const welcomeMessage = await this.saveMessage(
          user,
          'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
          'bot'
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
      }
    } catch (error) {
      console.error('Error getting/creating welcome message:', error)
      return {
        id: '1',
        content: 'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
        sender: 'bot',
        timestamp: new Date(),
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
} 