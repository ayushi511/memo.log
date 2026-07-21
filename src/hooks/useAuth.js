"use client";
import { useState, useEffect } from "react";
import { watchAuth } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = watchAuth((u) => setUser(u));
    return () => unsub();
  }, []);

  return { user, loading: user === undefined };
}