import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "outline";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-hover text-fg-muted border border-border",
  brand: "bg-brand/10 text-brand border border-brand/30",
  success: "bg-positive/10 text-positive border border-positive/25",
  warning: "bg-warning/10 text-warning border border-warning/25",
  danger: "bg-danger/10 text-danger border border-danger/25",
  outline: "border border-border text-fg-muted",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
