"use client";

import Link from "next/link";
import { BookOpen, Inbox, Star, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { MyQuestionRow } from "@/components/MyQuestionRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";
import { getExpertAnalytics } from "@/lib/stats";
import { formatCompactNumber } from "@/lib/format";

export default function ExpertDashboardPage() {
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const questions = useAppStore((s) => s.questions);

  const expert = experts.find((e) => e.id === session?.id);

  if (!expert) return null;

  const analytics = getExpertAnalytics(expert.id, questions);

  const directed = questions.filter(
    (q) => q.expertId === expert.id && q.status === "waiting"
  );
  const domainGeneral = questions.filter(
    (q) =>
      q.target === "general" &&
      q.status === "waiting" &&
      !q.clusterOf &&
      !q.expertId &&
      expert.categorySlugs.includes(q.categorySlug)
  );
  const waiting = [...directed, ...domainGeneral].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">
        Welcome back, {expert.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Here&apos;s how your knowledge is performing.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Knowledge Items" value={`${analytics.knowledgeCount}`} accent />
        <StatCard icon={Users} label="Followers" value={formatCompactNumber(expert.followersCount)} />
        <StatCard icon={TrendingUp} label="Response Rate" value={`${expert.responseRate}%`} />
        <StatCard icon={Star} label="Rating" value={expert.rating.toFixed(1)} />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
            <Inbox className="size-4 text-brand" /> New questions
          </h2>
          <Link href="/expert-dashboard/questions" className="text-sm font-medium text-brand hover:underline">
            View inbox
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {waiting.length > 0 ? (
            waiting.slice(0, 4).map((q) => (
              <MyQuestionRow key={q.id} question={q} href={`/expert-dashboard/questions/${q.id}`} />
            ))
          ) : (
            <EmptyState
              icon={Inbox}
              title="Inbox zero"
              description="You're all caught up — no pending questions right now."
            />
          )}
        </div>
      </section>
    </div>
  );
}
