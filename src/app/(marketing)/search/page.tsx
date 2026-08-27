import { SearchBar } from "@/components/SearchBar";
import { ExpertCard } from "@/components/ExpertCard";
import { CategoryCard } from "@/components/CategoryCard";
import { QuestionCard } from "@/components/QuestionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { search, hasResults } from "@/lib/search";
import { SearchX } from "lucide-react";

export const metadata = { title: "Search — WitHub" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = search(query, 30);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SearchBar variant="hero" className="mb-4" />
      <p className="mt-2 text-sm text-fg-muted">
        {query
          ? `Results for "${query}"`
          : "Search for a question, an expert, or a category."}
      </p>

      {query && !hasResults(results) && (
        <EmptyState
          className="mt-8"
          icon={SearchX}
          title="No results found"
          description="Try a different keyword, or browse categories instead."
        />
      )}

      {results.experts.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-fg">
            Experts
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.experts.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </section>
      )}

      {results.questions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-fg">
            Questions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {results.questions.map((qq) => (
              <QuestionCard key={qq.id} question={qq} />
            ))}
          </div>
        </section>
      )}

      {results.categories.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-fg">
            Categories
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
