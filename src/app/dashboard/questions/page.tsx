"use client";

import { useState } from "react";
import { Clock, Inbox } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { MyQuestionRow } from "@/components/MyQuestionRow";
import { useAppStore } from "@/lib/store";
import { isEffectivelyAnswered } from "@/lib/question-helpers";

const TABS = [
  { value: "waiting", label: "Waiting" },
  { value: "answered", label: "Answered" },
  { value: "archived", label: "Archived" },
] as const;

export default function MyQuestionsPage() {
  const session = useAppStore((s) => s.session);
  const questions = useAppStore((s) => s.questions);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("waiting");

  const myQuestions = questions
    .filter((q) => q.askerId === session?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const grouped = {
    waiting: myQuestions.filter(
      (q) =>
        !isEffectivelyAnswered(q, questions) &&
        (q.status === "waiting" || q.status === "expired" || q.status === "declined")
    ),
    answered: myQuestions.filter((q) => isEffectivelyAnswered(q, questions)),
    archived: myQuestions.filter((q) => q.status === "archived"),
  };

  const list = grouped[tab];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">My Questions</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Every question you&apos;ve asked, in one place.
      </p>

      <Tabs
        items={TABS.map((t) => ({ ...t, count: grouped[t.value].length }))}
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        className="mt-6"
      />

      <div className="mt-5 flex flex-col gap-3">
        {list.length > 0 ? (
          list.map((q) => (
            <MyQuestionRow key={q.id} question={q} href={`/dashboard/questions/${q.id}`} />
          ))
        ) : (
          <EmptyState
            icon={tab === "waiting" ? Clock : Inbox}
            title={`No ${tab} questions`}
            description={
              tab === "waiting"
                ? "Questions you're waiting on will show up here."
                : `You don't have any ${tab} questions yet.`
            }
          />
        )}
      </div>
    </div>
  );
}
