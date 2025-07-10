"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar, Phone, MapPin } from "lucide-react"

interface HoursModalProps {
  isOpen: boolean
  onClose: () => void
}

const businessHours = [
  { day: "Monday", hours: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Tuesday", hours: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Wednesday", hours: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Thursday", hours: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Friday", hours: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Saturday", hours: "8:00 AM - 6:00 PM", isOpen: true },
  { day: "Sunday", hours: "Closed", isOpen: false }
]

const upcomingAvailability = [
  { date: "Today", slots: ["2:30 PM", "4:00 PM", "5:30 PM"] },
  { date: "Tomorrow", slots: ["10:00 AM", "11:30 AM", "1:00 PM", "3:30 PM", "6:00 PM"] },
  { date: "Wednesday", slots: ["9:00 AM", "10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"] },
  { date: "Thursday", slots: ["9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"] }
]

export default function HoursModal({ isOpen, onClose }: HoursModalProps) {
  const getCurrentStatus = () => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours()
    
    // Convert to our day format (Monday = 0, Sunday = 6)
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1
    const todayHours = businessHours[dayIndex]
    
    if (!todayHours.isOpen) {
      return { isOpen: false, status: "Closed Today" }
    }
    
    // Simple check for business hours (9 AM - 7 PM)
    if (currentHour >= 9 && currentHour < 19) {
      return { isOpen: true, status: "Open Now" }
    }
    
    return { isOpen: false, status: "Closed" }
  }

  const { isOpen: isCurrentlyOpen, status } = getCurrentStatus()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours & Availability
          </DialogTitle>
          <DialogDescription>
            Check our opening hours and find the best time for your appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isCurrentlyOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                {status}
              </CardTitle>
              <CardDescription>
                {isCurrentlyOpen 
                  ? "We're here to help you look your best!" 
                  : "We'll be back soon. Book ahead to secure your spot!"}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Business Hours */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Business Hours</CardTitle>
              <CardDescription>
                Our regular operating schedule throughout the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {businessHours.map((dayInfo, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                    <span className="font-medium">{dayInfo.day}</span>
                    <span className={`text-sm ${dayInfo.isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {dayInfo.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Availability */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Availability</CardTitle>
              <CardDescription>
                Quick view of available appointment slots this week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAvailability.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {day.date}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot, slotIndex) => (
                        <Button
                          key={slotIndex}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            // TODO: Implement quick booking
                            console.log(`Quick booking for ${day.date} at ${slot}`)
                          }}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact & Location</CardTitle>
              <CardDescription>
                Get in touch or visit us at our location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">(555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Call us for appointments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">123 Main Street</p>
                    <p className="text-sm text-muted-foreground">Downtown City, ST 12345</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={() => {
              // TODO: Implement call functionality
              console.log("Calling business")
            }}
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // TODO: Open appointment modal
              console.log("Opening appointment modal")
            }}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Online
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 