"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Flame, Clock, Timer, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CelebrationPopup from "@/components/celebration-popup"

// Define task type
interface Task {
  id: string
  title: string
  subject: string
  priority: "high" | "medium" | "low"
  completed: boolean
  dueTime: string
}

// Sample tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete DSA assignment",
    subject: "Data Structures",
    priority: "high",
    completed: false,
    dueTime: "10:00",
  },
  {
    id: "2",
    title: "Review ML algorithms",
    subject: "Machine Learning",
    priority: "medium",
    completed: false,
    dueTime: "12:00",
  },
  {
    id: "3",
    title: "Prepare presentation",
    subject: "System Design",
    priority: "high",
    completed: false,
    dueTime: "15:30",
  },
  {
    id: "4",
    title: "Fix CSS bugs",
    subject: "Web Development",
    completed: true,
    priority: "low",
    dueTime: "14:00",
  },
  {
    id: "5",
    title: "Read research paper",
    subject: "Machine Learning",
    priority: "medium",
    completed: true,
    dueTime: "17:00",
  },
]

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTab, setActiveTab] = useState("pending")
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60) // 25 minutes in seconds
  const [showCelebration, setShowCelebration] = useState(false)

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      // Show celebration for newly completed tasks
      setShowCelebration(true)
    }
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Get priority icon with tooltip
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Flame className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>High priority task</p>
            </TooltipContent>
          </Tooltip>
        )
      case "medium":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Clock className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Medium priority task</p>
            </TooltipContent>
          </Tooltip>
        )
      default:
        return null
    }
  }

  // Get subject color
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Data Structures":
        return "bg-blue-100 text-blue-800"
      case "Machine Learning":
        return "bg-purple-100 text-purple-800"
      case "System Design":
        return "bg-red-100 text-red-800"
      case "Web Development":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Toggle pomodoro timer
  const toggleTimer = (taskId: string) => {
    if (activeTimer === taskId) {
      setActiveTimer(null)
    } else {
      setActiveTimer(taskId)
      setTimerSeconds(25 * 60) // Reset to 25 minutes
    }
  }

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => (activeTab === "pending" ? !task.completed : task.completed))

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tasks</CardTitle>
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No {activeTab} tasks found.</div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div>
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getSubjectColor(task.subject)}>
                          {task.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Due: {task.dueTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}

                    {activeTimer === task.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono">{formatTime(timerSeconds)}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleTimer(task.id)}>
                              <Timer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Stop Pomodoro timer</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleTimer(task.id)}>
                            <Timer className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Start 25-minute Pomodoro timer</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Change Priority</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <CelebrationPopup isVisible={showCelebration} onClose={() => setShowCelebration(false)} />
    </TooltipProvider>
  )
}
