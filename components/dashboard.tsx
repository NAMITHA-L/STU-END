"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import DailyGreeting from "@/components/daily-greeting"
import DailySummary from "@/components/daily-summary"
import QuickNavigation from "@/components/quick-navigation"
import Timetable from "@/components/timetable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const { toast } = useToast()
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveView}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Day</h1>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyGreeting />
            <DailySummary />
          </div>
          <QuickNavigation />
        </TabsContent>

        <TabsContent value="timetable">
          <Timetable
            onEventChange={(event) => {
              toast({
                title: "Event Updated",
                description: `${event.title} has been updated.`,
              })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
