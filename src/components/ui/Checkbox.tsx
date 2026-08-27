import { type InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer appearance-none rounded-md border border-border bg-bg-elevated transition-colors checked:border-brand checked:bg-brand",
        className
      )}
      {...props}
    />
    <Check className="pointer-events-none absolute size-3 scale-0 text-bg transition-transform peer-checked:scale-100" />
  </span>
));
Checkbox.displayName = "Checkbox";
