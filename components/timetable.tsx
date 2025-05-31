"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Define the event type
interface TimeSlot {
  id: string
  title: string
  start: string
  end: string
  color: string
}

// Sample data
const initialEvents: TimeSlot[] = [
  { id: "1", title: "DSA Practice", start: "09:00", end: "10:00", color: "bg-blue-100 border-blue-300" },
  { id: "2", title: "System Design", start: "10:30", end: "12:00", color: "bg-purple-100 border-purple-300" },
  { id: "3", title: "Lunch Break", start: "12:00", end: "13:00", color: "bg-amber-100 border-amber-300" },
  { id: "4", title: "Frontend Development", start: "13:30", end: "15:30", color: "bg-green-100 border-green-300" },
  { id: "5", title: "Exercise", start: "16:00", end: "17:00", color: "bg-red-100 border-red-300" },
]

// Generate time slots for the day
const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8 // Start at 8 AM
  return `${hour.toString().padStart(2, "0")}:00`
})

interface TimetableProps {
  onEventChange?: (event: TimeSlot) => void
}

export default function Timetable({ onEventChange }: TimetableProps) {
  const [events, setEvents] = useState<TimeSlot[]>(initialEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<TimeSlot | null>(null)
  const [editingEvent, setEditingEvent] = useState<TimeSlot | null>(null)

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

  // Handle drag start
  const handleDragStart = (event: TimeSlot) => {
    setDraggedEvent(event)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault()

    if (draggedEvent) {
      // Calculate new end time based on duration
      const startHour = Number.parseInt(timeSlot.split(":")[0])
      const startTime = `${startHour.toString().padStart(2, "0")}:00`

      // Calculate duration of original event
      const originalStartHour = Number.parseInt(draggedEvent.start.split(":")[0])
      const originalEndHour = Number.parseInt(draggedEvent.end.split(":")[0])
      const duration = originalEndHour - originalStartHour

      // Calculate new end time
      const endHour = startHour + duration
      const endTime = `${endHour.toString().padStart(2, "0")}:00`

      const updatedEvent = {
        ...draggedEvent,
        start: startTime,
        end: endTime,
      }

      // Update events
      const updatedEvents = events.map((event) => (event.id === draggedEvent.id ? updatedEvent : event))

      setEvents(updatedEvents)
      if (onEventChange) {
        onEventChange(updatedEvent)
      }
      setDraggedEvent(null)
    }
  }

  // Open dialog to add/edit event
  const openEventDialog = (event?: TimeSlot) => {
    if (event) {
      setEditingEvent(event)
    } else {
      setEditingEvent({
        id: Math.random().toString(36).substring(7),
        title: "",
        start: "09:00",
        end: "10:00",
        color: "bg-blue-100 border-blue-300",
      })
    }
    setIsDialogOpen(true)
  }

  // Save event
  const saveEvent = () => {
    if (editingEvent) {
      if (events.some((e) => e.id === editingEvent.id)) {
        // Update existing event
        setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)))
        if (onEventChange) {
          onEventChange(editingEvent)
        }
      } else {
        // Add new event
        setEvents([...events, editingEvent])
        if (onEventChange) {
          onEventChange(editingEvent)
        }
      }
      setIsDialogOpen(false)
      setEditingEvent(null)
    }
  }

  // Delete event
  const deleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter((e) => e.id !== editingEvent.id))
      setIsDialogOpen(false)
      setEditingEvent(null)
    }
  }

  // Get events for a specific time slot
  const getEventsForTimeSlot = (timeSlot: string) => {
    return events.filter((event) => {
      const startHour = Number.parseInt(event.start.split(":")[0])
      const endHour = Number.parseInt(event.end.split(":")[0])
      const slotHour = Number.parseInt(timeSlot.split(":")[0])

      return slotHour >= startHour && slotHour < endHour
    })
  }

  // Calculate event position and height
  const getEventStyle = (event: TimeSlot) => {
    const startHour = Number.parseInt(event.start.split(":")[0])
    const endHour = Number.parseInt(event.end.split(":")[0])
    const startIndex = startHour - 8 // Adjust for 8 AM start
    const duration = endHour - startHour

    return {
      gridRowStart: startIndex + 1,
      gridRowEnd: `span ${duration}`,
      gridColumnStart: 2,
      gridColumnEnd: 3,
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Daily Timetable</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{formattedDate}</span>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => openEventDialog()}>
            <Plus className="h-4 w-4 mr-1" /> Add Event
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
            {/* Time slot drop zones */}
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot}
                className="border-b border-dashed h-14"
                onDragOver={(e) => handleDragOver(e, timeSlot)}
                onDrop={(e) => handleDrop(e, timeSlot)}
              />
            ))}

            {/* Events */}
            {events.map((event) => (
              <div
                key={event.id}
                className={`absolute mx-1 p-2 rounded border-l-4 ${event.color} cursor-grab`}
                style={{
                  top: `${(Number.parseInt(event.start.split(":")[0]) - 8) * 3.5}rem`,
                  height: `${(Number.parseInt(event.end.split(":")[0]) - Number.parseInt(event.start.split(":")[0])) * 3.5}rem`,
                  width: "calc(100% - 0.5rem)",
                }}
                draggable
                onDragStart={() => handleDragStart(event)}
                onClick={() => openEventDialog(event)}
              >
                <div className="text-sm font-medium truncate">{event.title}</div>
                <div className="text-xs text-muted-foreground">
                  {event.start} - {event.end}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent?.id ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={editingEvent?.title || ""}
                onChange={(e) => setEditingEvent((prev) => (prev ? { ...prev, title: e.target.value } : null))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Select
                  value={editingEvent?.start}
                  onValueChange={(value) => setEditingEvent((prev) => (prev ? { ...prev, start: value } : null))}
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
                  value={editingEvent?.end}
                  onValueChange={(value) => setEditingEvent((prev) => (prev ? { ...prev, end: value } : null))}
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
              <Label htmlFor="color">Color</Label>
              <Select
                value={editingEvent?.color}
                onValueChange={(value) => setEditingEvent((prev) => (prev ? { ...prev, color: value } : null))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100 border-blue-300">Blue</SelectItem>
                  <SelectItem value="bg-green-100 border-green-300">Green</SelectItem>
                  <SelectItem value="bg-purple-100 border-purple-300">Purple</SelectItem>
                  <SelectItem value="bg-amber-100 border-amber-300">Amber</SelectItem>
                  <SelectItem value="bg-red-100 border-red-300">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {editingEvent?.id && (
              <Button variant="destructive" onClick={deleteEvent}>
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEvent}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
