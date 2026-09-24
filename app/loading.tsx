import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></main>
}
