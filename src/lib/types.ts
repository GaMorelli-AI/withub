export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide-react icon name
  description: string;
  topics: string[];
}

// "Domain" is the conceptual name used in the schema/brief; a Category *is* a Domain.
export type Domain = Category;

export type Language = string;
export type ModerationStatus = "published" | "pending" | "flagged" | "removed";

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
  rating: number;
  answersCount: number;
  followersCount: number;
  responseRate: number; // percentage 0-100
  verification: "verified" | "pending";
  linkedinUrl?: string;
  website?: string;
  otherSocialLabel?: string;
  otherSocialUrl?: string;
  joinedAt: string; // ISO date
  gradientSeed: number; // 0-5, used to pick avatar gradient
}

export type QuestionPrivacy = "public" | "private";
export type QuestionTarget = "general" | "expert";
export type AnswerVisibility = "named" | "anonymous";
export type QuestionStatus =
  | "waiting"
  | "answered"
  | "archived"
  | "expired"
  | "declined";

export interface QuestionAnswer {
  text: string;
  createdAt: string; // ISO date
  authorExpertId: string;
  visibility: AnswerVisibility;
  sourceKnowledgeIds: string[];
  generation: "expert" | "assisted"; // manually written vs generated-from-knowledge
}

export interface Question {
  id: string;
  askerId: string | null; // null = anonymous visitor session
  target: QuestionTarget;
  expertId?: string; // set when target === "expert"
  categorySlug: string;
  topic?: string;
  text: string;
  details?: string;
  attachments?: string[];
  privacy: QuestionPrivacy;
  status: QuestionStatus;
  clusterOf?: string; // id of the representative question this duplicates
  likes: number;
  createdAt: string; // ISO date
  expiresAt: string; // ISO date
  answer?: QuestionAnswer;
}

export type KnowledgeSourceType = "text" | "url" | "file" | "pdf";
export type KnowledgeAccess = "free" | "subscribers";

export interface KnowledgeItem {
  id: string;
  expertId: string;
  title: string;
  body: string;
  sourceType: KnowledgeSourceType;
  sourceUrl?: string;
  categorySlug: string;
  topics: string[];
  access: KnowledgeAccess;
  status: ModerationStatus;
  views: number;
  createdAt: string;
}

export interface PollOption {
  id: string;
  label: string;
  expertVotes: number;
  communityVotes: number;
}

export type PollTrend = "up" | "down" | "flat";

export interface Poll {
  id: string;
  categorySlug: string;
  question: string;
  options: PollOption[];
  trend: PollTrend;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  country: string;
  language: Language;
  interests: string[]; // category slugs
  followingExpertIds: string[];
  subscriptionTier: "free" | "premium";
  privateProfile: boolean;
  joinedAt: string;
  gradientSeed: number;
}

export type NotificationType =
  | "answer"
  | "cluster_answer"
  | "follower"
  | "poll_result"
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
