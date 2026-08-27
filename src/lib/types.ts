export type Currency = number;

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide-react icon name
  description: string;
  topics: string[];
}

export type Language = string;

export interface Expert {
  id: string;
  name: string;
  headline: string; // job title / role
  company?: string;
  location: string;
  country: string;
  languages: Language[];
  bio: string;
  experience: string;
  categorySlugs: string[];
  tags: string[];
  pricePerQuestion: Currency;
  rating: number;
  answersCount: number;
  followersCount: number;
  responseRate: number; // percentage 0-100
  verification: "verified" | "pending";
  joinedAt: string; // ISO date
  gradientSeed: number; // 0-5, used to pick avatar gradient
}

export type QuestionPrivacy = "public" | "private";
export type QuestionStatus =
  | "waiting"
  | "answered"
  | "archived"
  | "expired"
  | "declined";

export interface QuestionAnswer {
  text: string;
  createdAt: string; // ISO date
}

export interface Question {
  id: string;
  askerId: string;
  expertId: string;
  categorySlug: string;
  topic?: string;
  text: string;
  details?: string;
  attachments?: string[];
  privacy: QuestionPrivacy;
  status: QuestionStatus;
  price: Currency;
  platformFee: Currency;
  expertEarnings: Currency;
  likes: number;
  createdAt: string; // ISO date
  expiresAt: string; // ISO date
  answer?: QuestionAnswer;
}

export interface Review {
  id: string;
  expertId: string;
  userId: string;
  questionId?: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  country: string;
  interests: string[]; // category slugs
  savedExpertIds: string[];
  joinedAt: string;
  gradientSeed: number;
}

export type NotificationType =
  | "answer"
  | "follower"
  | "reminder"
  | "system";

export interface AppNotification {
  id: string;
  userType: "user" | "expert";
  ownerId: string; // userId or expertId
  type: NotificationType;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface EarningsTransaction {
  id: string;
  expertId: string;
  questionId: string;
  userName: string;
  questionText: string;
  amount: Currency;
  status: "paid" | "pending";
  date: string; // ISO date
}
