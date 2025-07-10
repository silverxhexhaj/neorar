"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, Award, Clock } from "lucide-react"

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
}

const staffMembers = [
  {
    id: 1,
    name: "Mike Johnson",
    role: "Senior Barber",
    experience: "8 years",
    specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shaves"],
    rating: 4.9,
    bio: "Mike has been perfecting his craft for over 8 years. He specializes in classic cuts and is known for his attention to detail and friendly personality.",
    availability: "Mon-Fri, 9 AM - 6 PM",
    initials: "MJ"
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Master Barber",
    experience: "12 years",
    specialties: ["Modern Fades", "Beard Trims", "Hair Styling"],
    rating: 4.8,
    bio: "Alex is our master barber with over a decade of experience. He stays current with the latest trends and techniques in men's grooming.",
    availability: "Tue-Sat, 10 AM - 7 PM",
    initials: "AR"
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Barber & Stylist",
    experience: "5 years",
    specialties: ["Precision Cuts", "Color Touch-ups", "Styling"],
    rating: 4.7,
    bio: "Sarah brings a fresh perspective to traditional barbering. She excels at precision cuts and has a keen eye for modern styling.",
    availability: "Wed-Sun, 9 AM - 5 PM",
    initials: "SW"
  },
  {
    id: 4,
    name: "David Brown",
    role: "Barber",
    experience: "3 years",
    specialties: ["Trendy Cuts", "Beard Maintenance", "Quick Trims"],
    rating: 4.6,
    bio: "David is our rising star, known for his energy and expertise with trendy cuts. He's great with clients of all ages.",
    availability: "Mon-Fri, 11 AM - 7 PM",
    initials: "DB"
  }
]

export default function StaffModal({ isOpen, onClose }: StaffModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Meet Our Team
          </DialogTitle>
          <DialogDescription>
            Get to know our skilled barbers and find the perfect match for your style.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staffMembers.map((member) => (
            <Card key={member.id} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {member.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {member.rating}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {member.availability}
                  </span>
                  <span>{member.experience} experience</span>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement booking with specific barber
                    console.log(`Booking with ${member.name}`)
                  }}
                >
                  Book with {member.name.split(' ')[0]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center space-y-2">
            <h4 className="font-medium">Not sure who to choose?</h4>
            <p className="text-sm text-muted-foreground">
              Our AI assistant can help you find the perfect barber based on your preferences and needs.
            </p>
            <Button variant="outline" onClick={onClose} className="mt-2">
              Ask the AI Assistant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 