import { experts } from "@/data/experts";
import { questions } from "@/data/questions";
import { knowledgeItems } from "@/data/knowledge";
import { polls } from "@/data/polls";

export function getCategoryStats(slug: string) {
  return {
    expertsCount: experts.filter((e) => e.categorySlugs.includes(slug)).length,
    questionsCount: questions.filter((q) => q.categorySlug === slug).length,
    knowledgeCount: knowledgeItems.filter((k) => k.categorySlug === slug).length,
    pollsCount: polls.filter((p) => p.categorySlug === slug).length,
  };
}

export function getExpertAnalytics(expertId: string, liveQuestions = questions) {
  const items = knowledgeItems.filter((k) => k.expertId === expertId);
  const answered = liveQuestions.filter(
    (q) => q.answer?.authorExpertId === expertId
  );
  const answeredWithSources = answered.filter(
    (q) => q.answer && q.answer.sourceKnowledgeIds.length > 0
  );
  const totalViews = items.reduce((sum, k) => sum + k.views, 0);
  const topItem = [...items].sort((a, b) => b.views - a.views)[0];

  return {
    knowledgeCount: items.length,
    knowledgeViews: totalViews,
    questionsAnsweredWithKnowledge: answeredWithSources.length,
    topKnowledgeItem: topItem,
  };
}
