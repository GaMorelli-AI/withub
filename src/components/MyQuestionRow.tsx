import Link from "next/link";
import { Globe } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import { resolveAnswer } from "@/lib/question-helpers";
import { formatDate } from "@/lib/format";
import type { Question } from "@/lib/types";

export function MyQuestionRow({ question, href }: { question: Question; href: string }) {
  const experts = useAppStore((s) => s.experts);
  const allQuestions = useAppStore((s) => s.questions);

  const resolved = resolveAnswer(question, allQuestions);
  const isAnonymousAnswer = resolved?.answer.visibility === "anonymous";
  const expertId = resolved?.answer.authorExpertId ?? question.expertId;
  const expert = experts.find((e) => e.id === expertId);
  const effectiveStatus = resolved ? "answered" : question.status;

  return (
    <Link href={href}>
      <Card interactive className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        {expert && !isAnonymousAnswer ? (
          <Avatar name={expert.name} seed={expert.gradientSeed} size="md" />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-hover text-fg-subtle">
            <Globe className="size-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">{question.text}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {expert && !isAnonymousAnswer
              ? `To ${expert.name}`
              : question.target === "general"
              ? "Asked to everyone"
              : "Waiting for an expert"}{" "}
            &middot; {formatDate(question.createdAt)}
          </p>
        </div>
        <StatusBadge status={effectiveStatus} />
      </Card>
    </Link>
  );
}
