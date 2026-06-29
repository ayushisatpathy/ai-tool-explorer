"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    // Remove any leftover channels first
    supabase.getChannels().forEach((channel) => {
      supabase.removeChannel(channel);
    });

    // Give this subscription a unique channel name
    const channel = supabase.channel(`tools-${crypto.randomUUID()}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tools",
        },
        (payload) => {
          console.log("Realtime payload:", payload);
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}