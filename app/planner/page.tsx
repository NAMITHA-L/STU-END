import LayoutWrapper from "@/components/layout-wrapper"
import PlanGenerator from "@/components/plan-generator"

export default function PlannerPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <PlanGenerator />
      </div>
    </LayoutWrapper>
  )
}
