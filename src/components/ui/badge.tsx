"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", pulse = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
        // Size
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        // Variant
        variant === "default" && "bg-primary/10 text-primary border border-primary/20",
        variant === "success" && "bg-success-bg text-success border border-success/20",
        variant === "warning" && "bg-warning-bg text-warning border border-warning/20",
        variant === "error" && "bg-error-bg text-error border border-error/20",
        variant === "info" && "bg-info-bg text-info border border-info/20",
        variant === "outline" && "bg-transparent text-foreground border border-border",
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge };