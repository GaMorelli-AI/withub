"use client";

import { useState } from "react";
import { PollCard } from "@/components/PollCard";
import { Select } from "@/components/ui/Select";
import { useAppStore } from "@/lib/store";
import { categories } from "@/data/categories";

export default function PollsPage() {
  const polls = useAppStore((s) => s.polls);
  const [categorySlug, setCategorySlug] = useState("all");

  const filtered = categorySlug === "all" ? polls : polls.filter((p) => p.categorySlug === categorySlug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">Trending on WitHub</h1>
          <p className="mt-2 text-sm text-fg-muted">
            What people who understand a subject think, versus what the community thinks.
          </p>
        </div>
        <Select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="w-auto min-w-[180px]"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
