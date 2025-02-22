'use client'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center">
        <div className="w-full">
          <div className="flex flex-col gap-8 items-center py-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold tracking-widest text-gradient-gold animate-text-shimmer">
                MNKY
              </span>
              <div className="flex items-center gap-4 mt-2">
                <span className="w-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <span className="text-lg font-medium text-muted-foreground tracking-[0.5em] uppercase">
                  Dashboard
                </span>
                <span className="w-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col">
          <main className="flex flex-1 flex-col items-center">
            <div className="flex-1 w-full max-w-5xl px-4 py-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
