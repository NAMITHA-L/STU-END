import { NextRequest, NextResponse } from "next/server"
import { getTasksCollection, isValidTaskPayload, serializeTask, taskPayload } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const date = params.get("date")
    const from = params.get("from")
    const to = params.get("to")
    const collection = await getTasksCollection()
    const filter = date ? { dueDate: date } : from && to ? { dueDate: { $gte: from, $lte: to } } : {}
    const tasks = await collection.find(filter).sort({ dueDate: 1, dueTime: 1, createdAt: 1 }).toArray()
    return NextResponse.json(tasks.map(serializeTask))
  } catch (error) {
    console.error("[tasks] GET failed", error)
    return NextResponse.json({ error: "Unable to load tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!isValidTaskPayload(body)) return NextResponse.json({ error: "Invalid task data" }, { status: 400 })
    const now = new Date()
    const collection = await getTasksCollection()
    const result = await collection.insertOne({ ...taskPayload(body), completed: false, skipped: false, createdAt: now, updatedAt: now })
    const task = await collection.findOne({ _id: result.insertedId })
    return NextResponse.json(serializeTask(task!), { status: 201 })
  } catch (error) {
    console.error("[tasks] POST failed", error)
    return NextResponse.json({ error: "Unable to create task" }, { status: 500 })
  }
}
