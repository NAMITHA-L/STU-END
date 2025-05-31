import LayoutWrapper from "@/components/layout-wrapper"
import SettingsPage from "@/components/settings-page"

export default function Settings() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <SettingsPage />
      </div>
    </LayoutWrapper>
  )
}
