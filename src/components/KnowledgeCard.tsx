"use client";

import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getCategoryBySlug } from "@/data/categories";
import { cn } from "@/lib/cn";
import type { KnowledgeItem } from "@/lib/types";
import Link from "next/link";

export function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  const { t } = useI18n();
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);

  const currentUser = session?.type === "user" ? users.find((u) => u.id === session.id) : null;
  const isOwner = session?.type === "expert" && session.id === item.expertId;
  const isPremium = currentUser?.subscriptionTier === "premium";
  const locked = item.access === "subscribers" && !isPremium && !isOwner;
  const category = getCategoryBySlug(item.categorySlug);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{category?.name}</Badge>
        <Badge variant={item.access === "free" ? "success" : "brand"}>
          {item.access === "free" ? t("knowledge.free") : t("knowledge.subscribers")}
        </Badge>
      </div>
      <p className="mt-3 font-display text-base font-semibold text-fg">{item.title}</p>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed text-fg-muted",
          locked && "line-clamp-2 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
        )}
      >
        {item.body}
      </p>
      {locked && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-brand/25 bg-brand/5 px-4 py-3">
          <span className="flex items-center gap-1.5 text-xs text-fg-muted">
            <Lock className="size-3.5 text-brand" /> Subscribers-only knowledge
          </span>
          <Link href="/signup" className={cn(buttonVariants("primary", "sm"))}>
            {t("common.upgrade")}
          </Link>
        </div>
      )}
    </Card>
  );
}
