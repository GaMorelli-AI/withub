import Link from "next/link";
import { Search, MessageCircle, Sparkles, UserPlus, PenLine, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata = { title: "How it works — WitHub" };

const FOR_USERS = [
  {
    icon: Search,
    title: "Ask anything, no account needed",
    description: "Ask the whole community or search existing knowledge — try WitHub free before you ever sign up.",
  },
  {
    icon: MessageCircle,
    title: "Ask a specific expert",
    description: "Found someone who really knows the subject? Ask them directly, publicly or privately.",
  },
  {
    icon: Sparkles,
    title: "Get an answer built on real knowledge",
    description: "WitHub reuses existing answers and expert knowledge first, so you're rarely the first person asking.",
  },
];

const FOR_EXPERTS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description: "Add your LinkedIn, pick the domains you know, and let people know what you can help with.",
  },
  {
    icon: PenLine,
    title: "Build your knowledge base",
    description: "Add what you already know as text, links or documents. Mark each piece Free or Subscribers-only.",
  },
  {
    icon: BarChart3,
    title: "Grow your following",
    description: "Every answer and knowledge item you publish makes WitHub smarter — and makes your profile more visible.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
          How WitHub works
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-fg-muted">
          A searchable network of human knowledge — built for people who have
          a question, and people who have the answer.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-fg">
          If you have a question
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FOR_USERS.map((step, i) => (
            <Card key={step.title} className="p-6">
              <span className="font-display text-sm text-brand">
                0{i + 1}
              </span>
              <step.icon className="mt-3 size-6 text-fg-muted" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-base font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{step.description}</p>
            </Card>
          ))}
        </div>
        <Link href="/ask" className={cn(buttonVariants("primary", "md"), "mt-6")}>
          Ask a question
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold text-fg">
          If you have the knowledge
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FOR_EXPERTS.map((step, i) => (
            <Card key={step.title} className="p-6">
              <span className="font-display text-sm text-brand">
                0{i + 1}
              </span>
              <step.icon className="mt-3 size-6 text-fg-muted" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-base font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{step.description}</p>
            </Card>
          ))}
        </div>
        <Link href="/signup/expert" className={cn(buttonVariants("primary", "md"), "mt-6")}>
          Become an Expert
        </Link>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-fg">
          Free vs. Premium
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          WitHub isn&apos;t priced per question. Access to the platform and
          its knowledge is a subscription — Experts choose which of their own
          knowledge is free, and which is for subscribers only.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-display text-base font-semibold text-fg">Free</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
              <li>A limited number of questions</li>
              <li>Access to public knowledge and answers</li>
              <li>Follow experts and vote in polls</li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-5">
            <p className="font-display text-base font-semibold text-gradient-brand">Premium</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
              <li>Unlimited questions</li>
              <li>Full access to subscribers-only knowledge</li>
              <li>Priority routing to experts in your domains</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
