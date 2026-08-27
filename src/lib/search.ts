import { categories } from "@/data/categories";
import { experts } from "@/data/experts";
import { questions } from "@/data/questions";
import type { Category, Expert, Question } from "@/lib/types";

export interface SearchResults {
  questions: Question[];
  experts: Expert[];
  categories: Category[];
}

const EMPTY: SearchResults = { questions: [], experts: [], categories: [] };

export function search(rawQuery: string, limit = 5): SearchResults {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return EMPTY;

  const matchedQuestions = questions
    .filter(
      (q) =>
        q.privacy === "public" &&
        (q.text.toLowerCase().includes(query) ||
          q.topic?.toLowerCase().includes(query) ||
          q.categorySlug.toLowerCase().includes(query))
    )
    .slice(0, limit);

  const matchedExperts = experts
    .filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.headline.toLowerCase().includes(query) ||
        e.tags.some((t) => t.toLowerCase().includes(query)) ||
        e.categorySlugs.some((c) => c.toLowerCase().includes(query))
    )
    .slice(0, limit);

  const matchedCategories = categories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.topics.some((t) => t.toLowerCase().includes(query))
    )
    .slice(0, limit);

  return {
    questions: matchedQuestions,
    experts: matchedExperts,
    categories: matchedCategories,
  };
}

export function hasResults(results: SearchResults): boolean {
  return (
    results.questions.length > 0 ||
    results.experts.length > 0 ||
    results.categories.length > 0
  );
}
