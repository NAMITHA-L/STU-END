"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

type Task = { id: string; title: string; subject: string; priority: "high" | "medium" | "low"; dueDate: string; dueTime: string; completed: boolean; skipped?: boolean }

const localDate = (offset = 0) => { const date = new Date(); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` }
const overdueBefore = () => localDate()
const nextSlot = (index: number) => { const now = new Date(); const minutes = Math.ceil((now.getHours() * 60 + now.getMinutes()) / 30) * 30 + index * 30; return `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}` }

export default function MissedTaskHandler() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks?overdue=true&overdueBefore=${overdueBefore()}`, { cache: "no-store" })
      if (!response.ok) throw new Error()
      const items: Task[] = await response.json()
      setTasks(items)
      setSelected(new Set(items.map((task) => task.id)))
    } catch { toast.error("Could not load overdue tasks") } finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])

  const reallocate = async () => {
    const chosen = tasks.filter((task) => selected.has(task.id))
    if (!chosen.length) return toast.error("Select at least one task")
    setSaving(true)
    try {
      const results = await Promise.all(chosen.map((task, index) => fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dueDate: localDate(), dueTime: nextSlot(index) }) })))
      if (results.some((response) => !response.ok)) throw new Error()
      setTasks((current) => current.filter((task) => !selected.has(task.id)))
      setSelected(new Set())
      toast.success(`${chosen.length} task${chosen.length === 1 ? "" : "s"} moved to today from the next available slot`)
    } catch { toast.error("Could not reallocate tasks") } finally { setSaving(false) }
  }

  return <Card>
    <CardHeader><CardTitle>Reallocator</CardTitle><CardDescription>Real overdue tasks that were not completed or skipped. Reallocate them into today without losing their history.</CardDescription></CardHeader>
    <CardContent>
      {loading ? <p className="py-8 text-center text-muted-foreground">Checking overdue tasks…</p> : tasks.length === 0 ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto mb-3 size-10 text-primary" /><p className="font-medium">No overdue tasks</p><p className="text-sm text-muted-foreground">Unfinished work will appear here after its date passes.</p></div> : <div className="flex flex-col gap-3">{tasks.map((task) => <label key={task.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3"><span className="flex min-w-0 items-center gap-3"><Checkbox checked={selected.has(task.id)} onCheckedChange={() => setSelected((current) => { const next = new Set(current); next.has(task.id) ? next.delete(task.id) : next.add(task.id); return next })} /><span className="min-w-0"><span className="block truncate font-medium">{task.title}</span><span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="outline">{task.subject}</Badge>{task.dueDate} at {task.dueTime}</span></span></span><Badge variant={task.priority === "high" ? "destructive" : "outline"}>{task.priority}</Badge></label>)}</div>}
    </CardContent>
    <CardFooter className="flex gap-2"><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw data-icon="inline-start" />Refresh</Button><Button onClick={() => void reallocate()} disabled={saving || selected.size === 0}>Move selected to today</Button></CardFooter>
  </Card>
}
