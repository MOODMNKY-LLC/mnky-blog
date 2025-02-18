export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-zinc-900 to-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="h-12 w-3/4 bg-muted animate-pulse rounded mx-auto mb-6" />
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border bg-card"
              >
                <div className="aspect-[16/9] bg-muted animate-pulse" />
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-x-4 mb-4">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 