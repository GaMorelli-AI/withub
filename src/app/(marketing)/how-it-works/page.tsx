import Link from "next/link";
import { Search, MessageCircle, Wallet, UserPlus, PenLine, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata = { title: "How it works — WitHub" };

const FOR_USERS = [
  {
    icon: Search,
    title: "Find the right expert",
    description: "Search by topic or browse categories to find someone with real, hands-on experience in exactly what you're asking about.",
  },
  {
    icon: MessageCircle,
    title: "Ask your question",
    description: "Add context, choose public or private, and send it. No scheduling, no waiting rooms — just your question, direct.",
  },
  {
    icon: Wallet,
    title: "Get a real answer",
    description: "Your expert answers directly in your dashboard. You only pay for the question you asked.",
  },
];

const FOR_EXPERTS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description: "Set your specialties, your price per question, and let people know exactly what you can help with.",
  },
  {
    icon: PenLine,
    title: "Answer on your time",
    description: "Questions land in your inbox. Answer when it suits you — there's no live call to schedule.",
  },
  {
    icon: TrendingUp,
    title: "Track your earnings",
    description: "Every answered question adds to your balance. Watch your rating and following grow over time.",
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
          A marketplace for knowledge — built for people who have a question,
          and people who have the answer.
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
          How the money works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Every question has a clear, transparent split. The User pays the
          question price, WitHub keeps a small platform fee, and the rest
          goes straight to the Expert.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MoneyStat label="Question price" value="$20" />
          <MoneyStat label="Platform fee (20%)" value="$4" />
          <MoneyStat label="Expert receives" value="$16" accent />
        </div>
      </section>
    </div>
  );
}

function MoneyStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-fg-subtle">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-xl font-semibold",
          accent ? "text-gradient-brand" : "text-fg"
        )}
      >
        {value}
      </p>
    </div>
  );
}
