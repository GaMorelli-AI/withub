import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepIndicatorProps {
  steps: string[];
  current: number; // 0-based
  className?: string;
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-brand text-bg",
                  active &&
                    "bg-gradient-to-br from-brand to-brand-secondary text-bg",
                  !done && !active && "border border-border text-fg-subtle"
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  active ? "text-fg" : "text-fg-muted"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1",
                  done ? "bg-brand/50" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
