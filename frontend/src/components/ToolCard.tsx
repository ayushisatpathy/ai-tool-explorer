"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tool } from "@/types";
import { PricingBadge } from "./PricingBadge";
import { api } from "@/lib/api";

interface Props {
  tool: Tool;
  onFavoriteChange?: (toolId: string, isFav: boolean) => void;
}

export function ToolCard({ tool, onFavoriteChange }: Props) {
  const [isFav, setIsFav] = useState(tool.is_favorite);
const [loading, setLoading] = useState(false);
const [imageError, setImageError] = useState(false);

// Reset image state if a different tool is rendered
useEffect(() => {
  setImageError(false);
}, [tool.logo_url]);

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.tools.toggleFavorite(tool.id);
      setIsFav(res.is_favorite);
      onFavoriteChange?.(tool.id, res.is_favorite);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
          {tool.logo_url && !imageError ? (
  <Image
    src={tool.logo_url}
    alt={tool.name}
    width={48}
    height={48}
    className="object-contain"
    unoptimized
    onError={() => setImageError(true)}
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-indigo-100">
    <span className="text-lg font-bold text-indigo-600">
      {tool.name.charAt(0).toUpperCase()}
    </span>
  </div>
)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h3>
            <button
              onClick={handleFavorite}
              disabled={loading}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              className="shrink-0 text-lg transition-transform hover:scale-110 disabled:opacity-50"
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
          <PricingBadge pricing={tool.pricing_model} className="mt-1" />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-sm text-gray-500 line-clamp-2">
          {tool.description || "No description available."}
        </p>
      </div>

      {/* Categories */}
      {tool.categories.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-1">
          {tool.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
