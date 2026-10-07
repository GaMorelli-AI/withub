"use client";

import { useState } from "react";
import { Globe2, Inbox as InboxIcon, XCircle } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { InboxQuestionCard } from "@/components/InboxQuestionCard";
import { MyQuestionRow } from "@/components/MyQuestionRow";
import { useAppStore } from "@/lib/store";

const TABS = [
  { value: "directed", label: "Directed to you" },
  { value: "unanswered", label: "Unanswered in your domains" },
  { value: "declined", label: "Declined" },
] as const;

export default function ExpertInboxPage() {
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const questions = useAppStore((s) => s.questions);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("directed");

  const expert = experts.find((e) => e.id === session?.id);
  const mine = questions.filter((q) => q.expertId === session?.id);

  const directed = mine
    .filter((q) => q.status === "waiting")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const unanswered = questions
    .filter(
      (q) =>
        q.target === "general" &&
        q.status === "waiting" &&
        !q.clusterOf &&
        !q.expertId &&
        expert?.categorySlugs.includes(q.categorySlug)
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const declined = mine.filter((q) => q.status === "declined");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Questions</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Answer within 48 hours to keep your response rate high.
      </p>

      <Tabs
        items={[
          { ...TABS[0], count: directed.length },
          { ...TABS[1], count: unanswered.length },
          { ...TABS[2], count: declined.length },
        ]}
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        className="mt-6"
      />

      <div className="mt-5 flex flex-col gap-3">
        {tab === "directed" &&
          (directed.length > 0 ? (
            directed.map((q) => <InboxQuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              icon={InboxIcon}
              title="Inbox zero"
              description="No new questions right now — check back soon."
            />
          ))}

        {tab === "unanswered" &&
          (unanswered.length > 0 ? (
            unanswered.map((q) => <InboxQuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              icon={Globe2}
              title="Nothing waiting in your domains"
              description="Questions asked to the whole community in your categories show up here."
            />
          ))}

        {tab === "declined" &&
          (declined.length > 0 ? (
            declined.map((q) => (
              <MyQuestionRow key={q.id} question={q} href={`/expert-dashboard/questions/${q.id}`} />
            ))
          ) : (
            <EmptyState
              icon={XCircle}
              title="No declined questions"
              description="Questions you decline will appear here."
            />
          ))}
      </div>
    </div>
  );
}
