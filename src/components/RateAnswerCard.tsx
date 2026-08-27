"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export function RateAnswerCard() {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="p-5">
        <p className="text-sm text-fg-muted">Thanks for rating this answer!</p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-fg">Rate this answer</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                (hover || rating) >= n
                  ? "fill-warning text-warning"
                  : "text-fg-subtle"
              )}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <button
          onClick={() => {
            setSubmitted(true);
            toast("Thanks for your feedback!");
          }}
          className="mt-3 text-sm font-medium text-brand hover:underline"
        >
          Submit rating
        </button>
      )}
    </Card>
  );
}
