"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Search as SearchIcon,
  Sun,
  User as UserIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useI18n, LOCALE_LABELS } from "@/lib/i18n";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Navbar() {
  const router = useRouter();
  const { t } = useI18n();
  const session = useAppStore((s) => s.session);
  const logout = useAppStore((s) => s.logout);
  const users = useAppStore((s) => s.users);
  const experts = useAppStore((s) => s.experts);
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/experts", label: t("nav.experts") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/polls", label: t("nav.polls") },
    { href: "/how-it-works", label: t("nav.howItWorks") },
    { href: "/signup/expert", label: t("nav.becomeExpert") },
  ];

  const profile =
    session?.type === "user"
      ? users.find((u) => u.id === session.id)
      : session?.type === "expert"
      ? experts.find((e) => e.id === session.id)
      : null;

  const myNotifications = session
    ? notifications
        .filter((n) => n.userType === session.type && n.ownerId === session.id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    : [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const dashboardHref = session?.type === "expert" ? "/expert-dashboard" : "/dashboard";

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-chrome-border bg-chrome-bg/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-chrome-fg-muted transition-colors hover:text-chrome-fg"
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

        <div className="ml-auto flex items-center gap-1.5">
          <button
            className="text-chrome-fg-muted md:hidden"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <SearchIcon className="size-5" />
          </button>

          <ThemeToggle />
          <LanguageToggle />

          {session ? (
            <>
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative flex size-9 items-center justify-center rounded-full text-chrome-fg-muted transition-colors hover:bg-chrome-surface-hover hover:text-chrome-fg"
                  aria-label={t("notif.title")}
                >
                  <Bell className="size-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
                  )}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-chrome-border bg-chrome-elevated p-2 shadow-2xl">
                      <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-chrome-fg-subtle">
                        {t("notif.title")}
                      </p>
                      <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
                        {myNotifications.length > 0 ? (
                          myNotifications.slice(0, 5).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={cn(
                                "flex flex-col gap-0.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-chrome-surface-hover",
                                !n.read && "bg-brand/5"
                              )}
                            >
                              <span className="text-xs text-chrome-fg">{n.text}</span>
                              <span className="text-[11px] text-chrome-fg-subtle">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-2 py-4 text-center text-xs text-chrome-fg-subtle">
                            {t("notif.empty")}
                          </p>
                        )}
                      </div>
                      <Link
                        href={
                          session.type === "expert" ? dashboardHref : "/dashboard/notifications"
                        }
                        onClick={() => setNotifOpen(false)}
                        className="mt-1 block rounded-lg px-2 py-1.5 text-center text-xs font-medium text-brand hover:bg-chrome-surface-hover"
                      >
                        {t("common.viewAll")}
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {session.type === "user" && (
                <Link
                  href="/ask"
                  className={cn(buttonVariants("primary", "sm"), "hidden sm:inline-flex")}
                >
                  {t("nav.askQuestion")}
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
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-chrome-border bg-chrome-elevated p-1.5 shadow-2xl">
                      <p className="truncate px-2.5 py-1.5 text-xs text-chrome-fg-subtle">
                        {profile?.name}
                      </p>
                      <Link
                        href={dashboardHref}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-chrome-fg hover:bg-chrome-surface-hover"
                      >
                        <LayoutDashboard className="size-4" /> {t("nav.dashboard")}
                      </Link>
                      <Link
                        href={`${dashboardHref}/profile`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-chrome-fg hover:bg-chrome-surface-hover"
                      >
                        <UserIcon className="size-4" /> {t("nav.profile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-danger hover:bg-danger/10"
                      >
                        <LogOut className="size-4" /> {t("nav.logout")}
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
                className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-chrome-fg-muted transition-colors hover:bg-chrome-surface-hover hover:text-chrome-fg sm:inline-flex"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full border border-chrome-border px-3.5 py-2 text-sm font-medium text-chrome-fg transition-colors hover:border-chrome-fg-subtle sm:inline-flex"
              >
                {t("nav.createAccount")}
              </Link>
              <Link href="/ask" className={buttonVariants("primary", "sm")}>
                {t("nav.askQuestion")}
              </Link>
            </>
          )}

          <button
            className="text-chrome-fg-muted lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-chrome-border p-3 md:hidden">
          <SearchBar variant="compact" autoFocus />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-chrome-border p-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-chrome-fg-muted hover:bg-chrome-surface-hover hover:text-chrome-fg"
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <div className="mt-2 flex gap-2 border-t border-chrome-border pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-full border border-chrome-border px-3.5 py-2 text-center text-sm font-medium text-chrome-fg"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants("primary", "sm"), "flex-1")}
              >
                {t("nav.createAccount")}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const order: Array<typeof mode> = ["dark", "light", "system"];
  const icons = { dark: Moon, light: Sun, system: Monitor };
  const Icon = icons[mode];

  function cycle() {
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
  }

  return (
    <button
      onClick={cycle}
      className="flex size-9 items-center justify-center rounded-full text-chrome-fg-muted transition-colors hover:bg-chrome-surface-hover hover:text-chrome-fg"
      aria-label={`Theme: ${mode}`}
      title={`Theme: ${mode}`}
    >
      <Icon className="size-[18px]" />
    </button>
  );
}

function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en-US" ? "pt-BR" : "en-US")}
      className="hidden h-9 items-center justify-center rounded-full px-2.5 text-xs font-semibold text-chrome-fg-muted transition-colors hover:bg-chrome-surface-hover hover:text-chrome-fg sm:flex"
      aria-label="Change language"
      title="Change language"
    >
      {LOCALE_LABELS[locale]}
    </button>
  );
}
