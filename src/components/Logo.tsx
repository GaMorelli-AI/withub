import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center", className)}
      aria-label="WitHub home"
    >
      <Image
        src="/logo.svg"
        alt="WitHub"
        width={145}
        height={90}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
