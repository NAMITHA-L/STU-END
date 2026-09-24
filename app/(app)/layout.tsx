import type { ReactNode } from "react"
import LayoutWrapper from "@/components/layout-wrapper"

export default function AppLayout({ children }: { children: ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>
}
