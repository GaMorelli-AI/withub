import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface PriceBadgeProps {
  price: number;
  label?: string;
  className?: string;
}

export function PriceBadge({ price, label = "Ask from", className }: PriceBadgeProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 text-sm", className)}>
      <span className="text-fg-muted">{label}</span>
      <span className="font-display font-semibold text-gradient-brand">
        {formatPrice(price)}
      </span>
    </span>
  );
}
