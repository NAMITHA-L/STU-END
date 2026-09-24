"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Flame, Clock, Timer, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CelebrationPopup from "@/components/celebration-popup"
import { toast } from "sonner"

type Priority = "high" | "medium" | "low"
type Task = { id: string; title: string; subject: string; priority: Priority; completed: boolean; dueDate: string; dueTime: string }

const today = () => new Date().toISOString().slice(0, 10)
const blankTask = () => ({ title: "", subject: "", priority: "medium" as Priority, dueDate: today(), dueTime: "09:00" })

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [showCelebration, setShowCelebration] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blankTask)
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks?date=${today()}`, { cache: "no-store" })
      if (!response.ok) throw new Error("Unable to load tasks")
      setTasks(await response.json())
    } catch { toast.error("Could not load today’s tasks") } finally { setLoading(false) }
  }, [])

  useEffect(() => { void loadTasks() }, [loadTasks])
  useEffect(() => {
    if (!activeTimer) return
    const interval = window.setInterval(() => setTimerSeconds((seconds) => seconds <= 1 ? 0 : seconds - 1), 1000)
    return () => window.clearInterval(interval)
  }, [activeTimer])

  const saveTask = async () => {
    if (!form.title.trim() || !form.subject.trim()) return toast.error("Add a task title and subject")
    const response = await fetch(editingId ? `/api/tasks/${editingId}` : "/api/tasks", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (!response.ok) return toast.error("Could not save task")
    const saved: Task = await response.json()
    setTasks((current) => editingId ? current.map((task) => task.id === saved.id ? saved : task) : [...current, saved].sort((a, b) => a.dueTime.localeCompare(b.dueTime)))
    setDialogOpen(false); setEditingId(null); setForm(blankTask()); toast.success(editingId ? "Task updated" : "Task added")
  }

  const updateCompletion = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, completed: !task.completed }) })
    if (!response.ok) return toast.error("Could not update task")
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))
    if (!task.completed) setShowCelebration(true)
  }

  const deleteTask = async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    if (!response.ok) return toast.error("Could not delete task")
    setTasks((current) => current.filter((task) => task.id !== id)); toast.success("Task deleted")
  }

  const filteredTasks = useMemo(() => tasks.filter((task) => activeTab === "pending" ? !task.completed : task.completed), [tasks, activeTab])
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
  const openEdit = (task: Task) => { setEditingId(task.id); setForm({ title: task.title, subject: task.subject, priority: task.priority, dueDate: task.dueDate, dueTime: task.dueTime }); setDialogOpen(true) }

  return <>
    <Card>
      <CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>Daily tasks</CardTitle><div className="flex items-center gap-2"><Tabs value={activeTab} onValueChange={setActiveTab}><TabsList><TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger></TabsList></Tabs><Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(blankTask()) } }}><DialogTrigger asChild><Button size="sm"><Plus data-icon="inline-start" />Add task</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingId ? "Edit task" : "Add today’s task"}</DialogTitle></DialogHeader><div className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="task-title">Task</Label><Input id="task-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" /></div><div className="flex flex-col gap-2"><Label htmlFor="task-subject">Subject</Label><Input id="task-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject or project" /></div><div className="grid grid-cols-2 gap-3"><div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div><div className="flex flex-col gap-2"><Label>Due time</Label><Input type="time" value={form.dueTime} onChange={(e) => setForm({ ...form, dueTime: e.target.value })} /></div></div><div className="flex flex-col gap-2"><Label>Priority</Label><Select value={form.priority} onValueChange={(value: Priority) => setForm({ ...form, priority: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div><Button onClick={saveTask}>{editingId ? "Save changes" : "Create task"}</Button></div></DialogContent></Dialog></div></div></CardHeader>
      <CardContent>{loading ? <p className="py-8 text-center text-muted-foreground">Loading today’s tasks…</p> : filteredTasks.length === 0 ? <div className="py-8 text-center text-muted-foreground">No {activeTab} tasks for today. Add your first one.</div> : <div className="flex flex-col gap-3">{filteredTasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-3 rounded-md border p-3"><div className="flex min-w-0 items-start gap-3"><Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => void updateCompletion(task)} /><div className="min-w-0"><label htmlFor={`task-${task.id}`} className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</label><div className="mt-1 flex flex-wrap items-center gap-2"><Badge variant="outline">{task.subject}</Badge><span className="text-xs text-muted-foreground">Due {task.dueDate} at {task.dueTime}</span></div></div></div><div className="flex items-center gap-1">{task.priority === "high" ? <Flame className="size-4 text-red-500" aria-label="High priority" /> : task.priority === "medium" ? <Clock className="size-4 text-amber-500" aria-label="Medium priority" /> : null}<Button variant="ghost" size="icon" aria-label="Pomodoro timer" onClick={() => { setActiveTimer(activeTimer === task.id ? null : task.id); setTimerSeconds(25 * 60) }}>{activeTimer === task.id ? <span className="font-mono text-xs">{formatTime(timerSeconds)}</span> : <Timer />}</Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Task actions"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => openEdit(task)}>Edit task</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => void deleteTask(task.id)}><Trash2 data-icon="inline-start" />Delete task</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></div>)}</div>}</CardContent>
    </Card><CelebrationPopup isVisible={showCelebration} onClose={() => setShowCelebration(false)} />
  </>
}
