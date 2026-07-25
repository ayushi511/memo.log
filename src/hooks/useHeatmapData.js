"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useHeatmapData() {
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

  const countByDate = entries.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + 1;
    return acc;
  }, {});

  // last 12 weeks (84 days), ending today
  const today = new Date();
  const days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, count: countByDate[dateStr] || 0 });
  }

  return { days };
}