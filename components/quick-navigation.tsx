import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckSquare, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { name: "Timetable", icon: Calendar, href: "/timetable", color: "bg-blue-100 text-blue-700" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks", color: "bg-purple-100 text-purple-700" },
  { name: "Progress", icon: BarChart3, href: "/progress", color: "bg-green-100 text-green-700" },
  { name: "Settings", icon: Settings, href: "/settings", color: "bg-amber-100 text-amber-700" },
]

export default function QuickNavigation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Shortcuts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent transition-colors"
            >
              <div className={`p-3 rounded-full ${link.color} mb-2`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-center">{link.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
