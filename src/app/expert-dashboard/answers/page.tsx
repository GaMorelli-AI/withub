"use client";

import { MessageSquareText } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";

export default function ExpertAnswersPage() {
  const session = useAppStore((s) => s.session);
  const questions = useAppStore((s) => s.questions);

  const answered = questions
    .filter((q) => q.expertId === session?.id && q.status === "answered")
    .sort((a, b) => (a.answer!.createdAt < b.answer!.createdAt ? 1 : -1));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Answers</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Everything you&apos;ve answered so far ({answered.length}).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {answered.length > 0 ? (
          answered.map((q) => <QuestionCard key={q.id} question={q} showExpert={false} />)
        ) : (
          <EmptyState
            className="lg:col-span-2"
            icon={MessageSquareText}
            title="No answers yet"
            description="Answered questions will show up here as a public track record."
          />
        )}
      </div>
    </div>
  );
}
