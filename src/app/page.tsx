"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import Header from "@/components/header"
import { DatabaseTest } from "@/components/db-test"
import { AdvancedDatabaseTest } from "@/components/db-test-advanced"
import { Button } from "@/components/ui/button"
import { Database, MessageCircle, TestTube } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dbtest' | 'advanced'>('chat')

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
          <Button
            variant={activeTab === 'dbtest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dbtest')}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Basic Test
          </Button>
          <Button
            variant={activeTab === 'advanced' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('advanced')}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Advanced Test
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-4 lg:p-6">
        {activeTab === 'chat' ? (
          <div className="w-full max-w-4xl h-[calc(100vh-12rem)]">
            <ChatInterface />
          </div>
        ) : activeTab === 'dbtest' ? (
          <div className="w-full max-w-4xl">
            <DatabaseTest />
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <AdvancedDatabaseTest />
          </div>
        )}
      </div>
    </div>
  )
} 