import type { EarningsTransaction } from "@/lib/types";
import { questions } from "@/data/questions";
import { getUserById } from "@/data/users";

// Earnings are derived from answered questions so the seed data can never
// drift out of sync with the questions/answers it's describing.
export const earnings: EarningsTransaction[] = questions
  .filter((q) => q.status === "answered" && q.answer)
  .map((q) => ({
    id: `earn-${q.id}`,
    expertId: q.expertId,
    questionId: q.id,
    userName: getUserById(q.askerId)?.name ?? "Anonymous",
    questionText: q.text,
    amount: q.expertEarnings,
    status: "paid" as const,
    date: q.answer!.createdAt,
  }));

export function getEarningsByExpert(expertId: string): EarningsTransaction[] {
  return earnings
    .filter((e) => e.expertId === expertId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
