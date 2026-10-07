"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ExpertCard } from "@/components/ExpertCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import type { Expert } from "@/lib/types";

const RATING_OPTIONS = [
  { value: "any", label: "Any rating" },
  { value: "4.5", label: "4.5+" },
  { value: "4.8", label: "4.8+" },
];

const ANSWERS_OPTIONS = [
  { value: "any", label: "Any volume" },
  { value: "100", label: "100+ answers" },
  { value: "300", label: "300+ answers" },
];

const FOLLOWERS_OPTIONS = [
  { value: "any", label: "Any following" },
  { value: "500", label: "500+ followers" },
  { value: "1500", label: "1,500+ followers" },
];

export function ExpertFilterGrid({ experts }: { experts: Expert[] }) {
  const [rating, setRating] = useState("any");
  const [language, setLanguage] = useState("any");
  const [minAnswers, setMinAnswers] = useState("any");
  const [minFollowers, setMinFollowers] = useState("any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const languages = useMemo(
    () => Array.from(new Set(experts.flatMap((e) => e.languages))).sort(),
    [experts]
  );

  const filtered = experts.filter((e) => {
    if (rating !== "any" && e.rating < Number(rating)) return false;
    if (language !== "any" && !e.languages.includes(language)) return false;
    if (minAnswers !== "any" && e.answersCount < Number(minAnswers)) return false;
    if (minFollowers !== "any" && e.followersCount < Number(minFollowers)) return false;
    if (verifiedOnly && e.verification !== "verified") return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-fg-subtle">
          <SlidersHorizontal className="size-3.5" /> Filters
        </span>
        <Select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-auto min-w-[120px]"
        >
          {RATING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-auto min-w-[130px]"
        >
          <option value="any">Any language</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Select
          value={minAnswers}
          onChange={(e) => setMinAnswers(e.target.value)}
          className="w-auto min-w-[140px]"
        >
          {ANSWERS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select
          value={minFollowers}
          onChange={(e) => setMinFollowers(e.target.value)}
          className="w-auto min-w-[150px]"
        >
          {FOLLOWERS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <Checkbox
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Verified only
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-6"
          icon={SlidersHorizontal}
          title="No experts match these filters"
          description="Try widening a filter or clearing them."
        />
      )}
    </div>
  );
}
