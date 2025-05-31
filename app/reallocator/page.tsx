import LayoutWrapper from "@/components/layout-wrapper"
import MissedTaskHandler from "@/components/missed-task-handler"

export default function ReallocatorPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <MissedTaskHandler />
      </div>
    </LayoutWrapper>
  )
}
