import { CardContainer, StatCard, EmptyState } from "@/components/ui/card-container"

export default function Page() {
  return (
    <div className="grid gap-8 w-full">
      <CardContainer heading="Quick Stats">
        <div className="grid gap-6 md:grid-cols-3 p-6">
          <StatCard label="Total Posts" value={0} />
          <StatCard label="Draft Posts" value={0} />
          <StatCard label="Published Posts" value={0} />
        </div>
      </CardContainer>

      <CardContainer heading="Recent Activity">
        <EmptyState 
          message="No recent activity"
          action="Start Creating"
        />
      </CardContainer>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  )
}
