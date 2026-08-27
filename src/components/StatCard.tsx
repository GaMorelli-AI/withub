import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, hint, accent = false }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-fg-muted">{label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            accent ? "bg-brand/10 text-brand" : "bg-surface-hover text-fg-subtle"
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 font-display text-2xl font-semibold",
          accent ? "text-gradient-brand" : "text-fg"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </Card>
  );
}
