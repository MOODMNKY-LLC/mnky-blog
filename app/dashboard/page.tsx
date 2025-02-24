import { ChatDrawer } from "@/components/chat/chat-drawer"

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome to your dashboard. Here you can manage your blog posts and interact with BLOG MNKY.
        </p>
      </div>
      <ChatDrawer />
    </div>
  )
}
