import type { Poll } from "@/lib/types";

function pct(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((votes / total) * 100);
}

export function optionExpertPct(poll: Poll, optionId: string): number {
  const total = poll.options.reduce((s, o) => s + o.expertVotes, 0);
  const option = poll.options.find((o) => o.id === optionId);
  return option ? pct(option.expertVotes, total) : 0;
}

export function optionCommunityPct(poll: Poll, optionId: string): number {
  const total = poll.options.reduce((s, o) => s + o.communityVotes, 0);
  const option = poll.options.find((o) => o.id === optionId);
  return option ? pct(option.communityVotes, total) : 0;
}

export function totalExpertVotes(poll: Poll): number {
  return poll.options.reduce((s, o) => s + o.expertVotes, 0);
}

export function totalCommunityVotes(poll: Poll): number {
  return poll.options.reduce((s, o) => s + o.communityVotes, 0);
}

export function leadingOption(poll: Poll) {
  return [...poll.options].sort((a, b) => b.communityVotes - a.communityVotes)[0];
}

export const polls: Poll[] = [
  {
    id: "poll-001",
    categorySlug: "artificial-intelligence",
    question: "Will AI agents become the primary interface for enterprise software by 2030?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 88, communityVotes: 2230 },
      { id: "no", label: "No", expertVotes: 36, communityVotes: 1252 },
    ],
    trend: "up",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "poll-002",
    categorySlug: "artificial-intelligence",
    question: "Which AI coding assistant will be most used by professional developers in 2027?",
    options: [
      { id: "claude", label: "Claude", expertVotes: 61, communityVotes: 1480 },
      { id: "chatgpt", label: "ChatGPT / Codex", expertVotes: 34, communityVotes: 1120 },
      { id: "gemini", label: "Gemini", expertVotes: 14, communityVotes: 402 },
      { id: "other", label: "Something else", expertVotes: 9, communityVotes: 210 },
    ],
    trend: "flat",
    createdAt: "2026-07-18T09:00:00.000Z",
  },
  {
    id: "poll-003",
    categorySlug: "business",
    question: "Will remote work keep declining through 2027?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 42, communityVotes: 2140 },
      { id: "no", label: "No", expertVotes: 49, communityVotes: 1005 },
    ],
    trend: "down",
    createdAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "poll-004",
    categorySlug: "finance",
    question: "Will the Federal Reserve cut interest rates again before the end of the year?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 57, communityVotes: 1890 },
      { id: "no", label: "No", expertVotes: 31, communityVotes: 940 },
    ],
    trend: "up",
    createdAt: "2026-09-05T09:00:00.000Z",
  },
  {
    id: "poll-005",
    categorySlug: "health",
    question: "Is intermittent fasting more effective than simple calorie counting for fat loss?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 19, communityVotes: 1610 },
      { id: "no", label: "No", expertVotes: 44, communityVotes: 980 },
    ],
    trend: "flat",
    createdAt: "2026-05-22T09:00:00.000Z",
  },
  {
    id: "poll-006",
    categorySlug: "career",
    question: "Will a 4-day work week become standard across the tech industry by 2030?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 28, communityVotes: 2760 },
      { id: "no", label: "No", expertVotes: 33, communityVotes: 890 },
    ],
    trend: "up",
    createdAt: "2026-08-28T09:00:00.000Z",
  },
  {
    id: "poll-007",
    categorySlug: "sports",
    question: "Can an AI-generated training plan outperform a human coach for amateur athletes?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 22, communityVotes: 640 },
      { id: "no", label: "No", expertVotes: 51, communityVotes: 1120 },
    ],
    trend: "flat",
    createdAt: "2026-07-02T09:00:00.000Z",
  },
  {
    id: "poll-008",
    categorySlug: "travel",
    question: "Will points and miles programs get noticeably less valuable over the next 5 years?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 40, communityVotes: 1330 },
      { id: "no", label: "No", expertVotes: 18, communityVotes: 705 },
    ],
    trend: "up",
    createdAt: "2026-06-30T09:00:00.000Z",
  },
  {
    id: "poll-009",
    categorySlug: "entertainment",
    question: "Will streaming services bring back cable-style bundles by 2027?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 34, communityVotes: 1875 },
      { id: "no", label: "No", expertVotes: 21, communityVotes: 860 },
    ],
    trend: "up",
    createdAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "poll-010",
    categorySlug: "entrepreneurship",
    question: "Is it still realistic to bootstrap a SaaS to $1M ARR without raising outside money?",
    options: [
      { id: "yes", label: "Yes", expertVotes: 46, communityVotes: 1540 },
      { id: "no", label: "No", expertVotes: 24, communityVotes: 705 },
    ],
    trend: "flat",
    createdAt: "2026-05-14T09:00:00.000Z",
  },
];

export function getPollById(id: string): Poll | undefined {
  return polls.find((p) => p.id === id);
}

export function getPollsByCategory(categorySlug: string): Poll[] {
  return polls.filter((p) => p.categorySlug === categorySlug);
}
