import Link from "next/link";
import { MessageSquareText, TrendingUp, BadgeCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { buttonVariants } from "@/components/ui/Button";
import { Rating } from "@/components/Rating";
import { formatCompactNumber } from "@/lib/format";
import type { Expert } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <Card interactive className="flex flex-col p-5">
      <Link
        href={`/expert/${expert.id}`}
        className="flex flex-col gap-3"
      >
        <div className="flex items-start gap-3">
          <Avatar name={expert.name} seed={expert.gradientSeed} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-base font-semibold text-fg">
                {expert.name}
              </h3>
              {expert.verification === "verified" && (
                <BadgeCheck className="size-4 shrink-0 text-brand" />
              )}
            </div>
            <p className="truncate text-sm text-fg-muted">{expert.headline}</p>
            {expert.company && (
              <p className="truncate text-xs text-fg-subtle">{expert.company}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {expert.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[11px] text-fg-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-muted">
          <Rating value={expert.rating} />
          <span className="inline-flex items-center gap-1">
            <MessageSquareText className="size-3.5" />
            {expert.answersCount} answers
          </span>
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="size-3.5" />
            {expert.responseRate}% response rate
          </span>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
          <Users className="size-3.5" />
          {formatCompactNumber(expert.followersCount)} followers
        </span>
        <Link
          href={`/expert/${expert.id}`}
          className={cn(buttonVariants("secondary", "sm"))}
        >
          View profile
        </Link>
      </div>
    </Card>
  );
}
