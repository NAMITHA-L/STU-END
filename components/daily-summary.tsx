import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, CheckCircle } from "lucide-react"

export default function DailySummary() {
  // This would typically come from an API or state management
  const summary = {
    subjectsPlanned: 5,
    hoursAllocated: 6.5,
    tasksCompleted: 3,
    totalTasks: 5,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
              <span>Subjects Planned</span>
            </div>
            <span className="font-medium">{summary.subjectsPlanned} Tasks Today</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <span>Time Allocated</span>
            </div>
            <span className="font-medium">{summary.hoursAllocated} hrs scheduled</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Tasks Completed</span>
            </div>
            <span className="font-medium">
              {summary.tasksCompleted}/{summary.totalTasks} ✅
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
