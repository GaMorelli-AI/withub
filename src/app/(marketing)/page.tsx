import Link from "next/link";
import { ArrowRight, Rocket, Library, Wallet } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ExpertCard } from "@/components/ExpertCard";
import { CategoryCard } from "@/components/CategoryCard";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { experts } from "@/data/experts";
import { categories } from "@/data/categories";
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

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Library,
    title: "Find the right expert",
    description:
      "Search by topic or browse categories to find someone who has actually done the thing you're trying to figure out.",
  },
  {
    step: "02",
    icon: Rocket,
    title: "Ask your question",
    description:
      "Add context, choose public or private, and send it — no back and forth scheduling, no wasted calls.",
  },
  {
    step: "03",
    icon: Wallet,
    title: "Get a real answer",
    description:
      "Your expert answers directly. You pay only for the question you asked, and can follow up any time.",
  },
];

export default function HomePage() {
  const featured = FEATURED_EXPERT_IDS.map((id) =>
    experts.find((e) => e.id === id)
  ).filter((e): e is NonNullable<typeof e> => Boolean(e));

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
            Connect with experts, ask questions and get answers from people
            with real experience.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <SearchBar variant="hero" />
          </div>

          <Link
            href="/ask"
            className={cn(buttonVariants("primary", "lg"), "mt-8")}
          >
            Ask an Expert <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
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
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
            Explore knowledge
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            Sixteen categories, hundreds of specific topics.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              Be an expert
            </h2>
            <p className="mt-3 max-w-md text-sm text-fg-muted">
              Join WitHub and use your knowledge to expand your audience and
              make more money. Answer on your own time, at your own price.
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
              &ldquo;WitHub gave me a new source of income, with minimal
              effort.&rdquo;
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              Sarah Mason &middot; Growth & Marketing Expert
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <p className="text-xs text-fg-subtle">Avg. monthly income</p>
                <p className="mt-1 font-display text-xl font-semibold text-gradient-brand">
                  $1,245
                </p>
              </div>
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <p className="text-xs text-fg-subtle">Avg. audience growth</p>
                <p className="mt-1 font-display text-xl font-semibold text-gradient-brand">
                  45%
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
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
        </div>
      </section>
    </>
  );
}
