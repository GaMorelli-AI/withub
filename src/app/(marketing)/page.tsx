import Link from "next/link";
import { ArrowRight, BookOpen, MessagesSquare, Vote } from "lucide-react";
import { VisitorAskWidget } from "@/components/VisitorAskWidget";
import { ExpertCard } from "@/components/ExpertCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PollCard } from "@/components/PollCard";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { experts } from "@/data/experts";
import { categories } from "@/data/categories";
import { polls } from "@/data/polls";
import { cn } from "@/lib/cn";

const FEATURED_EXPERT_IDS = [
  "exp-sarah-mason",
  "exp-priya-nathan",
  "exp-daniela-kruger",
  "exp-marcus-boateng",
  "exp-ahmed-alfarsi",
  "exp-naomi-clarke",
  "exp-julia-andersson",
  "exp-thiago-nunes",
];

const TRENDING_POLL_IDS = ["poll-001", "poll-003", "poll-004", "poll-006"];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: MessagesSquare,
    title: "Ask anything",
    description:
      "Ask the whole community or a specific expert — no scheduling, no wasted calls. Try it before you even create an account.",
  },
  {
    step: "02",
    icon: BookOpen,
    title: "Get an answer from real knowledge",
    description:
      "WitHub searches existing answers and expert knowledge first, and routes anything new to the right experts.",
  },
  {
    step: "03",
    icon: Vote,
    title: "See what people really think",
    description:
      "Vote in polls and compare Expert Signal against Community Pulse on the questions everyone's asking.",
  },
];

export default function HomePage() {
  const featured = FEATURED_EXPERT_IDS.map((id) =>
    experts.find((e) => e.id === id)
  ).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const trendingPolls = TRENDING_POLL_IDS.map((id) =>
    polls.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <section className="bg-grid-fade relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="animate-slide-up font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
            Knowledge has <span className="text-gradient-brand">value.</span>
          </h1>
          <p className="mt-4 font-display text-xl text-fg-muted sm:text-2xl">
            Ask people who actually know.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-fg-subtle sm:text-base">
            A searchable network of human knowledge — ask the community, ask
            an expert, or see what both really think.
          </p>

          <div className="mx-auto mt-10">
            <VisitorAskWidget />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              Trending on WitHub
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              What experts think, versus what the community thinks.
            </p>
          </div>
          <Link
            href="/polls"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
          >
            View all polls <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {trendingPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                Learn from people who know.
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                Verified experts across business, tech, health, law and more.
              </p>
            </div>
            <Link
              href="/experts"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
            >
              View all experts <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>

          <Link
            href="/experts"
            className={cn(buttonVariants("secondary", "md"), "mt-6 flex w-fit sm:hidden")}
          >
            View all experts
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
          Explore knowledge
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          {categories.length} categories, hundreds of specific topics.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                Be an expert
              </h2>
              <p className="mt-3 max-w-md text-sm text-fg-muted">
                Join WitHub and turn your knowledge into a searchable asset —
                answer questions, publish knowledge, and grow a following in
                your domain.
              </p>
              <Link
                href="/signup/expert"
                className={cn(buttonVariants("primary", "md"), "mt-6")}
              >
                Become an Expert
              </Link>
            </div>

            <Card className="p-6 sm:p-8">
              <p className="font-display text-lg leading-snug text-fg">
                &ldquo;WitHub turned the answers I was already giving people
                into something that keeps growing my audience.&rdquo;
              </p>
              <p className="mt-3 text-sm text-fg-muted">
                Sarah Mason &middot; Growth & Marketing Expert
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-bg-elevated p-4">
                  <p className="text-xs text-fg-subtle">Knowledge items</p>
                  <p className="mt-1 font-display text-xl font-semibold text-gradient-brand">
                    3
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-bg-elevated p-4">
                  <p className="text-xs text-fg-subtle">Follower growth</p>
                  <p className="mt-1 font-display text-xl font-semibold text-gradient-brand">
                    45%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="p-6">
              <span className="font-display text-sm text-brand">
                {item.step}
              </span>
              <item.icon className="mt-3 size-6 text-fg-muted" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-base font-semibold text-fg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{item.description}</p>
            </Card>
          ))}
        </div>
        <Link href="/how-it-works" className={cn(buttonVariants("outline", "md"), "mt-8")}>
          Learn more about how it works
        </Link>
      </section>
    </>
  );
}
