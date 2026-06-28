import type { Tool, ToolListResponse, Category, ScrapeRun, ScrapeResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API request failed");
  }
  return res.json();
}

export interface ToolsParams {
  search?: string;
  category?: string;
  pricing?: string;
  favorites_only?: boolean;
  page?: number;
  limit?: number;
}

export const api = {
  tools: {
    list: (params: ToolsParams = {}) => {
      const qs = new URLSearchParams();
      if (params.search) qs.set("search", params.search);
      if (params.category) qs.set("category", params.category);
      if (params.pricing) qs.set("pricing", params.pricing);
      if (params.favorites_only) qs.set("favorites_only", "true");
      if (params.page) qs.set("page", String(params.page));
      if (params.limit) qs.set("limit", String(params.limit));
      return fetchAPI<ToolListResponse>(`/api/tools?${qs}`);
    },
    get: (slug: string) => fetchAPI<Tool>(`/api/tools/${slug}`),
    toggleFavorite: (toolId: string) =>
      fetchAPI<{ is_favorite: boolean }>(`/api/tools/${toolId}/favorite`, { method: "POST" }),
    categories: () => fetchAPI<Category[]>("/api/tools/categories"),
  },
  admin: {
    scrape: () => fetchAPI<ScrapeResponse>("/api/admin/scrape", { method: "POST" }),
    runs: (limit = 10) => fetchAPI<ScrapeRun[]>(`/api/admin/scrape/runs?limit=${limit}`),
    getRun: (id: string) => fetchAPI<ScrapeRun>(`/api/admin/scrape/runs/${id}`),
  },
};
