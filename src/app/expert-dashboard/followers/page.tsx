"use client";

import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/format";

export default function FollowersPage() {
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);

  const followers = users.filter((u) => u.followingExpertIds.includes(session?.id ?? ""));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Followers</h1>
      <p className="mt-1 text-sm text-fg-muted">
        {followers.length} people following your knowledge.
      </p>

      <div className="mt-6">
        {followers.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {followers.map((u) => (
              <Card key={u.id} className="flex items-center gap-3 p-4">
                <Avatar name={u.name} seed={u.gradientSeed} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{u.name}</p>
                  <p className="text-xs text-fg-subtle">Member since {formatDate(u.joinedAt)}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No followers yet"
            description="Answer questions and publish knowledge to start growing your following."
          />
        )}
      </div>
    </div>
  );
}
