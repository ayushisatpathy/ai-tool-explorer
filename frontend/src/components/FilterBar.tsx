"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

const PRICING_OPTIONS = ["Free", "Freemium", "Paid", "Trial", "Unknown"];

interface Props {
  categories: Category[];
}

export function FilterBar({ categories }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/?${params}`);
  }

  const currentPricing = sp.get("pricing");
  const currentCategory = sp.get("category");
  const favOnly = sp.get("favorites_only") === "true";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Pricing filter */}
      <select
        value={currentPricing ?? ""}
        onChange={(e) => setParam("pricing", e.target.value || null)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Pricing</option>
        {PRICING_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Category filter */}
      <select
        value={currentCategory ?? ""}
        onChange={(e) => setParam("category", e.target.value || null)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      {/* Favorites toggle */}
      <button
        onClick={() => setParam("favorites_only", favOnly ? null : "true")}
        className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors ${
          favOnly
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        {favOnly ? "❤️" : "🤍"} Favorites
      </button>

      {/* Clear filters */}
      {(currentPricing || currentCategory || favOnly) && (
        <button
          onClick={() => router.push("/")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
