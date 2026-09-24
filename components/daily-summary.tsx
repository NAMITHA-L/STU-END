"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, CheckCircle } from "lucide-react"

const toMinutes = (value: string) => { const [hours, minutes] = value.split(":").map(Number); return hours * 60 + minutes }

export default function DailySummary() {
  const [summary, setSummary] = useState({ subjectsPlanned: 0, hoursAllocated: 0, tasksCompleted: 0, totalTasks: 0 })
  useEffect(() => {
    const date = new Date()
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    Promise.all([fetch(`/api/tasks?date=${dateKey}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : []), fetch(`/api/schedules?date=${dateKey}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : [])]).then(([tasks, schedules]) => {
      const hours = schedules.reduce((sum: number, slot: { start: string; end: string }) => sum + (toMinutes(slot.end) - toMinutes(slot.start)) / 60, 0)
      setSummary({ subjectsPlanned: new Set(schedules.map((slot: { title: string }) => slot.title)).size, hoursAllocated: Math.round(hours * 2) / 2, tasksCompleted: tasks.filter((task: { completed: boolean }) => task.completed).length, totalTasks: tasks.length })
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
              <span>Subjects Planned</span>
            </div>
            <span className="font-medium">{summary.subjectsPlanned} Subjects Planned</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <span>Time Allocated</span>
            </div>
            <span className="font-medium">{summary.hoursAllocated} hrs scheduled</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Tasks Completed</span>
            </div>
            <span className="font-medium">
              {summary.tasksCompleted}/{summary.totalTasks} ✅
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
