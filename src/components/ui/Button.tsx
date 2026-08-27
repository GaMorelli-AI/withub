import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand to-brand-secondary text-bg shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_0_24px_-4px_rgba(46,230,214,0.5)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-surface text-fg border border-border hover:border-border-hover hover:bg-surface-hover",
  outline:
    "border border-brand/40 text-brand hover:bg-brand/10 hover:border-brand",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-hover",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function buttonVariants(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants(variant, size, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
