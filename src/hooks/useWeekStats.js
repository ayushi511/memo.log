"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useWeekStats() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "entries"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map((d) => d.data()));
    });
    return () => unsub();
  }, []);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = weekDates.map((date, i) => ({
    day: dayLabels[i],
    entries: entries.filter((e) => e.date === date).length,
  }));

  const weekEntries = entries.filter((e) => weekDates.includes(e.date));
  const categoryCounts = weekEntries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const lifetimeCounts = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const photosCount = weekEntries.filter((e) => e.imageUrl).length;
  const newThings = new Set(weekEntries.map((e) => e.category)).size;

  const allDatesSet = new Set(entries.map((e) => e.date));
let streak = 0;
let d = new Date(today);

// agar aaj entry nahi hai, kal se check karna shuru karo
if (!allDatesSet.has(d.toISOString().split("T")[0])) {
  d.setDate(d.getDate() - 1);
}

while (allDatesSet.has(d.toISOString().split("T")[0])) {
  streak++;
  d.setDate(d.getDate() - 1);
}

  return {
    chartData,
    totalEntries: weekEntries.length,
    categoryCounts,
    lifetimeCounts,
    photosCount,
    newThings,
    streak,
    weekRangeLabel: `${startOfWeek.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(
      startOfWeek.getTime() + 6 * 86400000
    ).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
  };
}