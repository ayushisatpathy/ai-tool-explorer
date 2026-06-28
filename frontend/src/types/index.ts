export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  canonical_url: string;
  logo_url: string | null;
  pricing_model: "Free" | "Freemium" | "Paid" | "Trial" | "Unknown";
  last_seen_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_favorite: boolean;
  categories: string[];
}

export interface ToolListResponse {
  tools: Tool[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ScrapeRun {
  id: string;
  status: "running" | "completed" | "failed";
  started_at: string | null;
  completed_at: string | null;
  tools_scraped: number;
  error_message: string | null;
}

export interface ScrapeResponse {
  run_id: string;
  message: string;
}

export type PricingModel = "Free" | "Freemium" | "Paid" | "Trial" | "Unknown";
