import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/data/categories";

export const metadata = { title: "Categories — WitHub" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-fg">
        Explore knowledge
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Browse all {categories.length} categories on WitHub.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
