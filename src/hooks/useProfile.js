"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const defaultProfile = {
  name: "",
  intro: "",
  photoUrl: "",
  currently: "",
  currentlyBuilding: "",
  accentColor: "#8B6F9E",
};

export function useProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid)).then((snap) => {
      setProfile(snap.exists() ? { ...defaultProfile, ...snap.data() } : defaultProfile);
      setLoading(false);
    });
  }, []);

  async function saveProfile(updates) {
    const user = auth.currentUser;
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await setDoc(doc(db, "profiles", user.uid), newProfile, { merge: true });
  }

  return { profile, loading, saveProfile };
}