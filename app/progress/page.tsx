import LayoutWrapper from "@/components/layout-wrapper"
import ProgressAnalytics from "@/components/progress-analytics"

export default function ProgressPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <ProgressAnalytics />
      </div>
    </LayoutWrapper>
  )
}
