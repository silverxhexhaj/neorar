"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat'>('chat')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Tab Navigation */}
      <div className="flex justify-center p-4">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-4xl h-[calc(100vh-12rem)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
} 