import type { AppUser } from "@/lib/types";

export const users: AppUser[] = [
  {
    id: "usr-lucas-estevam",
    name: "Lucas Estevam",
    email: "lucas.estevam@example.com",
    country: "Brazil",
    interests: ["travel", "business", "artificial-intelligence", "entrepreneurship"],
    savedExpertIds: ["exp-sarah-mason", "exp-ahmed-alfarsi", "exp-thiago-nunes"],
    joinedAt: "2024-05-11",
    gradientSeed: 1,
  },
  {
    id: "usr-marina-costa",
    name: "Marina Costa",
    email: "marina.costa@example.com",
    country: "Portugal",
    interests: ["design", "career"],
    savedExpertIds: ["exp-julia-andersson"],
    joinedAt: "2024-02-19",
    gradientSeed: 3,
  },
  {
    id: "usr-terry-cole",
    name: "Terry Cole",
    email: "terry.cole@example.com",
    country: "United States",
    interests: ["finance", "business"],
    savedExpertIds: [],
    joinedAt: "2023-12-02",
    gradientSeed: 0,
  },
  {
    id: "usr-david-park",
    name: "David Park",
    email: "david.park@example.com",
    country: "South Korea",
    interests: ["technology", "artificial-intelligence"],
    savedExpertIds: ["exp-marcus-boateng"],
    joinedAt: "2024-07-23",
    gradientSeed: 2,
  },
  {
    id: "usr-hana-kimura",
    name: "Hana Kimura",
    email: "hana.kimura@example.com",
    country: "Japan",
    interests: ["health", "lifestyle"],
    savedExpertIds: [],
    joinedAt: "2024-09-14",
    gradientSeed: 4,
  },
  {
    id: "usr-bruno-alves",
    name: "Bruno Alves",
    email: "bruno.alves@example.com",
    country: "Brazil",
    interests: ["sales", "business", "entrepreneurship"],
    savedExpertIds: ["exp-lucas-ferreira"],
    joinedAt: "2024-03-30",
    gradientSeed: 5,
  },
];

export function getUserById(id: string): AppUser | undefined {
  return users.find((u) => u.id === id);
}
