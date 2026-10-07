"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Globe,
  Image as ImageIcon,
  Lock,
  Paperclip,
  Search,
  Sparkles,
  Users2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button, buttonVariants } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Avatar } from "@/components/ui/Avatar";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { inferCategorySlug } from "@/lib/semantic";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";
import type { AskQuestionResult } from "@/lib/store";
import type { QuestionPrivacy, QuestionTarget } from "@/lib/types";

const STEP_LABELS: Record<string, string> = {
  question: "Question",
  details: "Details",
  audience: "Audience",
  expert: "Expert",
  review: "Review",
};

export function AskFlow() {
  const toast = useToast();
  const searchParams = useSearchParams();

  const session = useAppStore((s) => s.session);
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const loginDemo = useAppStore((s) => s.loginDemo);
  const askQuestion = useAppStore((s) => s.askQuestion);
  const experts = useAppStore((s) => s.experts);

  const initialExpertId = searchParams.get("expert");
  const initialCategory = searchParams.get("category");

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [target, setTarget] = useState<QuestionTarget>(initialExpertId ? "expert" : "general");
  const [privacy, setPrivacy] = useState<QuestionPrivacy>("public");
  const [expertId, setExpertId] = useState<string | null>(initialExpertId);
  const [expertQuery, setExpertQuery] = useState("");
  const [result, setResult] = useState<AskQuestionResult | null>(null);

  const selectedExpert = expertId ? experts.find((e) => e.id === expertId) : undefined;
  const categorySlug = useMemo(
    () =>
      initialCategory ??
      selectedExpert?.categorySlugs[0] ??
      inferCategorySlug(text, categories),
    [initialCategory, selectedExpert, text]
  );

  const steps = useMemo(
    () => (target === "expert" ? ["question", "details", "audience", "expert", "review"] : ["question", "details", "audience", "review"]),
    [target]
  );

  const filteredExperts = useMemo(() => {
    const q = expertQuery.trim().toLowerCase();
    let list = experts;
    if (initialCategory) {
      list = list.filter((e) => e.categorySlugs.includes(initialCategory));
    }
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.headline.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 8);
  }, [expertQuery, initialCategory, experts]);

  const stepKey = steps[step];
  const canContinue =
    stepKey === "question"
      ? text.trim().length >= 10
      : stepKey === "expert"
      ? Boolean(expertId)
      : true;

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleAttach(kind: "image" | "pdf" | "doc") {
    const names: Record<typeof kind, string> = {
      image: "screenshot.png",
      pdf: "context.pdf",
      doc: "notes.docx",
    };
    setAttachments((prev) => [...prev, names[kind]]);
  }

  function handleSend() {
    if (!session) {
      loginDemo("user");
      toast("Signed in as Lucas Estevam (demo User) to send your question.");
    }
    const askerId = session?.id ?? "usr-lucas-estevam";
    if (target === "expert" && !expertId) return;

    const res = askQuestion({
      askerId,
      target,
      expertId: target === "expert" ? expertId ?? undefined : undefined,
      categorySlug,
      text: text.trim(),
      details: details.trim() || undefined,
      attachments,
      privacy: target === "expert" ? privacy : "public",
    });
    setResult(res);

    if (target === "expert") {
      toast(`Your question was sent to ${selectedExpert?.name ?? "the expert"}.`);
    } else if (res.instantAnswer) {
      toast("WitHub found an answer from existing knowledge.");
    } else {
      toast("Your question was sent to WitHub.");
    }
  }

  if (result) {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Check className="size-8" />
        </span>

        {target === "expert" ? (
          <>
            <h1 className="mt-5 font-display text-2xl font-semibold text-fg">
              Question sent!
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              Your question was sent to <strong className="text-fg">{selectedExpert?.name}</strong>.
              You&apos;ll be notified as soon as it&apos;s answered.
            </p>
          </>
        ) : result.instantAnswer ? (
          <>
            <h1 className="mt-5 font-display text-2xl font-semibold text-fg">
              Here&apos;s what WitHub knows
            </h1>
            <Card className="mt-5 w-full p-5 text-left">
              <p className="text-sm leading-relaxed text-fg-muted">
                {result.instantAnswer.text}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-3 text-xs text-fg-subtle">
                <Sparkles className="size-3.5 text-brand" /> Based on knowledge from{" "}
                {result.instantAnswer.expertIds
                  .map((id) => experts.find((e) => e.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </Card>
            {result.similarCount > 1 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-muted">
                <Users2 className="size-3.5" /> {result.similarCount} people asked something similar
              </p>
            )}
          </>
        ) : result.joinedCluster ? (
          <>
            <h1 className="mt-5 font-display text-2xl font-semibold text-fg">
              You&apos;re not alone
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              {result.similarCount} people asked something similar. We&apos;ll notify everyone
              as soon as an Expert answers.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-5 font-display text-2xl font-semibold text-fg">
              Sent to WitHub
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              This question is waiting for an Expert in this domain. We&apos;ll notify you
              the moment it&apos;s answered.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Link href="/dashboard/questions" className={buttonVariants("primary", "md")}>
            View my questions
          </Link>
          <Link href="/experts" className={buttonVariants("secondary", "md")}>
            Ask another question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-fg">Ask a question</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Straight to someone who actually knows — or to everyone at once.
      </p>

      <StepIndicator steps={steps.map((k) => STEP_LABELS[k])} current={step} className="mt-6" />

      <Card className="mt-6 p-6 sm:p-7">
        {stepKey === "question" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">
              What would you like to ask?
            </label>
            <Textarea
              rows={6}
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. How should a small company start using AI in their marketing?"
            />
            <p className="mt-2 text-xs text-fg-subtle">
              {text.trim().length < 10
                ? "Add a bit more detail (at least 10 characters)."
                : "Looks good."}
            </p>
          </div>
        )}

        {stepKey === "details" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">
              Add context (optional)
            </label>
            <Textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything that helps answer this well."
            />
            <div className="mt-4 flex flex-wrap gap-2.5">
              <AttachButton icon={ImageIcon} label="Attach image" onClick={() => handleAttach("image")} />
              <AttachButton icon={FileText} label="Attach PDF" onClick={() => handleAttach("pdf")} />
              <AttachButton icon={Paperclip} label="Attach document" onClick={() => handleAttach("doc")} />
            </div>
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-xs text-fg-muted"
                  >
                    {name}
                    <button
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      aria-label="Remove attachment"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {stepKey === "audience" && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-fg">Ask</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AudienceOption
                  icon={Users2}
                  title="Everyone"
                  description="WitHub finds an answer from existing knowledge, or routes it to Experts in this domain."
                  active={target === "general"}
                  onClick={() => setTarget("general")}
                />
                <AudienceOption
                  icon={Search}
                  title="A specific Expert"
                  description="Pick someone by name and ask them directly."
                  active={target === "expert"}
                  onClick={() => setTarget("expert")}
                />
              </div>
            </div>

            {target === "expert" && (
              <div>
                <label className="mb-3 block text-sm font-medium text-fg">
                  Who can see this?
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AudienceOption
                    icon={Globe}
                    title="Public"
                    description="Your question and its answer may appear on WitHub."
                    active={privacy === "public"}
                    onClick={() => setPrivacy("public")}
                  />
                  <AudienceOption
                    icon={Lock}
                    title="Private"
                    description="Only you and the expert can see this."
                    active={privacy === "private"}
                    onClick={() => setPrivacy("private")}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {stepKey === "expert" && (
          <div>
            {selectedExpert ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">
                  Your expert
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-elevated p-4">
                  <Avatar name={selectedExpert.name} seed={selectedExpert.gradientSeed} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{selectedExpert.name}</p>
                    <p className="truncate text-xs text-fg-subtle">{selectedExpert.headline}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpertId(null)}
                  className="mt-3 text-sm font-medium text-brand hover:underline"
                >
                  Change expert
                </button>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">
                  Choose an expert
                </label>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
                  <Input
                    className="pl-10"
                    value={expertQuery}
                    onChange={(e) => setExpertQuery(e.target.value)}
                    placeholder="Search experts by name or topic"
                  />
                </div>
                <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                  {filteredExperts.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setExpertId(e.id)}
                      className="flex items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-brand/40 hover:bg-surface-hover"
                    >
                      <Avatar name={e.name} seed={e.gradientSeed} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-fg">{e.name}</p>
                        <p className="truncate text-xs text-fg-subtle">{e.headline}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {stepKey === "review" && (
          <div>
            <label className="mb-3 block text-sm font-medium text-fg">
              Review &amp; send
            </label>
            <div className="rounded-xl border border-border bg-bg-elevated p-4">
              <Row
                label="Ask"
                value={target === "expert" ? selectedExpert?.name ?? "—" : "Everyone"}
              />
              {target === "expert" && (
                <Row label="Visibility" value={privacy === "public" ? "Public" : "Private"} />
              )}
              <Row label="Question" value={text.trim()} wrap />
            </div>
            {!session && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-subtle">
                <Sparkles className="size-3.5" /> You&apos;ll be signed in as our demo User to send this.
              </p>
            )}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next} disabled={!canContinue}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={!hasHydrated}>
              Send question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function AttachButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof ImageIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-border-hover hover:text-fg"
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

function AudienceOption({
  icon: Icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
        active ? "border-brand bg-brand/5" : "border-border hover:border-border-hover"
      )}
    >
      <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-brand/15 text-brand" : "bg-surface-hover text-fg-subtle")}>
        <Icon className="size-4" />
      </span>
      <span className="font-display text-sm font-semibold text-fg">{title}</span>
      <span className="text-xs text-fg-muted">{description}</span>
    </button>
  );
}

function Row({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div className={cn("py-1 text-sm", wrap ? "flex flex-col gap-1" : "flex items-center justify-between")}>
      <span className="text-fg-muted">{label}</span>
      <span className={cn("text-fg", wrap && "text-sm leading-relaxed")}>{value}</span>
    </div>
  );
}
