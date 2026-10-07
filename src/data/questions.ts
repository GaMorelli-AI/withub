import type { Question, QuestionAnswer } from "@/lib/types";

function ans(
  text: string,
  createdAt: string,
  authorExpertId: string,
  opts?: Partial<
    Pick<QuestionAnswer, "visibility" | "generation" | "sourceKnowledgeIds">
  >
): QuestionAnswer {
  return {
    text,
    createdAt,
    authorExpertId,
    visibility: opts?.visibility ?? "named",
    generation: opts?.generation ?? "expert",
    sourceKnowledgeIds: opts?.sourceKnowledgeIds ?? [],
  };
}

function q(partial: Omit<Question, "attachments">): Question {
  return { ...partial, attachments: [] };
}

export const questions: Question[] = [
  // Sarah Mason — marketing
  q({
    id: "q-001",
    askerId: "usr-marina-costa",
    target: "expert",
    expertId: "exp-sarah-mason",
    categorySlug: "marketing",
    topic: "Growth Marketing",
    text: "How should a small company start using AI in their marketing?",
    details: "We're a 5-person team with a small budget and no dedicated data person.",
    privacy: "public",
    status: "answered",
    likes: 61,
    createdAt: "2026-06-02T09:00:00.000Z",
    expiresAt: "2026-06-04T09:00:00.000Z",
    answer: ans(
      "Start small: use AI to speed up the work you already do well, not to replace strategy. Draft ad copy variants and email sequences with a tool like Claude, then A/B test them manually. Use AI to summarize customer interviews and support tickets so you spot patterns faster. Skip anything that promises 'AI-powered attribution' until you have enough volume for it to matter — with a small budget, a simple UTM + spreadsheet setup will beat a black-box tool every time.",
      "2026-06-03T14:20:00.000Z",
      "exp-sarah-mason",
      { sourceKnowledgeIds: ["kn-001"] }
    ),
  }),
  q({
    id: "q-002",
    askerId: "usr-terry-cole",
    target: "expert",
    expertId: "exp-sarah-mason",
    categorySlug: "marketing",
    topic: "Marketing Analytics",
    text: "What's the best way to measure marketing attribution with a small budget?",
    privacy: "public",
    status: "answered",
    likes: 34,
    createdAt: "2026-05-14T09:00:00.000Z",
    expiresAt: "2026-05-16T09:00:00.000Z",
    answer: ans(
      "Full multi-touch attribution isn't worth building until you're spending well into six figures a month. Below that, use last-click plus a simple 'how did you hear about us' field at signup — it's inaccurate but directionally right, and directionally right is enough to decide what to cut.",
      "2026-05-15T11:05:00.000Z",
      "exp-sarah-mason",
      { sourceKnowledgeIds: ["kn-002"] }
    ),
  }),
  q({
    id: "q-003",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-sarah-mason",
    categorySlug: "marketing",
    topic: "SEO",
    text: "Is it too late to invest heavily in SEO in 2026?",
    details: "We're a B2B SaaS in a fairly crowded niche.",
    privacy: "public",
    status: "waiting",
    likes: 12,
    createdAt: "2026-09-23T08:00:00.000Z",
    expiresAt: "2026-09-25T08:00:00.000Z",
  }),

  // Law — asked to everyone, answered anonymously
  q({
    id: "q-004",
    askerId: "usr-hana-kimura",
    target: "general",
    categorySlug: "law",
    topic: "Immigration Law",
    text: "Does anyone know how to get a visa for Canada? And what are the best hotels to stay at in Quebec City?",
    privacy: "public",
    status: "answered",
    likes: 47,
    createdAt: "2026-04-20T09:00:00.000Z",
    expiresAt: "2026-04-22T09:00:00.000Z",
    answer: ans(
      "It depends heavily on your purpose (work, study, visit, or PR) — for a visitor visa you'll apply online through IRCC with proof of funds and ties to your home country, and processing currently runs 3-6 weeks. Happy to go deeper if you tell me which stream applies to you. For hotels — that's outside what I can advise on professionally, but Le Château Frontenac and Auberge Saint-Antoine are well reviewed in Old Québec.",
      "2026-04-21T16:40:00.000Z",
      "exp-daniela-kruger",
      { visibility: "anonymous", sourceKnowledgeIds: ["kn-013"] }
    ),
  }),
  q({
    id: "q-005",
    askerId: "usr-david-park",
    target: "expert",
    expertId: "exp-daniela-kruger",
    categorySlug: "law",
    topic: "Work Visas",
    text: "What's the fastest legitimate path to permanent residency as a software engineer moving to Canada?",
    details: "I have 6 years of experience and a pending offer from a Toronto startup.",
    privacy: "private",
    status: "answered",
    likes: 0,
    createdAt: "2026-07-01T09:00:00.000Z",
    expiresAt: "2026-07-03T09:00:00.000Z",
    answer: ans(
      "With a job offer in hand, Express Entry under the Federal Skilled Worker program is almost certainly your fastest route — your CRS score with a valid offer and 6 years of experience should be competitive within 1-2 draws. I'd also register your NOC code correctly (2173 for software engineers) since that affects both eligibility and processing speed. Happy to review your specific CRS breakdown if you send it over.",
      "2026-07-02T10:15:00.000Z",
      "exp-daniela-kruger",
      { sourceKnowledgeIds: ["kn-013"] }
    ),
  }),
  q({
    id: "q-006",
    askerId: "usr-marina-costa",
    target: "expert",
    expertId: "exp-daniela-kruger",
    categorySlug: "law",
    topic: "Immigration Law",
    text: "How long does spousal sponsorship typically take in 2026?",
    privacy: "public",
    status: "waiting",
    likes: 9,
    createdAt: "2026-09-22T12:00:00.000Z",
    expiresAt: "2026-09-24T12:00:00.000Z",
  }),

  // Marcus Boateng — technology
  q({
    id: "q-007",
    askerId: "usr-david-park",
    target: "expert",
    expertId: "exp-marcus-boateng",
    categorySlug: "technology",
    topic: "Software Architecture",
    text: "How do I prepare for a system design interview at a big tech company?",
    details: "I have 4 years of experience mostly on the frontend.",
    privacy: "public",
    status: "answered",
    likes: 88,
    createdAt: "2026-03-10T09:00:00.000Z",
    expiresAt: "2026-03-12T09:00:00.000Z",
    answer: ans(
      "Focus on the fundamentals first: load balancing, caching, database sharding, and CAP theorem trade-offs. Practice explaining your reasoning out loud, not just drawing boxes — interviewers care more about how you navigate trade-offs than the 'correct' architecture. Do 5-6 mock interviews on real prompts (design a URL shortener, a rate limiter, a news feed) before the real thing.",
      "2026-03-11T13:30:00.000Z",
      "exp-marcus-boateng",
      { sourceKnowledgeIds: ["kn-011"] }
    ),
  }),
  q({
    id: "q-008",
    askerId: "usr-bruno-alves",
    target: "expert",
    expertId: "exp-marcus-boateng",
    categorySlug: "technology",
    topic: "Software Architecture",
    text: "When should a startup move from a monolith to microservices?",
    privacy: "public",
    status: "answered",
    likes: 55,
    createdAt: "2026-02-18T09:00:00.000Z",
    expiresAt: "2026-02-20T09:00:00.000Z",
    answer: ans(
      "Later than you think. Microservices trade code complexity for operational complexity — you need real reasons (independent scaling needs, separate teams stepping on each other, deploy velocity actually blocked by coupling) before it's worth it. Most startups under 20 engineers are better off with a well-organized monolith and clear internal module boundaries.",
      "2026-02-19T15:00:00.000Z",
      "exp-marcus-boateng"
    ),
  }),
  q({
    id: "q-009",
    askerId: "usr-hana-kimura",
    target: "expert",
    expertId: "exp-marcus-boateng",
    categorySlug: "technology",
    topic: "Cloud Infrastructure",
    text: "What cloud provider should a small SaaS start on in 2026?",
    privacy: "public",
    status: "archived",
    likes: 41,
    createdAt: "2025-11-05T09:00:00.000Z",
    expiresAt: "2025-11-07T09:00:00.000Z",
    answer: ans(
      "Unless you have a specific need (GPU access, data residency, an existing enterprise agreement), it genuinely doesn't matter much at small scale — pick whichever has the best free tier and docs for your stack and move on. Optimize for shipping, not for picking the 'right' cloud.",
      "2025-11-06T10:00:00.000Z",
      "exp-marcus-boateng"
    ),
  }),

  // Isabela Ramos — health
  q({
    id: "q-010",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-isabela-ramos",
    categorySlug: "health",
    topic: "Nutrition",
    text: "What's a realistic weekly calorie deficit for sustainable weight loss?",
    privacy: "public",
    status: "answered",
    likes: 73,
    createdAt: "2026-04-02T09:00:00.000Z",
    expiresAt: "2026-04-04T09:00:00.000Z",
    answer: ans(
      "A deficit of 300-500 calories per day (roughly 0.5-1% of your body weight lost per week) is sustainable for most people without significant muscle loss or metabolic slowdown. Anything more aggressive tends to backfire through fatigue and rebound eating. Pair it with adequate protein (around 1.6-2.2g per kg of bodyweight) to protect lean mass.",
      "2026-04-03T09:45:00.000Z",
      "exp-isabela-ramos",
      { sourceKnowledgeIds: ["kn-012"] }
    ),
  }),
  q({
    id: "q-011",
    askerId: "usr-terry-cole",
    target: "expert",
    expertId: "exp-isabela-ramos",
    categorySlug: "health",
    topic: "Nutrition",
    text: "Are protein supplements necessary if I already eat enough meat?",
    privacy: "public",
    status: "answered",
    likes: 29,
    createdAt: "2026-06-20T09:00:00.000Z",
    expiresAt: "2026-06-22T09:00:00.000Z",
    answer: ans(
      "If you're consistently hitting your protein target from whole food, supplements are just convenience, not necessity. Where they help is on busy days when you'd otherwise fall short — a shake is easier to fit in than another chicken breast. There's no magic to the powder itself.",
      "2026-06-21T08:30:00.000Z",
      "exp-isabela-ramos"
    ),
  }),
  q({
    id: "q-012",
    askerId: "usr-bruno-alves",
    target: "expert",
    expertId: "exp-isabela-ramos",
    categorySlug: "health",
    topic: "Nutrition",
    text: "How do I build a meal plan for muscle gain on a tight budget?",
    details: "Around $150/month for groceries, training 4x a week.",
    privacy: "private",
    status: "waiting",
    likes: 0,
    createdAt: "2026-09-23T15:00:00.000Z",
    expiresAt: "2026-09-25T15:00:00.000Z",
  }),

  // Ahmed Al-Farsi — finance / entrepreneurship
  q({
    id: "q-013",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-ahmed-alfarsi",
    categorySlug: "finance",
    topic: "Startup Fundraising",
    text: "How should I structure my cap table before raising a seed round?",
    details: "Two co-founders, one early advisor with a verbal equity promise.",
    privacy: "private",
    status: "answered",
    likes: 0,
    createdAt: "2026-07-15T09:00:00.000Z",
    expiresAt: "2026-07-17T09:00:00.000Z",
    answer: ans(
      "Get the advisor's equity in writing now with a standard advisor agreement (typically 0.25%-1% vesting over 1-2 years) before it becomes a dispute later — verbal promises are the #1 thing that blows up cap tables. Keep a clean common pool for founders, reserve 10-15% for an option pool before you raise (investors will ask for this and it dilutes founders less if it's set up upfront), and avoid convertible notes stacking with different caps if you can help it — it gets messy fast at conversion.",
      "2026-07-16T12:00:00.000Z",
      "exp-ahmed-alfarsi",
      { generation: "assisted", sourceKnowledgeIds: ["kn-007"] }
    ),
  }),
  q({
    id: "q-014",
    askerId: "usr-david-park",
    target: "expert",
    expertId: "exp-ahmed-alfarsi",
    categorySlug: "finance",
    topic: "Startup Fundraising",
    text: "What do angel investors actually look for in a pitch deck?",
    privacy: "public",
    status: "answered",
    likes: 66,
    createdAt: "2026-05-28T09:00:00.000Z",
    expiresAt: "2026-05-30T09:00:00.000Z",
    answer: ans(
      "Honestly, most of the decision happens before the deck even opens — it's the team and the traction line in your intro email. Once I'm in the deck, I'm scanning for: a problem I believe is real and growing, a wedge into the market that's specific (not 'we do everything'), and evidence you can execute (even scrappy early traction beats a polished projection).",
      "2026-05-29T09:20:00.000Z",
      "exp-ahmed-alfarsi",
      { sourceKnowledgeIds: ["kn-008"] }
    ),
  }),
  q({
    id: "q-015",
    askerId: "usr-marina-costa",
    target: "expert",
    expertId: "exp-ahmed-alfarsi",
    categorySlug: "entrepreneurship",
    topic: "Startup Fundraising",
    text: "Is it smarter to raise a bridge round right now or just cut costs and extend runway?",
    privacy: "public",
    status: "waiting",
    likes: 5,
    createdAt: "2026-09-22T09:00:00.000Z",
    expiresAt: "2026-09-24T09:00:00.000Z",
  }),

  // Priya Nathan — AI, with a similar-questions cluster
  q({
    id: "q-016",
    askerId: "usr-bruno-alves",
    target: "general",
    categorySlug: "artificial-intelligence",
    topic: "AI Strategy",
    text: "How can a small business start using AI?",
    privacy: "public",
    status: "answered",
    likes: 94,
    createdAt: "2026-03-30T09:00:00.000Z",
    expiresAt: "2026-04-01T09:00:00.000Z",
    answer: ans(
      "Pick one workflow where the cost of being wrong is low but the volume is high — customer support triage, internal documentation search, first-draft copy. Ship a narrow version in weeks, not a platform in quarters. Most failed AI pilots fail because they tried to solve everything at once instead of proving value on one clearly bounded task first.",
      "2026-03-31T11:10:00.000Z",
      "exp-priya-nathan",
      { generation: "assisted", sourceKnowledgeIds: ["kn-004", "kn-005"] }
    ),
  }),
  q({
    id: "q-016b",
    askerId: "usr-marina-costa",
    target: "general",
    categorySlug: "artificial-intelligence",
    topic: "AI Strategy",
    text: "How should SMEs implement AI?",
    privacy: "public",
    status: "waiting",
    clusterOf: "q-016",
    likes: 8,
    createdAt: "2026-03-30T10:00:00.000Z",
    expiresAt: "2026-04-01T10:00:00.000Z",
  }),
  q({
    id: "q-016c",
    askerId: "usr-terry-cole",
    target: "general",
    categorySlug: "artificial-intelligence",
    topic: "AI Strategy",
    text: "Where should I start with AI in my company?",
    privacy: "public",
    status: "waiting",
    clusterOf: "q-016",
    likes: 6,
    createdAt: "2026-03-31T08:00:00.000Z",
    expiresAt: "2026-04-02T08:00:00.000Z",
  }),
  q({
    id: "q-016d",
    askerId: "usr-hana-kimura",
    target: "general",
    categorySlug: "artificial-intelligence",
    topic: "AI Strategy",
    text: "How can my company adopt generative AI?",
    privacy: "public",
    status: "waiting",
    clusterOf: "q-016",
    likes: 4,
    createdAt: "2026-04-01T09:30:00.000Z",
    expiresAt: "2026-04-03T09:30:00.000Z",
  }),
  q({
    id: "q-017",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-priya-nathan",
    categorySlug: "artificial-intelligence",
    topic: "AI Agents",
    text: "What's the realistic ROI of building an AI agent for customer support today?",
    details: "We handle about 400 tickets a week.",
    privacy: "public",
    status: "answered",
    likes: 52,
    createdAt: "2026-07-22T09:00:00.000Z",
    expiresAt: "2026-07-24T09:00:00.000Z",
    answer: ans(
      "At 400 tickets a week, a well-scoped agent handling tier-1 triage (routing, FAQ-type answers, order status) can realistically deflect 25-40% of volume within a couple of months, which usually pays for itself quickly. Full resolution without a human in the loop is still shakier — budget for a review queue, not full autonomy, for at least the first two quarters.",
      "2026-07-23T14:00:00.000Z",
      "exp-priya-nathan",
      { sourceKnowledgeIds: ["kn-005"] }
    ),
  }),
  q({
    id: "q-018",
    askerId: "usr-hana-kimura",
    target: "expert",
    expertId: "exp-priya-nathan",
    categorySlug: "artificial-intelligence",
    topic: "LLMs",
    text: "Are open-source LLMs good enough for production use in 2026?",
    privacy: "public",
    status: "expired",
    likes: 18,
    createdAt: "2026-06-01T09:00:00.000Z",
    expiresAt: "2026-06-03T09:00:00.000Z",
  }),

  // Lucas Ferreira — sales
  q({
    id: "q-019",
    askerId: "usr-terry-cole",
    target: "expert",
    expertId: "exp-lucas-ferreira",
    categorySlug: "sales",
    topic: "Cold Outreach",
    text: "How do I build a cold outreach sequence that doesn't feel spammy?",
    privacy: "public",
    status: "answered",
    likes: 37,
    createdAt: "2026-05-05T09:00:00.000Z",
    expiresAt: "2026-05-07T09:00:00.000Z",
    answer: ans(
      "Cut it to 4 touches max and make every single one reference something specific about the account, not just their name and company merged in. The 'spammy' feeling almost always comes from volume plus generic copy — fix the copy and you can send fewer, better emails and get more replies.",
      "2026-05-06T09:30:00.000Z",
      "exp-lucas-ferreira"
    ),
  }),
  q({
    id: "q-020",
    askerId: "usr-david-park",
    target: "expert",
    expertId: "exp-lucas-ferreira",
    categorySlug: "sales",
    topic: "Sales Leadership",
    text: "What's a healthy quota-to-rep ratio for a 10-person sales team?",
    privacy: "public",
    status: "answered",
    likes: 22,
    createdAt: "2026-04-11T09:00:00.000Z",
    expiresAt: "2026-04-13T09:00:00.000Z",
    answer: ans(
      "As a rough benchmark, aim for quotas that the top 60-70% of your team can hit consistently — if only your top 2 reps are hitting number, the quota is set for your best performer, not your team. Revisit it quarterly as your pipeline and ramp data mature.",
      "2026-04-12T10:00:00.000Z",
      "exp-lucas-ferreira"
    ),
  }),
  q({
    id: "q-021",
    askerId: "usr-marina-costa",
    target: "expert",
    expertId: "exp-lucas-ferreira",
    categorySlug: "sales",
    topic: "Negotiation",
    text: "How do you handle a prospect who keeps going quiet after a great demo?",
    privacy: "public",
    status: "waiting",
    likes: 8,
    createdAt: "2026-09-23T10:00:00.000Z",
    expiresAt: "2026-09-25T10:00:00.000Z",
  }),

  // Naomi Clarke — career
  q({
    id: "q-022",
    askerId: "usr-hana-kimura",
    target: "expert",
    expertId: "exp-naomi-clarke",
    categorySlug: "career",
    topic: "Interview Prep",
    text: "How do I explain a layoff in an interview without sounding negative about my old company?",
    privacy: "public",
    status: "answered",
    likes: 105,
    createdAt: "2026-03-02T09:00:00.000Z",
    expiresAt: "2026-03-04T09:00:00.000Z",
    answer: ans(
      "Keep it to one neutral sentence — 'the company went through a restructuring and my team was affected' — then move straight into what you did next. Interviewers are listening for how you talk about it more than the fact itself; brief and forward-looking always reads better than a long explanation.",
      "2026-03-03T09:15:00.000Z",
      "exp-naomi-clarke",
      { sourceKnowledgeIds: ["kn-009"] }
    ),
  }),
  q({
    id: "q-023",
    askerId: "usr-bruno-alves",
    target: "expert",
    expertId: "exp-naomi-clarke",
    categorySlug: "career",
    topic: "Salary Negotiation",
    text: "What's a good way to negotiate salary when I have a competing offer?",
    privacy: "public",
    status: "answered",
    likes: 81,
    createdAt: "2026-06-14T09:00:00.000Z",
    expiresAt: "2026-06-16T09:00:00.000Z",
    answer: ans(
      "Be direct and specific: share the number (or at least the range) from the competing offer, and tell them clearly that this role is your preference if they can get close. Vague leverage ('I have other options') is much weaker than a real number — recruiters can work with specifics, not hints.",
      "2026-06-15T08:50:00.000Z",
      "exp-naomi-clarke",
      { sourceKnowledgeIds: ["kn-010"] }
    ),
  }),
  q({
    id: "q-024",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-naomi-clarke",
    categorySlug: "career",
    topic: "Resume & LinkedIn",
    text: "Should I put a career break on my resume or just skip the dates?",
    details: "8-month break to care for a family member.",
    privacy: "public",
    status: "archived",
    likes: 44,
    createdAt: "2025-10-10T09:00:00.000Z",
    expiresAt: "2025-10-12T09:00:00.000Z",
    answer: ans(
      "List it plainly — 'Family Caregiving, 2025' as its own line with dates. Recruiters have seen this constantly since 2020 and gaps read far worse when they look hidden than when they're just stated. One line is enough; you don't owe more detail than that.",
      "2025-10-11T09:40:00.000Z",
      "exp-naomi-clarke"
    ),
  }),

  // Renata Silva — design/architecture
  q({
    id: "q-025",
    askerId: "usr-terry-cole",
    target: "expert",
    expertId: "exp-renata-silva",
    categorySlug: "design",
    topic: "Architecture",
    text: "How do I brief an architect if I don't fully know what I want yet?",
    privacy: "public",
    status: "answered",
    likes: 26,
    createdAt: "2026-05-19T09:00:00.000Z",
    expiresAt: "2026-05-21T09:00:00.000Z",
    answer: ans(
      "You don't need a finished vision, just honest constraints: budget, how you actually use your space day to day, and 5-10 reference images of things you like (and dislike). A good architect's job is to turn that into options — come with problems and preferences, not a finished design.",
      "2026-05-20T13:00:00.000Z",
      "exp-renata-silva"
    ),
  }),
  q({
    id: "q-026",
    askerId: "usr-david-park",
    target: "expert",
    expertId: "exp-renata-silva",
    categorySlug: "design",
    topic: "Residential Design",
    text: "What's a fair price range for a mid-size residential renovation project?",
    details: "Roughly 120sqm apartment, kitchen and two bathrooms.",
    privacy: "private",
    status: "waiting",
    likes: 0,
    createdAt: "2026-09-21T09:00:00.000Z",
    expiresAt: "2026-09-23T09:00:00.000Z",
  }),

  // Kevin O'Brien — sports
  q({
    id: "q-027",
    askerId: "usr-hana-kimura",
    target: "expert",
    expertId: "exp-kevin-obrien",
    categorySlug: "sports",
    topic: "Injury Prevention",
    text: "How much should a recreational runner train to avoid injury?",
    privacy: "public",
    status: "answered",
    likes: 39,
    createdAt: "2026-04-25T09:00:00.000Z",
    expiresAt: "2026-04-27T09:00:00.000Z",
    answer: ans(
      "The 10% rule still holds up well: don't increase your weekly mileage by more than about 10% week over week. Most recreational running injuries come from doing too much too soon, not from running itself — add strength training twice a week and you'll cut your injury risk further.",
      "2026-04-26T10:30:00.000Z",
      "exp-kevin-obrien"
    ),
  }),
  q({
    id: "q-028",
    askerId: "usr-marina-costa",
    target: "expert",
    expertId: "exp-kevin-obrien",
    categorySlug: "sports",
    topic: "Athletic Performance",
    text: "What's actually worth doing for recovery after intense training?",
    privacy: "public",
    status: "answered",
    likes: 31,
    createdAt: "2026-07-08T09:00:00.000Z",
    expiresAt: "2026-07-10T09:00:00.000Z",
    answer: ans(
      "Sleep and protein intake do about 80% of the work — ice baths and foam rolling are nice-to-haves, not the foundation. If you're only going to fix one thing, fix your sleep consistency first; nothing else compensates for it.",
      "2026-07-09T09:00:00.000Z",
      "exp-kevin-obrien"
    ),
  }),

  // Julia Andersson — design/product
  q({
    id: "q-029",
    askerId: "usr-bruno-alves",
    target: "expert",
    expertId: "exp-julia-andersson",
    categorySlug: "design",
    topic: "Portfolio Review",
    text: "What should a UX portfolio include to get noticed in 2026?",
    privacy: "public",
    status: "answered",
    likes: 58,
    createdAt: "2026-06-09T09:00:00.000Z",
    expiresAt: "2026-06-11T09:00:00.000Z",
    answer: ans(
      "Three deep case studies beat ten shallow ones. Show your process, not just polished final screens — the decisions you made, the constraints you worked under, and what changed based on user feedback. Recruiters skim, but hiring managers read, so make the depth easy to find for whoever's actually deciding.",
      "2026-06-10T11:20:00.000Z",
      "exp-julia-andersson",
      { sourceKnowledgeIds: ["kn-014"] }
    ),
  }),
  q({
    id: "q-030",
    askerId: "usr-terry-cole",
    target: "expert",
    expertId: "exp-julia-andersson",
    categorySlug: "design",
    topic: "Design Systems",
    text: "How does a design system team actually work day to day?",
    privacy: "public",
    status: "waiting",
    likes: 14,
    createdAt: "2026-09-23T09:00:00.000Z",
    expiresAt: "2026-09-25T09:00:00.000Z",
  }),

  // Thiago Nunes — travel
  q({
    id: "q-031",
    askerId: "usr-terry-cole",
    target: "general",
    categorySlug: "travel",
    topic: "Budget Travel",
    text: "What is the best way to get cheap hotel reservations and airline tickets? Do you recommend any websites?",
    privacy: "public",
    status: "answered",
    likes: 138,
    createdAt: "2026-07-30T09:00:00.000Z",
    expiresAt: "2026-08-01T09:00:00.000Z",
    answer: ans(
      "For flights, set fare alerts on Google Flights and book in incognito — but the real savings come from being flexible on dates, not from a secret website. For hotels, I almost always cross-check the hotel's own site against booking platforms since many now price-match or beat OTAs directly for loyalty members.",
      "2026-07-31T09:30:00.000Z",
      "exp-thiago-nunes",
      { sourceKnowledgeIds: ["kn-015"] }
    ),
  }),
  q({
    id: "q-032",
    askerId: "usr-hana-kimura",
    target: "expert",
    expertId: "exp-thiago-nunes",
    categorySlug: "travel",
    topic: "Trip Planning",
    text: "What are the best hotels to stay at in Quebec City for a long weekend?",
    privacy: "public",
    status: "answered",
    likes: 31,
    createdAt: "2026-08-01T09:00:00.000Z",
    expiresAt: "2026-08-03T09:00:00.000Z",
    answer: ans(
      "Le Château Frontenac is the iconic pick if you want to splurge, but Auberge Saint-Antoine and Hotel Clarendon both give you the Old Québec charm for less. Book at least a month out if you're visiting during Winter Carnival — rooms disappear fast.",
      "2026-08-02T09:00:00.000Z",
      "exp-thiago-nunes"
    ),
  }),
  q({
    id: "q-033",
    askerId: "usr-lucas-estevam",
    target: "expert",
    expertId: "exp-thiago-nunes",
    categorySlug: "travel",
    topic: "Points & Miles",
    text: "Is it worth getting a travel rewards credit card if I only fly twice a year?",
    privacy: "public",
    status: "waiting",
    likes: 6,
    createdAt: "2026-09-23T07:00:00.000Z",
    expiresAt: "2026-09-25T07:00:00.000Z",
  }),

  // Genuinely unanswered — sits in the Unanswered Questions queue for Engineering
  q({
    id: "q-034",
    askerId: "usr-david-park",
    target: "general",
    categorySlug: "engineering",
    topic: "Project Engineering",
    text: "Is it possible to get a professional engineering license without a degree from a US university?",
    privacy: "public",
    status: "waiting",
    likes: 3,
    createdAt: "2026-09-20T09:00:00.000Z",
    expiresAt: "2026-09-27T09:00:00.000Z",
  }),
];

export function getQuestionById(id: string): Question | undefined {
  return questions.find((qq) => qq.id === id);
}

export function getQuestionsByExpert(expertId: string): Question[] {
  return questions.filter((qq) => qq.expertId === expertId);
}

export function getQuestionsByAsker(askerId: string): Question[] {
  return questions.filter((qq) => qq.askerId === askerId);
}

export function getQuestionsByCategory(categorySlug: string): Question[] {
  return questions.filter((qq) => qq.categorySlug === categorySlug);
}

export function getClusterMembers(representativeId: string): Question[] {
  return questions.filter((qq) => qq.clusterOf === representativeId);
}
