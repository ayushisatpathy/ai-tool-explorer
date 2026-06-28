"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { ScrapeRun } from "@/types";
import { formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  running: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const [runs, setRuns] = useState<ScrapeRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.admin.runs(15);
      setRuns(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  // Poll for updates if a run is active
  useEffect(() => {
    const hasRunning = runs.some((r) => r.status === "running");
    if (!hasRunning) return;
    const id = setInterval(fetchRuns, 3000);
    return () => clearInterval(id);
  }, [runs, fetchRuns]);

  async function handleScrape() {
    setScraping(true);
    setMessage(null);
    try {
      const res = await api.admin.scrape();
      setMessage({ text: `Scrape started! Run ID: ${res.run_id}`, type: "success" });
      setTimeout(fetchRuns, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to start scrape.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
      <p className="text-gray-500 mb-8">
        Trigger the AI tools scraper and monitor run history.
      </p>

      {/* Scraper trigger */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Run Scraper</h2>
        <p className="text-sm text-gray-500 mb-4">
          Scrapes AI tools from{" "}
          <a
            href="https://www.aixploria.com/en/free-ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Aixploria
          </a>{" "}
          and stores them in Supabase. Duplicate tools are updated automatically.
        </p>

        <button
          onClick={handleScrape}
          disabled={scraping}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {scraping ? (
            <>
              <span className="animate-spin">⏳</span> Starting...
            </>
          ) : (
            "🚀 Run Scraper"
          )}
        </button>

        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Run logs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Scrape History</h2>
          <button
            onClick={fetchRuns}
            disabled={loading}
            className="text-sm text-indigo-600 hover:underline disabled:opacity-40"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {runs.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">No scrape runs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Started</th>
                  <th className="pb-3 pr-4 font-medium">Completed</th>
                  <th className="pb-3 pr-4 font-medium">Tools</th>
                  <th className="pb-3 font-medium">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[run.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {run.status === "running" && (
                          <span className="inline-block animate-spin mr-1">⏳</span>
                        )}
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                      {run.started_at
                        ? new Date(run.started_at).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                      {run.completed_at ? formatDate(run.completed_at) : "—"}
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {run.tools_scraped}
                    </td>
                    <td className="py-3 text-red-600 text-xs max-w-xs truncate">
                      {run.error_message ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
