"use client";

import { BookOpen, Eye, MessageSquareText, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";
import { getExpertAnalytics } from "@/lib/stats";
import { getCategoryBySlug } from "@/data/categories";
import { formatCompactNumber } from "@/lib/format";

export default function KnowledgeAnalyticsPage() {
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const questions = useAppStore((s) => s.questions);
  const knowledge = useAppStore((s) => s.knowledge);

  const expert = experts.find((e) => e.id === session?.id);
  if (!expert) return null;

  const analytics = getExpertAnalytics(expert.id, questions);
  const myKnowledge = knowledge.filter((k) => k.expertId === expert.id);
  const topItems = [...myKnowledge].sort((a, b) => b.views - a.views).slice(0, 5);

  const answeredByDomain = questions
    .filter((q) => q.answer?.authorExpertId === expert.id)
    .reduce<Record<string, number>>((acc, q) => {
      acc[q.categorySlug] = (acc[q.categorySlug] ?? 0) + 1;
      return acc;
    }, {});
  const topDomains = Object.entries(answeredByDomain)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Knowledge Analytics</h1>
      <p className="mt-1 text-sm text-fg-muted">
        How your knowledge is being discovered and reused.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Eye} label="Knowledge Views" value={formatCompactNumber(analytics.knowledgeViews)} accent />
        <StatCard
          icon={MessageSquareText}
          label="Answers from Knowledge"
          value={`${analytics.questionsAnsweredWithKnowledge}`}
        />
        <StatCard icon={Users} label="Followers" value={formatCompactNumber(expert.followersCount)} />
        <StatCard icon={BookOpen} label="Knowledge Items" value={`${analytics.knowledgeCount}`} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-fg">Most useful knowledge</h2>
        {topItems.length > 0 ? (
          <Card className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-fg-subtle">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Access</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((k) => (
                  <tr key={k.id} className="border-b border-border last:border-0">
                    <td className="max-w-[280px] truncate px-4 py-3 text-fg">{k.title}</td>
                    <td className="px-4 py-3 text-fg-muted capitalize">{k.access}</td>
                    <td className="px-4 py-3 font-medium text-fg">{formatCompactNumber(k.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <EmptyState
            className="mt-3"
            icon={BookOpen}
            title="No knowledge published yet"
            description="Add knowledge to start showing up in searches and generated answers."
          />
        )}
      </section>

      <section className="mt-10 mb-4">
        <h2 className="font-display text-lg font-semibold text-fg">Top domains</h2>
        {topDomains.length > 0 ? (
          <div className="mt-3 flex flex-col gap-2">
            {topDomains.map(([slug, count]) => (
              <div
                key={slug}
                className="flex items-center justify-between rounded-xl border border-border bg-bg-elevated px-4 py-3"
              >
                <span className="text-sm text-fg">{getCategoryBySlug(slug)?.name ?? slug}</span>
                <span className="text-sm font-medium text-fg-muted">{count} answers</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-3"
            icon={MessageSquareText}
            title="No answers yet"
            description="Answer a question to see which domains you're most active in."
          />
        )}
      </section>
    </div>
  );
}
