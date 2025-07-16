"use client"

import { useState, useEffect } from "react"
import ChatInterface from "@/components/chat-interface"
import ChatSidebar from "@/components/chat-sidebar"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { AuthenticationOverlay } from "@/components/auth/authentication-overlay"
import { ChatService } from "@/lib/chat-service"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Load or create active conversation when user changes
  useEffect(() => {
    const loadActiveConversation = async () => {
      if (!user) {
        setCurrentConversationId(null)
        return
      }

      try {
        const activeConversation = await ChatService.getOrCreateActiveConversation(user)
        if (activeConversation) {
          setCurrentConversationId(activeConversation.id)
        }
      } catch (error) {
        console.error('Error loading active conversation:', error)
      }
    }

    loadActiveConversation()
  }, [user])

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    setMobileSidebarOpen(false)
  }

  const handleNewChat = async () => {
    if (!user) return

    try {
      const newConversation = await ChatService.createConversation(user, 'New Chat')
      if (newConversation) {
        setCurrentConversationId(newConversation.id)
        setMobileSidebarOpen(false)
      }
    } catch (error) {
      console.error('Error creating new conversation:', error)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header>
        {/* Mobile sidebar toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="h-10 w-10"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Header>

      {/* Main Content Area */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMobileSidebar} />
        )}

        {/* Sidebar */}
        <div className={`
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          z-50 md:z-0
          transition-transform duration-300 ease-in-out
          h-full
        `}>
          <ChatSidebar
            currentConversationId={currentConversationId || undefined}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Desktop sidebar toggle */}
          {sidebarCollapsed && (
            <div className="absolute top-4 left-4 z-10 hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-10 w-10 bg-background/80 backdrop-blur-sm border border-border/50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}

                     <div className={`h-full p-4 lg:p-6 ${user ? "" : "pointer-events-none select-none"}`}>
             <ChatInterface 
               conversationId={currentConversationId || undefined}
               onConversationUpdate={() => {
                 // This will trigger a re-render of the sidebar to refresh conversation list
                 // The sidebar will automatically update via its useEffect
               }}
             />
           </div>

          {/* Authentication Overlay */}
          {!user && <AuthenticationOverlay />}
        </div>
      </main>
    </div>
  )
} 