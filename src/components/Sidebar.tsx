"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({ items, header, footer }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" || href === "/expert-dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-border p-4 md:flex">
        {header}
        <nav className="mt-2 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                )}
              >
                <item.icon className="size-[18px]" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {footer}
      </aside>

      {/* Mobile top tab bar */}
      <nav className="sticky top-16 z-30 flex gap-1 overflow-x-auto border-b border-border bg-bg/90 px-3 py-2 backdrop-blur-lg md:hidden">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-brand/10 text-brand"
                  : "text-fg-muted hover:bg-surface-hover"
              )}
            >
              <item.icon className="size-3.5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
