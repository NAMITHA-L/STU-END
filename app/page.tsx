import LayoutWrapper from "@/components/layout-wrapper"
import DailyGreeting from "@/components/daily-greeting"
import DailySummary from "@/components/daily-summary"
import QuickNavigation from "@/components/quick-navigation"

export default function Dashboard() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyGreeting />
          <DailySummary />
        </div>

        <QuickNavigation />
      </div>
    </LayoutWrapper>
  )
}
