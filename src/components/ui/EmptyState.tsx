import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-hover text-fg-subtle">
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-display text-base font-medium text-fg">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
