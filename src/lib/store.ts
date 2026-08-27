import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { experts as seedExperts } from "@/data/experts";
import { questions as seedQuestions } from "@/data/questions";
import { users as seedUsers } from "@/data/users";
import { earnings as seedEarnings } from "@/data/earnings";
import { notifications as seedNotifications } from "@/data/notifications";
import type {
  AppNotification,
  AppUser,
  EarningsTransaction,
  Expert,
  Question,
  QuestionPrivacy,
} from "@/lib/types";

export const PLATFORM_FEE_RATE = 0.2;

export function splitPrice(price: number) {
  const platformFee = Math.round(price * PLATFORM_FEE_RATE);
  return { platformFee, expertEarnings: price - platformFee };
}

export type Session =
  | { type: "user"; id: string }
  | { type: "expert"; id: string }
  | null;

export interface AskQuestionInput {
  askerId: string;
  expertId: string;
  categorySlug: string;
  topic?: string;
  text: string;
  details?: string;
  privacy: QuestionPrivacy;
  price: number;
}

interface AppState {
  hasHydrated: boolean;
  session: Session;
  experts: Expert[];
  questions: Question[];
  users: AppUser[];
  earningsTx: EarningsTransaction[];
  notifications: AppNotification[];

  setHasHydrated: (value: boolean) => void;
  loginDemo: (type: "user" | "expert") => void;
  login: (type: "user" | "expert", id: string) => void;
  logout: () => void;

  addUser: (user: AppUser) => void;
  addExpert: (expert: Expert) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  updateExpert: (id: string, patch: Partial<Expert>) => void;

  askQuestion: (input: AskQuestionInput) => string;
  answerQuestion: (questionId: string, answerText: string) => void;
  declineQuestion: (questionId: string) => void;

  toggleSaveExpert: (userId: string, expertId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (
    userType: "user" | "expert",
    ownerId: string
  ) => void;

  resetDemoData: () => void;
}

const DEMO_USER_ID = "usr-lucas-estevam";
const DEMO_EXPERT_ID = "exp-sarah-mason";

let questionCounter = seedQuestions.length;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      session: null,
      experts: seedExperts,
      questions: seedQuestions,
      users: seedUsers,
      earningsTx: seedEarnings,
      notifications: seedNotifications,

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
      addExpert: (expert) =>
        set((s) => ({ experts: [...s.experts, expert] })),
      updateUser: (id, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),
      updateExpert: (id, patch) =>
        set((s) => ({
          experts: s.experts.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      askQuestion: (input) => {
        questionCounter += 1;
        const id = `q-live-${questionCounter}`;
        const { platformFee, expertEarnings } = splitPrice(input.price);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);

        const question: Question = {
          id,
          askerId: input.askerId,
          expertId: input.expertId,
          categorySlug: input.categorySlug,
          topic: input.topic,
          text: input.text,
          details: input.details,
          attachments: [],
          privacy: input.privacy,
          status: "waiting",
          price: input.price,
          platformFee,
          expertEarnings,
          likes: 0,
          createdAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };

        set((s) => ({ questions: [question, ...s.questions] }));
        return id;
      },

      answerQuestion: (questionId, answerText) => {
        const question = get().questions.find((q) => q.id === questionId);
        if (!question) return;
        const answeredAt = new Date().toISOString();

        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  status: "answered",
                  answer: { text: answerText, createdAt: answeredAt },
                }
              : q
          ),
          experts: s.experts.map((e) =>
            e.id === question.expertId
              ? { ...e, answersCount: e.answersCount + 1 }
              : e
          ),
          earningsTx: [
            {
              id: `earn-${questionId}`,
              expertId: question.expertId,
              questionId: question.id,
              userName:
                s.users.find((u) => u.id === question.askerId)?.name ??
                "Anonymous",
              questionText: question.text,
              amount: question.expertEarnings,
              status: "paid",
              date: answeredAt,
            },
            ...s.earningsTx,
          ],
        }));
      },

      declineQuestion: (questionId) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === questionId ? { ...q, status: "declined" } : q
          ),
        })),

      toggleSaveExpert: (userId, expertId) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  savedExpertIds: u.savedExpertIds.includes(expertId)
                    ? u.savedExpertIds.filter((id) => id !== expertId)
                    : [...u.savedExpertIds, expertId],
                }
              : u
          ),
        })),

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

      resetDemoData: () =>
        set({
          session: null,
          experts: seedExperts,
          questions: seedQuestions,
          users: seedUsers,
          earningsTx: seedEarnings,
          notifications: seedNotifications,
        }),
    }),
    {
      name: "withub-demo-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        session: s.session,
        experts: s.experts,
        questions: s.questions,
        users: s.users,
        earningsTx: s.earningsTx,
        notifications: s.notifications,
      }),
    }
  )
);
