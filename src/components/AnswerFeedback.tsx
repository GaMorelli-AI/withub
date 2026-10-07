"use client";

import { useState } from "react";
import { Flag, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export function AnswerFeedback({ questionId }: { questionId: string }) {
  const toast = useToast();
  const [helpful, setHelpful] = useState<boolean | null>(null);

  return (
    <Card className="flex items-center justify-between p-4">
      <p className="text-sm text-fg-muted">Was this answer helpful?</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setHelpful(true);
            toast("Thanks for the feedback!");
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            helpful === true
              ? "border-brand bg-brand/10 text-brand"
              : "border-border text-fg-muted hover:border-border-hover"
          )}
        >
          <ThumbsUp className="size-3.5" /> Helpful
        </button>
        <button
          onClick={() => {
            toast(`Flagged answer for question ${questionId} for review.`, "info");
          }}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:border-danger/40 hover:text-danger"
        >
          <Flag className="size-3.5" /> Report
        </button>
      </div>
    </Card>
  );
}
