export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { Pagination } from "@/components/Pagination";
import { RealtimeListener } from "@/components/RealtimeListener";

interface SearchParams {
  search?: string;
  category?: string;
  pricing?: string;
  favorites_only?: string;
  page?: string;
}

const LIMIT = 20;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const [{ tools, total }, categories] = await Promise.all([
    api.tools.list({
      search: params.search,
      category: params.category,
      pricing: params.pricing,
      favorites_only: params.favorites_only === "true",
      page,
      limit: LIMIT,
    }),
    api.tools.categories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RealtimeListener />
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Discover <span className="text-indigo-600">AI Tools</span>
        </h1>
        <p className="text-gray-500 text-lg">
          {total} tools curated and updated automatically.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
        <Suspense>
          <FilterBar categories={categories} />
        </Suspense>
      </div>

      {/* Grid */}
      {tools.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-medium">No tools found.</p>
          <p className="mt-2 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination total={total} limit={LIMIT} page={page} />
      </Suspense>
    </div>
  );
}
