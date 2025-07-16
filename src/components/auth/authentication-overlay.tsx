import { AuthModal } from "@/components/auth/auth-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Lock, User } from "lucide-react"

export function AuthenticationOverlay() {
  return (
    <div className="absolute inset-0 bg-background/85 backdrop-blur-md flex items-center justify-center animate-fade-in z-10">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-2 bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4 ring-2 ring-primary/20">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Welcome to BarberBot
          </CardTitle>
          <CardDescription className="text-lg">
            Your personal barbershop assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Authentication Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to start chatting with our AI barber assistant and unlock all features.
            </p>
          </div>
          
          <div className="space-y-3">
            <AuthModal
              trigger={
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  Sign In to Chat
                </Button>
              }
            />
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                New here? You can create an account in the sign-in dialog.
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-center space-y-3">
              <h4 className="font-semibold text-sm">✨ What awaits you:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <span className="text-primary">📅</span>
                  <span>Book appointments</span>
                </div>
                <div className="flex items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <span className="text-primary">💡</span>
                  <span>Styling advice</span>
                </div>
                <div className="flex items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <span className="text-primary">✂️</span>
                  <span>Service info</span>
                </div>
                <div className="flex items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <span className="text-primary">💬</span>
                  <span>Hair care tips</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 