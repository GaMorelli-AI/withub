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
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button, buttonVariants } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Avatar } from "@/components/ui/Avatar";
import { PriceBadge } from "@/components/PriceBadge";
import { useAppStore, splitPrice } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const STEPS = ["Question", "Details", "Privacy", "Expert", "Payment"];
const PRIVATE_MARKUP = 1.5;

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
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [expertId, setExpertId] = useState<string | null>(initialExpertId);
  const [expertQuery, setExpertQuery] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const selectedExpert = expertId ? experts.find((e) => e.id === expertId) : undefined;
  const category = initialCategory ?? selectedExpert?.categorySlugs[0] ?? "business";

  const basePrice = selectedExpert?.pricePerQuestion ?? 20;
  const price = privacy === "private" ? Math.round(basePrice * PRIVATE_MARKUP) : basePrice;
  const { platformFee, expertEarnings } = splitPrice(price);

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

  const canContinue = [
    text.trim().length >= 10,
    true,
    true,
    Boolean(expertId),
    true,
  ][step];

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
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
    if (!expertId) return;

    const id = askQuestion({
      askerId,
      expertId,
      categorySlug: category,
      text: text.trim(),
      details: details.trim() || undefined,
      privacy,
      price,
    });
    setSubmittedId(id);
    toast(`Your question was sent to ${selectedExpert?.name ?? "the expert"}.`);
  }

  if (submittedId) {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Check className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-fg">
          Question sent!
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Your question was sent to <strong className="text-fg">{selectedExpert?.name}</strong>.
          You&apos;ll be notified as soon as it&apos;s answered.
        </p>
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
        Straight to someone who actually knows.
      </p>

      <StepIndicator steps={STEPS} current={step} className="mt-6" />

      <Card className="mt-6 p-6 sm:p-7">
        {step === 0 && (
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

        {step === 1 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">
              Add context (optional)
            </label>
            <Textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything that helps the expert understand your situation better."
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

        {step === 2 && (
          <div>
            <label className="mb-3 block text-sm font-medium text-fg">
              Who can see this question?
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PrivacyOption
                icon={Globe}
                title="Public"
                description="Your question and its answer may appear on WitHub for others to learn from."
                active={privacy === "public"}
                onClick={() => setPrivacy("public")}
              />
              <PrivacyOption
                icon={Lock}
                title="Private"
                description="Only you and the expert can see this. Private questions cost more."
                active={privacy === "private"}
                onClick={() => setPrivacy("private")}
              />
            </div>
          </div>
        )}

        {step === 3 && (
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
                  <PriceBadge price={selectedExpert.pricePerQuestion} label="" />
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
                      <PriceBadge price={e.pricePerQuestion} label="" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="mb-3 block text-sm font-medium text-fg">
              Review &amp; send
            </label>
            <div className="rounded-xl border border-border bg-bg-elevated p-4">
              <Row label="Expert" value={selectedExpert?.name ?? "—"} />
              <Row label="Question price" value={formatPrice(basePrice)} />
              {privacy === "private" && (
                <Row label="Private question fee" value={`+${formatPrice(price - basePrice)}`} />
              )}
              <Row label="Platform fee" value={formatPrice(platformFee)} muted />
              <div className="my-3 h-px bg-border" />
              <Row label="Total" value={formatPrice(price)} bold />
              <p className="mt-2 text-xs text-fg-subtle">
                {selectedExpert?.name} receives {formatPrice(expertEarnings)}.
              </p>
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
          {step < STEPS.length - 1 ? (
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

function PrivacyOption({
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
  muted = false,
  bold = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={muted ? "text-fg-subtle" : "text-fg-muted"}>{label}</span>
      <span className={cn(bold ? "font-display text-base font-semibold text-fg" : "text-fg")}>
        {value}
      </span>
    </div>
  );
}
