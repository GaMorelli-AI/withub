"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Globe2,
  MapPin,
  MessageSquareText,
  Star,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import { LinkedinIcon } from "@/components/icons/SocialIcons";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { buttonVariants } from "@/components/ui/Button";
import { QuestionCard } from "@/components/QuestionCard";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { PollCard } from "@/components/PollCard";
import { FollowExpertButton } from "@/components/FollowExpertButton";
import { useAppStore } from "@/lib/store";
import { categories } from "@/data/categories";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

const TABS = [
  { value: "knowledge", label: "Knowledge" },
  { value: "answers", label: "Answers" },
  { value: "polls", label: "Polls" },
  { value: "about", label: "About" },
] as const;

export default function ExpertProfileClient({ expertId }: { expertId: string }) {
  const experts = useAppStore((s) => s.experts);
  const questions = useAppStore((s) => s.questions);
  const knowledge = useAppStore((s) => s.knowledge);
  const polls = useAppStore((s) => s.polls);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("knowledge");

  const expert = experts.find((e) => e.id === expertId);
  if (!expert) return null;

  const answers = questions.filter(
    (q) => q.answer?.authorExpertId === expert.id && q.answer.visibility !== "anonymous" && q.privacy === "public"
  );
  const myKnowledge = knowledge.filter((k) => k.expertId === expert.id && k.status === "published");
  const myPolls = polls.filter((p) => expert.categorySlugs.includes(p.categorySlug));
  const expertCategories = categories.filter((c) => expert.categorySlugs.includes(c.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Card className="overflow-hidden p-0">
        <div className="h-32 bg-profile-banner sm:h-44" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar
                name={expert.name}
                seed={expert.gradientSeed}
                size="xl"
                className="ring-4 ring-surface"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                    {expert.name}
                  </h1>
                  {expert.verification === "verified" ? (
                    <Badge variant="brand">
                      <BadgeCheck className="size-3.5" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning">Verification pending</Badge>
                  )}
                </div>
                <p className="mt-1 text-base text-fg-muted">{expert.headline}</p>
                {expert.company && (
                  <p className="text-sm text-fg-subtle">{expert.company}</p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px]">
              <Link
                href={`/ask?expert=${expert.id}`}
                className={cn(buttonVariants("primary", "lg"), "w-full")}
              >
                Ask me a question
              </Link>
              <FollowExpertButton expertId={expert.id} expertName={expert.name} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {expert.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="size-3.5" /> {expert.languages.join(", ")}
            </span>
            {expert.linkedinUrl && (
              <a
                href={expert.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand hover:underline"
              >
                <LinkedinIcon className="size-3.5" /> LinkedIn
              </a>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {expert.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            <Indicator icon={Users} label="Followers" value={formatCompactNumber(expert.followersCount)} />
            <Indicator icon={MessageSquareText} label="Answers" value={`${expert.answersCount}`} />
            <Indicator icon={Star} label="Rating" value={expert.rating.toFixed(1)} />
            <Indicator icon={TrendingUp} label="Response rate" value={`${expert.responseRate}%`} />
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs items={[...TABS]} value={tab} onChange={(v) => setTab(v as typeof tab)} />

          <div className="mt-5 flex flex-col gap-4">
            {tab === "knowledge" &&
              (myKnowledge.length > 0 ? (
                myKnowledge.map((k) => <KnowledgeCard key={k.id} item={k} />)
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No knowledge published yet"
                  description="This expert hasn't added anything to their knowledge base yet."
                />
              ))}

            {tab === "answers" &&
              (answers.length > 0 ? (
                answers.map((q) => <QuestionCard key={q.id} question={q} showExpert={false} />)
              ) : (
                <EmptyState
                  icon={MessageSquareText}
                  title="No public answers yet"
                  description="This expert hasn't published a public answer yet."
                />
              ))}

            {tab === "polls" &&
              (myPolls.length > 0 ? (
                myPolls.map((p) => <PollCard key={p.id} poll={p} />)
              ) : (
                <EmptyState
                  icon={Vote}
                  title="No polls in this expert's domains"
                  description="Polls related to this expert's categories will show up here."
                />
              ))}

            {tab === "about" && (
              <Card className="p-5">
                <p className="text-sm leading-relaxed text-fg-muted">{expert.bio}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{expert.experience}</p>
                {expert.website && (
                  <a
                    href={expert.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
                  >
                    <Globe2 className="size-3.5" /> {expert.website.replace("https://", "")}
                  </a>
                )}
              </Card>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold text-fg">
              Expertise
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {expertCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-fg-muted transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Indicator({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-fg-subtle">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1 font-display text-lg font-semibold text-fg">{value}</p>
    </div>
  );
}
