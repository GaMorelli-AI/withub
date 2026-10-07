"use client";

import { useState } from "react";
import { FileText, Link2, Paperclip, Type } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { categories } from "@/data/categories";
import { useAppStore, nextKnowledgeId } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import type { KnowledgeAccess, KnowledgeSourceType } from "@/lib/types";

const SOURCE_TYPES: { value: KnowledgeSourceType; label: string; icon: typeof Type }[] = [
  { value: "text", label: "Text", icon: Type },
  { value: "url", label: "URL", icon: Link2 },
  { value: "file", label: "File", icon: Paperclip },
  { value: "pdf", label: "PDF", icon: FileText },
];

export function AddKnowledgeModal({
  open,
  onClose,
  expertId,
}: {
  open: boolean;
  onClose: () => void;
  expertId: string;
}) {
  const toast = useToast();
  const addKnowledgeItem = useAppStore((s) => s.addKnowledgeItem);

  const [sourceType, setSourceType] = useState<KnowledgeSourceType>("text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0].slug);
  const [access, setAccess] = useState<KnowledgeAccess>("free");

  function reset() {
    setSourceType("text");
    setTitle("");
    setBody("");
    setSourceUrl("");
    setAccess("free");
  }

  function handleSubmit() {
    if (!title.trim() || !body.trim()) return;
    addKnowledgeItem({
      id: nextKnowledgeId(),
      expertId,
      title: title.trim(),
      body: body.trim(),
      sourceType,
      sourceUrl: sourceType === "url" ? sourceUrl.trim() : undefined,
      categorySlug,
      topics: [],
      access,
      status: "published",
      views: 0,
      createdAt: new Date().toISOString(),
    });
    toast("Knowledge added to your base.");
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Knowledge" className="max-w-lg">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg-muted">Source</label>
          <div className="grid grid-cols-4 gap-2">
            {SOURCE_TYPES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSourceType(s.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition-colors",
                  sourceType === s.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-fg-muted hover:border-border-hover"
                )}
              >
                <s.icon className="size-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg-muted">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How I validate startup ideas"
          />
        </div>

        {sourceType === "url" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg-muted">URL</label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        )}

        {(sourceType === "file" || sourceType === "pdf") && (
          <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-fg-subtle">
            File upload isn&apos;t wired up in this demo — add a summary below instead.
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg-muted">Content</label>
          <Textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write what you know…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg-muted">Domain</label>
            <Select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg-muted">Access</label>
            <Select value={access} onChange={(e) => setAccess(e.target.value as KnowledgeAccess)}>
              <option value="free">Free</option>
              <option value="subscribers">Subscribers</option>
            </Select>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={!title.trim() || !body.trim()} className="mt-1">
          Add Knowledge
        </Button>
      </div>
    </Modal>
  );
}
