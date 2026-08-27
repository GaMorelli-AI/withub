import { experts } from "@/data/experts";
import { questions } from "@/data/questions";

export function getCategoryStats(slug: string) {
  return {
    expertsCount: experts.filter((e) => e.categorySlugs.includes(slug)).length,
    questionsCount: questions.filter((q) => q.categorySlug === slug).length,
  };
}
