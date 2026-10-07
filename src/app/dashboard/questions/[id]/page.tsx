"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Globe, Lock, Paperclip, Sparkles, Users2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { useAppStore } from "@/lib/store";
import { resolveAnswer, getClusterSize } from "@/lib/question-helpers";
import { getKnowledgeById } from "@/data/knowledge";
import { formatDate, formatTimeRemaining } from "@/lib/format";

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

  const resolved = resolveAnswer(question, questions);
  const isAnonymous = resolved?.answer.visibility === "anonymous";
  const expertId = resolved?.answer.authorExpertId ?? question.expertId;
  const expert = experts.find((e) => e.id === expertId);
  // A question can carry both its own copy of an instantly-synthesized
  // answer *and* a clusterOf pointer (see askQuestion) — the clusterOf field
  // is always the reliable way to find sibling questions, direct answer or not.
  const clusterRepId = question.clusterOf ?? (resolved?.via === "cluster" ? resolved.representative.id : undefined);
  const clusterSize = clusterRepId ? getClusterSize(clusterRepId, questions) + 1 : 0;

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
          <StatusBadge status={resolved ? "answered" : question.status} />
          {question.target === "general" && (
            <Badge variant="outline">
              <Globe className="size-3" /> Asked to everyone
            </Badge>
          )}
          {question.privacy === "private" && (
            <Badge variant="outline">
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

        {clusterSize > 1 && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-muted">
            <Users2 className="size-3.5" /> {clusterSize} people asked something similar
          </p>
        )}

        {expert && !isAnonymous ? (
          <Link
            href={`/expert/${expert.id}`}
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-bg-elevated p-3 transition-colors hover:border-brand/40"
          >
            <Avatar name={expert.name} seed={expert.gradientSeed} size="sm" />
            <div>
              <p className="text-sm font-medium text-fg">{expert.name}</p>
              <p className="text-xs text-fg-subtle">{expert.headline}</p>
            </div>
          </Link>
        ) : (
          !resolved && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-fg-muted">
              <Clock className="size-4 shrink-0" /> Waiting for an Expert.
            </div>
          )
        )}

        {question.status === "waiting" && !resolved && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning">
            <Clock className="size-4 shrink-0" />
            {formatTimeRemaining(question.expiresAt)}
          </div>
        )}
      </Card>

      {resolved && (
        <>
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-fg">Answer</h2>
            <Card className="mt-3 p-6">
              {isAnonymous ? (
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-surface-hover text-fg-subtle">
                    <Lock className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg">Verified Expert</p>
                    <p className="text-xs text-fg-subtle">
                      {formatDate(resolved.answer.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                expert && (
                  <div className="flex items-center gap-3">
                    <Avatar name={expert.name} seed={expert.gradientSeed} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-fg">{expert.name}</p>
                      <p className="text-xs text-fg-subtle">
                        {formatDate(resolved.answer.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              )}

              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                {resolved.answer.text}
              </p>

              {(resolved.answer.generation === "assisted" ||
                resolved.answer.sourceKnowledgeIds.length > 0) && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-3 text-xs text-fg-subtle">
                  <Sparkles className="size-3.5 text-brand" />
                  {resolved.answer.generation === "assisted"
                    ? "Generated from Expert Knowledge"
                    : "Cited knowledge"}
                  {resolved.answer.sourceKnowledgeIds.length > 0 && (
                    <span>
                      &middot;{" "}
                      {resolved.answer.sourceKnowledgeIds
                        .map((kid) => getKnowledgeById(kid)?.title)
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </div>
              )}
            </Card>
          </div>
          <div className="mt-4">
            <AnswerFeedback questionId={question.id} />
          </div>
        </>
      )}
    </div>
  );
}
