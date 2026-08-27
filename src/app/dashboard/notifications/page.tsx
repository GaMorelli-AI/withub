"use client";

import { Bell, CheckCheck, MessageSquareText, UserPlus, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  answer: MessageSquareText,
  follower: UserPlus,
  reminder: Bell,
  system: Info,
};

export default function NotificationsPage() {
  const session = useAppStore((s) => s.session);
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);

  const mine = notifications
    .filter((n) => n.userType === "user" && n.ownerId === session?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const unreadCount = mine.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Notifications</h1>
          <p className="mt-1 text-sm text-fg-muted">Stay on top of your questions and answers.</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => session && markAllNotificationsRead("user", session.id)}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {mine.length > 0 ? (
          mine.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <Card
                key={n.id}
                interactive
                onClick={() => markNotificationRead(n.id)}
                className={cn("flex cursor-pointer items-start gap-3 p-4", !n.read && "border-brand/30")}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    n.read ? "bg-surface-hover text-fg-subtle" : "bg-brand/10 text-brand"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", n.read ? "text-fg-muted" : "text-fg")}>{n.text}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />}
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="We'll let you know when there's something new."
          />
        )}
      </div>
    </div>
  );
}
