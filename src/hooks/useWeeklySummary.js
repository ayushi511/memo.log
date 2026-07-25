"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export function useWeeklySummary(timeframe = "week") {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const cutoffDate = new Date();
    if (timeframe === "month") cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    else if (timeframe === "year") cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    else cutoffDate.setDate(cutoffDate.getDate() - 7);
    const cutoff = cutoffDate.toISOString().split("T")[0];

    const q = query(collection(db, "entries"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));

    setLoading(true);
    const unsub = onSnapshot(q, async (snap) => {
      const recent = snap.docs.map((d) => d.data()).filter((e) => e.date >= cutoff);

      if (recent.length === 0) {
        setSummary(`Start writing, and I'll summarize your ${timeframe} here.`);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries: recent, timeframe }),
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setSummary("Couldn't load your recap right now.");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [timeframe]);

  return { summary, loading };
}