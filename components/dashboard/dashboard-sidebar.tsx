import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChartIcon,
  FileTextIcon,
  GearIcon,
  ImageIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

interface DashboardSidebarProps {
  // This interface is intentionally left empty as it may be extended in the future
  // and serves as a base for component props
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Posts
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ImageIcon className="mr-2 h-4 w-4" />
              Media
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PersonIcon className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <GearIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 