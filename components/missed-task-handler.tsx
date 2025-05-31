"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define missed task type
interface MissedTask {
  id: string
  title: string
  subject: string
  priority: "high" | "medium" | "low"
  originalTime: string
  completed: boolean
  selected: boolean
}

// Sample missed tasks
const initialMissedTasks: MissedTask[] = [
  {
    id: "1",
    title: "Complete DSA assignment",
    subject: "Data Structures",
    priority: "high",
    originalTime: "Yesterday, 4:00 PM",
    completed: false,
    selected: true,
  },
  {
    id: "2",
    title: "Review ML algorithms",
    subject: "Machine Learning",
    priority: "medium",
    originalTime: "Yesterday, 2:00 PM",
    completed: false,
    selected: true,
  },
]

export default function MissedTaskHandler() {
  const { toast } = useToast()
  const [missedTasks, setMissedTasks] = useState<MissedTask[]>(initialMissedTasks)
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [reason, setReason] = useState("")
  const [selectedReason, setSelectedReason] = useState("")
  const [reallocatedTasks, setReallocatedTasks] = useState<MissedTask[]>([])

  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    setMissedTasks(missedTasks.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task)))
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

  // Get priority label
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "High 🔥"
      case "medium":
        return "Medium 🧘‍♀️"
      default:
        return "Low"
    }
  }

  // Handle reallocation
  const handleReallocate = () => {
    const selectedTasks = missedTasks.filter((task) => task.selected)

    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to reallocate.",
        variant: "destructive",
      })
      return
    }

    setReallocatedTasks(selectedTasks)
    setShowReasonDialog(true)
  }

  // Submit reason and show confirmation
  const submitReason = () => {
    setShowReasonDialog(false)
    setShowConfirmDialog(true)
  }

  // Confirm reallocation
  const confirmReallocation = () => {
    // In a real app, this would update the database or state management
    setShowConfirmDialog(false)

    // Remove reallocated tasks from missed tasks
    setMissedTasks(missedTasks.filter((task) => !reallocatedTasks.some((rt) => rt.id === task.id)))

    toast({
      title: "Tasks Reallocated",
      description: `${reallocatedTasks.length} tasks have been reallocated to tomorrow.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Missed Tasks</CardTitle>
          <CardDescription>Review and reallocate tasks you didn't complete</CardDescription>
        </CardHeader>
        <CardContent>
          {missedTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">All Caught Up!</h3>
              <p className="text-muted-foreground">You don't have any missed tasks to reallocate.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="font-medium">Uncompleted Tasks</span>
                <span className="text-sm text-muted-foreground">{missedTasks.length} tasks</span>
              </div>

              {missedTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 border rounded-md">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`select-${task.id}`}
                      checked={task.selected}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                    <div>
                      <label htmlFor={`select-${task.id}`} className="font-medium">
                        {task.title}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getSubjectColor(task.subject)}>
                          {task.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.originalTime}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleReallocate} disabled={missedTasks.length === 0} className="w-full">
            Reallocate Selected Tasks
          </Button>
        </CardFooter>
      </Card>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why were these tasks missed?</DialogTitle>
            <DialogDescription>Understanding why tasks were missed helps improve future planning</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason-select">Common Reasons</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Ran out of time</SelectItem>
                  <SelectItem value="difficult">Task was too difficult</SelectItem>
                  <SelectItem value="energy">Low energy/motivation</SelectItem>
                  <SelectItem value="interruption">Unexpected interruption</SelectItem>
                  <SelectItem value="other">Other reason</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason-text">Additional Notes (Optional)</Label>
              <Textarea
                id="reason-text"
                placeholder="Add any additional details..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitReason}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reallocation</DialogTitle>
            <DialogDescription>The following tasks will be moved to tomorrow's schedule</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md border p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Tasks to Reallocate</span>
              </div>

              <ul className="space-y-2 pl-6 list-disc">
                {reallocatedTasks.map((task) => (
                  <li key={task.id}>
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">({task.subject})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <span>These tasks will be added to your tomorrow's schedule in the earliest available slots.</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReallocation}>Confirm Reallocation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
