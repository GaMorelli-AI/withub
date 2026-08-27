import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/format";
import type { Question } from "@/lib/types";

export function MyQuestionRow({ question, href }: { question: Question; href: string }) {
  const experts = useAppStore((s) => s.experts);
  const expert = experts.find((e) => e.id === question.expertId);

  return (
    <Link href={href}>
      <Card interactive className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <Avatar name={expert?.name ?? "?"} seed={expert?.gradientSeed} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">{question.text}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            To {expert?.name ?? "Unknown expert"} &middot; {formatDate(question.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <StatusBadge status={question.status} />
          <span className="text-xs text-fg-subtle">{formatPrice(question.price)}</span>
        </div>
      </Card>
    </Link>
  );
}
