import Link from "next/link"
import { ArrowRight, MessageSquare, Users, BookCopy, Bot, Bell, PenTool } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex">
      {/* Left side with MNKY branding and content */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFBE33] flex-col items-center justify-between py-12 relative overflow-hidden">
        {/* Top branding section */}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="flex items-center gap-1.5 justify-center mb-4">
            <span className="text-6xl font-bold tracking-wider text-[#2A1810]">
              MNKY
            </span>
            <span className="text-6xl font-medium tracking-wide text-[#71717A]">
              BLOG
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#71717A] to-transparent" />
            <p className="text-lg font-medium text-[#71717A] tracking-[0.5em] uppercase">
              Community Hub
            </p>
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#71717A] to-transparent" />
          </div>
        </div>

        {/* Middle content sections */}
        <div className="relative z-10 max-w-md mx-auto space-y-8 px-8">
          {/* Features grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#2A1810]/5 backdrop-blur-sm rounded-xl p-4 hover:bg-[#2A1810]/10 transition-all duration-300 animate-fade-in-up border border-[#71717A]/20">
              <MessageSquare className="w-6 h-6 text-[#2A1810] mb-2" />
              <h3 className="text-[#2A1810] font-medium mb-1">Forums & Chat</h3>
              <p className="text-[#71717A] text-sm">Join discussions, study groups, and real-time conversations</p>
            </div>
            <div className="bg-[#2A1810]/5 backdrop-blur-sm rounded-xl p-4 hover:bg-[#2A1810]/10 transition-all duration-300 animate-fade-in-up delay-100 border border-[#71717A]/20">
              <Users className="w-6 h-6 text-[#2A1810] mb-2" />
              <h3 className="text-[#2A1810] font-medium mb-1">Study Groups</h3>
              <p className="text-[#71717A] text-sm">Create or join topic-focused groups with private messaging</p>
            </div>
            <div className="bg-[#2A1810]/5 backdrop-blur-sm rounded-xl p-4 hover:bg-[#2A1810]/10 transition-all duration-300 animate-fade-in-up delay-200 border border-[#71717A]/20">
              <BookCopy className="w-6 h-6 text-[#2A1810] mb-2" />
              <h3 className="text-[#2A1810] font-medium mb-1">Rich Content</h3>
              <p className="text-[#71717A] text-sm">Create polls, assignments, and interactive discussions</p>
            </div>
            <div className="bg-[#2A1810]/5 backdrop-blur-sm rounded-xl p-4 hover:bg-[#2A1810]/10 transition-all duration-300 animate-fade-in-up delay-300 border border-[#71717A]/20">
              <Bot className="w-6 h-6 text-[#2A1810] mb-2" />
              <h3 className="text-[#2A1810] font-medium mb-1">AI Features</h3>
              <p className="text-[#71717A] text-sm">Smart summaries, auto-tagging, and content recommendations</p>
            </div>
          </div>

          {/* Additional features list */}
          <div className="space-y-3 animate-fade-in-up delay-500">
            <div className="flex items-center gap-2 text-[#71717A]">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Real-time notifications & announcements</span>
            </div>
            <div className="flex items-center gap-2 text-[#71717A]">
              <PenTool className="w-4 h-4" />
              <span className="text-sm">Rich text editor with markdown support</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="relative z-10 text-center animate-fade-in">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#71717A] hover:text-[#2A1810] transition-colors"
          >
            <span className="text-sm font-medium tracking-wider uppercase">Explore Public Content</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-radial from-[#2A1810]/5 via-transparent to-transparent animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-soft-light" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#2A1810]/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#2A1810]/10 to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#71717A]/20 rounded-full animate-float" />
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#71717A]/20 rounded-full animate-float delay-300" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#71717A]/20 rounded-full animate-float delay-700" />
        </div>
      </div>

      {/* Right side with auth forms */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
