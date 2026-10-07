import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { experts as seedExperts } from "@/data/experts";
import { questions as seedQuestions } from "@/data/questions";
import { users as seedUsers } from "@/data/users";
import { knowledgeItems as seedKnowledge } from "@/data/knowledge";
import { polls as seedPolls } from "@/data/polls";
import { notifications as seedNotifications } from "@/data/notifications";
import { synthesizeAnswer, findSimilarQuestions } from "@/lib/semantic";
import type {
  AnswerVisibility,
  AppNotification,
  AppUser,
  Expert,
  KnowledgeItem,
  Poll,
  Question,
  QuestionPrivacy,
  QuestionTarget,
} from "@/lib/types";

export const FREE_VISITOR_QUESTIONS = 3;

export type Session =
  | { type: "user"; id: string }
  | { type: "expert"; id: string }
  | null;

export interface AskQuestionInput {
  askerId: string | null;
  target: QuestionTarget;
  expertId?: string;
  categorySlug: string;
  topic?: string;
  text: string;
  details?: string;
  attachments?: string[];
  privacy: QuestionPrivacy;
}

export interface AskQuestionResult {
  id: string;
  status: "answered" | "waiting";
  instantAnswer: {
    text: string;
    expertIds: string[];
    knowledgeIds: string[];
  } | null;
  joinedCluster: boolean;
  similarCount: number;
}

interface AppState {
  hasHydrated: boolean;
  session: Session;
  experts: Expert[];
  questions: Question[];
  users: AppUser[];
  knowledge: KnowledgeItem[];
  polls: Poll[];
  notifications: AppNotification[];
  votedPolls: Record<string, string>;
  visitorQuestionsAsked: number;

  setHasHydrated: (value: boolean) => void;
  loginDemo: (type: "user" | "expert") => void;
  login: (type: "user" | "expert", id: string) => void;
  logout: () => void;

  addUser: (user: AppUser) => void;
  addExpert: (expert: Expert) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  updateExpert: (id: string, patch: Partial<Expert>) => void;

  askQuestion: (input: AskQuestionInput) => AskQuestionResult;
  answerQuestion: (
    questionId: string,
    answerText: string,
    opts?: { visibility?: AnswerVisibility; sourceKnowledgeIds?: string[] }
  ) => void;
  declineQuestion: (questionId: string) => void;

  toggleFollowExpert: (userId: string, expertId: string) => void;

  addKnowledgeItem: (item: KnowledgeItem) => void;

  votePoll: (pollId: string, optionId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (
    userType: "user" | "expert",
    ownerId: string
  ) => void;

  incrementVisitorQuestions: () => void;

  resetDemoData: () => void;
}

const DEMO_USER_ID = "usr-lucas-estevam";
const DEMO_EXPERT_ID = "exp-sarah-mason";

let questionCounter = seedQuestions.length;
let knowledgeCounter = seedKnowledge.length;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      session: null,
      experts: seedExperts,
      questions: seedQuestions,
      users: seedUsers,
      knowledge: seedKnowledge,
      polls: seedPolls,
      notifications: seedNotifications,
      votedPolls: {},
      visitorQuestionsAsked: 0,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      loginDemo: (type) =>
        set({
          session: {
            type,
            id: type === "user" ? DEMO_USER_ID : DEMO_EXPERT_ID,
          },
        }),
      login: (type, id) => set({ session: { type, id } }),
      logout: () => set({ session: null }),

      addUser: (user) => set((s) => ({ users: [...s.users, user] })),
      addExpert: (expert) => set((s) => ({ experts: [...s.experts, expert] })),
      updateUser: (id, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),
      updateExpert: (id, patch) =>
        set((s) => ({
          experts: s.experts.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      askQuestion: (input) => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const state = get();

        let clusterOf: string | undefined;
        let status: "answered" | "waiting" = "waiting";
        let instantAnswer: AskQuestionResult["instantAnswer"] = null;
        let similarCount = 0;
        let answer: Question["answer"];

        if (input.target === "general") {
          // Match against every existing general question in this domain —
          // whether it's a cluster representative, an already-answered
          // question, or another waiting duplicate — then resolve the
          // *representative* of whatever cluster that match belongs to.
          const questionMatches = findSimilarQuestions(
            input.text,
            input.categorySlug,
            state.questions.filter((q) => q.target === "general"),
            0.32
          );

          if (questionMatches.length > 0) {
            const best = questionMatches[0].question;
            const repId = best.clusterOf ?? best.id;
            const representative = state.questions.find((q) => q.id === repId);
            clusterOf = repId;
            similarCount = state.questions.filter((q) => q.clusterOf === repId).length + 1;

            if (representative?.answer) {
              status = "answered";
              answer = { ...representative.answer, generation: "assisted" };
              instantAnswer = {
                text: representative.answer.text,
                expertIds: [representative.answer.authorExpertId],
                knowledgeIds: representative.answer.sourceKnowledgeIds,
              };
            }
          }

          if (!clusterOf) {
            // No similar question at all — see if existing knowledge alone
            // is enough to answer this on the spot.
            const synthesis = synthesizeAnswer(input.text, input.categorySlug, {
              questions: state.questions,
              knowledge: state.knowledge,
            });
            if (synthesis) {
              status = "answered";
              answer = {
                text: synthesis.text,
                createdAt: now.toISOString(),
                authorExpertId: synthesis.expertIds[0] ?? "",
                visibility: "named",
                generation: "assisted",
                sourceKnowledgeIds: synthesis.knowledgeIds,
              };
              instantAnswer = {
                text: synthesis.text,
                expertIds: synthesis.expertIds,
                knowledgeIds: synthesis.knowledgeIds,
              };
            }
          }
        }

        questionCounter += 1;
        const id = `q-live-${questionCounter}`;

        const question: Question = {
          id,
          askerId: input.askerId,
          target: input.target,
          expertId: input.expertId,
          categorySlug: input.categorySlug,
          topic: input.topic,
          text: input.text,
          details: input.details,
          attachments: input.attachments ?? [],
          privacy: input.privacy,
          status,
          clusterOf,
          likes: 0,
          createdAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          answer,
        };

        set((s) => ({ questions: [question, ...s.questions] }));

        return {
          id,
          status,
          instantAnswer,
          joinedCluster: Boolean(clusterOf) && status === "waiting",
          similarCount,
        };
      },

      answerQuestion: (questionId, answerText, opts) => {
        const question = get().questions.find((q) => q.id === questionId);
        const session = get().session;
        if (!question) return;
        const authorExpertId =
          session?.type === "expert" ? session.id : question.expertId ?? "";
        const answeredAt = new Date().toISOString();

        set((s) => {
          const clusterMembers = s.questions.filter(
            (q) => q.clusterOf === questionId
          );
          const memberNotifications: AppNotification[] = clusterMembers
            .filter((q): q is Question & { askerId: string } => Boolean(q.askerId))
            .map((q) => ({
              id: `notif-cluster-${q.id}`,
              userType: "user",
              ownerId: q.askerId,
              type: "cluster_answer",
              text: "An expert answered a question similar to yours.",
              read: false,
              createdAt: answeredAt,
            }));
          const askerNotification: AppNotification[] = question.askerId
            ? [
                {
                  id: `notif-answer-${question.id}`,
                  userType: "user",
                  ownerId: question.askerId,
                  type: "answer",
                  text: "Your question has been answered.",
                  read: false,
                  createdAt: answeredAt,
                },
              ]
            : [];

          return {
            questions: s.questions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    status: "answered" as const,
                    answer: {
                      text: answerText,
                      createdAt: answeredAt,
                      authorExpertId,
                      visibility: opts?.visibility ?? "named",
                      generation: "expert" as const,
                      sourceKnowledgeIds: opts?.sourceKnowledgeIds ?? [],
                    },
                  }
                : q
            ),
            experts: s.experts.map((e) =>
              e.id === authorExpertId
                ? { ...e, answersCount: e.answersCount + 1 }
                : e
            ),
            notifications: [
              ...askerNotification,
              ...memberNotifications,
              ...s.notifications,
            ],
          };
        });
      },

      declineQuestion: (questionId) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === questionId ? { ...q, status: "declined" } : q
          ),
        })),

      toggleFollowExpert: (userId, expertId) => {
        const isFollowing = get()
          .users.find((u) => u.id === userId)
          ?.followingExpertIds.includes(expertId);

        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  followingExpertIds: isFollowing
                    ? u.followingExpertIds.filter((id) => id !== expertId)
                    : [...u.followingExpertIds, expertId],
                }
              : u
          ),
          experts: s.experts.map((e) =>
            e.id === expertId
              ? {
                  ...e,
                  followersCount: e.followersCount + (isFollowing ? -1 : 1),
                }
              : e
          ),
        }));
      },

      addKnowledgeItem: (item) =>
        set((s) => ({ knowledge: [item, ...s.knowledge] })),

      votePoll: (pollId, optionId) => {
        const session = get().session;
        if (!session || get().votedPolls[pollId]) return;

        set((s) => ({
          polls: s.polls.map((p) =>
            p.id !== pollId
              ? p
              : {
                  ...p,
                  options: p.options.map((o) =>
                    o.id !== optionId
                      ? o
                      : {
                          ...o,
                          expertVotes:
                            o.expertVotes + (session.type === "expert" ? 1 : 0),
                          communityVotes:
                            o.communityVotes + (session.type === "user" ? 1 : 0),
                        }
                  ),
                }
          ),
          votedPolls: { ...s.votedPolls, [pollId]: optionId },
        }));
      },

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: (userType, ownerId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.userType === userType && n.ownerId === ownerId
              ? { ...n, read: true }
              : n
          ),
        })),

      incrementVisitorQuestions: () =>
        set((s) => ({ visitorQuestionsAsked: s.visitorQuestionsAsked + 1 })),

      resetDemoData: () => {
        questionCounter = seedQuestions.length;
        knowledgeCounter = seedKnowledge.length;
        set({
          session: null,
          experts: seedExperts,
          questions: seedQuestions,
          users: seedUsers,
          knowledge: seedKnowledge,
          polls: seedPolls,
          notifications: seedNotifications,
          votedPolls: {},
          visitorQuestionsAsked: 0,
        });
      },
    }),
    {
      name: "withub-demo-store-v2",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        session: s.session,
        experts: s.experts,
        questions: s.questions,
        users: s.users,
        knowledge: s.knowledge,
        polls: s.polls,
        notifications: s.notifications,
        votedPolls: s.votedPolls,
        visitorQuestionsAsked: s.visitorQuestionsAsked,
      }),
    }
  )
);

export function nextKnowledgeId(): string {
  knowledgeCounter += 1;
  return `kn-live-${knowledgeCounter}`;
}
