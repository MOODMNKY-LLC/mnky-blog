import * as React from "react"
import { cn } from "@/lib/utils"

interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  heading?: string
  className?: string
  contentClassName?: string
}

export function CardContainer({
  children,
  heading,
  className,
  contentClassName,
  ...props
}: CardContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-muted/50 p-8 backdrop-blur-sm border border-primary/10",
        className
      )}
      {...props}
    >
      {heading && (
        <h2 className="text-2xl font-semibold mb-6 text-gradient-gold animate-text-shimmer inline-block">
          {heading}
        </h2>
      )}
      <div className={cn("glass rounded-lg", contentClassName)}>
        {children}
      </div>
    </div>
  )
}

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  className?: string
}

export function StatCard({ label, value, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg glass p-6 text-center transition-all hover:scale-[1.02] hover:glass-hover",
        className
      )}
      {...props}
    >
      <h3 className="font-medium text-muted-foreground tracking-wide uppercase text-sm">
        {label}
      </h3>
      <p className="text-4xl font-bold mt-3 text-gradient-gold animate-text-shimmer">
        {value}
      </p>
    </div>
  )
}

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
  action?: string
  className?: string
}

export function EmptyState({ message, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("text-center p-12", className)} {...props}>
      <p className="text-muted-foreground tracking-wide">
        {message}
      </p>
      {action && (
        <div className="mt-4 flex items-center gap-4 justify-center">
          <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
            {action}
          </span>
          <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      )}
    </div>
  )
} 