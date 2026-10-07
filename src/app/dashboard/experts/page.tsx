"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { ExpertCard } from "@/components/ExpertCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { getUserById } from "@/data/users";

export default function FollowingExpertsPage() {
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);
  const experts = useAppStore((s) => s.experts);

  const currentUser = session ? users.find((u) => u.id === session.id) ?? getUserById(session.id) : null;
  const following = experts.filter((e) => currentUser?.followingExpertIds.includes(e.id));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Following</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Experts whose knowledge you follow.
      </p>

      <div className="mt-6">
        {following.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {following.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserPlus}
            title="You're not following any experts yet"
            description="Follow an expert's profile to see their answers and knowledge in your timeline."
            action={
              <Link href="/experts" className={buttonVariants("primary", "sm")}>
                Browse experts
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
