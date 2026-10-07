"use client";

import { TrendingDown, TrendingUp, Minus, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { getCategoryBySlug } from "@/data/categories";
import {
  optionCommunityPct,
  optionExpertPct,
  totalCommunityVotes,
  totalExpertVotes,
} from "@/data/polls";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Poll } from "@/lib/types";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };

export function PollCard({ poll }: { poll: Poll }) {
  const { t } = useI18n();
  const toast = useToast();
  const session = useAppStore((s) => s.session);
  const votedPolls = useAppStore((s) => s.votedPolls);
  const votePoll = useAppStore((s) => s.votePoll);

  const category = getCategoryBySlug(poll.categorySlug);
  const votedOptionId = votedPolls[poll.id];
  const hasVoted = Boolean(votedOptionId);
  const TrendIcon = TREND_ICON[poll.trend];
  const headline = poll.options[0];

  function handleVote(optionId: string) {
    if (!session) {
      toast("Sign in to vote in polls.", "info");
      return;
    }
    votePoll(poll.id, optionId);
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{category?.name}</Badge>
        <TrendIcon
          className={cn(
            "size-4",
            poll.trend === "up" && "text-positive",
            poll.trend === "down" && "text-danger",
            poll.trend === "flat" && "text-fg-subtle"
          )}
        />
      </div>

      <p className="mt-3 font-display text-base font-semibold leading-snug text-fg">
        {poll.question}
      </p>

      {!hasVoted ? (
        <div className="mt-4 flex flex-col gap-2">
          {poll.options.map((o) => (
            <button
              key={o.id}
              onClick={() => handleVote(o.id)}
              className="rounded-xl border border-border px-4 py-2.5 text-left text-sm font-medium text-fg-muted transition-colors hover:border-brand/40 hover:text-fg"
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {poll.options.map((o) => {
            const pct = optionCommunityPct(poll, o.id);
            const isMine = votedOptionId === o.id;
            return (
              <div key={o.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("flex items-center gap-1", isMine ? "text-fg" : "text-fg-muted")}>
                    {isMine && <Check className="size-3 text-brand" />}
                    {o.label}
                  </span>
                  <span className="text-fg-muted">{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-brand-secondary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <p className="text-[11px] uppercase tracking-wide text-fg-subtle">
            {t("poll.expertSignal")}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-fg">
            {optionExpertPct(poll, headline.id)}%
          </p>
          <p className="text-[11px] text-fg-subtle">
            {formatCompactNumber(totalExpertVotes(poll))} {t("poll.experts")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <p className="text-[11px] uppercase tracking-wide text-fg-subtle">
            {t("poll.communityPulse")}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-fg">
            {optionCommunityPct(poll, headline.id)}%
          </p>
          <p className="text-[11px] text-fg-subtle">
            {formatCompactNumber(totalCommunityVotes(poll))} {t("poll.communityVotes")}
          </p>
        </div>
      </div>
    </Card>
  );
}
