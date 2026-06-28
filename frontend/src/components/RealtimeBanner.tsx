"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function RealtimeBanner() {
  const [newTools, setNewTools] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("tools-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tools" },
        (payload) => {
          const name = (payload.new as { name?: string }).name ?? "A new tool";
          setNewTools((prev) => [name, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (newTools.length === 0) return null;

  return (
    <div className="bg-indigo-600 text-white text-sm px-4 py-2 flex items-center justify-between">
      <span>
        🆕 {newTools[0]} was just added!
        {newTools.length > 1 && ` (+${newTools.length - 1} more)`}
      </span>
      <button
        onClick={() => setNewTools([])}
        className="ml-4 text-indigo-200 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
