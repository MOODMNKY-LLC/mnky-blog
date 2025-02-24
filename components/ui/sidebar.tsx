"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isMobile?: boolean
}

const SidebarContext = React.createContext<SidebarContextValue>({})

interface SidebarProviderProps extends React.PropsWithChildren<SidebarContextValue> {
  defaultOpen?: boolean
}

function SidebarProvider({
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const open = controlledOpen ?? uncontrolledOpen
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledOpen

  return (
    <SidebarContext.Provider value={{ open, onOpenChange, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const sidebarVariants = cva(
  "flex flex-col h-full transition-all duration-300 ease-in-out",
  {
    variants: {
      open: {
        true: "w-[280px] opacity-100",
        false: "w-[0px] opacity-0",
      },
    },
    defaultVariants: {
      open: true,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: "none" | "hover" | "click";
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible = "click", ...props }, ref) => {
    const { open } = useSidebar()
    return (
      <div
        ref={ref}
        data-collapsible={collapsible}
        className={cn(
          sidebarVariants({ open, className }),
          collapsible === "none" && "w-[280px]"
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-hidden", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { open, onOpenChange } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-800/80 transition-all group z-50",
        "hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)]",
        open ? "-right-3" : "left-2",
        className
      )}
      onClick={() => onOpenChange?.(!open)}
      {...props}
    >
      <div className="w-6 h-6">
        <img 
          src="/logo.png" 
          alt="Toggle Sidebar"
          className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(50%) saturate(1000%) hue-rotate(330deg) brightness(101%) contrast(101%)' }}
        />
      </div>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2 overflow-hidden", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, asChild = false, ...props }, ref) => {
  const { open } = useSidebar()
  const Comp = asChild ? 'div' : 'div'
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex items-center transition-all duration-300",
        !open && "opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1 overflow-hidden", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("transition-all duration-300 overflow-hidden", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

const sidebarMenuButtonVariants = cva(
  "w-full text-left transition-all duration-300 flex items-center gap-3 rounded-lg",
  {
    variants: {
      open: {
        true: "",
        false: "justify-center",
      },
      size: {
        sm: "px-2 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-3",
      },
      isActive: {
        true: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        false: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      isActive: false,
    },
  }
)

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive, size, ...props }, ref) => {
    const { open } = useSidebar()
    return (
      <button
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cn(
          sidebarMenuButtonVariants({ open, size, isActive, className })
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarMenuActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showOnHover?: boolean;
}

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuActionProps
>(({ className, showOnHover, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-all",
        !open && "hidden",
        showOnHover && "opacity-0 group-hover:opacity-100",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "ml-auto text-xs font-medium text-zinc-400",
        !open && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px bg-zinc-800/50 my-2", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "pl-10 space-y-1 transition-all duration-300",
        !open && "opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("transition-all duration-300", className)}
    {...props}
  />
))
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ className, asChild = false, isActive, ...props }, ref) => {
    const { open } = useSidebar()
    return (
      <button
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cn(
          "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-300",
          !open && "justify-center",
          isActive && "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-y-0 left-0 w-[60px] bg-sidebar-rail border-r border-sidebar-rail-border transition-all duration-300",
        !open && "w-[0px]",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
}
