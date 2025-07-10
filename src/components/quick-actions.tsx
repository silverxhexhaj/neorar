"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Clock, Scissors } from "lucide-react"

interface QuickActionsProps {
  onAppointmentClick: () => void
  onStaffClick: () => void
  onHoursClick: () => void
}

export default function QuickActions({ onAppointmentClick, onStaffClick, onHoursClick }: QuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const actions = [
    {
      id: 'appointment',
      title: 'Book Appointment',
      description: 'Schedule your next cut',
      icon: Calendar,
      onClick: onAppointmentClick,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'staff',
      title: 'Our Staff',
      description: 'Meet our barbers',
      icon: Users,
      onClick: onStaffClick,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'hours',
      title: 'Opening Hours',
      description: 'When we\'re open',
      icon: Clock,
      onClick: onHoursClick,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="w-full lg:w-80 bg-background/50 p-4 space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </div>
          <CardDescription>
            Get started with our services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mobile: Horizontal layout */}
          <div className="lg:hidden">
            <div className="grid grid-cols-3 gap-2">
              {actions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant={selectedAction === action.id ? "default" : "outline"}
                    className="h-auto p-3 flex-col gap-2"
                    onClick={() => {
                      setSelectedAction(action.id)
                      action.onClick()
                    }}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-md ${action.color} text-white shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">{action.title}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Desktop: Vertical layout */}
          <div className="hidden lg:block space-y-3">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant={selectedAction === action.id ? "default" : "outline"}
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => {
                    setSelectedAction(action.id)
                    action.onClick()
                  }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md ${action.color} text-white shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional info card - Hidden on mobile */}
      <Card className="border-0 shadow-sm hidden lg:block">
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium">Need help?</div>
            <div className="text-xs text-muted-foreground">
              Ask our AI assistant anything about our services, pricing, or availability.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 