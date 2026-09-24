import { MongoClient } from "mongodb"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not configured")
  }

  if (global._mongoClientPromise) {
    return global._mongoClientPromise
  }

  const clientPromise = new MongoClient(uri).connect()
  if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise
  }
  return clientPromise
}

declare global {
  var _mongoIndexesPromise: Promise<void> | undefined
}

async function ensureIndexes() {
  if (global._mongoIndexesPromise) return global._mongoIndexesPromise
  global._mongoIndexesPromise = (async () => {
    const connectedClient = await getClientPromise()
    const db = connectedClient.db("studyplan")
    await Promise.all([
      db.collection<TaskDocument>("tasks").createIndex({ dueDate: 1, dueTime: 1 }),
      db.collection("schedules").createIndex({ date: 1, start: 1 }),
    ])
  })()
  return global._mongoIndexesPromise
}

export async function getTasksCollection() {
  const connectedClient = await getClientPromise()
  await ensureIndexes()
  return connectedClient.db("studyplan").collection<TaskDocument>("tasks")
}

export async function getSchedulesCollection() {
  const connectedClient = await getClientPromise()
  await ensureIndexes()
  return connectedClient.db("studyplan").collection("schedules")
}

export interface TaskDocument {
  _id?: import("mongodb").ObjectId
  title: string
  subject: string
  priority: "high" | "medium" | "low"
  dueDate: string
  dueTime: string
  completed: boolean
  skipped?: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export function serializeTask(task: TaskDocument) {
  return { ...task, id: task._id?.toString(), _id: undefined }
}

export function isValidPriority(value: unknown): value is TaskDocument["priority"] {
  return value === "high" || value === "medium" || value === "low"
}

export function isValidTaskPayload(value: unknown): value is Pick<TaskDocument, "title" | "subject" | "priority" | "dueDate" | "dueTime"> {
  if (!value || typeof value !== "object") return false
  const task = value as Record<string, unknown>
  return typeof task.title === "string" && task.title.trim().length > 0 &&
    typeof task.subject === "string" && task.subject.trim().length > 0 &&
    isValidPriority(task.priority) && typeof task.dueDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) && typeof task.dueTime === "string" &&
    /^\d{2}:\d{2}$/.test(task.dueTime)
}

export function taskPayload(value: Pick<TaskDocument, "title" | "subject" | "priority" | "dueDate" | "dueTime">) {
  return {
    title: value.title.trim(), subject: value.subject.trim(), priority: value.priority,
    dueDate: value.dueDate, dueTime: value.dueTime,
  }
}

export function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value)
}

export { ObjectId } from "mongodb"
