"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Bot, MessageCircle } from "lucide-react"

// Simple Message Interface
interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

// N8N Webhook URL for chat messages
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.srv832202.hstgr.cloud/webhook/2494dd6d-523d-4eb3-80cb-ac56ac244c5e'

// Function to send chat message to n8n webhook and get response
const sendMessageToWebhook = async (message: string) => {
  try {
    const chatData = {
      message: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      source: 'chat-interface'
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Message sent to n8n webhook:', result)
    
    // Return the bot response from n8n
    return { 
      success: true, 
      botResponse: result.output || result.message || "I'm here to help! How can I assist you today?"
    }
  } catch (error) {
    console.error('Error sending message to n8n webhook:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      botResponse: "I'm having trouble connecting right now. Please try again in a moment."
    }
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Welcome to BarberBot! 👋 I\'m here to help you with anything related to our barbershop. Just chat with me naturally and I\'ll do my best to assist you!',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight
        }, 100)
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputValue
    setInputValue('')
    setIsTyping(true)

    // Send message to n8n webhook and get bot response
    const result = await sendMessageToWebhook(userInput)
    
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: result.botResponse,
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/95 border border-border/50 rounded-xl shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Chat Header - Fixed Height */}
      <div className="flex-shrink-0 border-b border-border/50 p-4 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full ring-2 ring-primary/20">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Chat with BarberBot
            </h2>
            <p className="text-sm text-muted-foreground/80">Your personal barbershop assistant</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
      </div>

      {/* Messages Area - Takes all available space */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="p-4 pb-6 space-y-6 min-h-full">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg'
                      : 'bg-gradient-to-br from-muted/80 to-muted/60 text-foreground border border-border/30 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  <span className={`text-xs mt-3 block ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-secondary/80 to-secondary/60">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3 justify-start animate-in slide-in-from-bottom-2 duration-300">
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-muted/80 to-muted/60 rounded-2xl p-4 border border-border/30 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Footer - Fixed at Bottom */}
      <div className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="min-h-[48px] pr-4 py-3 text-sm bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-none"
                disabled={isTyping}
              />
              {inputValue.trim() && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/60">
                  {inputValue.length}
                </div>
              )}
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Quick suggestions - Only show when input is empty and few messages */}
        {!inputValue && messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {[
                "Book an appointment",
                "What services do you offer?",
                "Hair styling tips",
                "Price information"
              ].map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs rounded-full border-border/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 