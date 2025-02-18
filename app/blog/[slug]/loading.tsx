import { Skeleton } from '@/components/ui/skeleton'

export function PostSkeleton() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-4 text-xs mb-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-4 w-32 mb-12" />
      </div>

      <Skeleton className="aspect-[2/1] w-full rounded-lg mb-12" />

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}

export default function Loading() {
  return <PostSkeleton />
} 