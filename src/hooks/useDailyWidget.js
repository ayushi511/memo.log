"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

export function useDailyWidget(dateKey = todayKey()) {
  const [data, setData] = useState({ reminder: "", focus: "", gratitude: "", mood: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    const docId = `${user.uid}_${dateKey}`;
    getDoc(doc(db, "dailyWidgets", docId)).then((snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData({ reminder: "", focus: "", gratitude: "", mood: "" });
      }
      setLoading(false);
    });
  }, [dateKey]);

  async function updateField(field, value) {
    const user = auth.currentUser;
    if (!user) return;

    setData((prev) => ({ ...prev, [field]: value }));
    const docId = `${user.uid}_${dateKey}`;
    await setDoc(doc(db, "dailyWidgets", docId), { ...data, [field]: value, userId: user.uid }, { merge: true });
  }

  return { data, loading, updateField };
}