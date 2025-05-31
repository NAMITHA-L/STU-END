import LayoutWrapper from "@/components/layout-wrapper"
import TaskList from "@/components/task-list"

export default function TasksPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto p-6">
        <TaskList />
      </div>
    </LayoutWrapper>
  )
}
