import type { AppNotification } from "@/lib/types";

export const notifications: AppNotification[] = [
  {
    id: "notif-001",
    userType: "user",
    ownerId: "usr-lucas-estevam",
    type: "answer",
    text: "Isabela Ramos answered your question about calorie deficits.",
    read: true,
    createdAt: "2026-04-03T09:45:00.000Z",
  },
  {
    id: "notif-002",
    userType: "user",
    ownerId: "usr-lucas-estevam",
    type: "answer",
    text: "Ahmed Al-Farsi answered your private question about cap tables.",
    read: true,
    createdAt: "2026-07-16T12:00:00.000Z",
  },
  {
    id: "notif-003",
    userType: "user",
    ownerId: "usr-lucas-estevam",
    type: "answer",
    text: "Priya Nathan answered your question about AI agent ROI.",
    read: false,
    createdAt: "2026-07-23T14:00:00.000Z",
  },
  {
    id: "notif-004",
    userType: "user",
    ownerId: "usr-lucas-estevam",
    type: "reminder",
    text: "Your question to Sarah Mason is still waiting for a response.",
    read: false,
    createdAt: "2026-08-24T20:00:00.000Z",
  },
  {
    id: "notif-005",
    userType: "user",
    ownerId: "usr-lucas-estevam",
    type: "system",
    text: "Welcome to WitHub — start by exploring experts in your interests.",
    read: true,
    createdAt: "2024-05-11T10:00:00.000Z",
  },
  {
    id: "notif-006",
    userType: "expert",
    ownerId: "exp-sarah-mason",
    type: "reminder",
    text: "You have a new question from Lucas Estevam waiting for an answer.",
    read: false,
    createdAt: "2026-08-24T08:05:00.000Z",
  },
  {
    id: "notif-007",
    userType: "expert",
    ownerId: "exp-sarah-mason",
    type: "follower",
    text: "You gained 12 new followers this week.",
    read: false,
    createdAt: "2026-08-22T09:00:00.000Z",
  },
  {
    id: "notif-008",
    userType: "expert",
    ownerId: "exp-sarah-mason",
    type: "system",
    text: "Your response rate is in the top 5% of experts on WitHub this month.",
    read: true,
    createdAt: "2026-08-10T09:00:00.000Z",
  },
  {
    id: "notif-009",
    userType: "expert",
    ownerId: "exp-sarah-mason",
    type: "answer",
    text: "Your answer to Marina Costa was marked helpful.",
    read: true,
    createdAt: "2026-06-04T10:05:00.000Z",
  },
];

export function getNotifications(
  userType: "user" | "expert",
  ownerId: string
): AppNotification[] {
  return notifications
    .filter((n) => n.userType === userType && n.ownerId === ownerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
