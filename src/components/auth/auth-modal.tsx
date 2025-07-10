'use client'

import { useState } from 'react'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
        {isLoginMode ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}
      </DialogContent>
    </Dialog>
  )
} 