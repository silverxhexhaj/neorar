"use client"

import ChatInterface from "@/components/chat-interface"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { AuthenticationOverlay } from "@/components/auth/authentication-overlay"

export default function Home() {
  const { user, loading } = useAuth()

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
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center p-4 lg:p-6 min-h-0 overflow-hidden">
        <div className="w-full max-w-6xl h-full relative">
          {/* Chat Interface Container */}
          <div className={`h-full ${user ? "" : "pointer-events-none select-none"}`}>
            <ChatInterface />
          </div>

          {/* Authentication Overlay */}
          {!user && <AuthenticationOverlay />}
        </div>
      </main>
    </div>
  )
} 