"use client"

import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BarberBot</h1>
              <p className="text-sm text-muted-foreground">Your AI Assistant</p>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
            ) : user ? (
              <UserMenu />
            ) : (
              <AuthModal 
                trigger={
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 