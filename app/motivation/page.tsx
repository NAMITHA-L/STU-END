import LayoutWrapper from "@/components/layout-wrapper"
import MotivationPage from "@/components/motivation-page"

export default function MotivationPageRoute() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <MotivationPage />
      </div>
    </LayoutWrapper>
  )
}
