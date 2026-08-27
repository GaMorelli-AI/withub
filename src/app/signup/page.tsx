import Link from "next/link";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata = { title: "Create account — WitHub" };

export default function SignupChooserPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
        How do you want to use WitHub?
      </h1>
      <p className="mt-2 text-center text-sm text-fg-muted">
        You can always add the other side of the marketplace later.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card interactive className="flex flex-col p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <GraduationCap className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-fg">
            I want to learn
          </h2>
          <p className="mt-2 flex-1 text-sm text-fg-muted">
            Ask experts and access knowledge from experienced people across
            business, tech, health, law and more.
          </p>
          <Link
            href="/signup/user"
            className={cn(buttonVariants("primary", "md"), "mt-6")}
          >
            Continue as User <ArrowRight className="size-4" />
          </Link>
        </Card>

        <Card interactive className="flex flex-col p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-brand-secondary/15 text-brand">
            <Sparkles className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-fg">
            I want to share my knowledge
          </h2>
          <p className="mt-2 flex-1 text-sm text-fg-muted">
            Answer questions, build your reputation and monetize your
            expertise on your own schedule.
          </p>
          <Link
            href="/signup/expert"
            className={cn(buttonVariants("secondary", "md"), "mt-6")}
          >
            Become an Expert <ArrowRight className="size-4" />
          </Link>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
