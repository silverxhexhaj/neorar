"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Bot, MessageCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const barberResponses = [
  // Appointment-related responses
  "I'd be happy to help you book an appointment! Our most popular times are weekday afternoons and Saturday mornings. What day works best for you?",
  "Great choice! Let me help you schedule that. We have availability this week - would you prefer morning, afternoon, or evening?",
  "Perfect! I can get you set up with one of our skilled barbers. Do you have a preference for who you'd like to see?",
  
  // Service-related responses
  "Our signature services include precision haircuts, classic hot towel shaves, and beard styling. What type of service interests you most?",
  "We specialize in everything from traditional cuts to modern fades. Our barbers stay current with all the latest trends and techniques.",
  "For a complete grooming experience, I'd recommend our haircut and beard trim combo - it's very popular with our clients!",
  
  // Staff-related responses
  "Our team includes master barbers with years of experience. Mike specializes in classic cuts, while Alex is known for modern fades and styling.",
  "Each of our barbers has their own specialties. Would you like to know more about their experience and what they're best at?",
  
  // Pricing and general info
  "Our pricing starts at $35 for a standard cut, with premium services available. We believe in providing excellent value for professional grooming.",
  "We're open Monday through Saturday, with extended hours to fit your schedule. Sunday is our day to recharge!",
  "Quality is our top priority - we use premium products and take our time to ensure you leave looking and feeling your best.",
  
  // General helpful responses
  "I'm here to help with anything you need - booking appointments, learning about our services, or answering questions about grooming and style.",
  "Feel free to ask me about our services, availability, or anything else related to men's grooming. I'm here to help!",
  "Whether you're looking for a quick trim or a complete style makeover, we've got you covered. What brings you in today?"
]

const getContextualResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()
  
  // Appointment-related keywords
  if (message.includes('book') || message.includes('appointment') || message.includes('schedule')) {
    const appointmentResponses = [
      "I'd be happy to help you book an appointment! Our most popular times are weekday afternoons and Saturday mornings. What day works best for you?",
      "Great choice! Let me help you schedule that. We have availability this week - would you prefer morning, afternoon, or evening?",
      "Perfect! I can get you set up with one of our skilled barbers. Do you have a preference for who you'd like to see?"
    ]
    return appointmentResponses[Math.floor(Math.random() * appointmentResponses.length)]
  }
  
  // Service-related keywords
  if (message.includes('haircut') || message.includes('cut') || message.includes('trim') || message.includes('service')) {
    const serviceResponses = [
      "Our signature services include precision haircuts, classic hot towel shaves, and beard styling. What type of service interests you most?",
      "We specialize in everything from traditional cuts to modern fades. Our barbers stay current with all the latest trends and techniques.",
      "For a complete grooming experience, I'd recommend our haircut and beard trim combo - it's very popular with our clients!"
    ]
    return serviceResponses[Math.floor(Math.random() * serviceResponses.length)]
  }
  
  // Staff-related keywords
  if (message.includes('barber') || message.includes('staff') || message.includes('team')) {
    const staffResponses = [
      "Our team includes master barbers with years of experience. Mike specializes in classic cuts, while Alex is known for modern fades and styling.",
      "Each of our barbers has their own specialties. Would you like to know more about their experience and what they're best at?",
      "We have four talented barbers on staff, each with their own expertise. I can help you find the perfect match for your style preferences."
    ]
    return staffResponses[Math.floor(Math.random() * staffResponses.length)]
  }
  
  // Price-related keywords
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    const priceResponses = [
      "Our pricing starts at $35 for a standard cut, with premium services available. We believe in providing excellent value for professional grooming.",
      "Prices vary by service: haircuts start at $35, beard trims at $25, and hot towel shaves at $45. Combo packages offer great value!",
      "We offer competitive pricing with exceptional quality. A standard cut is $35, and we often have package deals for regular clients."
    ]
    return priceResponses[Math.floor(Math.random() * priceResponses.length)]
  }
  
  // Hours-related keywords
  if (message.includes('hours') || message.includes('open') || message.includes('time')) {
    const hoursResponses = [
      "We're open Monday through Saturday, 9 AM to 7 PM. Sunday is our day to recharge! What day works best for you?",
      "Our hours are 9 AM to 7 PM Monday through Friday, and 8 AM to 6 PM on Saturday. We're closed Sundays.",
      "We're open six days a week with extended hours to fit your schedule. Would you like to know about our current availability?"
    ]
    return hoursResponses[Math.floor(Math.random() * hoursResponses.length)]
  }
  
  // Default to random response
  return barberResponses[Math.floor(Math.random() * barberResponses.length)]
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to BarberBot! 👋 I\'m here to help you book appointments, learn about our services, and answer any questions about our barber shop. Whether you\'re looking for a classic cut, modern fade, or full grooming experience, I\'ve got you covered. How can I assist you today?',
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
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    const userInput = inputValue
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response with contextual barber-specific responses
    setTimeout(() => {
      const contextualResponse = getContextualResponse(userInput)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: contextualResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg shadow-sm animate-fade-in">
      {/* Chat Header */}
      <div className="border-b border-border p-4 bg-background/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Chat with BarberBot</h2>
            <p className="text-sm text-muted-foreground">Your personal grooming assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-fade-in ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground border border-border/50'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3 justify-start animate-fade-in">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 border border-border/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background/50 rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about appointments, services, pricing, or anything else..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="shrink-0 btn-hover-lift"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 