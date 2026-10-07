import Link from "next/link";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Globe, MessageSquareText, Vote } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { ExpertFilterGrid } from "@/components/ExpertFilterGrid";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { PollCard } from "@/components/PollCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getExpertsByCategory } from "@/data/experts";
import { getQuestionsByCategory } from "@/data/questions";
import { getKnowledgeByCategory } from "@/data/knowledge";
import { getPollsByCategory } from "@/data/polls";
import { getCategoryStats } from "@/lib/stats";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const Icon = (Icons[category.icon as keyof typeof Icons] ??
    Icons.Sparkles) as LucideIcon;
  const { expertsCount, questionsCount } = getCategoryStats(category.slug);
  const categoryExperts = getExpertsByCategory(category.slug).sort(
    (a, b) => b.rating - a.rating
  );
  const categoryQuestions = getQuestionsByCategory(category.slug).filter(
    (q) => q.privacy === "public"
  );
  const trending = categoryQuestions
    .filter((q) => q.status === "answered")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
  const unanswered = categoryQuestions.filter(
    (q) => q.target === "general" && q.status === "waiting" && !q.clusterOf && !q.expertId
  );
  const knowledge = getKnowledgeByCategory(category.slug)
    .filter((k) => k.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);
  const categoryPolls = getPollsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/15 to-brand-secondary/15 text-brand">
          <Icon className="size-7" strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">{category.description}</p>
          <p className="mt-2 text-xs text-fg-subtle">
            {expertsCount} Experts &middot; {questionsCount} Questions
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {category.topics.map((topic) => (
          <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`}>
            <Badge variant="outline" className="hover:border-brand/40 hover:text-brand">
              {topic}
            </Badge>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-fg">
          Trending questions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {trending.length > 0 ? (
            trending.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <EmptyState
              className="lg:col-span-2"
              icon={MessageSquareText}
              title="No public questions yet"
              description="Be the first to ask something in this category."
            />
          )}
        </div>
      </section>

      {unanswered.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-fg">
            <Globe className="size-4 text-brand" /> Unanswered questions
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            Asked to everyone — any expert in {category.name} can answer these.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {unanswered.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      )}

      {categoryPolls.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-fg">
            <Vote className="size-4 text-brand" /> Polls
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {categoryPolls.map((p) => (
              <PollCard key={p.id} poll={p} />
            ))}
          </div>
        </section>
      )}

      {knowledge.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-fg">
            <BookOpen className="size-4 text-brand" /> Popular knowledge
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {knowledge.map((k) => (
              <KnowledgeCard key={k.id} item={k} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-fg">
          Top experts in {category.name}
        </h2>
        <div className="mt-4">
          <ExpertFilterGrid experts={categoryExperts} />
        </div>
      </section>
    </div>
  );
}
