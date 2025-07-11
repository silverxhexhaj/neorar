"use client"

import ChatInterface from "@/components/chat-interface"
import Header from "@/components/header"

export default function Home() {
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