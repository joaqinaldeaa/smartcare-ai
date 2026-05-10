"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({ className, variant = "rectangular", width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-full h-4",
        variant === "rectangular" && "rounded-xl",
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export { Skeleton };
