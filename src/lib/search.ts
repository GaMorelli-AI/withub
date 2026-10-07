import { categories } from "@/data/categories";
import { experts } from "@/data/experts";
import { questions } from "@/data/questions";
import { knowledgeItems } from "@/data/knowledge";
import { polls } from "@/data/polls";
import type { Category, Expert, KnowledgeItem, Poll, Question } from "@/lib/types";

export interface SearchResults {
  questions: Question[];
  experts: Expert[];
  categories: Category[];
  knowledge: KnowledgeItem[];
  polls: Poll[];
}

const EMPTY: SearchResults = {
  questions: [],
  experts: [],
  categories: [],
  knowledge: [],
  polls: [],
};

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

  const matchedKnowledge = knowledgeItems
    .filter(
      (k) =>
        k.status === "published" &&
        (k.title.toLowerCase().includes(query) ||
          k.body.toLowerCase().includes(query) ||
          k.topics.some((t) => t.toLowerCase().includes(query)))
    )
    .slice(0, limit);

  const matchedPolls = polls
    .filter((p) => p.question.toLowerCase().includes(query))
    .slice(0, limit);

  return {
    questions: matchedQuestions,
    experts: matchedExperts,
    categories: matchedCategories,
    knowledge: matchedKnowledge,
    polls: matchedPolls,
  };
}

export function hasResults(results: SearchResults): boolean {
  return (
    results.questions.length > 0 ||
    results.experts.length > 0 ||
    results.categories.length > 0 ||
    results.knowledge.length > 0 ||
    results.polls.length > 0
  );
}
