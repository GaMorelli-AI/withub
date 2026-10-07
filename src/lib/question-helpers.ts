import type { Question, QuestionAnswer } from "@/lib/types";

export interface ResolvedAnswer {
  answer: QuestionAnswer;
  via: "direct" | "cluster";
  representative: Question;
}

/**
 * A question answered via clustering never gets its own `answer` — it
 * inherits the representative question's answer. This resolves that chain
 * so the UI can treat both cases uniformly.
 */
export function resolveAnswer(
  question: Question,
  all: Question[]
): ResolvedAnswer | null {
  if (question.answer) {
    return { answer: question.answer, via: "direct", representative: question };
  }
  if (question.clusterOf) {
    const rep = all.find((q) => q.id === question.clusterOf);
    if (rep?.answer) {
      return { answer: rep.answer, via: "cluster", representative: rep };
    }
  }
  return null;
}

export function isEffectivelyAnswered(question: Question, all: Question[]): boolean {
  return resolveAnswer(question, all) !== null;
}

export function getClusterMembers(representativeId: string, all: Question[]): Question[] {
  return all.filter((q) => q.clusterOf === representativeId);
}

export function getClusterSize(representativeId: string, all: Question[]): number {
  return getClusterMembers(representativeId, all).length;
}
