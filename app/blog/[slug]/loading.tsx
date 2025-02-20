import { Skeleton } from '@/components/ui/skeleton'

export function PostSkeleton() {
  return (
    <article className="relative pb-16">
      {/* Hero Skeleton */}
      <div className="relative w-full min-h-[50vh] -mt-24">
        <div className="absolute inset-0 bg-muted animate-pulse" />
        <div className="relative z-2 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-6 w-24 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-2/3 mb-8" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Actions Bar Skeleton */}
          <div className="sticky top-24 z-20 -mx-4 mb-4 backdrop-blur-sm bg-background/80 px-4 py-2 sm:mx-0 sm:px-0">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-28" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>

          {/* Tags Skeleton */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          {/* Author Bio Skeleton */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Loading() {
  return <PostSkeleton />
} 