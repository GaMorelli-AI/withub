"use client";

import Link from "next/link";
import { ArrowRight, Clock, MessageSquareText, Sparkles } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { ExpertCard } from "@/components/ExpertCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PollCard } from "@/components/PollCard";
import { VisitorAskWidget } from "@/components/VisitorAskWidget";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";

export default function UserDashboardPage() {
  const session = useAppStore((s) => s.session);
  const questions = useAppStore((s) => s.questions);
  const experts = useAppStore((s) => s.experts);
  const users = useAppStore((s) => s.users);
  const polls = useAppStore((s) => s.polls);

  const user = session ? users.find((u) => u.id === session.id) : null;
  const myQuestions = questions.filter((q) => q.askerId === session?.id);
  const active = myQuestions
    .filter((q) => q.status === "waiting")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const answered = myQuestions
    .filter((q) => q.status === "answered")
    .sort((a, b) => (a.answer && b.answer ? (a.answer.createdAt < b.answer.createdAt ? 1 : -1) : 0))
    .slice(0, 3);

  const interestSlugs = user?.interests ?? [];

  const trendingQuestions = questions
    .filter(
      (q) =>
        q.status === "answered" &&
        q.privacy === "public" &&
        q.askerId !== session?.id &&
        interestSlugs.includes(q.categorySlug)
    )
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2);
  const trendingPoll = polls.find((p) => interestSlugs.includes(p.categorySlug));

  const recommended = experts
    .filter((e) => e.categorySlugs.some((c) => interestSlugs.includes(c)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  const exploreCategories = categories
    .filter((c) => interestSlugs.includes(c.slug))
    .slice(0, 4);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">
        Welcome back, {user?.name.split(" ")[0] ?? "there"}
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Here&apos;s what&apos;s happening in your interests.
      </p>

      <div className="mt-6">
        <VisitorAskWidget />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
            <Clock className="size-4 text-brand" /> Active questions
          </h2>
          <Link href="/dashboard/questions" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {active.length > 0 ? (
            active.slice(0, 4).map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              className="lg:col-span-2"
              icon={MessageSquareText}
              title="No active questions"
              description="Ask an expert something you've been wondering about."
              action={
                <Link href="/ask" className={buttonVariants("primary", "sm")}>
                  Ask a question
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-fg">
            Recently answered
          </h2>
          <Link href="/dashboard/questions" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {answered.length > 0 ? (
            answered.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              className="lg:col-span-2"
              icon={MessageSquareText}
              title="Nothing answered yet"
              description="Once an expert answers, it'll show up here."
            />
          )}
        </div>
      </section>

      {(trendingQuestions.length > 0 || trendingPoll) && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
            <Sparkles className="size-4 text-brand" /> Trending in your interests
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {trendingPoll && <PollCard poll={trendingPoll} />}
            {trendingQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-fg">
            Experts to follow
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </section>
      )}

      {exploreCategories.length > 0 && (
        <section className="mt-10 mb-4">
          <h2 className="font-display text-lg font-semibold text-fg">
            Explore topics
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {exploreCategories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      <Link href="/categories" className={cn(buttonVariants("outline", "sm"), "mt-2 inline-flex")}>
        Browse all categories <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
