"use client";

import { useState } from "react";
import { Inbox as InboxIcon, XCircle } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { InboxQuestionCard } from "@/components/InboxQuestionCard";
import { MyQuestionRow } from "@/components/MyQuestionRow";
import { useAppStore } from "@/lib/store";

const TABS = [
  { value: "new", label: "New Questions" },
  { value: "declined", label: "Declined" },
] as const;

export default function ExpertInboxPage() {
  const session = useAppStore((s) => s.session);
  const questions = useAppStore((s) => s.questions);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("new");

  const mine = questions.filter((q) => q.expertId === session?.id);
  const waiting = mine
    .filter((q) => q.status === "waiting")
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
          { ...TABS[0], count: waiting.length },
          { ...TABS[1], count: declined.length },
        ]}
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        className="mt-6"
      />

      <div className="mt-5 flex flex-col gap-3">
        {tab === "new" ? (
          waiting.length > 0 ? (
            waiting.map((q) => <InboxQuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              icon={InboxIcon}
              title="Inbox zero"
              description="No new questions right now — check back soon."
            />
          )
        ) : declined.length > 0 ? (
          declined.map((q) => (
            <MyQuestionRow key={q.id} question={q} href={`/expert-dashboard/questions/${q.id}`} />
          ))
        ) : (
          <EmptyState
            icon={XCircle}
            title="No declined questions"
            description="Questions you decline will appear here."
          />
        )}
      </div>
    </div>
  );
}
