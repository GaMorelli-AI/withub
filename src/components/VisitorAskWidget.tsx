"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Users2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore, FREE_VISITOR_QUESTIONS } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { inferCategorySlug } from "@/lib/semantic";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";
import type { AskQuestionResult } from "@/lib/store";

const SUGGESTIONS = [
  "Artificial Intelligence",
  "Business",
  "Law",
  "Finance",
  "Marketing",
];

export function VisitorAskWidget() {
  const { t } = useI18n();
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const visitorQuestionsAsked = useAppStore((s) => s.visitorQuestionsAsked);
  const incrementVisitorQuestions = useAppStore((s) => s.incrementVisitorQuestions);
  const askQuestion = useAppStore((s) => s.askQuestion);

  const [text, setText] = useState("");
  const [result, setResult] = useState<AskQuestionResult | null>(null);

  const remaining = Math.max(0, FREE_VISITOR_QUESTIONS - visitorQuestionsAsked);
  const limitReached = !session && remaining <= 0;

  function handleSubmit() {
    if (!text.trim() || limitReached) return;
    const categorySlug = inferCategorySlug(text, categories);
    const res = askQuestion({
      askerId: session?.type === "user" ? session.id : null,
      target: "general",
      categorySlug,
      text: text.trim(),
      privacy: "public",
    });
    if (!session) incrementVisitorQuestions();
    setResult(res);
  }

  function reset() {
    setText("");
    setResult(null);
  }

  if (result) {
    return (
      <Card className="mx-auto max-w-2xl p-6 text-left">
        {result.instantAnswer ? (
          <>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-brand">
              <Sparkles className="size-3.5" /> Answer from WitHub knowledge
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {result.instantAnswer.text}
            </p>
            <p className="mt-3 text-xs text-fg-subtle">
              Based on knowledge from{" "}
              {result.instantAnswer.expertIds
                .map((id) => experts.find((e) => e.id === id)?.name)
                .filter(Boolean)
                .join(", ")}
            </p>
          </>
        ) : (
          <>
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Check className="size-5" />
            </span>
            <p className="mt-3 text-sm text-fg-muted">
              {result.joinedCluster
                ? `${result.similarCount} people asked something similar — your question is waiting for an Expert.`
                : "Your question is waiting for an Expert in this domain."}
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={reset} className={cn(buttonVariants("secondary", "sm"))}>
            Ask something else
          </button>
          {limitReached && (
            <Link href="/signup" className={cn(buttonVariants("primary", "sm"))}>
              {t("home.createAccountToContinue")}
            </Link>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border bg-surface px-6 transition-colors",
          limitReached ? "border-warning/40" : "border-border focus-within:border-brand/50"
        )}
      >
        <input
          value={text}
          disabled={limitReached}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={limitReached ? t("home.limitReached") : t("home.searchPlaceholder")}
          className="h-16 w-full bg-transparent text-lg text-fg placeholder:text-fg-subtle outline-none disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSubmit}
          disabled={limitReached || !text.trim()}
          aria-label="Ask"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-secondary text-bg disabled:opacity-40"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setText(`How does ${s.toLowerCase()} work for a small business?`)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-brand/40 hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>

      {!session && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
          <Users2 className="size-3.5" />
          {limitReached
            ? t("home.limitReached")
            : t("home.freeQuestionsRemaining", { count: remaining })}
        </p>
      )}
      {limitReached && (
        <div className="mt-3 flex justify-center">
          <Link href="/signup" className={cn(buttonVariants("primary", "sm"))}>
            {t("home.createAccountToContinue")}
          </Link>
        </div>
      )}
    </div>
  );
}
