"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-primary text-on-primary hover:bg-primary-hover active:scale-[0.97] shadow-md hover:shadow-lg",
  secondary: "bg-surface text-foreground border border-border hover:border-primary hover:bg-primary-light active:scale-[0.97]",
  accent: "bg-accent text-on-accent hover:bg-accent-hover active:scale-[0.97] shadow-md hover:shadow-lg",
  ghost: "text-foreground hover:bg-muted active:scale-[0.97]",
  destructive: "bg-error text-white hover:bg-error/90 active:scale-[0.97] shadow-md",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary active:scale-[0.97]",
  link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-11 px-5 py-2.5 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-8 text-base",
  icon: "h-11 w-11",
  "icon-sm": "h-9 w-9",
  "icon-lg": "h-12 w-12",
};

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/50",
          "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          buttonVariants[variant!],
          buttonSizes[size!],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, buttonSizes };
export type { ButtonProps, ButtonVariant, ButtonSize };
