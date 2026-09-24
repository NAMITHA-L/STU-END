import { NextRequest, NextResponse } from "next/server"
import { getTasksCollection } from "@/lib/mongodb"

type Task = { title: string; subject: string; dueDate: string; completed: boolean; skipped?: boolean }

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
function mondayOf(date: Date) {
  const result = new Date(date)
  const day = result.getDay()
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1))
  return localDate(result)
}
function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00`)
  date.setDate(date.getDate() + days)
  return localDate(date)
}

export async function GET(request: NextRequest) {
  try {
    const collection = await getTasksCollection()
    const requestedWeek = request.nextUrl.searchParams.get("week")
    const currentWeek = mondayOf(new Date())
    const taskDates = await collection.distinct("dueDate") as string[]
    const weeks = [...new Set(taskDates.map((date) => mondayOf(new Date(`${date}T00:00:00`))))].sort().reverse()
    const week = requestedWeek && /^\d{4}-\d{2}-\d{2}$/.test(requestedWeek) ? requestedWeek : currentWeek
    const tasks = await collection.find({ dueDate: { $gte: week, $lte: addDays(week, 6) } }).sort({ dueDate: 1, dueTime: 1 }).toArray() as Task[]
    const days = Array.from({ length: 7 }, (_, index) => addDays(week, index))
    const daily = days.map((date) => {
      const dayTasks = tasks.filter((task) => task.dueDate === date)
      return { date, total: dayTasks.length, completed: dayTasks.filter((task) => task.completed).length }
    })
    const subjectMap = new Map<string, { subject: string; total: number; completed: number; skipped: number }>()
    tasks.forEach((task) => {
      const current = subjectMap.get(task.subject) ?? { subject: task.subject, total: 0, completed: 0, skipped: 0 }
      current.total += 1
      if (task.completed) current.completed += 1
      if (task.skipped) current.skipped += 1
      subjectMap.set(task.subject, current)
    })
    return NextResponse.json({ week, currentWeek, weeks: [...new Set([currentWeek, ...weeks])], totals: { total: tasks.length, completed: tasks.filter((task) => task.completed).length, skipped: tasks.filter((task) => task.skipped).length, open: tasks.filter((task) => !task.completed && !task.skipped).length }, daily, subjects: [...subjectMap.values()] })
  } catch (error) {
    console.error("[progress] GET failed", error)
    return NextResponse.json({ error: "Unable to load progress" }, { status: 500 })
  }
}
