import { Metadata } from "next"
import { CommunityUpdates } from "@/components/community/updates/CommunityUpdates"

export const metadata: Metadata = {
  title: "Community Updates | MOOD MNKY",
  description: "Stay informed about the latest community news, announcements, and updates.",
}

export default function UpdatesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community Updates</h1>
        <p className="text-muted-foreground">
          Stay informed about the latest community news, announcements, and updates.
        </p>
      </div>
      <CommunityUpdates />
    </div>
  )
} 