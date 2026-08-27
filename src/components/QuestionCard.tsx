"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/cn";

interface QuestionCardProps {
  question: Question;
  showExpert?: boolean;
}

export function QuestionCard({ question, showExpert = true }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const experts = useAppStore((s) => s.experts);
  const users = useAppStore((s) => s.users);
  const expert = experts.find((e) => e.id === question.expertId);
  const asker = users.find((u) => u.id === question.askerId);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
        {question.topic && <Badge variant="outline">{question.topic}</Badge>}
        {question.privacy === "private" && (
          <Badge variant="brand">
            <Lock className="size-3" /> Premium content
          </Badge>
        )}
        <span className="ml-auto">{formatRelativeTime(question.createdAt)}</span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-fg">
        {question.text}
      </h3>

      {showExpert && expert && (
        <Link
          href={`/expert/${expert.id}`}
          className="mt-3 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-brand"
        >
          <Avatar name={expert.name} seed={expert.gradientSeed} size="xs" />
          Answered by {expert.name}
        </Link>
      )}

      {question.answer ? (
        <div className="mt-3">
          <p
            className={cn(
              "text-sm leading-relaxed text-fg-muted",
              !expanded && "line-clamp-2"
            )}
          >
            {question.answer.text}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            {expanded ? "Show less" : "View full answer"}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm italic text-fg-subtle">
          Not answered yet.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-fg-subtle">
        <span>{asker ? `Asked by ${asker.name}` : "Asked anonymously"}</span>
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3.5" />
          {question.likes}
        </span>
      </div>
    </Card>
  );
}
