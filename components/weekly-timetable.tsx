"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Coffee, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the time slot type
interface TimeSlot {
  id: string
  subject: string
  start: string
  end: string
  type: "study" | "break"
  color: string
}

// Sample weekly data with 5 subjects per day + breaks
const weeklyData: Record<string, TimeSlot[]> = {
  Monday: [
    {
      id: "1",
      subject: "DSA Practice",
      start: "09:00",
      end: "10:00",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "2",
      subject: "Break",
      start: "10:00",
      end: "10:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "3",
      subject: "Machine Learning",
      start: "10:15",
      end: "11:15",
      type: "study",
      color: "bg-red-100 border-red-300 text-red-900",
    },
    {
      id: "4",
      subject: "Break",
      start: "11:15",
      end: "11:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "5",
      subject: "System Design",
      start: "11:30",
      end: "12:30",
      type: "study",
      color: "bg-purple-100 border-purple-300 text-purple-900",
    },
    {
      id: "6",
      subject: "Lunch",
      start: "12:30",
      end: "13:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "7",
      subject: "Web Development",
      start: "13:30",
      end: "14:30",
      type: "study",
      color: "bg-green-100 border-green-300 text-green-900",
    },
    {
      id: "8",
      subject: "Break",
      start: "14:30",
      end: "14:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "9",
      subject: "Mathematics",
      start: "14:45",
      end: "15:45",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
  ],
  Tuesday: [
    {
      id: "10",
      subject: "Machine Learning",
      start: "09:00",
      end: "10:00",
      type: "study",
      color: "bg-red-100 border-red-300 text-red-900",
    },
    {
      id: "11",
      subject: "Break",
      start: "10:00",
      end: "10:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "12",
      subject: "DSA Practice",
      start: "10:15",
      end: "11:15",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "13",
      subject: "Break",
      start: "11:15",
      end: "11:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "14",
      subject: "Web Development",
      start: "11:30",
      end: "12:30",
      type: "study",
      color: "bg-green-100 border-green-300 text-green-900",
    },
    {
      id: "15",
      subject: "Lunch",
      start: "12:30",
      end: "13:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "16",
      subject: "System Design",
      start: "13:30",
      end: "14:30",
      type: "study",
      color: "bg-purple-100 border-purple-300 text-purple-900",
    },
    {
      id: "17",
      subject: "Break",
      start: "14:30",
      end: "14:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "18",
      subject: "Mathematics",
      start: "14:45",
      end: "15:45",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
  ],
  Wednesday: [
    {
      id: "19",
      subject: "System Design",
      start: "09:00",
      end: "10:00",
      type: "study",
      color: "bg-purple-100 border-purple-300 text-purple-900",
    },
    {
      id: "20",
      subject: "Break",
      start: "10:00",
      end: "10:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "21",
      subject: "Web Development",
      start: "10:15",
      end: "11:15",
      type: "study",
      color: "bg-green-100 border-green-300 text-green-900",
    },
    {
      id: "22",
      subject: "Break",
      start: "11:15",
      end: "11:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "23",
      subject: "Mathematics",
      start: "11:30",
      end: "12:30",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
    {
      id: "24",
      subject: "Lunch",
      start: "12:30",
      end: "13:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "25",
      subject: "DSA Practice",
      start: "13:30",
      end: "14:30",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "26",
      subject: "Break",
      start: "14:30",
      end: "14:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "27",
      subject: "Machine Learning",
      start: "14:45",
      end: "15:45",
      type: "study",
      color: "bg-red-100 border-red-300 text-red-900",
    },
  ],
  Thursday: [
    {
      id: "28",
      subject: "DSA Practice",
      start: "09:00",
      end: "10:00",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "29",
      subject: "Break",
      start: "10:00",
      end: "10:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "30",
      subject: "Mathematics",
      start: "10:15",
      end: "11:15",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
    {
      id: "31",
      subject: "Break",
      start: "11:15",
      end: "11:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "32",
      subject: "Machine Learning",
      start: "11:30",
      end: "12:30",
      type: "study",
      color: "bg-red-100 border-red-300 text-red-900",
    },
    {
      id: "33",
      subject: "Lunch",
      start: "12:30",
      end: "13:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "34",
      subject: "Web Development",
      start: "13:30",
      end: "14:30",
      type: "study",
      color: "bg-green-100 border-green-300 text-green-900",
    },
    {
      id: "35",
      subject: "Break",
      start: "14:30",
      end: "14:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "36",
      subject: "System Design",
      start: "14:45",
      end: "15:45",
      type: "study",
      color: "bg-purple-100 border-purple-300 text-purple-900",
    },
  ],
  Friday: [
    {
      id: "37",
      subject: "Web Development",
      start: "09:00",
      end: "10:00",
      type: "study",
      color: "bg-green-100 border-green-300 text-green-900",
    },
    {
      id: "38",
      subject: "Break",
      start: "10:00",
      end: "10:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "39",
      subject: "System Design",
      start: "10:15",
      end: "11:15",
      type: "study",
      color: "bg-purple-100 border-purple-300 text-purple-900",
    },
    {
      id: "40",
      subject: "Break",
      start: "11:15",
      end: "11:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "41",
      subject: "DSA Practice",
      start: "11:30",
      end: "12:30",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "42",
      subject: "Lunch",
      start: "12:30",
      end: "13:30",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "43",
      subject: "Mathematics",
      start: "13:30",
      end: "14:30",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
    {
      id: "44",
      subject: "Break",
      start: "14:30",
      end: "14:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "45",
      subject: "Machine Learning",
      start: "14:45",
      end: "15:45",
      type: "study",
      color: "bg-red-100 border-red-300 text-red-900",
    },
  ],
  Saturday: [
    {
      id: "46",
      subject: "Mathematics",
      start: "09:00",
      end: "10:30",
      type: "study",
      color: "bg-indigo-100 border-indigo-300 text-indigo-900",
    },
    {
      id: "47",
      subject: "Break",
      start: "10:30",
      end: "10:45",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "48",
      subject: "DSA Practice",
      start: "10:45",
      end: "12:15",
      type: "study",
      color: "bg-blue-100 border-blue-300 text-blue-900",
    },
    {
      id: "49",
      subject: "Lunch",
      start: "12:15",
      end: "13:15",
      type: "break",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: "50",
      subject: "Review Session",
      start: "13:15",
      end: "14:45",
      type: "study",
      color: "bg-pink-100 border-pink-300 text-pink-900",
    },
  ],
  Sunday: [
    {
      id: "51",
      subject: "Rest Day",
      start: "09:00",
      end: "12:00",
      type: "break",
      color: "bg-gray-50 border-gray-200 text-gray-800",
    },
  ],
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function WeeklyTimetable() {
  const [currentWeek, setCurrentWeek] = useState(0)

  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek - 1)
  }

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek + 1)
  }

  const getWeekDates = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7))
    return days.map((_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })
  }

  const weekDates = getWeekDates()

  // Generate dynamic time slots based on actual data
  const generateTimeSlots = () => {
    const allSlots = Object.values(weeklyData).flat()
    const startTimes = allSlots.map((slot) => Number.parseInt(slot.start.split(":")[0]))
    const endTimes = allSlots.map((slot) => Number.parseInt(slot.end.split(":")[0]))

    const minHour = Math.min(...startTimes)
    const maxHour = Math.max(...endTimes)

    const slots = []
    for (let hour = minHour; hour <= maxHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const getSlotForTimeAndDay = (time: string, day: string) => {
    const daySlots = weeklyData[day] || []
    return daySlots.find((slot) => {
      const slotStartHour = Number.parseInt(slot.start.split(":")[0])
      const slotStartMinute = Number.parseInt(slot.start.split(":")[1])
      const slotEndHour = Number.parseInt(slot.end.split(":")[0])
      const slotEndMinute = Number.parseInt(slot.end.split(":")[1])

      const timeHour = Number.parseInt(time.split(":")[0])
      const timeMinute = Number.parseInt(time.split(":")[1])

      const slotStartTotal = slotStartHour * 60 + slotStartMinute
      const slotEndTotal = slotEndHour * 60 + slotEndMinute
      const timeTotal = timeHour * 60 + timeMinute

      return timeTotal >= slotStartTotal && timeTotal < slotEndTotal
    })
  }

  return (
    <Card className="w-full border-2 border-primary/20 professional-shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-primary">Weekly Schedule Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} className="border-2 border-primary/20">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold px-4">
              Week {currentWeek === 0 ? "Current" : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextWeek} className="border-2 border-primary/20">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[800px]">
            {/* Header row */}
            <div className="p-3 font-semibold text-center border-b-2 border-primary/20 bg-primary/5">Time</div>
            {days.map((day, index) => (
              <div key={day} className="p-3 font-semibold text-center border-b-2 border-primary/20 bg-primary/5">
                <div className="text-base">{day}</div>
                <div className="text-sm text-muted-foreground font-medium">{weekDates[index]}</div>
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="p-3 text-sm font-semibold text-center border-r-2 border-primary/10 bg-secondary/5">
                  {time}
                </div>
                {days.map((day) => {
                  const slot = getSlotForTimeAndDay(time, day)
                  return (
                    <div key={`${day}-${time}`} className="p-1 border border-border min-h-[60px] bg-background">
                      {slot && (
                        <div
                          className={cn(
                            "h-full p-2 rounded border-l-4 text-xs",
                            slot.color,
                            slot.type === "break" && "border-dashed",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{slot.subject}</span>
                            {slot.type === "break" ? (
                              <Coffee className="h-3 w-3 text-amber-600" />
                            ) : (
                              <BookOpen className="h-3 w-3 text-blue-600" />
                            )}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {slot.start} - {slot.end}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-300 rounded"></div>
            <span className="text-sm font-medium">Study Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-50 border-l-4 border-amber-200 border-dashed rounded"></div>
            <span className="text-sm font-medium">Break Time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
