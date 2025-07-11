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

      {/* Content */}
      <div className="flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-4xl h-[calc(100vh-12rem)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
} 