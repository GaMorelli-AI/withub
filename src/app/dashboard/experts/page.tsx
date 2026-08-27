"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { ExpertCard } from "@/components/ExpertCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { getUserById } from "@/data/users";

export default function SavedExpertsPage() {
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);
  const experts = useAppStore((s) => s.experts);

  const currentUser = session ? users.find((u) => u.id === session.id) ?? getUserById(session.id) : null;
  const saved = experts.filter((e) => currentUser?.savedExpertIds.includes(e.id));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Saved Experts</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Experts you&apos;ve bookmarked to ask later.
      </p>

      <div className="mt-6">
        {saved.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No saved experts yet"
            description="Save an expert's profile to find them quickly later."
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
