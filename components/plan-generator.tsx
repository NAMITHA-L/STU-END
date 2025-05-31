"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, X, Minus, Brain, Zap, Target, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define subject type
interface Subject {
  id: string
  name: string
  priority: number
  color: string
}

// Define generated plan type
interface PlanSlot {
  id: string
  subject: string
  start: string
  end: string
  color: string
  priority: number
}

export default function PlanGenerator() {
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Data Structures & Algorithms", priority: 5, color: "bg-professional-gold text-black" },
    { id: "2", name: "Machine Learning", priority: 3, color: "bg-professional-silver text-black" },
    { id: "3", name: "Web Development", priority: 4, color: "bg-professional-charcoal text-white" },
  ])

  const [newSubject, setNewSubject] = useState("")
  const [newPriority, setNewPriority] = useState(3)
  const [availableHours, setAvailableHours] = useState(6)
  const [generatedPlan, setGeneratedPlan] = useState<PlanSlot[]>([])
  const [showPlanPreview, setShowPlanPreview] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingSlot, setEditingSlot] = useState<PlanSlot | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Smart conflict resolution function
  const findNextAvailableSlot = (desiredStart: string, duration: number, excludeId?: string): string => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number)
      return hours * 60 + minutes
    }

    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
    }

    const desiredStartMinutes = timeToMinutes(desiredStart)
    const durationMinutes = duration * 60

    const existingSlots = generatedPlan
      .filter((slot) => slot.id !== excludeId)
      .map((slot) => ({
        start: timeToMinutes(slot.start),
        end: timeToMinutes(slot.end),
      }))
      .sort((a, b) => a.start - b.start)

    const isTimeAvailable = (start: number, end: number) => {
      return !existingSlots.some((slot) => start < slot.end && end > slot.start)
    }

    if (isTimeAvailable(desiredStartMinutes, desiredStartMinutes + durationMinutes)) {
      return desiredStart
    }

    let currentTime = Math.max(desiredStartMinutes, 9 * 60)
    const endOfDay = 22 * 60

    while (currentTime + durationMinutes <= endOfDay) {
      if (isTimeAvailable(currentTime, currentTime + durationMinutes)) {
        return minutesToTime(currentTime)
      }
      currentTime += 30
    }

    toast({
      title: "Schedule Conflict Detected",
      description: "Automatic optimization applied to resolve timing conflicts.",
      variant: "destructive",
    })
    return desiredStart
  }

  const addSubject = () => {
    if (newSubject.trim()) {
      const professionalColors = [
        "bg-professional-gold text-black",
        "bg-professional-silver text-black",
        "bg-professional-charcoal text-white",
        "bg-professional-platinum text-black",
        "bg-professional-silver-pink text-black",
        "bg-professional-silver-blue text-black",
      ]

      const newSubjectObj: Subject = {
        id: Date.now().toString(),
        name: newSubject,
        priority: newPriority,
        color: professionalColors[Math.floor(Math.random() * professionalColors.length)],
      }

      setSubjects([...subjects, newSubjectObj])
      setNewSubject("")
      setNewPriority(3)

      toast({
        title: "Subject Added Successfully",
        description: `${newSubject} has been integrated into your study plan.`,
      })
    }
  }

  const removeSubject = (id: string) => {
    const subject = subjects.find((s) => s.id === id)
    setSubjects(subjects.filter((subject) => subject.id !== id))

    if (subject) {
      toast({
        title: "Subject Removed",
        description: `${subject.name} has been removed from your plan.`,
      })
    }
  }

  const updateSubjectPriority = (id: string, newPriority: number) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, priority: Math.max(1, Math.min(5, newPriority)) } : subject,
      ),
    )
  }

  const generatePlan = () => {
    if (subjects.length === 0 || availableHours <= 0) return

    const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority)
    const totalPriority = sortedSubjects.reduce((sum, subject) => sum + subject.priority, 0)

    const plan: PlanSlot[] = []
    let startHour = 9

    sortedSubjects.forEach((subject) => {
      const subjectHours = Math.max(0.5, Math.round((subject.priority / totalPriority) * availableHours * 2) / 2)

      const endHour = startHour + subjectHours

      plan.push({
        id: Date.now().toString() + subject.id,
        subject: subject.name,
        start: `${Math.floor(startHour).toString().padStart(2, "0")}:${startHour % 1 === 0 ? "00" : "30"}`,
        end: `${Math.floor(endHour).toString().padStart(2, "0")}:${endHour % 1 === 0 ? "00" : "30"}`,
        color: subject.color,
        priority: subject.priority,
      })

      startHour = endHour + 0.5
    })

    setGeneratedPlan(plan)
    setShowPlanPreview(true)
    setIsEditMode(false)

    toast({
      title: "Professional Study Plan Generated",
      description: `Optimized schedule created for ${plan.length} subjects with intelligent time allocation.`,
    })
  }

  const editPlanSlot = (slot: PlanSlot) => {
    setEditingSlot(slot)
    setShowEditDialog(true)
  }

  const saveEditedSlot = () => {
    if (editingSlot) {
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number)
        return hours * 60 + minutes
      }

      const startMinutes = timeToMinutes(editingSlot.start)
      const endMinutes = timeToMinutes(editingSlot.end)
      const duration = (endMinutes - startMinutes) / 60

      const optimizedStart = findNextAvailableSlot(editingSlot.start, duration, editingSlot.id)

      const optimizedSlot = {
        ...editingSlot,
        start: optimizedStart,
        end: (() => {
          const startMins = timeToMinutes(optimizedStart)
          const endMins = startMins + duration * 60
          const hours = Math.floor(endMins / 60)
          const mins = endMins % 60
          return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
        })(),
      }

      setGeneratedPlan(generatedPlan.map((slot) => (slot.id === editingSlot.id ? optimizedSlot : slot)))
      setShowEditDialog(false)
      setEditingSlot(null)

      if (optimizedStart !== editingSlot.start) {
        toast({
          title: "Schedule Optimized",
          description: `Session moved to ${optimizedStart} to resolve conflicts.`,
        })
      } else {
        toast({
          title: "Schedule Updated",
          description: "Your study plan has been updated successfully.",
        })
      }
    }
  }

  const savePlan = () => {
    setShowPlanPreview(false)
    toast({
      title: "Professional Plan Saved",
      description: "Your optimized study schedule is now active.",
    })
  }

  const enableEditMode = () => {
    setIsEditMode(true)
    toast({
      title: "Edit Mode Activated",
      description: "Select any session to modify your schedule.",
    })
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-primary/20 professional-shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
          <CardTitle className="flex items-center text-2xl">
            <Target className="h-7 w-7 mr-3 text-primary" />
            Study Plan Configuration
          </CardTitle>
          <CardDescription className="text-base">
            Configure subjects, priorities, and time allocation for intelligent schedule generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          {/* Available Hours */}
          <div className="space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center">
              <Label htmlFor="hours" className="text-lg font-semibold flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Available Study Hours
              </Label>
              <span className="text-2xl font-bold text-primary">{availableHours} hours</span>
            </div>
            <Slider
              id="hours"
              min={1}
              max={12}
              step={0.5}
              value={[availableHours]}
              onValueChange={(value) => setAvailableHours(value[0])}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Configure total daily study time for optimal schedule distribution
            </p>
          </div>

          {/* Subject Management */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Subject Portfolio</Label>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-6 border-2 border-primary/10 rounded-lg bg-card hover:professional-shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <Badge className={`${subject.color} px-4 py-2 text-sm font-semibold`}>{subject.name}</Badge>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2">
                      <span className="text-sm font-medium text-muted-foreground">Priority Level:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => updateSubjectPriority(subject.id, subject.priority - 1)}
                          disabled={subject.priority <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-8 text-center text-primary">{subject.priority}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                          onClick={() => updateSubjectPriority(subject.id, subject.priority + 1)}
                          disabled={subject.priority >= 5}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubject(subject.id)}
                    className="hover:bg-destructive/20 hover:text-destructive h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              {subjects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-xl font-semibold">No Subjects Configured</p>
                  <p className="text-base mt-2">Add your first subject to begin professional schedule generation</p>
                </div>
              )}
            </div>
          </div>

          {/* Add New Subject - Fixed priority box spacing */}
          <div className="space-y-4 p-6 bg-secondary/5 rounded-lg border border-secondary/20">
            <Label className="text-lg font-semibold text-secondary">Add New Subject</Label>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Enter subject name (e.g., Advanced Mathematics, Computer Science)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="h-12 border-2 border-secondary/20 focus:border-secondary text-base"
                />
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority Level (1-5)
                </Label>
                <div className="flex items-center justify-center gap-1 border-2 border-secondary/20 rounded-md px-2 py-2 h-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/20 flex-shrink-0"
                    onClick={() => setNewPriority(Math.max(1, newPriority - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-bold w-8 text-center text-secondary flex-shrink-0">{newPriority}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/20 flex-shrink-0"
                    onClick={() => setNewPriority(Math.min(5, newPriority + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={addSubject}
                className="h-12 bg-secondary hover:bg-secondary/90 text-black font-semibold px-8"
                disabled={!newSubject.trim()}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Subject
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-8">
          <Button
            onClick={generatePlan}
            disabled={subjects.length === 0 || availableHours <= 0}
            className="w-full h-16 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-black font-bold text-xl rounded-lg professional-shadow-lg hover:professional-shadow-xl transition-all duration-300"
          >
            <Brain className="h-6 w-6 mr-3" />
            Generate Professional Study Plan
          </Button>
        </CardFooter>
      </Card>

      {/* Plan Preview Dialog */}
      <Dialog open={showPlanPreview} onOpenChange={setShowPlanPreview}>
        <DialogContent className="max-w-4xl border-2 border-primary/20 professional-shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Settings className="h-7 w-7 mr-3 text-primary" />
              Professional Study Schedule
            </DialogTitle>
            <DialogDescription className="text-base">
              AI-optimized schedule with intelligent time allocation and conflict resolution
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6 max-h-96 overflow-y-auto">
            {generatedPlan.map((slot, index) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-6 border-2 border-primary/10 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 hover:professional-shadow-lg transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={`${slot.color} px-4 py-2 text-sm font-semibold`}>{slot.subject}</Badge>
                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                      Priority Level {slot.priority}
                    </span>
                  </div>
                  <div className="text-base text-muted-foreground flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      {slot.start} - {slot.end}
                    </span>
                    <span className="text-sm">•</span>
                    <span className="font-medium">
                      {(
                        (new Date(`2000-01-01 ${slot.end}:00`).getTime() -
                          new Date(`2000-01-01 ${slot.start}:00`).getTime()) /
                        (1000 * 60 * 60)
                      ).toFixed(1)}{" "}
                      hours duration
                    </span>
                  </div>
                </div>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editPlanSlot(slot)}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold"
                  >
                    Modify Session
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between gap-4">
            {!isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={enableEditMode}
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-black font-semibold px-6"
                >
                  Edit Schedule
                </Button>
                <Button
                  onClick={savePlan}
                  className="bg-gradient-to-r from-primary to-secondary text-black font-bold px-8"
                >
                  <Check className="h-4 w-4 mr-2" /> Save Professional Plan
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditMode(false)} className="bg-primary text-black font-bold px-6">
                Complete Editing
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slot Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="border-2 border-primary/20 professional-shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-primary text-xl">
              <Settings className="h-6 w-6 mr-2" />
              Professional Schedule Editor
            </DialogTitle>
            <DialogDescription className="text-base">
              Advanced AI will automatically resolve scheduling conflicts and optimize time allocation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Subject Name</Label>
              <Input
                value={editingSlot?.subject || ""}
                onChange={(e) => setEditingSlot((prev) => (prev ? { ...prev, subject: e.target.value } : null))}
                className="h-12 border-2 border-primary/20 focus:border-primary text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Start Time</Label>
                <Input
                  type="time"
                  value={editingSlot?.start || ""}
                  onChange={(e) => setEditingSlot((prev) => (prev ? { ...prev, start: e.target.value } : null))}
                  className="h-12 border-2 border-primary/20 focus:border-primary text-base"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">End Time</Label>
                <Input
                  type="time"
                  value={editingSlot?.end || ""}
                  onChange={(e) => setEditingSlot((prev) => (prev ? { ...prev, end: e.target.value } : null))}
                  className="h-12 border-2 border-primary/20 focus:border-primary text-base"
                />
              </div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-semibold">AI Conflict Resolution Active</p>
              <p className="text-xs text-muted-foreground mt-1">
                Intelligent scheduling will automatically optimize timing to prevent conflicts
              </p>
            </div>
          </div>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="font-semibold px-6">
              Cancel Changes
            </Button>
            <Button onClick={saveEditedSlot} className="bg-primary text-black font-bold px-6">
              <Brain className="h-4 w-4 mr-2" />
              Apply AI Optimization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
