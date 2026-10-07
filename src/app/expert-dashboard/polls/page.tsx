"use client";

import { Vote } from "lucide-react";
import { PollCard } from "@/components/PollCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";

export default function ExpertPollsPage() {
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const polls = useAppStore((s) => s.polls);

  const expert = experts.find((e) => e.id === session?.id);
  const relevant = polls.filter((p) => expert?.categorySlugs.includes(p.categorySlug));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Polls</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Community polls in your domains — your vote counts as Expert Signal.
      </p>

      <div className="mt-6">
        {relevant.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relevant.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Vote}
            title="No polls in your domains yet"
            description="When a poll opens in one of your categories, it'll show up here."
          />
        )}
      </div>
    </div>
  );
}
