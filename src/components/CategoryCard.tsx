import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getCategoryStats } from "@/lib/stats";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = (Icons[category.icon as keyof typeof Icons] ??
    Icons.Sparkles) as LucideIcon;
  const { expertsCount, questionsCount } = getCategoryStats(category.slug);

  return (
    <Link href={`/category/${category.slug}`}>
      <Card interactive className="group flex h-full flex-col gap-4 p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-brand-secondary/15 text-brand transition-colors group-hover:from-brand/25 group-hover:to-brand-secondary/25">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="font-display text-sm font-semibold text-fg">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-fg-subtle">
            {expertsCount} Experts &middot; {questionsCount} Questions
          </p>
        </div>
      </Card>
    </Link>
  );
}
