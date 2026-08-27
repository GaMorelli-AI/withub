"use client";

import Link from "next/link";
import { Clock, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { getCategoryBySlug } from "@/data/categories";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, formatTimeRemaining } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Question } from "@/lib/types";

export function InboxQuestionCard({ question }: { question: Question }) {
  const toast = useToast();
  const declineQuestion = useAppStore((s) => s.declineQuestion);
  const users = useAppStore((s) => s.users);
  const asker = users.find((u) => u.id === question.askerId);
  const category = getCategoryBySlug(question.categorySlug);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Avatar name={asker?.name ?? "Anonymous"} seed={asker?.gradientSeed} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">
            {asker?.name ?? "Anonymous"}
          </p>
          <p className="truncate text-xs text-fg-subtle">
            {category?.name}
            {question.topic ? ` / ${question.topic}` : ""}
          </p>
        </div>
        <Badge variant="brand">{formatPrice(question.price)}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg">{question.text}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className={cn("flex items-center gap-1.5 text-xs", "text-fg-subtle")}>
          <Clock className="size-3.5" /> {formatTimeRemaining(question.expiresAt)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              declineQuestion(question.id);
              toast("Question declined.", "info");
            }}
          >
            <X className="size-3.5" /> Decline
          </Button>
          <Link
            href={`/expert-dashboard/questions/${question.id}`}
            className={buttonVariants("primary", "sm")}
          >
            Answer
          </Link>
        </div>
      </div>
    </Card>
  );
}
