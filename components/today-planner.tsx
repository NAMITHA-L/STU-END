"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Edit, Flame, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the time slot type
interface TimeSlot {
  id: string
  subject: string
  start: string
  end: string
  priority: "high" | "medium" | "low"
  color: string
}

// Sample data
const initialTimeSlots: TimeSlot[] = [
  {
    id: "1",
    subject: "Data Structures & Algorithms",
    start: "09:00",
    end: "10:00",
    priority: "high",
    color: "border-blue-400",
  },
  {
    id: "2",
    subject: "Machine Learning",
    start: "10:30",
    end: "12:00",
    priority: "medium",
    color: "border-purple-400",
  },
  {
    id: "3",
    subject: "Lunch Break",
    start: "12:00",
    end: "13:00",
    priority: "low",
    color: "border-amber-400",
  },
  {
    id: "4",
    subject: "Web Development",
    start: "13:30",
    end: "15:30",
    priority: "medium",
    color: "border-green-400",
  },
  {
    id: "5",
    subject: "System Design",
    start: "16:00",
    end: "17:30",
    priority: "high",
    color: "border-red-400",
  },
]

// Generate time slots for the day
const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8 // Start at 8 AM
  return `${hour.toString().padStart(2, "0")}:00`
})

export default function TodayPlanner() {
  const { toast } = useToast()
  const [slots, setSlots] = useState<TimeSlot[]>(initialTimeSlots)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

  // Format the current date
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  // Open dialog to edit slot
  const openEditDialog = (slot: TimeSlot) => {
    setEditingSlot(slot)
    setIsDialogOpen(true)
  }

  // Save edited slot
  const saveSlot = () => {
    if (editingSlot) {
      setSlots(slots.map((slot) => (slot.id === editingSlot.id ? editingSlot : slot)))
      setIsDialogOpen(false)
      setEditingSlot(null)

      toast({
        title: "Time slot updated",
        description: `${editingSlot.subject} has been updated.`,
      })
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flame className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  // Get slots for a specific time
  const getSlotsForTime = (time: string) => {
    return slots.filter((slot) => {
      const startHour = Number.parseInt(slot.start.split(":")[0])
      const endHour = Number.parseInt(slot.end.split(":")[0])
      const timeHour = Number.parseInt(time.split(":")[0])

      return timeHour >= startHour && timeHour < endHour
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Daily Schedule</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{formattedDate}</span>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[80px_1fr] gap-2 h-[600px] overflow-y-auto">
          {/* Time labels */}
          <div className="space-y-6 pr-2 text-right text-sm text-muted-foreground">
            {timeSlots.map((time) => (
              <div key={time} className="h-14 -mt-2">
                {time}
              </div>
            ))}
          </div>

          {/* Timetable grid */}
          <div className="relative grid grid-rows-[repeat(14,_minmax(3.5rem,_1fr))] border-l">
            {/* Time slot backgrounds */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="border-b border-dashed h-14" />
            ))}

            {/* Slots */}
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`absolute mx-1 p-2 rounded border-l-4 ${slot.color} bg-background shadow-sm`}
                style={{
                  top: `${(Number.parseInt(slot.start.split(":")[0]) - 8) * 3.5}rem`,
                  height: `${(Number.parseInt(slot.end.split(":")[0]) - Number.parseInt(slot.start.split(":")[0])) * 3.5}rem`,
                  width: "calc(100% - 0.5rem)",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium truncate">{slot.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {slot.start} - {slot.end}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getPriorityIcon(slot.priority)}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(slot)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={editingSlot?.subject || ""}
                onChange={(e) => setEditingSlot((prev) => (prev ? { ...prev, subject: e.target.value } : null))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Select
                  value={editingSlot?.start}
                  onValueChange={(value) => setEditingSlot((prev) => (prev ? { ...prev, start: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Select
                  value={editingSlot?.end}
                  onValueChange={(value) => setEditingSlot((prev) => (prev ? { ...prev, end: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editingSlot?.priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setEditingSlot((prev) => (prev ? { ...prev, priority: value } : null))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High 🔥</SelectItem>
                  <SelectItem value="medium">Medium 🧘‍♀️</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={editingSlot?.color}
                onValueChange={(value) => setEditingSlot((prev) => (prev ? { ...prev, color: value } : null))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="border-blue-400">Blue</SelectItem>
                  <SelectItem value="border-purple-400">Purple</SelectItem>
                  <SelectItem value="border-green-400">Green</SelectItem>
                  <SelectItem value="border-amber-400">Amber</SelectItem>
                  <SelectItem value="border-red-400">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSlot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
