"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, CalendarDays, CheckCircle2, ChevronDown, CircleSlash2, Clock3, History, Target } from "lucide-react"

type Report = { week: string; currentWeek: string; weeks: string[]; totals: { total: number; completed: number; skipped: number; open: number }; daily: { date: string; total: number; completed: number }[]; subjects: { subject: string; total: number; completed: number; skipped: number }[] }

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
const weekLabel = (value: string) => { const end = new Date(`${value}T00:00:00`); end.setDate(end.getDate() + 6); return `${formatDate(value)} – ${formatDate(`${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`)}` }

export default function ProgressAnalytics() {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)

  const load = async (week?: string) => {
    setLoading(true)
    const response = await fetch(`/api/progress${week ? `?week=${week}` : ""}`, { cache: "no-store" })
    if (response.ok) setReport(await response.json())
    setLoading(false)
  }
  useEffect(() => { void load() }, [])

  if (loading && !report) return <Card><CardContent className="py-16 text-center text-muted-foreground">Loading your real progress…</CardContent></Card>
  if (!report) return <Card><CardContent className="py-16 text-center text-muted-foreground">Progress is unavailable right now.</CardContent></Card>

  const completion = report.totals.total ? Math.round((report.totals.completed / report.totals.total) * 100) : 0
  const previousWeeks = report.weeks.filter((week) => week !== report.currentWeek)

  return <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-primary">Present week</p><h1 className="text-3xl font-semibold tracking-tight">Weekly progress</h1><p className="text-muted-foreground">{weekLabel(report.week)} · stored from your MongoDB task history</p></div>
      <div className="relative"><Button variant="outline" onClick={() => setHistoryOpen((open) => !open)}><History data-icon="inline-start" />Other weeks<ChevronDown data-icon="inline-end" /></Button>{historyOpen && <Card className="absolute right-0 top-11 z-10 w-64"><CardContent className="flex flex-col gap-1 p-2">{previousWeeks.length === 0 ? <p className="p-3 text-sm text-muted-foreground">Previous reports appear after you record more weeks.</p> : previousWeeks.map((week) => <Button key={week} variant="ghost" className="justify-start" onClick={() => { void load(week); setHistoryOpen(false) }}>{weekLabel(week)}</Button>)}</CardContent></Card>}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3"><Card><CardHeader className="pb-2"><CardDescription>Total tasks</CardDescription><CardTitle className="text-3xl">{report.totals.total}</CardTitle></CardHeader><CardContent><Badge variant="secondary"><Target data-icon="inline-start" />This week</Badge></CardContent></Card><Card><CardHeader className="pb-2"><CardDescription>Finished</CardDescription><CardTitle className="text-3xl">{report.totals.completed}</CardTitle></CardHeader><CardContent><Badge variant="secondary"><CheckCircle2 data-icon="inline-start" />{completion}% complete</Badge></CardContent></Card><Card><CardHeader className="pb-2"><CardDescription>Skipped / open</CardDescription><CardTitle className="text-3xl">{report.totals.skipped + report.totals.open}</CardTitle></CardHeader><CardContent><Badge variant="outline"><CircleSlash2 data-icon="inline-start" />{report.totals.skipped} skipped · {report.totals.open} open</Badge></CardContent></Card></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays />Daily record</CardTitle><CardDescription>Completed and total tasks for the selected week.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">{report.daily.map((day) => <div key={day.date} className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" })}</p><p className="mt-1 font-medium">{formatDate(day.date)}</p><p className="mt-3 text-2xl font-semibold">{day.completed}/{day.total}</p><p className="text-xs text-muted-foreground">finished</p></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 />Subject progress</CardTitle><CardDescription>Every subject records finished and skipped work separately.</CardDescription></CardHeader><CardContent>{report.subjects.length === 0 ? <div className="py-10 text-center text-muted-foreground">No tasks recorded for this week.</div> : <div className="flex flex-col gap-3">{report.subjects.map((subject) => <div key={subject.subject} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{subject.subject}</p><p className="text-sm text-muted-foreground">{subject.completed} finished · {subject.skipped} skipped/open</p></div><Badge variant={subject.completed === subject.total ? "default" : "outline"}>{subject.completed}/{subject.total}</Badge></div>)}</div>}</CardContent></Card>
    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 data-icon="inline-start" />Tasks are saved with their date, subject, completion state, and update time.</p>
  </div>
}
