import { getInitials } from "@/lib/format";
import { cn } from "@/lib/cn";

const GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-teal-400 to-blue-600",
  "from-sky-400 to-cyan-600",
  "from-cyan-300 to-blue-600",
];

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-24 text-2xl",
};

interface AvatarProps {
  name: string;
  seed?: number;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}

export function Avatar({
  name,
  seed = 0,
  size = "md",
  className,
  ring = false,
}: AvatarProps) {
  const gradient = GRADIENTS[Math.abs(seed) % GRADIENTS.length];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-semibold text-bg",
        gradient,
        SIZES[size],
        ring && "ring-2 ring-bg ring-offset-2 ring-offset-bg",
        className
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
