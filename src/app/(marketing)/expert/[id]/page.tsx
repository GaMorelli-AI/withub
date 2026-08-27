import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Globe2,
  MapPin,
  MessageSquareText,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { Rating } from "@/components/Rating";
import { QuestionCard } from "@/components/QuestionCard";
import { SaveExpertButton } from "@/components/SaveExpertButton";
import { getExpertById, experts } from "@/data/experts";
import { getQuestionsByExpert } from "@/data/questions";
import { getReviewsByExpert } from "@/data/reviews";
import { getUserById } from "@/data/users";
import { categories } from "@/data/categories";
import { formatCompactNumber, formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = getExpertById(id);
  if (!expert) notFound();

  const answers = getQuestionsByExpert(expert.id).filter(
    (q) => q.status === "answered" && q.privacy === "public"
  );
  const reviews = getReviewsByExpert(expert.id);
  const expertCategories = categories.filter((c) =>
    expert.categorySlugs.includes(c.slug)
  );

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

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[220px]">
              <Link
                href={`/ask?expert=${expert.id}`}
                className={cn(buttonVariants("primary", "lg"), "w-full")}
              >
                Ask me a question
              </Link>
              <SaveExpertButton expertId={expert.id} expertName={expert.name} />
              <p className="text-center text-sm text-fg-muted">
                Questions from{" "}
                <span className="font-display font-semibold text-gradient-brand">
                  {formatPrice(expert.pricePerQuestion)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {expert.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="size-3.5" /> {expert.languages.join(", ")}
            </span>
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
            <Indicator
              icon={Star}
              label="Rating"
              value={expert.rating.toFixed(1)}
            />
            <Indicator
              icon={TrendingUp}
              label="Response rate"
              value={`${expert.responseRate}%`}
            />
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section>
            <h2 className="font-display text-lg font-semibold text-fg">About</h2>
            <Card className="mt-3 p-5">
              <p className="text-sm leading-relaxed text-fg-muted">{expert.bio}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {expert.experience}
              </p>
            </Card>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-fg">
              Answers ({answers.length})
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {answers.length > 0 ? (
                answers.map((q) => (
                  <QuestionCard key={q.id} question={q} showExpert={false} />
                ))
              ) : (
                <EmptyState
                  icon={MessageSquareText}
                  title="No public answers yet"
                  description="This expert hasn't published a public answer yet."
                />
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-fg">
              Reviews ({reviews.length})
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const reviewer = getUserById(review.userId);
                  return (
                    <Card key={review.id} className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={reviewer?.name ?? "Anonymous"}
                          seed={reviewer?.gradientSeed}
                          size="sm"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-fg">
                            {reviewer?.name ?? "Anonymous"}
                          </p>
                          <p className="text-xs text-fg-subtle">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <Rating value={review.rating} />
                      </div>
                      <p className="mt-3 text-sm text-fg-muted">{review.text}</p>
                    </Card>
                  );
                })
              ) : (
                <EmptyState
                  icon={Star}
                  title="No reviews yet"
                  description="Be the first to review this expert after they answer your question."
                />
              )}
            </div>
          </section>
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
