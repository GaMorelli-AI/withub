import type { Category, KnowledgeItem, Question } from "@/lib/types";

/**
 * Mocked semantic layer. This stands in for a real embeddings/vector-search
 * service (see Withub26 schema: EMBEDDINGS, EMBEDDINGS_QUESTIONS). Every
 * function here is pure and works off in-memory data, so swapping it for a
 * real implementation later only means replacing this module.
 */

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "how", "what", "does", "you",
  "your", "are", "can", "should", "will", "have", "has", "from", "into",
  "about", "when", "who", "why", "any", "one", "all", "not", "but", "get",
  "start", "using", "use", "our", "their", "them", "they", "them", "it's",
  "was", "were", "been", "being", "just", "much", "many", "than", "then",
  "where", "there", "here", "some", "such", "over", "still", "also",
]);

// Short domain acronyms that a strict length filter would otherwise strip —
// exactly the kind of word this app's questions are full of ("AI", "UX"...).
const SHORT_TERM_ALLOWLIST = new Set([
  "ai", "ux", "ui", "hr", "pr", "vc", "pe", "ip", "api", "seo", "roi", "arr",
  "ceo", "cfo", "cto", "b2b", "b2c", "saas", "llm", "llms", "nba", "crs",
]);

function tokenize(text: string): Set<string> {
  const words = text.replace(/[^a-zA-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const tokens = new Set<string>();
  for (const word of words) {
    const lower = word.toLowerCase();
    if (STOPWORDS.has(lower)) continue;
    if (lower.length > 2 || SHORT_TERM_ALLOWLIST.has(lower)) {
      tokens.add(lower);
    }
  }
  return tokens;
}

export function similarityScore(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const word of ta) if (tb.has(word)) intersection += 1;
  return intersection / Math.min(ta.size, tb.size);
}

export interface SimilarQuestionMatch {
  question: Question;
  score: number;
}

export function findSimilarQuestions(
  text: string,
  categorySlug: string | undefined,
  pool: Question[],
  threshold = 0.34
): SimilarQuestionMatch[] {
  return pool
    .filter((q) => !categorySlug || q.categorySlug === categorySlug)
    .map((q) => ({ question: q, score: similarityScore(text, q.text) }))
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

export interface SynthesizedAnswer {
  text: string;
  expertIds: string[];
  knowledgeIds: string[];
  sourceQuestionIds: string[];
}

export function synthesizeAnswer(
  text: string,
  categorySlug: string | undefined,
  pool: { questions: Question[]; knowledge: KnowledgeItem[] }
): SynthesizedAnswer | null {
  const matchedQuestions = findSimilarQuestions(
    text,
    categorySlug,
    pool.questions.filter((q) => q.answer),
    0.3
  ).slice(0, 3);

  const matchedKnowledge = pool.knowledge
    .filter((k) => !categorySlug || k.categorySlug === categorySlug)
    .map((k) => ({ item: k, score: similarityScore(text, `${k.title} ${k.body}`) }))
    .filter((m) => m.score >= 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (matchedQuestions.length === 0 && matchedKnowledge.length === 0) return null;

  const expertIds = Array.from(
    new Set([
      ...matchedQuestions.map((m) => m.question.answer!.authorExpertId),
      ...matchedKnowledge.map((m) => m.item.expertId),
    ])
  );

  const bestText =
    matchedQuestions[0]?.question.answer?.text ?? matchedKnowledge[0]?.item.body;

  return {
    text: bestText!,
    expertIds,
    knowledgeIds: matchedKnowledge.map((m) => m.item.id),
    sourceQuestionIds: matchedQuestions.map((m) => m.question.id),
  };
}

/** Best-effort guess at which domain a free-typed question belongs to. */
export function inferCategorySlug(text: string, categories: Category[]): string {
  const scored = categories
    .map((c) => ({
      slug: c.slug,
      score: similarityScore(text, `${c.name} ${c.topics.join(" ")}`),
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].slug : categories[0]?.slug ?? "business";
}
