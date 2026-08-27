import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { QuestionStatus } from "@/lib/types";

const CONFIG: Record<QuestionStatus, { label: string; variant: BadgeVariant }> = {
  waiting: { label: "Waiting for answer", variant: "warning" },
  answered: { label: "Answered", variant: "success" },
  archived: { label: "Archived", variant: "neutral" },
  expired: { label: "Expired", variant: "danger" },
  declined: { label: "Declined", variant: "danger" },
};

export function StatusBadge({ status }: { status: QuestionStatus }) {
  const { label, variant } = CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
