"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Globe, Paperclip, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { getCategoryBySlug } from "@/data/categories";
import { getKnowledgeByExpert } from "@/data/knowledge";
import { formatDate, formatTimeRemaining } from "@/lib/format";

export default function AnswerQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const toast = useToast();
  const session = useAppStore((s) => s.session);
  const questions = useAppStore((s) => s.questions);
  const users = useAppStore((s) => s.users);
  const answerQuestion = useAppStore((s) => s.answerQuestion);

  const question = questions.find((q) => q.id === id);
  const [answer, setAnswer] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sourceIds, setSourceIds] = useState<string[]>([]);

  if (!question) notFound();

  const asker = question.askerId ? users.find((u) => u.id === question.askerId) : null;
  const category = getCategoryBySlug(question.categorySlug);
  const myKnowledge = session?.type === "expert" ? getKnowledgeByExpert(session.id) : [];
  const relevantKnowledge = myKnowledge.filter(
    (k) => k.categorySlug === question.categorySlug
  );

  function toggleSource(kid: string) {
    setSourceIds((prev) =>
      prev.includes(kid) ? prev.filter((id) => id !== kid) : [...prev, kid]
    );
  }

  function handleSend() {
    if (!question || answer.trim().length < 10) return;
    answerQuestion(question.id, answer.trim(), {
      visibility: anonymous ? "anonymous" : "named",
      sourceKnowledgeIds: sourceIds,
    });
    toast("Answer successfully published.");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/expert-dashboard/questions"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Back to inbox
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={question.status} />
          <Badge variant="outline">{category?.name}</Badge>
          {question.target === "general" && (
            <Badge variant="outline">
              <Globe className="size-3" /> Everyone
            </Badge>
          )}
          <span className="ml-auto text-xs text-fg-subtle">
            {formatDate(question.createdAt)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Avatar name={asker?.name ?? "Anonymous"} seed={asker?.gradientSeed} size="sm" />
          <div>
            <p className="text-sm font-medium text-fg">{asker?.name ?? "Anonymous visitor"}</p>
          </div>
        </div>

        <h1 className="mt-4 font-display text-lg font-semibold text-fg">
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

        {question.status === "waiting" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning">
            <Clock className="size-4 shrink-0" />
            {formatTimeRemaining(question.expiresAt)}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <h2 className="font-display text-lg font-semibold text-fg">
          {question.answer ? "Your answer" : "Write your answer"}
        </h2>
        <Card className="mt-3 p-6">
          {question.answer ? (
            <p className="text-sm leading-relaxed text-fg-muted">{question.answer.text}</p>
          ) : question.status === "waiting" ? (
            <>
              <Textarea
                rows={8}
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer..."
              />

              {relevantKnowledge.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-fg-muted">
                    Cite your knowledge (optional)
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {relevantKnowledge.map((k) => (
                      <label
                        key={k.id}
                        className="flex items-center gap-2 text-sm text-fg-muted"
                      >
                        <Checkbox
                          checked={sourceIds.includes(k.id)}
                          onChange={() => toggleSource(k.id)}
                        />
                        {k.title}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <label className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
                <Checkbox
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Answer anonymously — shown publicly as &ldquo;Verified Expert&rdquo;
              </label>

              <div className="mt-4 flex items-center justify-end">
                <Button onClick={handleSend} disabled={answer.trim().length < 10}>
                  <Send className="size-4" /> Send answer
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-fg-subtle">
              This question is {question.status} and can no longer be answered.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
