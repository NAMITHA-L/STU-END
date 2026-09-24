import { NextRequest, NextResponse } from "next/server"
import { getTasksCollection, isObjectId, isValidTaskPayload, ObjectId, serializeTask, taskPayload } from "@/lib/mongodb"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isObjectId(id)) return NextResponse.json({ error: "Invalid task id" }, { status: 400 })
  try {
    const body = await request.json()
    const collection = await getTasksCollection()
    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (typeof body.completed === "boolean") { update.completed = body.completed; update.skipped = false; update.completedAt = body.completed ? new Date() : null }
    if (typeof body.skipped === "boolean" && !body.completed) update.skipped = body.skipped
    if (body.title !== undefined || body.subject !== undefined || body.priority !== undefined || body.dueDate !== undefined || body.dueTime !== undefined) {
      if (!isValidTaskPayload(body)) return NextResponse.json({ error: "Invalid task data" }, { status: 400 })
      Object.assign(update, taskPayload(body))
    }
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" })
    if (!result) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(serializeTask(result))
  } catch (error) {
    console.error("[tasks] PATCH failed", error)
    return NextResponse.json({ error: "Unable to update task" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isObjectId(id)) return NextResponse.json({ error: "Invalid task id" }, { status: 400 })
  try {
    const collection = await getTasksCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    if (!result.deletedCount) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[tasks] DELETE failed", error)
    return NextResponse.json({ error: "Unable to delete task" }, { status: 500 })
  }
}
