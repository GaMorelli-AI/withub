"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lock, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { RateAnswerCard } from "@/components/RateAnswerCard";
import { useAppStore } from "@/lib/store";
import { formatDate, formatPrice, formatTimeRemaining } from "@/lib/format";

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const questions = useAppStore((s) => s.questions);
  const experts = useAppStore((s) => s.experts);

  const question = questions.find((q) => q.id === id);
  if (!question) notFound();
  const expert = experts.find((e) => e.id === question.expertId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/questions"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Back to my questions
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={question.status} />
          {question.privacy === "private" && (
            <Badge variant="brand">
              <Lock className="size-3" /> Private
            </Badge>
          )}
          <span className="ml-auto text-xs text-fg-subtle">
            {formatDate(question.createdAt)}
          </span>
        </div>

        <h1 className="mt-4 font-display text-xl font-semibold text-fg">
          {question.text}
        </h1>
        {question.details && (
          <p className="mt-2 text-sm text-fg-muted">{question.details}</p>
        )}
        {question.attachments && question.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {question.attachments.map((a, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-fg-muted"
              >
                <Paperclip className="size-3" /> {a}
              </span>
            ))}
          </div>
        )}

        {expert && (
          <Link
            href={`/expert/${expert.id}`}
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-bg-elevated p-3 transition-colors hover:border-brand/40"
          >
            <Avatar name={expert.name} seed={expert.gradientSeed} size="sm" />
            <div>
              <p className="text-sm font-medium text-fg">{expert.name}</p>
              <p className="text-xs text-fg-subtle">{expert.headline}</p>
            </div>
            <span className="ml-auto text-xs font-medium text-fg-muted">
              {formatPrice(question.price)} paid
            </span>
          </Link>
        )}

        {question.status === "waiting" && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning">
            <Clock className="size-4 shrink-0" />
            {formatTimeRemaining(question.expiresAt)}
          </div>
        )}
      </Card>

      {question.answer && (
        <>
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-fg">Answer</h2>
            <Card className="mt-3 p-6">
              {expert && (
                <div className="flex items-center gap-3">
                  <Avatar name={expert.name} seed={expert.gradientSeed} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-fg">{expert.name}</p>
                    <p className="text-xs text-fg-subtle">
                      {formatDate(question.answer.createdAt)}
                    </p>
                  </div>
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                {question.answer.text}
              </p>
            </Card>
          </div>
          <div className="mt-4">
            <RateAnswerCard />
          </div>
        </>
      )}
    </div>
  );
}
