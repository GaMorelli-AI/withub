import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2", className)}
      aria-label="WitHub home"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="withub-logo-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="#2ee6d6" />
            <stop offset="1" stopColor="#3e7bfa" />
          </linearGradient>
        </defs>
        <path
          d="M4 8 L11 8 L14 24 L18 12 L22 24 L25 8 L28 8 L23 27 L18.5 27 L16 19 L13.5 27 L9 27 Z"
          fill="url(#withub-logo-grad)"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-fg">
        Wit<span className="text-gradient-brand">Hub</span>
      </span>
    </Link>
  );
}
