'use client'

import { useState } from 'react'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Button } from '@/components/ui/button'

interface AuthModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
}

export function AuthModal({ trigger, defaultOpen = false }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
  }

  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>
            {isLoginMode ? "Sign In" : "Sign Up"}
          </DialogTitle>
        </VisuallyHidden>
        {isLoginMode ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}
      </DialogContent>
    </Dialog>
  )
} 