import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface RatingProps {
  value: number;
  size?: "sm" | "md";
  className?: string;
  showValue?: boolean;
}

export function Rating({ value, size = "sm", className, showValue = true }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star
        className={cn(
          "fill-warning text-warning",
          size === "sm" ? "size-3.5" : "size-4"
        )}
      />
      {showValue && (
        <span
          className={cn(
            "font-medium text-fg",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
