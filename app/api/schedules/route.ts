import { NextRequest, NextResponse } from "next/server"
import { getSchedulesCollection } from "@/lib/mongodb"

interface ScheduleInput { title: string; start: string; end: string; color: string; priority?: number }
function validTime(value: unknown): value is string { return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) }
function validDate(value: unknown): value is string { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) }
function serialize(item: Record<string, unknown>) { return { ...item, id: String(item._id), _id: undefined } }

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const date = params.get("date")
    const from = params.get("from")
    const to = params.get("to")
    const collection = await getSchedulesCollection()
    const filter = date && validDate(date) ? { date } : from && to && validDate(from) && validDate(to) ? { date: { $gte: from, $lte: to } } : {}
    const items = await collection.find(filter).sort({ date: 1, start: 1 }).toArray()
    return NextResponse.json(items.map((item) => serialize(item)))
  } catch (error) {
    console.error("[schedules] GET failed", error)
    return NextResponse.json({ error: "Unable to load schedule" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { date?: unknown; slots?: unknown }
    if (!validDate(body.date) || !Array.isArray(body.slots) || body.slots.length === 0) return NextResponse.json({ error: "A date and at least one slot are required" }, { status: 400 })
    const slots = body.slots as ScheduleInput[]
    if (slots.some((slot) => typeof slot.title !== "string" || !slot.title.trim() || !validTime(slot.start) || !validTime(slot.end) || slot.start >= slot.end || typeof slot.color !== "string")) return NextResponse.json({ error: "Invalid schedule slot" }, { status: 400 })
    const now = new Date()
    const collection = await getSchedulesCollection()
    await collection.deleteMany({ date: body.date })
    await collection.insertMany(slots.map((slot) => ({ date: body.date, title: slot.title.trim(), start: slot.start, end: slot.end, color: slot.color, priority: slot.priority, createdAt: now, updatedAt: now })))
    return NextResponse.json({ saved: slots.length }, { status: 201 })
  } catch (error) {
    console.error("[schedules] POST failed", error)
    return NextResponse.json({ error: "Unable to save schedule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date")
    if (!validDate(date)) return NextResponse.json({ error: "A valid date is required" }, { status: 400 })
    await (await getSchedulesCollection()).deleteMany({ date })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[schedules] DELETE failed", error)
    return NextResponse.json({ error: "Unable to clear schedule" }, { status: 500 })
  }
}
