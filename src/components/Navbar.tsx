"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Search as SearchIcon,
  User as UserIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/experts", label: "Experts" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/signup/expert", label: "Become an Expert" },
];

export function Navbar() {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const logout = useAppStore((s) => s.logout);
  const users = useAppStore((s) => s.users);
  const experts = useAppStore((s) => s.experts);
  const notifications = useAppStore((s) => s.notifications);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const profile =
    session?.type === "user"
      ? users.find((u) => u.id === session.id)
      : session?.type === "expert"
      ? experts.find((e) => e.id === session.id)
      : null;

  const unreadCount = session
    ? notifications.filter(
        (n) => n.userType === session.type && n.ownerId === session.id && !n.read
      ).length
    : 0;

  const dashboardHref = session?.type === "expert" ? "/expert-dashboard" : "/dashboard";
  const notificationsHref =
    session?.type === "expert" ? "/expert-dashboard" : "/dashboard/notifications";

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {session && (
          <div className="hidden flex-1 md:block lg:max-w-xs">
            <SearchBar variant="compact" />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            className="text-fg-muted md:hidden"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <SearchIcon className="size-5" />
          </button>

          {session ? (
            <>
              <Link
                href={notificationsHref}
                className="relative hidden size-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg sm:flex"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
                )}
              </Link>

              {session.type === "user" && (
                <Link
                  href="/ask"
                  className={cn(buttonVariants("primary", "sm"), "hidden sm:inline-flex")}
                >
                  Ask a question
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1"
                >
                  <Avatar
                    name={profile?.name ?? "?"}
                    seed={profile?.gradientSeed}
                    size="sm"
                  />
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-bg-elevated p-1.5 shadow-2xl">
                      <p className="truncate px-2.5 py-1.5 text-xs text-fg-subtle">
                        {profile?.name}
                      </p>
                      <Link
                        href={dashboardHref}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-fg hover:bg-surface-hover"
                      >
                        <LayoutDashboard className="size-4" /> Dashboard
                      </Link>
                      <Link
                        href={`${dashboardHref}/profile`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-fg hover:bg-surface-hover"
                      >
                        <UserIcon className="size-4" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-danger hover:bg-danger/10"
                      >
                        <LogOut className="size-4" /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants("ghost", "sm"), "hidden sm:inline-flex")}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants("secondary", "sm"), "hidden sm:inline-flex")}
              >
                Create account
              </Link>
              <Link href="/ask" className={buttonVariants("primary", "sm")}>
                Ask a question
              </Link>
            </>
          )}

          <button
            className="text-fg-muted lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border p-3 md:hidden">
          <SearchBar variant="compact" autoFocus />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border p-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:bg-surface-hover hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants("secondary", "sm"), "flex-1")}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants("primary", "sm"), "flex-1")}
              >
                Create account
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
