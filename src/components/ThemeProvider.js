"use client";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";

export default function ThemeProvider({ children }) {
  const { profile } = useProfile();

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", profile.accentColor || "#8B6F9E");
  }, [profile.accentColor]);

  return children;
}