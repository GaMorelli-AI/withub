import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-brand/60",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
