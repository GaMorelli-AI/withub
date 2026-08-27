import { ExpertFilterGrid } from "@/components/ExpertFilterGrid";
import { experts } from "@/data/experts";

export const metadata = { title: "Experts — WitHub" };

export default function ExpertsPage() {
  const sorted = [...experts].sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-fg">
        Our experts
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        {experts.length} verified professionals ready to answer your
        questions.
      </p>
      <div className="mt-8">
        <ExpertFilterGrid experts={sorted} />
      </div>
    </div>
  );
}
