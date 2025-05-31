import LayoutWrapper from "@/components/layout-wrapper"
import WeeklyTimetable from "@/components/weekly-timetable"

export default function TimetablePage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <WeeklyTimetable />
      </div>
    </LayoutWrapper>
  )
}
