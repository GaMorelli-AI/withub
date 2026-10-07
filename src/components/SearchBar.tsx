"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Search, MessageCircleQuestion, Users, Grid3x3, BookOpen, Vote } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { search, hasResults } from "@/lib/search";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  { label: "Artificial Intelligence", slug: "artificial-intelligence" },
  { label: "Business", slug: "business" },
  { label: "Law", slug: "law" },
  { label: "Finance", slug: "finance" },
  { label: "Marketing", slug: "marketing" },
];

interface SearchBarProps {
  variant?: "hero" | "compact";
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ variant = "compact", className, autoFocus }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToSearch(q: string) {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const results = query.trim() ? search(query, 4) : null;
  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border bg-surface transition-colors focus-within:border-brand/50",
          isHero ? "h-16 px-6" : "h-11 px-4"
        )}
      >
        <Search className={cn("shrink-0 text-fg-subtle", isHero ? "size-5" : "size-4")} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && goToSearch(query)}
          placeholder={
            isHero ? "What do you want to know?" : "Search anything you want to know..."
          }
          className={cn(
            "w-full bg-transparent text-fg placeholder:text-fg-subtle outline-none",
            isHero ? "text-lg" : "text-sm"
          )}
        />
      </div>

      {isHero && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/category/${s.slug}`}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {open && results && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-bg-elevated p-2 shadow-2xl">
          {!hasResults(results) ? (
            <p className="px-3 py-6 text-center text-sm text-fg-muted">
              No results for &ldquo;{query}&rdquo; yet.
            </p>
          ) : (
            <>
              {results.questions.length > 0 && (
                <ResultGroup icon={MessageCircleQuestion} label="Questions">
                  {results.questions.map((q) => (
                    <Link
                      key={q.id}
                      href={`/search?q=${encodeURIComponent(q.text)}`}
                      onClick={() => setOpen(false)}
                      className="block truncate rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-hover"
                    >
                      {q.text}
                    </Link>
                  ))}
                </ResultGroup>
              )}
              {results.experts.length > 0 && (
                <ResultGroup icon={Users} label="Experts">
                  {results.experts.map((e) => (
                    <Link
                      key={e.id}
                      href={`/expert/${e.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-hover"
                    >
                      <Avatar name={e.name} seed={e.gradientSeed} size="xs" />
                      <span className="truncate">{e.name}</span>
                      <span className="ml-auto truncate text-xs text-fg-subtle">
                        {e.headline}
                      </span>
                    </Link>
                  ))}
                </ResultGroup>
              )}
              {results.categories.length > 0 && (
                <ResultGroup icon={Grid3x3} label="Categories">
                  {results.categories.map((c) => {
                    const Icon = (Icons[c.icon as keyof typeof Icons] ??
                      Icons.Grid3x3) as LucideIcon;
                    return (
                      <Link
                        key={c.id}
                        href={`/category/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-hover"
                      >
                        <Icon className="size-4 text-brand" />
                        {c.name}
                      </Link>
                    );
                  })}
                </ResultGroup>
              )}
              {results.knowledge.length > 0 && (
                <ResultGroup icon={BookOpen} label="Knowledge">
                  {results.knowledge.map((k) => (
                    <Link
                      key={k.id}
                      href={`/expert/${k.expertId}`}
                      onClick={() => setOpen(false)}
                      className="block truncate rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-hover"
                    >
                      {k.title}
                    </Link>
                  ))}
                </ResultGroup>
              )}
              {results.polls.length > 0 && (
                <ResultGroup icon={Vote} label="Polls">
                  {results.polls.map((p) => (
                    <Link
                      key={p.id}
                      href="/polls"
                      onClick={() => setOpen(false)}
                      className="block truncate rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-hover"
                    >
                      {p.question}
                    </Link>
                  ))}
                </ResultGroup>
              )}
              <button
                onClick={() => goToSearch(query)}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand hover:bg-surface-hover"
              >
                See all results for &ldquo;{query}&rdquo;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1 last:mb-0">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        <Icon className="size-3" />
        {label}
      </div>
      {children}
    </div>
  );
}
