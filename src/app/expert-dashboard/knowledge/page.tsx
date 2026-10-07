"use client";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddKnowledgeModal } from "@/components/AddKnowledgeModal";
import { useAppStore } from "@/lib/store";
import { getCategoryBySlug } from "@/data/categories";
import { formatDate, formatCompactNumber } from "@/lib/format";

export default function KnowledgeBasePage() {
  const session = useAppStore((s) => s.session);
  const knowledge = useAppStore((s) => s.knowledge);
  const [open, setOpen] = useState(false);

  const mine = knowledge
    .filter((k) => k.expertId === session?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">My Knowledge</h1>
          <p className="mt-1 text-sm text-fg-muted">
            The more you add, the more questions WitHub can answer for you.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Add Knowledge
        </Button>
      </div>

      {mine.length > 0 ? (
        <Card className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-fg-subtle">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((k) => (
                <tr key={k.id} className="border-b border-border last:border-0">
                  <td className="max-w-[240px] truncate px-4 py-3 text-fg">{k.title}</td>
                  <td className="px-4 py-3 text-fg-muted">
                    {getCategoryBySlug(k.categorySlug)?.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={k.access === "free" ? "outline" : "brand"}>
                      {k.access === "free" ? "Free" : "Subscribers"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={k.status === "published" ? "success" : "warning"}>
                      {k.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{formatCompactNumber(k.views)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-subtle">
                    {formatDate(k.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState
          className="mt-6"
          icon={BookOpen}
          title="Your knowledge base is empty"
          description="Add text, a URL, or a document — WitHub uses it to answer questions in your domains."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Add Knowledge
            </Button>
          }
        />
      )}

      {session?.type === "expert" && (
        <AddKnowledgeModal open={open} onClose={() => setOpen(false)} expertId={session.id} />
      )}
    </div>
  );
}
